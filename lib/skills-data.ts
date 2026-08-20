export type SkillVersion = {
  version: string
  date: string
  notes: string[]
}

export type ReadmeBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; lang: string; text: string }

export type Skill = {
  slug: string
  name: string
  tagline: string
  owner: {
    handle: string
    name: string
    verified: boolean
  }
  repo: string // github repo path, e.g. "acme/pdf-skill"
  category: string
  tags: string[]
  stars: number
  installs: number
  updatedAt: string // ISO date
  versions: SkillVersion[] // newest first
  readme: ReadmeBlock[]
}

// Newest version is always versions[0]
export const skills: Skill[] = [
  {
    slug: "pdf-extractor",
    name: "PDF Extractor",
    tagline: "Parse, split, and extract structured data from PDFs inside any agent.",
    owner: { handle: "acme-labs", name: "Acme Labs", verified: true },
    repo: "acme-labs/pdf-extractor-skill",
    category: "Documents",
    tags: ["pdf", "parsing", "ocr", "documents"],
    stars: 2140,
    installs: 18300,
    updatedAt: "2026-08-14",
    versions: [
      {
        version: "3.2.0",
        date: "2026-08-14",
        notes: ["Added table extraction with column inference", "Faster OCR fallback for scanned pages"],
      },
      {
        version: "3.1.1",
        date: "2026-07-02",
        notes: ["Fix crash on encrypted PDFs", "Better error messages"],
      },
      {
        version: "3.0.0",
        date: "2026-05-20",
        notes: ["Rewrote extraction pipeline", "Breaking: renamed `parse()` to `extract()`"],
      },
      { version: "2.4.0", date: "2026-02-11", notes: ["Initial multi-page support"] },
    ],
    readme: [
      { type: "p", text: "A batteries-included skill for reading PDFs. It exposes tools your agent can call to extract text, tables, and metadata without leaving the conversation." },
      { type: "h2", text: "Capabilities" },
      { type: "ul", items: ["Text extraction with layout preservation", "Table detection and CSV export", "OCR fallback for scanned documents", "Page splitting and merging"] },
      { type: "h2", text: "Usage" },
      { type: "code", lang: "ts", text: "// Once integrated, the skill registers these tools:\nawait agent.call('pdf.extract', { url })\nawait agent.call('pdf.tables', { url, page: 2 })" },
    ],
  },
  {
    slug: "web-scraper",
    name: "Web Scraper",
    tagline: "Fetch, clean, and structure any web page into agent-ready markdown.",
    owner: { handle: "mira-dev", name: "Mira Chen", verified: true },
    repo: "mira-dev/web-scraper-skill",
    category: "Web",
    tags: ["scraping", "web", "markdown", "crawler"],
    stars: 3980,
    installs: 41200,
    updatedAt: "2026-08-18",
    versions: [
      { version: "5.0.0", date: "2026-08-18", notes: ["Headless browser mode", "Breaking: `scrape()` now returns `{ markdown, links }`"] },
      { version: "4.3.2", date: "2026-06-29", notes: ["Respect robots.txt by default", "Retry with backoff"] },
      { version: "4.2.0", date: "2026-04-15", notes: ["Add sitemap crawling"] },
    ],
    readme: [
      { type: "p", text: "Turn messy HTML into clean, structured markdown your model can actually reason over. Handles pagination, JS-rendered pages, and rate limiting." },
      { type: "h2", text: "Capabilities" },
      { type: "ul", items: ["Readability-based content extraction", "JS rendering via headless browser", "Automatic link and image resolution", "Polite crawling with robots.txt"] },
      { type: "h2", text: "Usage" },
      { type: "code", lang: "ts", text: "await agent.call('web.scrape', { url })\nawait agent.call('web.crawl', { url, depth: 2 })" },
    ],
  },
  {
    slug: "sql-copilot",
    name: "SQL Copilot",
    tagline: "Safe natural-language-to-SQL with schema awareness and guardrails.",
    owner: { handle: "datastack", name: "Datastack", verified: true },
    repo: "datastack/sql-copilot-skill",
    category: "Data",
    tags: ["sql", "database", "postgres", "analytics"],
    stars: 1720,
    installs: 9800,
    updatedAt: "2026-08-09",
    versions: [
      { version: "2.1.0", date: "2026-08-09", notes: ["Read-only mode enforced by default", "Schema caching"] },
      { version: "2.0.0", date: "2026-06-01", notes: ["Breaking: config now requires `dialect`"] },
      { version: "1.5.0", date: "2026-03-22", notes: ["Add explain-plan analysis"] },
    ],
    readme: [
      { type: "p", text: "Generate correct, parameterized SQL from plain English. Introspects your schema so queries reference real tables and columns, and refuses destructive statements unless explicitly allowed." },
      { type: "h2", text: "Guardrails" },
      { type: "ul", items: ["Read-only by default", "Parameterized queries only", "Row-limit injection", "Blocks DROP / TRUNCATE without opt-in"] },
    ],
  },
  {
    slug: "slack-notifier",
    name: "Slack Notifier",
    tagline: "Let agents post rich, threaded updates to Slack channels.",
    owner: { handle: "flowbits", name: "Flowbits", verified: false },
    repo: "flowbits/slack-notifier-skill",
    category: "Messaging",
    tags: ["slack", "notifications", "webhooks"],
    stars: 640,
    installs: 5200,
    updatedAt: "2026-07-28",
    versions: [
      { version: "1.4.0", date: "2026-07-28", notes: ["Threaded replies", "Block Kit builder helper"] },
      { version: "1.3.0", date: "2026-05-30", notes: ["Add file upload support"] },
    ],
    readme: [
      { type: "p", text: "A thin, reliable skill for sending messages, threads, and files to Slack. Uses your workspace connector so no tokens live in the agent." },
      { type: "h2", text: "Capabilities" },
      { type: "ul", items: ["Channel and DM messages", "Threaded replies", "Block Kit rich formatting", "File uploads"] },
    ],
  },
  {
    slug: "image-gen",
    name: "Image Generation",
    tagline: "Text-to-image and edits with a provider-agnostic interface.",
    owner: { handle: "pixelforge", name: "PixelForge", verified: true },
    repo: "pixelforge/image-gen-skill",
    category: "Media",
    tags: ["images", "generation", "media", "ai"],
    stars: 2890,
    installs: 22700,
    updatedAt: "2026-08-19",
    versions: [
      { version: "4.1.0", date: "2026-08-19", notes: ["Inpainting and outpainting tools", "Provider fallback"] },
      { version: "4.0.1", date: "2026-07-11", notes: ["Fix aspect-ratio rounding"] },
      { version: "4.0.0", date: "2026-06-18", notes: ["Breaking: unified `generate()` signature"] },
    ],
    readme: [
      { type: "p", text: "One interface, many providers. Swap the underlying model without changing how your agent calls it." },
      { type: "h2", text: "Capabilities" },
      { type: "ul", items: ["Text-to-image", "Inpainting / outpainting", "Upscaling", "Provider-agnostic routing"] },
    ],
  },
  {
    slug: "calendar-agent",
    name: "Calendar Agent",
    tagline: "Schedule, reschedule, and resolve conflicts across calendars.",
    owner: { handle: "mira-dev", name: "Mira Chen", verified: true },
    repo: "mira-dev/calendar-agent-skill",
    category: "Productivity",
    tags: ["calendar", "scheduling", "productivity"],
    stars: 1130,
    installs: 7400,
    updatedAt: "2026-08-02",
    versions: [
      { version: "2.2.0", date: "2026-08-02", notes: ["Timezone-aware conflict resolution", "Recurring events"] },
      { version: "2.1.0", date: "2026-06-14", notes: ["Add availability lookup"] },
    ],
    readme: [
      { type: "p", text: "Give your agent a calendar. It can find open slots, book meetings, and untangle conflicts across multiple attendees and timezones." },
      { type: "h2", text: "Capabilities" },
      { type: "ul", items: ["Availability lookup", "Conflict resolution", "Recurring events", "Timezone normalization"] },
    ],
  },
]

export function getSkill(slug: string): Skill | undefined {
  return skills.find((s) => s.slug === slug)
}

export const categories = Array.from(new Set(skills.map((s) => s.category))).sort()

export function latestVersion(skill: Skill): string {
  return skill.versions[0].version
}

/** Resolve which version a consumer receives given their tracking mode. */
export type TrackMode = "latest" | "major" | "pinned"

export function resolveVersion(skill: Skill, mode: TrackMode, pinned: string): string {
  if (mode === "latest") return latestVersion(skill)
  if (mode === "major") {
    const major = pinned.split(".")[0]
    const match = skill.versions.find((v) => v.version.split(".")[0] === major)
    return match ? match.version : latestVersion(skill)
  }
  return pinned
}

/** Build the git ref a tool should reference for a given mode. */
export function refForMode(skill: Skill, mode: TrackMode, pinned: string): string {
  if (mode === "latest") return "main"
  if (mode === "major") return `v${pinned.split(".")[0]}` // e.g. v3 tag tracks the major line
  return `v${pinned}`
}

export function githubUrl(skill: Skill): string {
  return `https://github.com/${skill.repo}`
}

export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number)
  const pb = b.split(".").map(Number)
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0)
  }
  return 0
}
