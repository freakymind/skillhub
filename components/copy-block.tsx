"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

export function CopyBlock({
  code,
  label,
  className,
}: {
  code: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-muted/40", className)}>
      {label && (
        <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        </div>
      )}
      <div className="flex items-start gap-2 px-3 py-2.5">
        <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-xs leading-relaxed text-foreground">
          <code>{code}</code>
        </pre>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy to clipboard"
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
        </button>
      </div>
    </div>
  )
}
