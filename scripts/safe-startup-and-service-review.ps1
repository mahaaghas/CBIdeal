#requires -Version 5.1
<#
.SYNOPSIS
Lists startup apps, lists non-Microsoft services, and safely offers Adobe/Autodesk/ASUS services for disable.

.DESCRIPTION
Run from an elevated Windows PowerShell session if you want to make changes.
Use -WhatIf to preview disable and stop actions without applying them.
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$VendorPatterns = [ordered]@{
    Adobe = '(?i)\bAdobe\b'
    Autodesk = '(?i)\bAutodesk\b'
    ASUS = '(?i)\bASUS\b|\bASUSTeK\b'
}

$ProtectedServiceNames = @(
    'Appinfo',
    'BFE',
    'BrokerInfrastructure',
    'CoreMessagingRegistrar',
    'CryptSvc',
    'DcomLaunch',
    'Dhcp',
    'Dnscache',
    'EventLog',
    'LanmanServer',
    'LanmanWorkstation',
    'LSM',
    'MpsSvc',
    'NlaSvc',
    'PlugPlay',
    'Power',
    'ProfSvc',
    'RpcEptMapper',
    'RpcSs',
    'SamSs',
    'Schedule',
    'SecurityHealthService',
    'SENS',
    'Sense',
    'SysMain',
    'Themes',
    'UserManager',
    'WinDefend',
    'Winmgmt',
    'WlanSvc',
    'WpnService'
)

function Write-Section {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title
    )

    Write-Host ''
    Write-Host ('=' * 90)
    Write-Host $Title
    Write-Host ('=' * 90)
}

function Test-IsAdministrator {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Read-YesNo {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Prompt,

        [bool]$Default = $false
    )

    $suffix = if ($Default) { '[Y/n]' } else { '[y/N]' }
    while ($true) {
        $response = Read-Host "$Prompt $suffix"
        if ([string]::IsNullOrWhiteSpace($response)) {
            return $Default
        }

        switch -Regex ($response.Trim()) {
            '^(y|yes)$' { return $true }
            '^(n|no)$' { return $false }
            default { Write-Warning 'Please answer with Y or N.' }
        }
    }
}

function Resolve-ExecutablePath {
    param(
        [string]$CommandLine
    )

    if ([string]::IsNullOrWhiteSpace($CommandLine)) {
        return $null
    }

    $expanded = [Environment]::ExpandEnvironmentVariables($CommandLine.Trim())
    $candidate = $null

    if ($expanded -match '^\s*"([^"]+?\.exe)"') {
        $candidate = $matches[1]
    } elseif ($expanded -match '^\s*([A-Za-z]:\\.+?\.exe)\b') {
        $candidate = $matches[1]
    } elseif ($expanded -match '^\s*([^\s]+?\.exe)\b') {
        $candidate = $matches[1]
    }

    if ([string]::IsNullOrWhiteSpace($candidate)) {
        return $null
    }

    try {
        if (Test-Path -LiteralPath $candidate) {
            return (Resolve-Path -LiteralPath $candidate).Path
        }
    } catch {
        return $candidate
    }

    return $candidate
}

function Get-FileCompanyName {
    param(
        [string]$Path
    )

    if ([string]::IsNullOrWhiteSpace($Path)) {
        return $null
    }

    try {
        if (Test-Path -LiteralPath $Path -PathType Leaf) {
            return (Get-Item -LiteralPath $Path).VersionInfo.CompanyName
        }
    } catch {
        return $null
    }

    return $null
}

function Test-IsMicrosoftComponent {
    param(
        [string]$CompanyName,
        [string]$BinaryPath
    )

    if ($CompanyName -match '(?i)\bMicrosoft\b') {
        return $true
    }

    if (-not [string]::IsNullOrWhiteSpace($BinaryPath)) {
        try {
            $windowsRoot = [System.IO.Path]::GetFullPath($env:WINDIR)
            $binaryFullPath = [System.IO.Path]::GetFullPath($BinaryPath)
            if ($binaryFullPath.StartsWith($windowsRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
                return $true
            }
        } catch {
            return $false
        }
    }

    return $false
}

function Get-ServiceVendor {
    param(
        [string[]]$Text
    )

    foreach ($vendor in $VendorPatterns.Keys) {
        foreach ($entry in $Text) {
            if (-not [string]::IsNullOrWhiteSpace($entry) -and $entry -match $VendorPatterns[$vendor]) {
                return $vendor
            }
        }
    }

    return $null
}

function Get-RegistryStartupEntries {
    $startupKeys = @(
        'HKLM:\Software\Microsoft\Windows\CurrentVersion\Run',
        'HKLM:\Software\Microsoft\Windows\CurrentVersion\RunOnce',
        'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Run',
        'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\RunOnce',
        'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run',
        'HKCU:\Software\Microsoft\Windows\CurrentVersion\RunOnce'
    )

    foreach ($keyPath in $startupKeys) {
        if (-not (Test-Path -LiteralPath $keyPath)) {
            continue
        }

        $item = Get-ItemProperty -LiteralPath $keyPath
        foreach ($property in $item.PSObject.Properties) {
            if ($property.Name -like 'PS*') {
                continue
            }

            [PSCustomObject]@{
                Name = $property.Name
                Source = 'Registry'
                Location = $keyPath
                Command = [string]$property.Value
                User = if ($keyPath -like 'HKCU:*') { $env:USERNAME } else { 'All Users' }
            }
        }
    }
}

function Get-StartupFolderEntries {
    $shell = $null

    try {
        $shell = New-Object -ComObject WScript.Shell
    } catch {
        $shell = $null
    }

    $locations = @(
        @{
            Path = [Environment]::GetFolderPath('Startup')
            User = $env:USERNAME
        },
        @{
            Path = [Environment]::GetFolderPath('CommonStartup')
            User = 'All Users'
        }
    )

    foreach ($location in $locations) {
        if ([string]::IsNullOrWhiteSpace($location.Path) -or -not (Test-Path -LiteralPath $location.Path)) {
            continue
        }

        foreach ($item in Get-ChildItem -LiteralPath $location.Path -File) {
            $command = $item.FullName
            if ($shell -and $item.Extension -ieq '.lnk') {
                try {
                    $shortcut = $shell.CreateShortcut($item.FullName)
                    if (-not [string]::IsNullOrWhiteSpace($shortcut.TargetPath)) {
                        $command = $shortcut.TargetPath
                        if (-not [string]::IsNullOrWhiteSpace($shortcut.Arguments)) {
                            $command = "$command $($shortcut.Arguments)"
                        }
                    }
                } catch {
                    $command = $item.FullName
                }
            }

            [PSCustomObject]@{
                Name = $item.BaseName
                Source = 'Startup Folder'
                Location = $location.Path
                Command = $command
                User = $location.User
            }
        }
    }
}

function Get-StartupCommandEntries {
    foreach ($item in Get-CimInstance -ClassName Win32_StartupCommand) {
        [PSCustomObject]@{
            Name = $item.Name
            Source = 'Win32_StartupCommand'
            Location = $item.Location
            Command = $item.Command
            User = $item.User
        }
    }
}

function Get-StartupApps {
    $seen = @{}
    $allEntries = @(
        @(Get-StartupCommandEntries)
        @(Get-RegistryStartupEntries)
        @(Get-StartupFolderEntries)
    )

    foreach ($entry in $allEntries) {
        $key = '{0}|{1}|{2}|{3}' -f $entry.Name, $entry.Command, $entry.Location, $entry.User
        if ($seen.ContainsKey($key)) {
            continue
        }

        $seen[$key] = $true
        $entry
    }
}

function Get-NonMicrosoftServices {
    foreach ($service in Get-CimInstance -ClassName Win32_Service) {
        $binaryPath = Resolve-ExecutablePath -CommandLine $service.PathName
        $companyName = Get-FileCompanyName -Path $binaryPath
        $isMicrosoft = Test-IsMicrosoftComponent -CompanyName $companyName -BinaryPath $binaryPath

        if ($isMicrosoft) {
            continue
        }

        $vendor = Get-ServiceVendor -Text @(
            $service.Name,
            $service.DisplayName,
            $companyName,
            $binaryPath
        )

        $dependentServices = @()
        try {
            $dependentServices = @(Get-Service -Name $service.Name -ErrorAction Stop | Select-Object -ExpandProperty DependentServices)
        } catch {
            $dependentServices = @()
        }

        $isProtected = $false
        $blockReason = $null

        if ($ProtectedServiceNames -contains $service.Name) {
            $isProtected = $true
            $blockReason = 'Explicitly protected service name.'
        } elseif ($vendor -and [string]::IsNullOrWhiteSpace($binaryPath)) {
            $isProtected = $true
            $blockReason = 'Executable path could not be resolved safely.'
        } elseif ($service.ServiceType -match 'Kernel Driver|File System Driver') {
            $isProtected = $true
            $blockReason = 'Driver services are not offered for changes.'
        } elseif ($dependentServices.Count -gt 0) {
            $isProtected = $true
            $blockReason = 'Other services depend on it.'
        } elseif ([string]::IsNullOrWhiteSpace($vendor)) {
            $blockReason = 'Not an Adobe, Autodesk, or ASUS service.'
        }

        [PSCustomObject]@{
            Name = $service.Name
            DisplayName = $service.DisplayName
            State = $service.State
            StartMode = $service.StartMode
            StartName = $service.StartName
            ServiceType = $service.ServiceType
            CompanyName = if ([string]::IsNullOrWhiteSpace($companyName)) { '<Unknown>' } else { $companyName }
            BinaryPath = if ([string]::IsNullOrWhiteSpace($binaryPath)) { '<Unknown>' } else { $binaryPath }
            Vendor = $vendor
            DependentServiceCount = $dependentServices.Count
            EligibleForDisable = [bool]($vendor -and -not $isProtected -and $service.StartMode -ne 'Disabled')
            BlockReason = if ($service.StartMode -eq 'Disabled' -and $vendor) { 'Already disabled.' } else { $blockReason }
        }
    }
}

function Read-ServiceSelection {
    param(
        [Parameter(Mandatory = $true)]
        [array]$Candidates
    )

    while ($true) {
        $response = Read-Host 'Enter the service numbers to disable (comma-separated), or press Enter to skip'
        if ([string]::IsNullOrWhiteSpace($response)) {
            return @()
        }

        $indexes = $response -split ',' |
            ForEach-Object { $_.Trim() } |
            Where-Object { $_ } |
            Sort-Object -Unique

        $selected = @()
        $isValid = $true

        foreach ($indexText in $indexes) {
            $parsedIndex = 0
            if (-not [int]::TryParse($indexText, [ref]$parsedIndex)) {
                $isValid = $false
                break
            }

            if ($parsedIndex -lt 1 -or $parsedIndex -gt $Candidates.Count) {
                $isValid = $false
                break
            }

            $selected += $Candidates[$parsedIndex - 1]
        }

        if ($isValid) {
            return $selected
        }

        Write-Warning 'Selection was not valid. Use the numbered values from the candidate list.'
    }
}

function Disable-SelectedServices {
    param(
        [Parameter(Mandatory = $true)]
        [array]$Services,

        [Parameter(Mandatory = $true)]
        [bool]$IsAdministrator
    )

    if ($Services.Count -eq 0) {
        Write-Host 'No services selected. No changes made.'
        return
    }

    if (-not $IsAdministrator) {
        Write-Warning 'This PowerShell session is not elevated. Re-run as Administrator to disable services.'
        return
    }

    $summary = $Services | ForEach-Object { '{0} ({1})' -f $_.Name, $_.Vendor }
    Write-Host ''
    Write-Host 'Selected services:'
    $summary | ForEach-Object { Write-Host " - $_" }

    if (-not (Read-YesNo -Prompt 'Proceed to disable startup for the selected services?' -Default $false)) {
        Write-Host 'Change request cancelled. No services were modified.'
        return
    }

    foreach ($service in $Services) {
        Write-Host ''
        Write-Host ('-' * 90)
        Write-Host ("Service: {0} ({1})" -f $service.Name, $service.DisplayName)
        Write-Host ("Vendor: {0}" -f $service.Vendor)
        Write-Host ("Company: {0}" -f $service.CompanyName)
        Write-Host ("Path: {0}" -f $service.BinaryPath)

        if (-not (Read-YesNo -Prompt "Disable '$($service.Name)'?" -Default $false)) {
            Write-Host "Skipped $($service.Name)."
            continue
        }

        try {
            if ($PSCmdlet.ShouldProcess($service.Name, 'Set startup type to Disabled')) {
                Set-Service -Name $service.Name -StartupType Disabled -ErrorAction Stop
                Write-Host "Startup type changed to Disabled for $($service.Name)."
            }

            $serviceController = Get-Service -Name $service.Name -ErrorAction Stop
            if ($serviceController.Status -eq 'Running') {
                if (Read-YesNo -Prompt "Stop '$($service.Name)' now too?" -Default $false) {
                    if ($PSCmdlet.ShouldProcess($service.Name, 'Stop running service')) {
                        Stop-Service -Name $service.Name -ErrorAction Stop
                        Write-Host "$($service.Name) stopped."
                    }
                } else {
                    Write-Host "$($service.Name) will stay running until the next restart or manual stop."
                }
            }
        } catch {
            Write-Warning ("Could not update {0}: {1}" -f $service.Name, $_.Exception.Message)
        }
    }
}

$isAdministrator = Test-IsAdministrator

Write-Section 'Startup Apps'
$startupApps = @(Get-StartupApps | Sort-Object Name, Source, User)
if ($startupApps.Count -eq 0) {
    Write-Host 'No startup apps were found from the common startup locations.'
} else {
    $startupApps |
        Select-Object Name, Source, User, Location, Command |
        Format-Table -Wrap -AutoSize
}

Write-Section 'Non-Microsoft Services'
$nonMicrosoftServices = @(Get-NonMicrosoftServices | Sort-Object Vendor, DisplayName, Name)
if ($nonMicrosoftServices.Count -eq 0) {
    Write-Host 'No non-Microsoft services were identified.'
} else {
    $nonMicrosoftServices |
        Select-Object Name, DisplayName, State, StartMode, StartName, CompanyName |
        Format-Table -Wrap -AutoSize
}

Write-Section 'Disable Candidates'
$eligibleCandidates = @($nonMicrosoftServices | Where-Object { $_.EligibleForDisable })

if ($eligibleCandidates.Count -eq 0) {
    Write-Host 'No safe Adobe, Autodesk, or ASUS service candidates were found to disable.'
} else {
    $numberedCandidates = for ($i = 0; $i -lt $eligibleCandidates.Count; $i++) {
        [PSCustomObject]@{
            Number = $i + 1
            Vendor = $eligibleCandidates[$i].Vendor
            Name = $eligibleCandidates[$i].Name
            DisplayName = $eligibleCandidates[$i].DisplayName
            State = $eligibleCandidates[$i].State
            StartMode = $eligibleCandidates[$i].StartMode
            CompanyName = $eligibleCandidates[$i].CompanyName
            BinaryPath = $eligibleCandidates[$i].BinaryPath
        }
    }

    $numberedCandidates | Format-Table -Wrap -AutoSize
}

$blockedVendorServices = @(
    $nonMicrosoftServices |
        Where-Object { $_.Vendor -and -not $_.EligibleForDisable }
)

if ($blockedVendorServices.Count -gt 0) {
    Write-Section 'Vendor Services Not Offered For Disable'
    $blockedVendorServices |
        Select-Object Vendor, Name, DisplayName, State, StartMode, BlockReason |
        Format-Table -Wrap -AutoSize
}

if (-not $isAdministrator) {
    Write-Warning 'Run this script from an elevated PowerShell window if you want to disable services.'
}

if ($eligibleCandidates.Count -gt 0) {
    $selectedServices = @(Read-ServiceSelection -Candidates $eligibleCandidates)
    Disable-SelectedServices -Services $selectedServices -IsAdministrator $isAdministrator
} else {
    Write-Host ''
    Write-Host 'No change workflow was started because there were no eligible candidates.'
}
