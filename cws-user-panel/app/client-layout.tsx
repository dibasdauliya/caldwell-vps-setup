"use client"

import { Toaster } from "@/components/ui/sonner"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}