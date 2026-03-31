import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Manrope } from "next/font/google"
import "@cbideal/config/globals.css"
import "./app-globals.css"
import { BrandingProvider } from "@/lib/branding-store"
import { CommunicationProvider } from "@/lib/communication-store"
import { WorkflowProvider } from "@/lib/workflow-store"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://app.cbideal.nl"),
  title: {
    default: "CBI Deal Workspace",
    template: "%s | CBI Deal Workspace",
  },
  description:
    "The CBI Deal workspace for internal coordination, case visibility, and controlled client access.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`app-workspace ${manrope.variable} ${cormorant.variable} font-sans antialiased`}>
        <BrandingProvider>
          <WorkflowProvider>
            <CommunicationProvider>{children}</CommunicationProvider>
          </WorkflowProvider>
        </BrandingProvider>
      </body>
    </html>
  )
}
