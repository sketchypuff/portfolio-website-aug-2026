import {
  PlaceholderSwatch,
  PlaceholderWash,
  WASH_NAMES,
  paletteColors,
  type WashPalette,
} from "@/components/journal/placeholder-wash";
import { cn } from "@/lib/utils";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/**
 * The entries of one section, stacked like the pages of the journal: each
 * `Entry` is a full-width row on a pencil rule. Hovering one quiets the rest
 * (hover devices only), so the eye lands on a single page at a time.
 */
export function EntryList({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <ol
      role="list"
      aria-label={label}
      className={cn(
        "border-border border-b",
        "[&>li]:transition-opacity [&>li]:duration-300 [&>li]:ease-out motion-reduce:[&>li]:transition-none",
        "[@media(hover:hover)]:[&:has(>li:hover)>li:not(:hover)]:opacity-60",
      )}
    >
      {children}
    </ol>
  );
}

/** Kept for callers that still use the old name. */
export const EntrySpread = EntryList;

/**
 * One project as a page of the field journal. Reads left to right the way a
 * naturalist's page does: the plate first (a watercolour on its own lit
 * sheet), then the typed header (entry number, where, status), then the ink
 * notes. The notes are the point of the motif, observed / found / changed,
 * and until they are written the project line stands alone.
 *
 * Hovering lifts the sheet off the desk and blooms the wash; both are
 * `motion-safe` and settle instantly under reduced motion.
 */
export function Entry({
  index,
  company,
  title,
  palette,
  seed,
  status = "In draft",
  notes,
}: {
  index: number;
  company: string;
  title: string;
  palette: WashPalette;
  seed: number;
  status?: string;
  notes?: { observed: string; found: string; changed: string };
}) {
  const number = String(index + 1).padStart(2, "0");
  const numeral = ROMAN[index] ?? number;
  const colors = paletteColors(palette);

  return (
    <li className="group/entry border-border grid gap-6 border-t py-8 md:grid-cols-12 md:gap-8 md:py-10">
      <figure className="md:col-span-5">
        <div
          className={cn(
            "bg-paper text-paper-foreground shadow-paper rounded-sm p-3",
            "transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "motion-safe:group-hover/entry:shadow-paper-lifted motion-safe:group-hover/entry:-translate-y-1",
            "motion-reduce:transition-none",
          )}
        >
          <div className="border-paper-rule relative aspect-[4/3] overflow-hidden border">
            <PlaceholderWash id={`entry-${number}`} seed={seed} palette={palette} />
            <span className="label text-paper-muted bg-paper/85 absolute top-2 left-2 px-1.5 py-0.5">
              Placeholder wash
            </span>
          </div>
          <figcaption className="label text-paper-muted mt-2.5 flex items-center justify-between gap-4">
            <span>Pl. {numeral}</span>
            <span className="flex items-center gap-2" aria-label="Pigments">
              {colors.map((color, i) => (
                <span key={color} className="flex items-center gap-1" title={WASH_NAMES[color]}>
                  <PlaceholderSwatch id={`entry-${number}-dab-${i}`} seed={seed + i * 3} color={color} className="size-3.5" />
                </span>
              ))}
            </span>
          </figcaption>
        </div>
      </figure>

      <div className="flex flex-col gap-4 md:col-span-7 md:pt-1">
        <header className="label text-muted-foreground flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-foreground">Entry {number}</span>
          <span aria-hidden>·</span>
          <span>{company}</span>
          <span aria-hidden className="bg-border mx-1 hidden h-px flex-1 self-center sm:block" />
          <span>{status}</span>
        </header>

        <p className="font-serif text-[1.375rem] leading-snug font-medium text-pretty">{title}</p>

        {notes ? (
          <dl className="mt-1 grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-2 text-base leading-relaxed">
            {(["observed", "found", "changed"] as const).map((key) => (
              <div key={key} className="contents">
                <dt className="label text-muted-foreground pt-1.5">{key}</dt>
                <dd>{notes[key]}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-muted-foreground mt-1 text-base italic">
            Notes to follow: what was observed, what was found, what changed.
          </p>
        )}

        <p className="label text-muted-foreground mt-auto flex flex-wrap gap-x-2 pt-2">
          <span>Pigments</span>
          <span aria-hidden>—</span>
          <span className="normal-case tracking-normal">{colors.map((c) => WASH_NAMES[c]).join(", ")}</span>
        </p>
      </div>
    </li>
  );
}
