import type { ReadmeBlock } from "@/lib/skills-data"

export function ReadmeView({ blocks }: { blocks: ReadmeBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h3 key={i} className="mt-2 text-sm font-semibold tracking-tight text-foreground">
                {block.text}
              </h3>
            )
          case "p":
            return (
              <p key={i} className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {block.text}
              </p>
            )
          case "ul":
            return (
              <ul key={i} className="flex flex-col gap-1.5">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            )
          case "code":
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-lg border border-border bg-muted/40 px-3 py-2.5 font-mono text-xs leading-relaxed text-foreground"
              >
                <code>{block.text}</code>
              </pre>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
