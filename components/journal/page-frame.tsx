import { cn } from "@/lib/utils";
import type { WashColor } from "@/components/journal/placeholder-wash";

export type Tab = { id: string; label: string; color: WashColor };

/**
 * One page of the journal, laid on the desk. Everything on home is written
 * on it. It carries the notebook's red margin rule (`--margin-x` from the
 * page's left edge, see `journal-page` in globals.css), and on wide screens
 * a set of index tabs cut into the fore-edge at the right, one per section,
 * each marked with a dab of a wash colour. The page never changes with the
 * theme: at night the desk goes dark and the page stays lit.
 */
export function JournalPage({ tabs, children }: { tabs: Tab[]; children: React.ReactNode }) {
  return (
    <article className="journal-page bg-paper shadow-page relative mx-auto w-full max-w-[1100px] py-8 sm:py-12 lg:py-14">
      {/* The red margin rule. */}
      <span aria-hidden className="bg-margin absolute inset-y-0 left-(--margin-x) w-px" />

      {/* Fore-edge index tabs. */}
      <nav aria-label="Index" className="absolute top-36 right-0 hidden translate-x-full flex-col gap-2.5 lg:flex">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            className={cn(
              "bg-tag shadow-tag group relative flex w-7 flex-col items-center rounded-r-[3px] pt-3 pb-3.5 transition-transform duration-300 ease-out hover:translate-x-0.5 motion-reduce:transition-none",
              tab.color,
            )}
          >
            <span aria-hidden className="mb-2.5 h-1 w-3 rounded-full bg-current opacity-80" />
            <span className="label vertical-text text-foreground/80 group-hover:text-foreground transition-colors">{tab.label}</span>
          </a>
        ))}
      </nav>

      {children}
    </article>
  );
}

/** The same index as a row of tags, for screens with no fore-edge to cut tabs into. */
export function TabRow({ tabs }: { tabs: Tab[] }) {
  return (
    <nav aria-label="Index" className="flex flex-wrap gap-2 lg:hidden">
      {tabs.map((tab) => (
        <a
          key={tab.id}
          href={`#${tab.id}`}
          className={cn("bg-tag shadow-tag label flex items-center gap-2 rounded-[3px] px-2.5 py-1.5", tab.color)}
        >
          <span aria-hidden className="size-1.5 rounded-full bg-current opacity-80" />
          <span className="text-foreground/80">{tab.label}</span>
        </a>
      ))}
    </nav>
  );
}

/**
 * A note written in the margin, left of the red rule, aligned to the first
 * line of whatever it annotates. The parent must be `relative`.
 */
export function MarginNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "label text-muted-foreground absolute top-[0.3em] right-[calc(100%+var(--gutter))] w-(--margin-x) pr-3 text-right",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A running head: typed across the top of the page, over a double rule. */
export function RunningHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="label border-rule flex items-baseline justify-between gap-4 border-b pb-2">
      {children}
    </div>
  );
}
