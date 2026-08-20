"use client"

import { useIntegrations } from "@/components/integrations-provider"
import { compareVersions, getSkill, resolveVersion } from "@/lib/skills-data"

/** The version a consumer *should* have given their tracking mode, right now. */
export function resolvedCurrent(slug: string, mode: string, pinned: string): string | null {
  const skill = getSkill(slug)
  if (!skill) return null
  return resolveVersion(skill, mode as never, pinned)
}

/** Number of integrations that have a newer version available under their mode. */
export function useUpdateCount(): number {
  const { integrations } = useIntegrations()
  return integrations.filter((i) => {
    const target = resolvedCurrent(i.slug, i.mode, i.pinned)
    return target !== null && compareVersions(target, i.installedVersion) > 0
  }).length
}
