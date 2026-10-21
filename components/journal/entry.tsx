import { PlaceholderWash, type WashPalette } from "@/components/journal/placeholder-wash";
import { cn } from "@/lib/utils";

// Each entry lies on the desk at its own slight angle, the way loose pages do.
// Literal classes so Tailwind sees them; cycled by position.
const TILTS = ["-rotate-[0.9deg]", "rotate-[0.6deg]", "rotate-[0.4deg]", "-rotate-[0.7deg]"];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/**
 * The spread of entries on home: a two-column pile of `Entry` pages, the right
 * column dropped half a plate so it reads as pages laid on a desk rather than
 * a grid of cards. Hovering one quiets the rest (hover devices only).
 */
export function EntrySpread({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <ul
      role="list"
      aria-label={label}
      className={cn(
        "grid gap-x-10 gap-y-12 md:grid-cols-2 md:pb-16 md:[&>li:nth-child(even)]:translate-y-16",
        "[&>li]:transition-opacity [&>li]:duration-300 [@media(hover:hover)]:[&:has(>li:hover)>li:not(:hover)]:opacity-75",
      )}
    >
      {children}
    </ul>
  );
}

/**
 * One project as a field-journal entry: a numbered header, a watercolour plate,
 * and ink notes underneath. Hovering lifts the page off the desk (it squares
 * up and its shadow deepens) and the plate blooms. Under reduced motion only
 * the shadow changes, without a transition.
 *
 * `notes` is the observed / found / changed triplet the motif is built for;
 * entries without it show the project line alone.
 */
export function Entry({
  index,
  company,
  title,
  palette,
  seed,
  notes,
}: {
  index: number;
  company: string;
  title: string;
  palette: WashPalette;
  seed: number;
  notes?: { observed: string; found: string; changed: string };
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <li>
      <article
        className={cn(
          "group/entry bg-paper text-paper-foreground shadow-paper hover:shadow-paper-lifted rounded-[3px] p-4 sm:p-5",
          "transition-[translate,rotate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          "motion-safe:hover:-translate-y-1.5 motion-safe:hover:rotate-0",
          TILTS[index % TILTS.length],
        )}
      >
        <header className="text-paper-muted flex items-baseline justify-between gap-4 font-mono text-xs tracking-wider uppercase">
          <span>Entry {number}</span>
          <span>{company}</span>
        </header>

        <figure className="mt-3">
          <div className="border-paper-rule relative aspect-[4/3] overflow-hidden border">
            <PlaceholderWash id={`entry-${number}`} seed={seed} palette={palette} />
            <span className="bg-paper/85 text-paper-muted absolute top-2 left-2 px-1.5 py-0.5 font-mono text-xs tracking-wider uppercase">
              Placeholder wash
            </span>
          </div>
          <figcaption className="text-paper-muted mt-2 flex justify-between gap-4 font-mono text-xs">
            <span>Pl. {ROMAN[index] ?? number}</span>
            <span>scan to come</span>
          </figcaption>
        </figure>

        <div className="border-paper-rule mt-4 border-t pt-3">
          <p className="font-serif text-lg leading-snug font-medium text-pretty">{title}</p>
          {notes && (
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-serif">
              {(["observed", "found", "changed"] as const).map((key) => (
                <div key={key} className="contents">
                  <dt className="text-paper-muted pt-0.5 font-mono text-xs uppercase">{key}</dt>
                  <dd>{notes[key]}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </article>
    </li>
  );
}
