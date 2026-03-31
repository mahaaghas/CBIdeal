"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePlatformAccess } from "@/lib/platform-access-store"

export default function LogoutPage() {
  const router = useRouter()
  const { signOut } = usePlatformAccess()

  useEffect(() => {
    signOut()
    router.replace("/login")
  }, [router, signOut])

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-6">
      <div className="section-card max-w-[720px] rounded-[32px] px-10 py-12 text-center">
        <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">Signing out</span>
        <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.02] tracking-[-0.04em] text-white">
          Closing the session…
        </h1>
      </div>
    </div>
  )
}
