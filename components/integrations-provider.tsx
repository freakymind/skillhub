"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { TrackMode } from "@/lib/skills-data"

export type Integration = {
  slug: string
  mode: TrackMode
  /** the version the consumer received when they last integrated/updated */
  installedVersion: string
  /** for major/pinned modes, the version string they chose */
  pinned: string
  addedAt: string
}

type IntegrationsContextValue = {
  integrations: Integration[]
  ready: boolean
  isIntegrated: (slug: string) => boolean
  getIntegration: (slug: string) => Integration | undefined
  integrate: (integration: Omit<Integration, "addedAt">) => void
  remove: (slug: string) => void
  /** bump installedVersion to the resolved current version */
  update: (slug: string, toVersion: string) => void
}

const STORAGE_KEY = "skillhub.integrations.v1"

const IntegrationsContext = createContext<IntegrationsContextValue | null>(null)

export function IntegrationsProvider({ children }: { children: ReactNode }) {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setIntegrations(JSON.parse(raw))
    } catch {
      // ignore malformed storage
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(integrations))
    } catch {
      // ignore quota errors
    }
  }, [integrations, ready])

  const value: IntegrationsContextValue = {
    integrations,
    ready,
    isIntegrated: (slug) => integrations.some((i) => i.slug === slug),
    getIntegration: (slug) => integrations.find((i) => i.slug === slug),
    integrate: (integration) =>
      setIntegrations((prev) => [
        ...prev.filter((i) => i.slug !== integration.slug),
        { ...integration, addedAt: new Date().toISOString() },
      ]),
    remove: (slug) => setIntegrations((prev) => prev.filter((i) => i.slug !== slug)),
    update: (slug, toVersion) =>
      setIntegrations((prev) =>
        prev.map((i) => (i.slug === slug ? { ...i, installedVersion: toVersion } : i)),
      ),
  }

  return <IntegrationsContext.Provider value={value}>{children}</IntegrationsContext.Provider>
}

export function useIntegrations() {
  const ctx = useContext(IntegrationsContext)
  if (!ctx) throw new Error("useIntegrations must be used within IntegrationsProvider")
  return ctx
}
