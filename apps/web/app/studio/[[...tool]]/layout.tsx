import type { ReactNode } from "react"

export { metadata, viewport } from "next-sanity/studio"

export default function StudioLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return children
}
