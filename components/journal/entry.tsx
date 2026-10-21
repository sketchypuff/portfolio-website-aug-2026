import { MarginNote } from "@/components/journal/page-frame";
import {
  PlaceholderWash,
  WASH_NAMES,
  paletteColors,
  type WashPalette,
} from "@/components/journal/placeholder-wash";
import { cn } from "@/lib/utils";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/**
 * The entries of one section, written down the page one after another, each
 * on its own pencil rule. Hovering one quiets the rest (hover devices only).
 */
export function EntryList({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <ol
      role="list"
      aria-label={label}
      className={cn(
        "[&>li]:transition-opacity [&>li]:duration-300 [&>li]:ease-out motion-reduce:[&>li]:transition-none",
        "[@media(hover:hover)]:[&:has(>li:hover)>li:not(:hover)]:opacity-55",
      )}
    >
      {children}
    </ol>
  );
}

/** Kept for callers that still use the old name. */
export const EntrySpread = EntryList;

// Where each callout points on the plate (percent of the plate) and where
// its label sits (percent of the annotated figure, whose right quarter is
// the label column).
const CALLOUTS = [
  { part: "sky", technique: "wet-in-wet", at: [28, 20], label: [76, 14] },
  { part: "ridge", technique: "wet-on-dry", at: [62, 50], label: [76, 46] },
  { part: "land", technique: "granulating", at: [40, 80], label: [76, 76] },
] as const;

/** The plate's share of the annotated figure's width; the rest is the label column. */
const PLATE = 0.72;

/**
 * A plate painted straight onto the page, with pencil callouts pointing into
 * it the way a naturalist labels the parts of a specimen. Until the scans
 * exist the callouts name the washes; once Yash writes his notes they will
 * name what he observed.
 */
function AnnotatedPlate({ id, seed, palette, numeral }: { id: string; seed: number; palette: WashPalette; numeral: string }) {
  const colors = paletteColors(palette);
  return (
    <figure className="flex flex-col gap-2">
      {/* On narrow screens there is no room beside the plate: the markers are
          numbered and a legend is written underneath instead. */}
      <div className="relative grid sm:grid-cols-[72fr_28fr]">
        <div className="border-paper-rule relative aspect-[4/3] overflow-hidden border">
          <PlaceholderWash id={id} seed={seed} palette={palette} />
          <span className="label bg-paper/85 absolute top-2 left-2 px-1.5 py-0.5">Placeholder wash</span>
          {CALLOUTS.map((c, i) => (
            <span
              key={c.part}
              aria-hidden
              className="label bg-paper text-foreground border-foreground/60 absolute flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[9px] leading-none sm:hidden"
              style={{ left: `${c.at[0]}%`, top: `${c.at[1]}%` }}
            >
              {i + 1}
            </span>
          ))}
        </div>
        {/* Leader lines, drawn in pencil from each label to its point on the plate. */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="text-foreground/45 group-hover/entry:text-foreground/80 pointer-events-none absolute inset-0 hidden size-full transition-colors duration-300 sm:block"
        >
          {CALLOUTS.map((c) => (
            <line
              key={c.part}
              x1={c.at[0] * PLATE}
              y1={c.at[1]}
              x2={c.label[0] - 1}
              y2={c.label[1] + 2}
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {CALLOUTS.map((c, i) => (
          <span key={c.part} className="hidden sm:contents">
            <span
              aria-hidden
              className="bg-foreground/70 absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: `${c.at[0] * PLATE}%`, top: `${c.at[1]}%` }}
            />
            <span
              className="label absolute flex max-w-[23%] flex-col gap-0.5 leading-[1.15]"
              style={{ left: `${c.label[0]}%`, top: `${c.label[1]}%` }}
            >
              <span className="text-foreground">{WASH_NAMES[colors[i]]}</span>
              <span className="text-muted-foreground normal-case tracking-wide">
                {c.part}, {c.technique}
              </span>
            </span>
          </span>
        ))}
      </div>
      <ol role="list" className="label text-muted-foreground flex flex-col gap-1 sm:hidden">
        {CALLOUTS.map((c, i) => (
          <li key={c.part} className="flex gap-2">
            <span className="text-foreground">{i + 1}.</span>
            <span>
              <span className="text-foreground">{WASH_NAMES[colors[i]]}</span>
              <span className="normal-case tracking-wide">
                {" "}
                · {c.part}, {c.technique}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <figcaption className="label text-muted-foreground flex justify-between gap-4 sm:pr-[28%]">
        <span>Pl. {numeral}</span>
        <span>scan to come</span>
      </figcaption>
    </figure>
  );
}

/**
 * One project as an entry in the journal: the number in the margin, the
 * annotated plate, and the written entry beside it. The written part is the
 * point of the motif, observed / found / changed, and until it is written the
 * project line stands alone with an honest note.
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

  return (
    <li className="group/entry border-border relative border-t py-9 first:border-t-0 first:pt-2 lg:py-11">
      <MarginNote className="text-foreground">{number}</MarginNote>
      <div className="grid gap-7 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <AnnotatedPlate id={`entry-${number}`} seed={seed} palette={palette} numeral={numeral} />
        </div>
        <div className="flex flex-col gap-3 lg:col-span-5">
          <p className="label text-muted-foreground flex items-baseline gap-2">
            <span className="text-foreground">{company}</span>
            <span aria-hidden>·</span>
            <span>{status}</span>
          </p>
          <h3 className="font-serif text-[1.45rem] leading-snug font-medium text-pretty">{title}</h3>
          {notes ? (
            <dl className="mt-1 grid grid-cols-[5rem_1fr] gap-x-4 gap-y-2 text-[1.0625rem] leading-relaxed">
              {(["observed", "found", "changed"] as const).map((key) => (
                <div key={key} className="contents">
                  <dt className="label text-muted-foreground pt-1.5">{key}</dt>
                  <dd>{notes[key]}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-muted-foreground mt-1 text-[1.0625rem] leading-relaxed italic">
              Entry to be written up: what was observed, what was found, what changed.
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
