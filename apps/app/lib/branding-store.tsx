"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

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

const BRANDING_LOCKED_NOTE =
  "Branding is locked to the CBI Deal identity. Custom brand overrides are ignored."

const BrandingContext = createContext<BrandingContextValue | null>(null)

function hexToRgb(hex: string) {
  const cleaned = hex.replace("#", "")
  const value = Number.parseInt(cleaned, 16)

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function getReadableForeground(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance > 0.58 ? "#132033" : "#ffffff"
}

export function getBrandingUiTokens(branding: BrandingSettings) {
  return {
    onPrimary: getReadableForeground(branding.primaryColor),
    primaryStrong: "#4d648a",
    surfaceTintSoft: withAlpha(branding.surfaceTint, 0.16),
    surfaceTintStrong: withAlpha(branding.surfaceTint, 0.22),
  }
}

export const defaultBrandingSettings: BrandingSettings = {
  companyName: "CBI Deal",
  companyLogoUrl: "/logo.svg",
  darkLogoUrl: "/logo.svg",
  appIconUrl: "/favicon.ico",
  primaryColor: "#5b78a2",
  secondaryColor: "#8ca6c6",
  surfaceTint: "#6c84a4",
  senderDisplayName: "CBI Deal",
}

export const brandingPresets: BrandingPreset[] = [
  {
    id: "cbideal-default",
    label: "CBI Deal",
    note: "Locked default branding for the CBI Deal platform.",
    ...defaultBrandingSettings,
  },
] as const

export function normaliseBrandingSettings(_input: BrandingSettings): BrandingSettings {
  return defaultBrandingSettings
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
  favicon.href = defaultBrandingSettings.appIconUrl
}

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<BrandingSettings>(defaultBrandingSettings)

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.removeItem(STORAGE_KEY)
    setBranding(defaultBrandingSettings)
    applyBrandingToDocument(defaultBrandingSettings)
  }, [])

  const value = useMemo<BrandingContextValue>(
    () => ({
      branding,
      presets: brandingPresets,
      updateBranding: () => {
        console.info("[branding] update ignored", { reason: BRANDING_LOCKED_NOTE })
        setBranding(defaultBrandingSettings)
      },
      replaceBranding: () => {
        console.info("[branding] replace ignored", { reason: BRANDING_LOCKED_NOTE })
        setBranding(defaultBrandingSettings)
      },
      applyPreset: () => {
        console.info("[branding] preset ignored", { reason: BRANDING_LOCKED_NOTE })
        setBranding(defaultBrandingSettings)
      },
      resetBranding: () => {
        setBranding(defaultBrandingSettings)
      },
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
