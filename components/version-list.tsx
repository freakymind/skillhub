import { Tag } from "lucide-react"
import type { Skill } from "@/lib/skills-data"

export function VersionList({ skill }: { skill: Skill }) {
  return (
    <ol className="relative border-l border-border pl-5">
      {skill.versions.map((v, i) => {
        const isMajor = v.version.endsWith(".0.0")
        return (
          <li key={v.version} className="relative pb-6 last:pb-0">
            <span className="absolute -left-[27px] flex size-3.5 items-center justify-center rounded-full border-2 border-background bg-primary" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 font-mono text-sm font-semibold">
                <Tag className="size-3.5 text-primary" />v{v.version}
              </span>
              {i === 0 && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary">
                  latest
                </span>
              )}
              {isMajor && (
                <span className="rounded bg-chart-5/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-chart-5">
                  breaking
                </span>
              )}
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">{v.date}</span>
            </div>
            <ul className="mt-2 space-y-1">
              {v.notes.map((note) => (
                <li key={note} className="text-sm leading-relaxed text-muted-foreground">
                  {note}
                </li>
              ))}
            </ul>
          </li>
        )
      })}
    </ol>
  )
}
