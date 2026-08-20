"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, GitBranch, Loader2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Parsed = {
  owner: string
  repo: string
}

type Status = "idle" | "fetching" | "done"

function parseRepo(input: string): Parsed | null {
  const trimmed = input.trim().replace(/\.git$/, "")
  const m = trimmed.match(/github\.com[/:]([\w.-]+)\/([\w.-]+)/i) ?? trimmed.match(/^([\w.-]+)\/([\w.-]+)$/)
  if (!m) return null
  return { owner: m[1], repo: m[2] }
}

const steps = [
  "Cloning repository metadata",
  "Reading skill.yaml manifest",
  "Discovering git tags & releases",
  "Indexing tools and README",
]

export default function PublishPage() {
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [activeStep, setActiveStep] = useState(0)
  const parsed = parseRepo(url)

  function handlePublish() {
    if (!parsed) return
    setStatus("fetching")
    setActiveStep(0)
    let step = 0
    const timer = setInterval(() => {
      step += 1
      if (step >= steps.length) {
        clearInterval(timer)
        setStatus("done")
      } else {
        setActiveStep(step)
      }
    }, 550)
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-20 pt-10">
      <div className="flex items-center gap-2">
        <GitBranch className="size-5 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Publish a skill</h1>
      </div>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
        Point SkillHub at a public GitHub repo containing a{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">skill.yaml</code> manifest.
        We index it by link — nothing is copied, so every release you tag becomes instantly
        available to consumers.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <label htmlFor="repo" className="text-xs font-medium text-muted-foreground">
          GitHub repository
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 focus-within:border-primary/50">
          <GitBranch className="size-4 shrink-0 text-muted-foreground" />
          <input
            id="repo"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setStatus("idle")
            }}
            placeholder="github.com/your-name/your-skill"
            className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        {url && !parsed && (
          <p className="mt-2 text-xs text-destructive">
            Enter a valid GitHub repo, e.g. github.com/owner/repo or owner/repo.
          </p>
        )}

        <Button
          size="lg"
          className="mt-4 w-full"
          disabled={!parsed || status === "fetching"}
          onClick={handlePublish}
        >
          {status === "fetching" ? <Loader2 className="animate-spin" /> : <GitBranch />}
          {status === "fetching" ? "Indexing…" : "Publish from GitHub"}
        </Button>
      </div>

      {/* Progress / result */}
      {status !== "idle" && parsed && (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          {status === "done" ? (
            <div>
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="size-5" />
                <span className="text-sm font-semibold">Published</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-mono text-foreground">
                  {parsed.owner}/{parsed.repo}
                </span>{" "}
                is now discoverable. Consumers can integrate it by link and will see new git tags
                the moment you push them.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 font-mono text-xs">
                <Tag className="size-3.5 text-primary" />
                latest tag detected: <span className="text-foreground">v1.0.0</span>
              </div>
              <Link
                href="/"
                className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-border bg-background text-sm font-medium transition-colors hover:bg-muted"
              >
                Back to discover
              </Link>
            </div>
          ) : (
            <ol className="flex flex-col gap-3">
              {steps.map((label, i) => {
                const state = i < activeStep ? "done" : i === activeStep ? "active" : "pending"
                return (
                  <li key={label} className="flex items-center gap-3 text-sm">
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border",
                        state === "done" && "border-success bg-success/15 text-success",
                        state === "active" && "border-primary text-primary",
                        state === "pending" && "border-border text-muted-foreground",
                      )}
                    >
                      {state === "done" ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : state === "active" ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <span className={state === "pending" ? "text-muted-foreground" : "text-foreground"}>
                      {label}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      )}

      {/* Manifest hint */}
      <div className="mt-8">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Example skill.yaml</p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 px-3 py-3 font-mono text-xs leading-relaxed text-foreground">
          <code>{`name: my-skill
version: 1.0.0
description: What this skill does.
tags: [example, demo]
tools:
  - name: my-skill.run
    description: Run the skill.`}</code>
        </pre>
      </div>
    </main>
  )
}
