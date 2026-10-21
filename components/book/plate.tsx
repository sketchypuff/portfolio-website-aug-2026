import { cn } from "@/lib/utils";

export type Pigment = "indigo" | "cerulean" | "sap" | "ochre" | "sienna" | "sepia";

/** Sky, distant hills, near ground: the three washes of a loose landscape. */
export type Wash = { sky: Pigment; hills: Pigment; ground: Pigment; seed: number };

const pigment = (p: Pigment) => `var(--pigment-${p})`;

/**
 * PLACEHOLDER for one of Yash's painted frontispieces. Three soft washes
 * whose edges are pushed around by a noise displacement so they bleed like
 * wet-in-wet paint. It is deliberately labelled on the plate itself: this
 * must never ship as if it were his painting. Replace the whole <svg> with a
 * bundler-loaded scan (`lib/images.ts`) when the paintings exist.
 */
export function PlaceholderWash({ id, wash }: { id: string; wash: Wash }) {
  const filter = `bleed-${id}`;
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
    >
      <defs>
        <filter id={filter} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed={wash.seed} />
          <feDisplacementMap in="SourceGraphic" scale="46" />
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <g filter={`url(#${filter})`}>
        <rect x="-20" y="-20" width="440" height="250" fill={pigment(wash.sky)} opacity="0.32" />
        <rect x="-20" y="40" width="300" height="90" fill={pigment(wash.sky)} opacity="0.18" />
        <path
          d="M-20 300 C 60 230, 120 250, 170 220 S 300 180, 420 250 L 420 380 L -20 380 Z"
          fill={pigment(wash.hills)}
          opacity="0.55"
        />
        <path
          d="M-20 360 C 90 330, 200 370, 300 335 S 380 320, 420 340 L 420 520 L -20 520 Z"
          fill={pigment(wash.ground)}
          opacity="0.6"
        />
        <ellipse cx="120" cy="430" rx="110" ry="30" fill={pigment(wash.hills)} opacity="0.35" />
        <circle cx="300" cy="90" r="38" fill={pigment(wash.ground)} opacity="0.3" />
        <ellipse cx="330" cy="460" rx="90" ry="40" fill={pigment(wash.sky)} opacity="0.25" />
      </g>
    </svg>
  );
}

/**
 * A frontispiece plate: the painting tipped onto its own lit sheet of paper,
 * with a printed caption beneath. The sheet is `bg-paper` in both themes so a
 * scan never sits on the dark page (see docs/design/book.md).
 */
export function Plate({
  id,
  wash,
  numeral,
  caption,
  shape = "portrait",
  className,
}: {
  id: string;
  wash: Wash;
  /** "Frontispiece" or a chapter's "Plate I". */
  numeral: string;
  caption: string;
  /** Portrait on the facing page; landscape where a plate sits inline (narrow screens). */
  shape?: "portrait" | "landscape";
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div className="bg-paper text-paper-foreground ring-foreground/10 rounded-[3px] p-3 shadow-sm ring-1">
        <div className={cn("relative overflow-hidden", shape === "portrait" ? "aspect-[4/5]" : "aspect-[3/2]")}>
          <PlaceholderWash id={id} wash={wash} />
          <span className="absolute bottom-2 left-2 font-mono text-xs uppercase">
            Placeholder · to be painted
          </span>
        </div>
      </div>
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="text-muted-foreground font-mono text-xs uppercase">{numeral}</span>
        <span className="font-serif text-sm italic">{caption}</span>
      </figcaption>
    </figure>
  );
}
