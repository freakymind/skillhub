"use client"

import Link from "next/link"
import { BadgeCheck, Download, Star } from "lucide-react"
import { latestVersion, type Skill } from "@/lib/skills-data"
import { useIntegrations } from "@/components/integrations-provider"

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function SkillCard({ skill }: { skill: Skill }) {
  const { isIntegrated } = useIntegrations()
  const integrated = isIntegrated(skill.slug)

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-semibold text-card-foreground">{skill.name}</h3>
            {integrated && (
              <span className="rounded bg-success/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-success">
                added
              </span>
            )}
          </div>
          <p className="mt-0.5 flex items-center gap-1 font-mono text-xs text-muted-foreground">
            {skill.owner.handle}
            {skill.owner.verified && <BadgeCheck className="size-3 text-primary" />}
          </p>
        </div>
        <span className="shrink-0 rounded-md border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
          v{latestVersion(skill)}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-pretty text-sm leading-relaxed text-muted-foreground">
        {skill.tagline}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {skill.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[11px] text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="size-3.5" />
          {formatCount(skill.stars)}
        </span>
        <span className="flex items-center gap-1">
          <Download className="size-3.5" />
          {formatCount(skill.installs)}
        </span>
        <span className="ml-auto font-mono text-[11px]">
          {new Date(skill.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
      </div>
    </Link>
  )
}
