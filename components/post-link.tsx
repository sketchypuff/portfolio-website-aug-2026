import Link from "next/link";
import { formatDate, type Entry } from "@/lib/content";

/**
 * A single row in the blog index. Text-only by design — the list should scan
 * fast; the images live inside the posts.
 */
export function PostLink({ entry }: { entry: Entry<"posts"> }) {
  return (
    <Link
      href={entry.href}
      className="group focus-visible:ring-ring -mx-3 block rounded-lg px-3 py-5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="flex items-baseline justify-between gap-6">
        <h3 className="group-hover:text-muted-foreground text-sm font-medium tracking-tight transition-colors">
          {entry.meta.title}
        </h3>
        <time
          dateTime={entry.meta.date}
          className="text-muted-foreground shrink-0 font-mono text-xs"
        >
          {formatDate(entry.meta.date)}
        </time>
      </div>
      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed text-pretty">
        {entry.meta.summary}
      </p>
    </Link>
  );
}
