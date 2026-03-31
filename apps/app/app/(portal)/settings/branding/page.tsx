"use client"

import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, Palette, RotateCcw, Upload } from "lucide-react"
import { AppBrand } from "@cbideal/ui/components/app-brand"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { Button } from "@cbideal/ui/components/ui/button"
import { Input } from "@cbideal/ui/components/ui/input"
import {
  defaultBrandingSettings,
  getBrandingUiTokens,
  normaliseBrandingSettings,
  useBranding,
  type BrandingSettings,
} from "@/lib/branding-store"

function FieldBlock({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2.5">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
        {hint ? <p className="text-sm leading-6 text-slate-300">{hint}</p> : null}
      </div>
      {children}
    </div>
  )
}

function LogoField({
  label,
  hint,
  value,
  onChange,
  onUpload,
}: {
  label: string
  hint: string
  value: string
  onChange: (value: string) => void
  onUpload: () => void
}) {
  return (
    <FieldBlock label={label} hint={hint}>
      <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-h-[64px] min-w-[200px] flex-1 items-center rounded-[18px] border border-white/10 bg-white/[0.04] px-3 py-3">
            {value ? (
              <img src={value} alt={label} className="h-10 w-auto max-w-full object-contain object-left" />
            ) : (
              <p className="text-sm text-slate-400">No asset selected</p>
            )}
          </div>
          <Button type="button" variant="outline" className="rounded-full" onClick={onUpload}>
            <Upload className="size-4" />
            Upload
          </Button>
        </div>
        <div className="mt-3">
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Paste an image URL or upload a file"
            className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
          />
        </div>
      </div>
    </FieldBlock>
  )
}

function ColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <FieldBlock label={label} hint={hint}>
      <div className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={label}
          className="h-11 w-14 rounded-xl border border-white/10 bg-transparent"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
        />
      </div>
    </FieldBlock>
  )
}

export default function BrandingSettingsPage() {
  const { branding, presets, replaceBranding } = useBranding()
  const [draft, setDraft] = useState<BrandingSettings>(branding)
  const [message, setMessage] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const darkLogoInputRef = useRef<HTMLInputElement | null>(null)
  const iconInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setDraft(branding)
  }, [branding])

  const preview = normaliseBrandingSettings(draft)
  const previewTokens = getBrandingUiTokens(preview)

  const handleFile =
    (field: keyof BrandingSettings) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        setDraft((current) => ({
          ...current,
          [field]: typeof reader.result === "string" ? reader.result : current[field],
        }))
      }
      reader.readAsDataURL(file)
    }

  return (
    <div className="space-y-8">
      <CrmPageHeader
        eyebrow="Branding"
        title="Personalise the workspace without breaking the system"
        description="Set a firm identity, guarded accent colours, and branded communication assets while keeping the CRM and client portal within one controlled visual language."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/settings">
              <ArrowLeft className="size-4" />
              Back to settings
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <CrmSectionCard title="Current company name" description="Shown across the internal workspace, portal, and email sign-off.">
          <p className="text-lg font-semibold text-white">{branding.companyName}</p>
        </CrmSectionCard>
        <CrmSectionCard title="Accent pair" description="Primary and secondary colours, safely normalised before use.">
          <div className="flex items-center gap-3">
            <span className="size-10 rounded-full border border-white/10" style={{ backgroundColor: branding.primaryColor }} />
            <span className="size-10 rounded-full border border-white/10" style={{ backgroundColor: branding.secondaryColor }} />
          </div>
        </CrmSectionCard>
        <CrmSectionCard title="Sender display name" description="Used in branded communication and reminder flows.">
          <p className="text-lg font-semibold text-white">{branding.senderDisplayName}</p>
        </CrmSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <CrmSectionCard
          title="Brand identity"
          description="Upload or paste controlled assets, then save them into the workspace."
        >
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FieldBlock label="Company name" hint="The main name shown in the CRM, client portal, and branded communication.">
                <Input
                  value={draft.companyName}
                  onChange={(event) => setDraft((current) => ({ ...current, companyName: event.target.value }))}
                  className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
                />
              </FieldBlock>
              <FieldBlock label="Sender display name" hint="Used in email sign-off and communication history.">
                <Input
                  value={draft.senderDisplayName}
                  onChange={(event) => setDraft((current) => ({ ...current, senderDisplayName: event.target.value }))}
                  className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
                />
              </FieldBlock>
            </div>

            <LogoField
              label="Company logo"
              hint="The main logo for sidebar, portal header, and branded email surfaces."
              value={draft.companyLogoUrl}
              onChange={(value) => setDraft((current) => ({ ...current, companyLogoUrl: value }))}
              onUpload={() => logoInputRef.current?.click()}
            />

            <LogoField
              label="Dark-surface logo"
              hint="Optional alternative for dark headers and sidebars. Leave blank to reuse the main logo."
              value={draft.darkLogoUrl}
              onChange={(value) => setDraft((current) => ({ ...current, darkLogoUrl: value }))}
              onUpload={() => darkLogoInputRef.current?.click()}
            />

            <LogoField
              label="App icon / favicon"
              hint="Used as the browser tab icon and smaller application mark where appropriate."
              value={draft.appIconUrl}
              onChange={(value) => setDraft((current) => ({ ...current, appIconUrl: value }))}
              onUpload={() => iconInputRef.current?.click()}
            />

            <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile("companyLogoUrl")} />
            <input ref={darkLogoInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile("darkLogoUrl")} />
            <input ref={iconInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile("appIconUrl")} />
          </div>
        </CrmSectionCard>

        <CrmSectionCard
          title="Colour controls"
          description="Only accent surfaces are configurable. Structure, typography, and core backgrounds stay fixed to preserve quality."
        >
          <div className="space-y-5">
            <ColorField
              label="Primary brand colour"
              hint="Used for buttons, active navigation, progress accents, and email CTA buttons."
              value={draft.primaryColor}
              onChange={(value) => setDraft((current) => ({ ...current, primaryColor: value }))}
            />
            <ColorField
              label="Secondary colour"
              hint="Used for supporting accents such as pills and subtle highlights."
              value={draft.secondaryColor}
              onChange={(value) => setDraft((current) => ({ ...current, secondaryColor: value }))}
            />
            <ColorField
              label="Neutral surface tint"
              hint="A restrained overlay used only for supporting surfaces and atmospheric depth."
              value={draft.surfaceTint}
              onChange={(value) => setDraft((current) => ({ ...current, surfaceTint: value }))}
            />

            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-5 py-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                  <Palette className="size-4" />
                </div>
                <div className="space-y-2 text-sm leading-6 text-slate-300">
                  <p className="font-semibold text-white">Safe theming is enforced</p>
                  <p>
                    Colour choices are normalised into a controlled range before they are applied, so the interface stays readable, premium, and consistent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CrmSectionCard>
      </div>

      <CrmSectionCard
        title="Preset starting points"
        description="Use a prepared brand direction, then fine-tune logos and colours before saving."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition-colors hover:bg-white/[0.06]"
              onClick={() => {
                setDraft(preset)
                setMessage(`${preset.label} loaded into the preview.`)
              }}
            >
              <div className="space-y-3">
                <AppBrand
                  name={preset.companyName}
                  subtitle="Preview"
                  logoUrl={preset.companyLogoUrl}
                  darkLogoUrl={preset.darkLogoUrl}
                  compact
                />
                <p className="text-sm font-semibold text-white">{preset.label}</p>
                <p className="text-sm leading-6 text-slate-300">{preset.note}</p>
              </div>
            </button>
          ))}
        </div>
      </CrmSectionCard>

      <CrmSectionCard
        title="Live preview"
        description="A restrained read on how the saved brand will appear across the workspace, portal, and communication surfaces."
      >
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4 rounded-[24px] border border-white/10 bg-[#202c3c] p-5">
            <div className="rounded-[20px] border border-white/10 bg-[#202c3c] px-5 py-5">
              <AppBrand
                name={preview.companyName}
                subtitle="Advisory workspace"
                logoUrl={preview.companyLogoUrl}
                darkLogoUrl={preview.darkLogoUrl}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-[200px_1fr]">
              <div className="space-y-2 rounded-[20px] border border-white/10 bg-[#202c3c] p-3">
                {["Overview", "Clients", "Applications", "Settings"].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl px-4 py-3 text-sm font-medium"
                    style={
                      index === 0
                        ? { backgroundColor: preview.primaryColor, color: previewTokens.onPrimary }
                        : { backgroundColor: "rgba(255,255,255,0.04)", color: "#c7d3e4" }
                    }
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="space-y-3 rounded-[20px] border border-white/10 bg-[#2a3548] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-serif text-[1.6rem] tracking-[-0.03em] text-white">Workspace preview</p>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ backgroundColor: `${preview.secondaryColor}33`, color: "#eef4fb" }}
                  >
                    Preview
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-300">
                  Buttons, links, active navigation, and selected states inherit the controlled brand accent.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-full px-5 py-2.5 text-sm font-semibold"
                    style={{ backgroundColor: preview.primaryColor, color: previewTokens.onPrimary }}
                  >
                    Primary action
                  </button>
                  <button
                    type="button"
                    className="rounded-full border px-5 py-2.5 text-sm font-semibold text-white"
                    style={{
                      borderColor: `${preview.primaryColor}55`,
                      backgroundColor: `${preview.surfaceTint}22`,
                    }}
                  >
                    Secondary action
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-[#2a3548] p-5">
              <div className="space-y-4">
                <AppBrand
                  name={preview.companyName}
                  subtitle="Client portal"
                  logoUrl={preview.companyLogoUrl}
                  darkLogoUrl={preview.darkLogoUrl}
                  compact
                />
                <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">Portal header preview</p>
                      <p className="text-sm leading-6 text-slate-300">A calm branded entry point for applicants and family office contacts.</p>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ backgroundColor: `${preview.secondaryColor}33` }}
                    >
                      Client access
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#f4f1ea] p-5">
              <div className="overflow-hidden rounded-[20px] bg-white shadow-sm">
                <div className="px-6 py-5" style={{ backgroundColor: preview.primaryColor }}>
                  {preview.darkLogoUrl || preview.companyLogoUrl ? (
                    <img
                      src={preview.darkLogoUrl || preview.companyLogoUrl}
                      alt={preview.companyName}
                      className="h-10 w-auto max-w-[220px] object-contain object-left"
                    />
                  ) : (
                    <p
                      className="font-serif text-[2rem] tracking-[-0.04em]"
                      style={{ color: previewTokens.onPrimary }}
                    >
                      {preview.companyName}
                    </p>
                  )}
                </div>
                <div className="space-y-4 px-6 py-6">
                  <div>
                    <p className="font-serif text-[1.9rem] tracking-[-0.03em] text-slate-900">Email preview</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Branded templates use the chosen company identity, sender name, and CTA colour automatically.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full px-5 py-2.5 text-sm font-semibold"
                    style={{ backgroundColor: preview.primaryColor, color: previewTokens.onPrimary }}
                  >
                    Open your portal
                  </button>
                  <p className="text-sm leading-6 text-slate-600">
                    {preview.senderDisplayName}
                    <br />
                    {preview.companyName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setDraft(defaultBrandingSettings)
                setMessage("Default branding restored in the preview.")
              }}
            >
              <RotateCcw className="size-4" />
              Restore defaults
            </Button>
          </div>
          <Button
            className="rounded-full"
            onClick={() => {
              replaceBranding(preview)
              setMessage("Branding saved to the workspace.")
            }}
          >
            Save branding
          </Button>
        </div>

        {message ? (
          <div className="rounded-[18px] border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-50">
            {message}
          </div>
        ) : null}
      </CrmSectionCard>
    </div>
  )
}
