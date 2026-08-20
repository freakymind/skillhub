"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, GitBranch, RefreshCw, Search, X } from "lucide-react"
import { categories, skills } from "@/lib/skills-data"
import { SkillCard } from "@/components/skill-card"
import { cn } from "@/lib/utils"

type Sort = "popular" | "recent" | "installs"

export default function DiscoverPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string | null>(null)
  const [sort, setSort] = useState<Sort>("popular")

  const recent = useMemo(
    () => [...skills].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4),
    [],
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = skills.filter((s) => {
      if (category && s.category !== category) return false
      if (!q) return true
      return (
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.owner.handle.toLowerCase().includes(q) ||
        s.tags.some((t) => t.includes(q))
      )
    })
    list = [...list].sort((a, b) => {
      if (sort === "recent") return b.updatedAt.localeCompare(a.updatedAt)
      if (sort === "installs") return b.installs - a.installs
      return b.stars - a.stars
    })
    return list
  }, [query, category, sort])

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20">
      {/* Hero */}
      <section className="border-b border-border py-12 md:py-16">
        <p className="flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
          <GitBranch className="size-3.5 text-primary" />
          GitHub-backed. Referenced by link, not copied.
        </p>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          The registry for AI agent skills.
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Publish a skill once from your GitHub repo. Consumers integrate it by link in Kiro or any
          agent — and when you ship a new version, they get the update on the terms they pinned.
        </p>

        {/* Search */}
        <div className="mt-8 flex max-w-2xl items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 focus-within:border-primary/50">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills, owners, or tags…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search skills"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </section>

      {/* Recently updated strip */}
      <section className="py-8">
        <div className="mb-3 flex items-center gap-2">
          <RefreshCw className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Recently updated</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((skill) => (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              className="group flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:border-primary/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{skill.name}</p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  v{skill.versions[0].version} · {skill.owner.handle}
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip active={category === null} onClick={() => setCategory(null)}>
            All
          </FilterChip>
          {categories.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </FilterChip>
          ))}
          <div className="ml-auto flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
            {(["popular", "recent", "installs"] as Sort[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                  sort === s ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-5">
          <p className="mb-4 font-mono text-xs text-muted-foreground">
            {results.length} skill{results.length === 1 ? "" : "s"}
          </p>
          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              No skills match your search.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((skill) => (
                <SkillCard key={skill.slug} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
