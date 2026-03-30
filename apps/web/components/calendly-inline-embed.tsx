import Script from "next/script"

interface CalendlyInlineEmbedProps {
  url: string
  minWidth?: number
  height?: number
}

export function CalendlyInlineEmbed({
  url,
  minWidth = 320,
  height = 700,
}: CalendlyInlineEmbedProps) {
  return (
    <>
      <Script
        id="calendly-widget-script"
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
      <div
        className="calendly-inline-widget w-full"
        data-url={url}
        style={{ minWidth, height }}
      />
    </>
  )
}
