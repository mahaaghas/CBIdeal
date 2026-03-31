"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { workspace } from "@/lib/mock-data"

export interface BrandingSettings {
  companyName: string
  companyLogoUrl: string
  darkLogoUrl: string
  appIconUrl: string
  primaryColor: string
  secondaryColor: string
  surfaceTint: string
  senderDisplayName: string
}

export interface BrandingPreset extends BrandingSettings {
  id: string
  label: string
  note: string
}

type BrandingContextValue = {
  branding: BrandingSettings
  presets: BrandingPreset[]
  updateBranding: (patch: Partial<BrandingSettings>) => void
  replaceBranding: (next: BrandingSettings) => void
  applyPreset: (presetId: string) => void
  resetBranding: () => void
}

const STORAGE_KEY = "cbideal-branding-state"

const BrandingContext = createContext<BrandingContextValue | null>(null)

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function cleanHex(value: string | null | undefined, fallback: string) {
  if (!value) return fallback
  const raw = value.trim().replace(/[^0-9a-fA-F]/g, "")
  if (raw.length === 3) {
    return `#${raw
      .split("")
      .map((part) => `${part}${part}`)
      .join("")
      .toLowerCase()}`
  }

  if (raw.length === 6) {
    return `#${raw.toLowerCase()}`
  }

  return fallback
}

function hexToRgb(hex: string) {
  const normalised = cleanHex(hex, "#5b78a2").replace("#", "")
  const value = Number.parseInt(normalised, 16)

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`
}

function rgbToHsl(r: number, g: number, b: number) {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  let h = 0
  const l = (max + min) / 2
  const s =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  if (delta !== 0) {
    switch (max) {
      case red:
        h = ((green - blue) / delta) % 6
        break
      case green:
        h = (blue - red) / delta + 2
        break
      default:
        h = (red - green) / delta + 4
        break
    }
  }

  return {
    h: Math.round(h * 60 < 0 ? h * 60 + 360 : h * 60),
    s: s * 100,
    l: l * 100,
  }
}

function hslToRgb(h: number, s: number, l: number) {
  const saturation = s / 100
  const lightness = l / 100
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const segment = h / 60
  const x = chroma * (1 - Math.abs((segment % 2) - 1))
  let red = 0
  let green = 0
  let blue = 0

  if (segment >= 0 && segment < 1) {
    red = chroma
    green = x
  } else if (segment < 2) {
    red = x
    green = chroma
  } else if (segment < 3) {
    green = chroma
    blue = x
  } else if (segment < 4) {
    green = x
    blue = chroma
  } else if (segment < 5) {
    red = x
    blue = chroma
  } else {
    red = chroma
    blue = x
  }

  const match = lightness - chroma / 2
  return {
    r: (red + match) * 255,
    g: (green + match) * 255,
    b: (blue + match) * 255,
  }
}

function constrainColor(
  value: string,
  fallback: string,
  limits: {
    minLightness: number
    maxLightness: number
    minSaturation: number
  },
) {
  const rgb = hexToRgb(cleanHex(value, fallback))
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const adjusted = hslToRgb(
    hsl.h,
    clamp(hsl.s, limits.minSaturation, 86),
    clamp(hsl.l, limits.minLightness, limits.maxLightness),
  )

  return rgbToHex(adjusted.r, adjusted.g, adjusted.b)
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function shade(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  const rgb = hslToRgb(h, s, clamp(l + amount, 18, 78))
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

export function getReadableForeground(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance > 0.58 ? "#132033" : "#ffffff"
}

export function getBrandingUiTokens(branding: BrandingSettings) {
  return {
    onPrimary: getReadableForeground(branding.primaryColor),
    primaryStrong: shade(branding.primaryColor, -9),
    surfaceTintSoft: withAlpha(branding.surfaceTint, 0.16),
    surfaceTintStrong: withAlpha(branding.surfaceTint, 0.22),
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function encodeSvg(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function createLogoSvg({
  monogram,
  name,
  primaryColor,
  secondaryColor,
}: {
  monogram: string
  name: string
  primaryColor: string
  secondaryColor: string
}) {
  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="420" height="96" viewBox="0 0 420 96" fill="none">
      <rect width="420" height="96" rx="28" fill="rgba(255,255,255,0.02)"/>
      <rect x="12" y="12" width="72" height="72" rx="22" fill="${primaryColor}"/>
      <circle cx="62" cy="34" r="14" fill="${secondaryColor}" opacity="0.32"/>
      <text x="48" y="58" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#ffffff" letter-spacing="-0.03em">${monogram}</text>
      <text x="108" y="43" font-family="Arial, sans-serif" font-size="13" fill="#D4DDE9" letter-spacing="0.28em">PRIVATE ADVISORY</text>
      <text x="108" y="67" font-family="Georgia, serif" font-size="28" fill="#FFFFFF" letter-spacing="-0.04em">${name}</text>
    </svg>
  `)
}

function createIconSvg(monogram: string, primaryColor: string, secondaryColor: string) {
  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" fill="none">
      <rect width="128" height="128" rx="34" fill="${primaryColor}"/>
      <circle cx="90" cy="38" r="18" fill="${secondaryColor}" opacity="0.28"/>
      <text x="64" y="76" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="#ffffff" letter-spacing="-0.04em">${monogram}</text>
    </svg>
  `)
}

function createPreset(
  id: string,
  label: string,
  note: string,
  companyName: string,
  primaryColor: string,
  secondaryColor: string,
  surfaceTint: string,
) {
  const companyInitials = getInitials(companyName)
  const logo = createLogoSvg({
    monogram: companyInitials,
    name: companyName,
    primaryColor,
    secondaryColor,
  })

  return {
    id,
    label,
    note,
    companyName,
    companyLogoUrl: logo,
    darkLogoUrl: logo,
    appIconUrl: createIconSvg(companyInitials, primaryColor, secondaryColor),
    primaryColor,
    secondaryColor,
    surfaceTint,
    senderDisplayName: companyName,
  } satisfies BrandingPreset
}

export const defaultBrandingSettings: BrandingSettings = createPreset(
  "cbideal-default",
  "CBI Deal",
  "Default workspace branding",
  workspace.firmName,
  "#5b78a2",
  "#8ca6c6",
  "#6c84a4",
)

export const brandingPresets: BrandingPreset[] = [
  defaultBrandingSettings as BrandingPreset,
  createPreset(
    "northgate-private",
    "Northgate Private Advisory",
    "A composed, darker blue system for discreet residence work.",
    "Northgate Private Advisory",
    "#4d648a",
    "#98aecd",
    "#687f9f",
  ),
  createPreset(
    "harbor-residency",
    "Harbor Residency Counsel",
    "A quieter green-blue accent pair suited to family office workflows.",
    "Harbor Residency Counsel",
    "#3f7b78",
    "#93b9b0",
    "#6d948f",
  ),
  createPreset(
    "sterling-citizenship",
    "Sterling Citizenship Advisory",
    "A warmer navy-and-sand interpretation within the same product frame.",
    "Sterling Citizenship Advisory",
    "#56698a",
    "#c4b28c",
    "#8d7e67",
  ),
]

export function normaliseBrandingSettings(input: BrandingSettings): BrandingSettings {
  const primaryColor = constrainColor(input.primaryColor, defaultBrandingSettings.primaryColor, {
    minLightness: 28,
    maxLightness: 52,
    minSaturation: 28,
  })
  const secondaryColor = constrainColor(input.secondaryColor, defaultBrandingSettings.secondaryColor, {
    minLightness: 42,
    maxLightness: 72,
    minSaturation: 18,
  })
  const surfaceTint = constrainColor(input.surfaceTint, defaultBrandingSettings.surfaceTint, {
    minLightness: 34,
    maxLightness: 66,
    minSaturation: 12,
  })

  return {
    companyName: input.companyName.trim() || defaultBrandingSettings.companyName,
    companyLogoUrl: input.companyLogoUrl.trim(),
    darkLogoUrl: input.darkLogoUrl.trim(),
    appIconUrl: input.appIconUrl.trim(),
    primaryColor,
    secondaryColor,
    surfaceTint,
    senderDisplayName: input.senderDisplayName.trim() || input.companyName.trim() || defaultBrandingSettings.senderDisplayName,
  }
}

function applyBrandingToDocument(branding: BrandingSettings) {
  if (typeof document === "undefined") return

  const root = document.documentElement
  const tokens = getBrandingUiTokens(branding)

  root.style.setProperty("--primary", branding.primaryColor)
  root.style.setProperty("--primary-foreground", tokens.onPrimary)
  root.style.setProperty("--ring", branding.primaryColor)
  root.style.setProperty("--accent", branding.secondaryColor)
  root.style.setProperty("--secondary", branding.secondaryColor)
  root.style.setProperty("--app-brand-primary", branding.primaryColor)
  root.style.setProperty("--app-brand-primary-strong", tokens.primaryStrong)
  root.style.setProperty("--app-brand-secondary", branding.secondaryColor)
  root.style.setProperty("--app-brand-surface-tint", tokens.surfaceTintSoft)
  root.style.setProperty("--app-brand-surface-tint-strong", tokens.surfaceTintStrong)
  root.style.setProperty("--app-brand-on-primary", tokens.onPrimary)
  root.style.setProperty("--app-brand-outline", withAlpha(branding.primaryColor, 0.22))

  let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null
  if (!favicon) {
    favicon = document.createElement("link")
    favicon.rel = "icon"
    document.head.appendChild(favicon)
  }
  favicon.href = branding.appIconUrl || defaultBrandingSettings.appIconUrl
}

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<BrandingSettings>(defaultBrandingSettings)

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as BrandingSettings
      setBranding(normaliseBrandingSettings({ ...defaultBrandingSettings, ...parsed }))
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(branding))
    }
    applyBrandingToDocument(branding)
  }, [branding])

  const value = useMemo<BrandingContextValue>(
    () => ({
      branding,
      presets: brandingPresets,
      updateBranding: (patch) =>
        setBranding((current) => normaliseBrandingSettings({ ...current, ...patch })),
      replaceBranding: (next) => setBranding(normaliseBrandingSettings(next)),
      applyPreset: (presetId) => {
        const preset = brandingPresets.find((item) => item.id === presetId)
        if (preset) {
          setBranding(normaliseBrandingSettings(preset))
        }
      },
      resetBranding: () => setBranding(defaultBrandingSettings),
    }),
    [branding],
  )

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>
}

export function useBranding() {
  const context = useContext(BrandingContext)
  if (!context) {
    throw new Error("useBranding must be used within BrandingProvider")
  }

  return context
}
