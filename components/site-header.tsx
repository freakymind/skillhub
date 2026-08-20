"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Boxes, LayoutDashboard, Search, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUpdateCount } from "@/components/use-updates"

const nav = [
  { href: "/", label: "Discover", icon: Search },
  { href: "/dashboard", label: "My Integrations", icon: LayoutDashboard },
  { href: "/publish", label: "Publish", icon: Upload },
]

export function SiteHeader() {
  const pathname = usePathname()
  const updates = useUpdateCount()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Boxes className="size-4" />
          </span>
          <span className="font-mono text-sm font-semibold tracking-tight">skillhub</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            const showBadge = item.href === "/dashboard" && updates > 0
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="size-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
                {showBadge && (
                  <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold text-primary-foreground">
                    {updates}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </a>
        </div>
      </div>
    </header>
  )
}
