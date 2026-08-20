"use client"

import Link from "next/link"
import { ArrowUpCircle, Boxes, Check, GitBranch, Trash2 } from "lucide-react"
import {
  compareVersions,
  getSkill,
  refForMode,
  resolveVersion,
} from "@/lib/skills-data"
import { useIntegrations } from "@/components/integrations-provider"
import { Button } from "@/components/ui/button"

const modeLabel: Record<string, string> = {
  latest: "latest",
  major: "major",
  pinned: "pinned",
}

export default function DashboardPage() {
  const { integrations, ready, update, remove } = useIntegrations()

  const rows = integrations
    .map((i) => {
      const skill = getSkill(i.slug)
      if (!skill) return null
      const target = resolveVersion(skill, i.mode, i.pinned)
      const hasUpdate = compareVersions(target, i.installedVersion) > 0
      const ref = refForMode(skill, i.mode, i.pinned)
      return { integration: i, skill, target, hasUpdate, ref }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => Number(b.hasUpdate) - Number(a.hasUpdate))

  const updateCount = rows.filter((r) => r.hasUpdate).length

  return (
    <main className="mx-auto max-w-4xl px-4 pb-20 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Integrations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Skills you reference by link. Updates arrive on the terms you pinned.
          </p>
        </div>
        {updateCount > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <ArrowUpCircle className="size-4" />
            {updateCount} update{updateCount === 1 ? "" : "s"} available
          </span>
        )}
      </div>

      {!ready ? (
        <div className="mt-10 text-sm text-muted-foreground">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
            <Boxes className="size-5 text-muted-foreground" />
          </span>
          <p className="mt-4 text-sm font-medium">No integrations yet</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Browse the registry and add a skill to start tracking its versions here.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Discover skills
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {rows.map(({ integration, skill, target, hasUpdate, ref }) => (
            <div
              key={skill.slug}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/skills/${skill.slug}`}
                    className="truncate font-semibold hover:text-primary"
                  >
                    {skill.name}
                  </Link>
                  <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-secondary-foreground">
                    {modeLabel[integration.mode]}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <GitBranch className="size-3" />
                  {skill.repo}#{ref}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-mono text-sm">
                    <span className={hasUpdate ? "text-muted-foreground line-through" : "text-foreground"}>
                      v{integration.installedVersion}
                    </span>
                    {hasUpdate && <span className="ml-1.5 text-primary">→ v{target}</span>}
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {hasUpdate ? "update available" : "up to date"}
                  </p>
                </div>

                {hasUpdate ? (
                  <Button size="sm" onClick={() => update(skill.slug, target)}>
                    <ArrowUpCircle />
                    Update
                  </Button>
                ) : (
                  <span className="flex size-7 items-center justify-center rounded-md bg-success/15 text-success">
                    <Check className="size-4" />
                  </span>
                )}
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Remove ${skill.name}`}
                  onClick={() => remove(skill.slug)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
