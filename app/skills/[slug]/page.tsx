import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BadgeCheck, Download, GitBranch, Star } from "lucide-react"
import { getSkill, githubUrl, latestVersion, skills } from "@/lib/skills-data"
import { IntegratePanel } from "@/components/integrate-panel"
import { VersionList } from "@/components/version-list"
import { ReadmeView } from "@/components/readme-view"

export function generateStaticParams() {
  return skills.map((s) => ({ slug: s.slug }))
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const skill = getSkill(slug)
  if (!skill) notFound()

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Discover
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-start gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-balance text-3xl font-semibold tracking-tight">{skill.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
                {skill.owner.handle}
                {skill.owner.verified && <BadgeCheck className="size-4 text-primary" />}
                <span className="text-border">/</span>
                {skill.category}
              </p>
            </div>
            <span className="rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-sm">
              v{latestVersion(skill)}
            </span>
          </div>

          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            {skill.tagline}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="size-4" />
              {formatCount(skill.stars)} stars
            </span>
            <span className="flex items-center gap-1">
              <Download className="size-4" />
              {formatCount(skill.installs)} installs
            </span>
            <a
              href={githubUrl(skill)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 transition-colors hover:text-foreground"
            >
              <GitBranch className="size-4" />
              {skill.repo}
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {skill.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-xs text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Readme */}
          <section className="mt-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Readme
            </h2>
            <ReadmeView blocks={skill.readme} />
          </section>

          {/* Versions */}
          <section className="mt-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Versions
            </h2>
            <VersionList skill={skill} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <IntegratePanel skill={skill} />
        </aside>
      </div>
    </main>
  )
}
