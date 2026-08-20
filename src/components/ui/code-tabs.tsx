"use client"

import type * as React from "react"
import { useConfig } from "@/hooks/use-config"

export function CodeTabs({ children }: { children: React.ReactNode }) {
  return <div className="relative mt-6 w-full">{children}</div>
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex gap-1 border-b border-fd-border">{children}</div>
  )
}

export function TabsTrigger({
  value,
  children,
}: {
  value: "cli" | "manual"
  children: React.ReactNode
}) {
  const [installationType, setInstallationType] = useConfig()

  const isActive = installationType === value

  return (
    <button
      type="button"
      onClick={() => setInstallationType(value)}
      className={`rounded-t-lg border-b-2 px-3 py-1.5 text-sm font-medium transition-colors ${
        isActive
          ? "border-fd-primary text-fd-primary"
          : "border-transparent text-fd-muted-foreground hover:text-fd-foreground"
      }`}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  children,
}: {
  value: "cli" | "manual"
  children: React.ReactNode
}) {
  const [installationType] = useConfig()

  if (installationType !== value) {
    return null
  }

  return <div className="mt-2">{children}</div>
}
