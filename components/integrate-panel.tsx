"use client"

import { useState } from "react"
import { Check, GitBranch, Plus, Trash2 } from "lucide-react"
import {
  githubUrl,
  latestVersion,
  refForMode,
  resolveVersion,
  type Skill,
  type TrackMode,
} from "@/lib/skills-data"
import { useIntegrations } from "@/components/integrations-provider"
import { CopyBlock } from "@/components/copy-block"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Target = "kiro" | "generic"

const modeCopy: Record<TrackMode, { label: string; hint: string }> = {
  latest: { label: "Latest", hint: "Tracks main — always the newest push." },
  major: { label: "Major", hint: "Stays on this major line, gets minor & patch updates." },
  pinned: { label: "Pinned", hint: "Exact version. Never changes until you bump it." },
}

export function IntegratePanel({ skill }: { skill: Skill }) {
  const { isIntegrated, getIntegration, integrate, remove } = useIntegrations()
  const [mode, setMode] = useState<TrackMode>("major")
  const [target, setTarget] = useState<Target>("kiro")
  const [selectedVersion, setSelectedVersion] = useState(latestVersion(skill))

  const integrated = isIntegrated(skill.slug)
  const existing = getIntegration(skill.slug)

  const resolved = resolveVersion(skill, mode, selectedVersion)
  const ref = refForMode(skill, mode, selectedVersion)
  const url = githubUrl(skill)
  const refUrl = `${url}#${ref}`

  const kiroSnippet = `# .kiro/skills.yaml
skills:
  - name: ${skill.slug}
    source: ${url}
    ref: ${ref}   # ${modeCopy[mode].label.toLowerCase()} → resolves to v${resolved}`

  const genericSnippet = `# Reference the skill by its GitHub link.
# Your agent fetches it at ${ref} — no files copied into your repo.

skill_ref: "${refUrl}"
resolved_version: "${resolved}"`

  const cliSnippet = `npx skillhub add ${skill.repo} --ref ${ref}`

  function handleIntegrate() {
    integrate({
      slug: skill.slug,
      mode,
      pinned: selectedVersion,
      installedVersion: resolved,
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Integrate</h2>
        {integrated && (
          <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 font-mono text-[11px] font-medium text-success">
            <Check className="size-3" />
            added · v{existing?.installedVersion}
          </span>
        )}
      </div>

      {/* Tracking mode */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Update mode</p>
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(modeCopy) as TrackMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                mode === m
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {modeCopy[m].label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{modeCopy[mode].hint}</p>
      </div>

      {/* Version picker (major/pinned) */}
      {mode !== "latest" && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {mode === "major" ? "Base version" : "Version"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {skill.versions.map((v) => (
              <button
                key={v.version}
                onClick={() => setSelectedVersion(v.version)}
                className={cn(
                  "rounded-md border px-2 py-1 font-mono text-xs transition-colors",
                  selectedVersion === v.version
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                v{v.version}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resolved ref */}
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs">
        <GitBranch className="size-3.5 shrink-0 text-primary" />
        <span className="font-mono text-muted-foreground">
          {skill.repo}
          <span className="text-foreground">#{ref}</span> → v{resolved}
        </span>
      </div>

      {/* Target tabs */}
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-1 rounded-lg border border-border p-0.5">
          {(["kiro", "generic"] as Target[]).map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={cn(
                "flex-1 rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors",
                target === t ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "kiro" ? "Kiro" : "Generic / CLI"}
            </button>
          ))}
        </div>

        {target === "kiro" ? (
          <CopyBlock label="Kiro" code={kiroSnippet} />
        ) : (
          <div className="flex flex-col gap-2">
            <CopyBlock label="Any agent" code={genericSnippet} />
            <CopyBlock label="CLI" code={cliSnippet} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {integrated ? (
          <Button
            variant="destructive"
            size="lg"
            className="flex-1"
            onClick={() => remove(skill.slug)}
          >
            <Trash2 />
            Remove
          </Button>
        ) : (
          <Button size="lg" className="flex-1" onClick={handleIntegrate}>
            <Plus />
            Add to my integrations
          </Button>
        )}
      </div>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Tracked in your dashboard so you know when v{skill.repo && latestVersion(skill)} changes.
      </p>
    </div>
  )
}
