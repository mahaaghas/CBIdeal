"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePlatformAccess } from "@/lib/platform-access-store"

export default function DemoAccessPage() {
  const router = useRouter()
  const { startDemoSession } = usePlatformAccess()

  useEffect(() => {
    startDemoSession()
    router.replace("/dashboard")
  }, [router, startDemoSession])

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-6">
      <div className="section-card max-w-[720px] rounded-[32px] px-10 py-12 text-center">
        <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">Demo access</span>
        <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.02] tracking-[-0.04em] text-white">
          Opening the shared demo workspace…
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-300">
          This environment is isolated from real firms and resets separately from live account data.
        </p>
      </div>
    </div>
  )
}
