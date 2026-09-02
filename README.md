# SkillHub — a GitHub-backed registry for AI agent skills

SkillHub is a dashboard where people **publish** agent skills from GitHub and other people **integrate** those skills by *link*, not by copying files. Because a consumer references `owner/repo#ref` instead of a snapshot, the owner stays in control of the skill, and every consumer can see and pull updates the moment a new version is released.

It works with Kiro out of the box and with any agent that can fetch a Git reference (Claude Code, Cursor, custom agents, CLI tooling).

---

## Table of contents

1. [The problem this solves](#1-the-problem-this-solves)
2. [Core concepts](#2-core-concepts)
3. [Roles: owner, publisher, consumer](#3-roles-owner-publisher-consumer)
4. [Owner workflow: publishing and controlling a skill](#4-owner-workflow-publishing-and-controlling-a-skill)
5. [Consumer workflow: discovering and integrating a skill](#5-consumer-workflow-discovering-and-integrating-a-skill)
6. [Tracking modes: how updates reach consumers](#6-tracking-modes-how-updates-reach-consumers)
7. [How update detection works](#7-how-update-detection-works)
8. [Skill repository layout](#8-skill-repository-layout)
9. [Integration formats (Kiro, generic, CLI)](#9-integration-formats-kiro-generic-cli)
10. [Dashboard pages](#10-dashboard-pages)
11. [Architecture and data model](#11-architecture-and-data-model)
12. [Current status and roadmap](#12-current-status-and-roadmap)
13. [Running locally](#13-running-locally)

---

## 1. The problem this solves

Today, sharing a skill usually means someone copies a `SKILL.md` (or a folder of prompts and tools) into their own project. That creates three problems:

- **Drift.** The moment the author improves the skill, every copy is stale. Nobody knows which copy is current.
- **No ownership.** Once copied, the author cannot fix a bug, retract a bad version, or communicate a breaking change to the people using it.
- **No discovery.** Skills live in random repos and chat threads. There is no single place to search "PDF extraction" and find the best-maintained option.

SkillHub fixes this by treating **GitHub as the single source of truth** and the registry as an **index plus subscription layer** on top of it.

---

## 2. Core concepts

| Term | Meaning |
|---|---|
| **Skill** | A unit of agent capability (instructions, tools, examples) that lives in its own GitHub repository. |
| **Owner** | The GitHub user or organization that owns the skill repository. Owners control the code, tags, and releases. |
| **Publisher** | The person who registers a skill in SkillHub by submitting its GitHub URL. Usually the owner, but any maintainer with push rights can publish. |
| **Consumer** | Anyone who integrates a skill into their agent (Kiro project, Claude Code config, custom runtime). |
| **Version** | A Git tag on the skill repo following semantic versioning, e.g. `v3.2.0`. |
| **Ref** | The Git reference a consumer points at: `main`, a major-line tag like `v3`, or an exact tag like `v3.2.0`. |
| **Tracking mode** | The consumer's policy for which ref they follow: `latest`, `major`, or `pinned`. |
| **Integration** | A record that a consumer has added a skill, in which mode, and which version they currently have installed. |

The key rule: **the registry never stores skill content**. It stores metadata (name, owner, tags, versions, README rendering) and pointers back to GitHub. The agent always fetches the real skill from the repo at the chosen ref.

---

## 3. Roles: owner, publisher, consumer

### Owner
- Owns the GitHub repository.
- Controls what the skill does by pushing commits.
- Controls *what consumers receive* by cutting Git tags and releases.
- Can mark a skill as verified (organization-level trust badge).
- Can deprecate, archive, or yank a version by deleting/retagging in GitHub — the registry reflects it on the next sync.

### Publisher
- Submits the repo URL to SkillHub (`/publish`).
- SkillHub reads the repo (README, tags, `skill.yaml` manifest) and creates the catalog entry.
- After the first publish, nothing else is manual: new tags on GitHub automatically show up as new versions.

### Consumer
- Searches and filters skills on the Discover page.
- Picks a tracking mode and copies the integration snippet for their tool.
- Sees an "Update available" badge in their dashboard whenever the owner releases something their mode is allowed to receive.
- Updates with one click (or by editing the ref in their config).

> **Control boundary:** Owners control *what exists* (code, tags). Consumers control *what they follow* (mode, pin). Neither can override the other. An owner cannot force-update a pinned consumer; a consumer cannot receive code the owner has not tagged.

---

## 4. Owner workflow: publishing and controlling a skill

### Step 1 — Create the skill repository
Put the skill in its own GitHub repo. A minimal layout is described in [section 8](#8-skill-repository-layout).

### Step 2 — Tag a release
```bash
git tag v1.0.0
git push origin v1.0.0
```
SkillHub uses semantic versioning: `MAJOR.MINOR.PATCH`.

- **PATCH** (`1.0.0 → 1.0.1`): bug fixes, wording tweaks. Safe for everyone.
- **MINOR** (`1.0.0 → 1.1.0`): new capabilities, backwards compatible.
- **MAJOR** (`1.x → 2.0.0`): breaking changes (renamed tools, changed inputs, removed behavior).

### Step 3 — Maintain a floating major tag (recommended)
Consumers in `major` mode follow a tag like `v1`. Move it whenever you release inside that line:
```bash
git tag -f v1 v1.1.0
git push origin v1 --force
```
This is what lets a consumer on `v1` receive `1.1.0` automatically without ever being moved to `2.0.0`.

### Step 4 — Publish to SkillHub
Go to **Publish**, paste the GitHub URL, and submit. SkillHub indexes:
- Name, tagline, tags, category (from `skill.yaml` or inferred from the README)
- Owner handle and verification status
- All semver tags as versions, newest first
- Release notes per version (from GitHub Releases or a `CHANGELOG.md`)
- README, rendered on the skill detail page

### Step 5 — Ship updates
Push code, tag a new version, move the floating major tag if applicable. That is the entire release process. Consumers see the update in their dashboard; you never touch the registry again.

### What owners can control
- **Content**: everything in the repo.
- **Release cadence**: only tagged versions are offered to `major`/`pinned` consumers; `latest` consumers see `main` immediately.
- **Breaking changes**: bump the major number. `major`-mode consumers are protected and must opt in.
- **Retraction**: delete a tag on GitHub and the version disappears from the registry on the next sync; consumers pinned to it are flagged.
- **Trust**: verified badge for organizations; stars and install counts are public signals.

---

## 5. Consumer workflow: discovering and integrating a skill

1. **Discover** — Open `/`, search by name or tag, filter by category, sort by popularity or recently updated. The "Recently updated" strip shows what has changed lately.
2. **Inspect** — Open a skill to read its README, owner, star/install counts, and full version history with release notes.
3. **Choose a tracking mode** — Latest, Major, or Pinned (see next section). For Major/Pinned, pick the base version.
4. **Copy the snippet** — Switch between **Kiro** and **Generic / CLI** tabs and copy the config that points at the resolved `repo#ref`.
5. **Add to my integrations** — Registers the skill in your dashboard so update tracking starts.
6. **Watch for updates** — The header badge and `/dashboard` show how many of your integrations have a newer version available under their mode.
7. **Update** — Click "Update" to move `installedVersion` to the newly resolved version, then refresh the ref in your tool if needed (for `major` and `latest` modes the ref itself does not change, only the content behind it).

---

## 6. Tracking modes: how updates reach consumers

| Mode | Ref used | What you receive | When to use |
|---|---|---|---|
| **Latest** | `main` | Every push, immediately. | Trusted owners, internal teams, prototyping. |
| **Major** *(default)* | `vN` (e.g. `v3`) | All minor and patch releases within major `N`. Never a breaking change. | Most production use. Safe automatic updates. |
| **Pinned** | `vN.N.N` (e.g. `v3.1.1`) | Nothing changes until you manually bump. | Compliance, reproducibility, audited environments. |

### Resolution rules

```
resolve(skill, mode, base):
  latest → newest tag in the repo
  major  → newest tag whose MAJOR equals MAJOR(base)
  pinned → base, exactly
```

Example with versions `3.2.0, 3.1.1, 3.0.0, 2.4.0` and base `3.0.0`:
- latest → `3.2.0`, ref `main`
- major → `3.2.0`, ref `v3`
- pinned → `3.0.0`, ref `v3.0.0`

Example with base `2.4.0` in major mode → resolves to `2.4.0` (nothing newer in the v2 line), and will **not** move to `3.x` because that would be a breaking change.

---

## 7. How update detection works

Every integration stores four fields:

```ts
{
  slug: "web-scraper",        // which skill
  mode: "major",              // latest | major | pinned
  pinned: "4.2.0",            // base version chosen at integration time
  installedVersion: "4.2.0",  // what the consumer currently has
  addedAt: "2026-06-01T..."
}
```

On every dashboard load:

1. Re-run `resolveVersion(skill, mode, pinned)` against the **current** version list from the registry.
2. Compare the result with `installedVersion` using semver ordering.
3. If `resolved > installed` → show **Update available: vX → vY** and count it in the header badge.
4. Clicking **Update** sets `installedVersion = resolved`.

Because resolution happens against live registry data, an owner tagging `v4.3.2` on GitHub is enough to light up the badge for every `major`-mode consumer on `v4`, and every `latest` consumer — without the owner doing anything in SkillHub. Pinned consumers are untouched by design.

In the production design, the registry syncs tags from GitHub via webhooks (`push`, `release`, `create` events) or a scheduled poll, so "current version list" is always within seconds of GitHub.

---

## 8. Skill repository layout

A skill repo needs only a manifest and a README. Everything else is up to the owner.

```
my-skill/
├── skill.yaml          # manifest read by SkillHub and by agents
├── SKILL.md            # the actual instructions the agent loads
├── README.md           # human docs, rendered on the detail page
├── CHANGELOG.md        # optional; release notes per version
├── tools/              # optional tool definitions / scripts
└── examples/           # optional usage examples
```

Example `skill.yaml`:

```yaml
name: web-scraper
version: 4.3.2
description: Fetch, clean, and structure any web page into agent-ready markdown.
category: Web
tags: [scraping, web, markdown, crawler]
entry: SKILL.md
compat:
  kiro: ">=1.0"
  generic: true
owner: mira-dev
license: MIT
```

`version` in the manifest should match the Git tag; the tag is authoritative.

---

## 9. Integration formats (Kiro, generic, CLI)

All formats express the same thing: **a GitHub URL plus a ref**. No skill files are copied into the consumer's repo.

### Kiro
```yaml
# .kiro/skills.yaml
skills:
  - name: web-scraper
    source: https://github.com/mira-dev/web-scraper-skill
    ref: v4   # major → resolves to v4.3.2
```

### Generic (any agent that can fetch a Git ref)
```yaml
skill_ref: "https://github.com/mira-dev/web-scraper-skill#v4"
resolved_version: "4.3.2"
```
The agent clones or raw-fetches `SKILL.md` (and anything in `entry`) at that ref on startup or on demand.

### CLI
```bash
npx skillhub add mira-dev/web-scraper-skill --ref v4
```
Writes the appropriate config for the detected tool and registers the integration.

---

## 10. Dashboard pages

| Route | Purpose |
|---|---|
| `/` | **Discover.** Search, category filter, sort, recently-updated strip, skill cards with owner, tags, stars, latest version, and an Integrate CTA. |
| `/skills/[slug]` | **Skill detail.** README, owner and trust info, version history with notes, and the Integrate panel (mode, version picker, Kiro/generic/CLI snippets). |
| `/dashboard` | **My Integrations.** Every skill you have added, its mode, installed vs resolved version, "Update available" state, one-click Update, and Remove. |
| `/publish` | **Publish.** Paste a GitHub URL; SkillHub validates it, indexes the repo, and adds it to the catalog. |

The header shows a live count of integrations with pending updates.

---

## 11. Architecture and data model

```
┌────────────┐   push / tag   ┌──────────────┐   sync (webhook/poll)   ┌────────────────┐
│  Owner     │ ─────────────▶ │  GitHub repo │ ──────────────────────▶ │ SkillHub index │
└────────────┘                └──────────────┘                         └───────┬────────┘
                                     ▲                                         │ resolve(mode)
                                     │ fetch SKILL.md @ ref                    ▼
                              ┌──────┴───────┐                         ┌────────────────┐
                              │ Agent (Kiro, │ ◀── config: repo#ref ── │   Consumer     │
                              │ generic)     │                         │   dashboard    │
                              └──────────────┘                         └────────────────┘
```

**Key files in this codebase**

| File | Role |
|---|---|
| `lib/skills-data.ts` | `Skill` and `SkillVersion` types, the catalog, and the resolution helpers: `resolveVersion`, `refForMode`, `compareVersions`, `githubUrl`. |
| `components/integrations-provider.tsx` | Consumer-side integration store (`integrate`, `remove`, `update`, `getIntegration`). |
| `components/use-updates.ts` | Computes which integrations have a newer resolvable version. |
| `components/integrate-panel.tsx` | Mode/version picker and Kiro / generic / CLI snippet generation. |
| `components/skill-card.tsx`, `version-list.tsx`, `readme-view.tsx` | Presentation components. |
| `app/page.tsx`, `app/skills/[slug]/page.tsx`, `app/dashboard/page.tsx`, `app/publish/page.tsx` | The four dashboard routes. |

---

## 12. Current status and roadmap

**This version is an interactive prototype.**
- The catalog is a mock dataset in `lib/skills-data.ts`.
- Integrations are stored in the browser (localStorage) so the update flow can be demonstrated without a backend.
- Publish simulates repo indexing.

**Planned for a production release**
- GitHub OAuth so owners are verified as repo maintainers before publishing.
- Live repo indexing via the GitHub API and tag sync via webhooks.
- Persistent catalog and per-user integrations in a database (Neon Postgres).
- `skillhub` CLI that writes tool-specific config and reports installed versions back.
- Signed releases and checksum verification for `pinned` mode.
- Organizations: private skills visible only to team members.
- Deprecation notices and yanked-version warnings surfaced to affected consumers.

---

## 13. Running locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

This project is built with Next.js (App Router), Tailwind CSS v4, and shadcn/ui, and is linked to a [v0](https://v0.app/chat/projects/prj_HFzzGl2GoH5BmO9CUheUHxDJU7No) project. Merges to `main` deploy automatically.
