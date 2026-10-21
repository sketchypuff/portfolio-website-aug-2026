import { useId } from "react";
import { cn } from "@/lib/utils";

/** The paints on the page. `name` is the tube colour, shown in mono captions. */
export const pigments = {
  ultramarine: { name: "Ultramarine", color: "var(--pigment-ultramarine)" },
  cerulean: { name: "Cerulean", color: "var(--pigment-cerulean)" },
  indigo: { name: "Indigo", color: "var(--pigment-indigo)" },
  sap: { name: "Sap green", color: "var(--pigment-sap)" },
  ochre: { name: "Yellow ochre", color: "var(--pigment-ochre)" },
  sienna: { name: "Burnt sienna", color: "var(--pigment-sienna)" },
  rose: { name: "Quinacridone rose", color: "var(--pigment-rose)" },
} as const;

export type Pigment = keyof typeof pigments;

/** A small seeded PRNG (mulberry32), so a wash looks the same on every build. */
function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A closed shape whose top edge is a soft ridge line: `points` heights
 * around `base`, smoothed with Catmull-Rom, then down past the bottom edge.
 */
function ridge(rand: () => number, width: number, height: number, base: number, amp: number, points: number) {
  const step = (width + 80) / (points - 1);
  const pts = Array.from({ length: points }, (_, i) => [-40 + i * step, base + (rand() - 0.5) * amp] as const);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return `${d} L ${width + 40} ${height + 40} L -40 ${height + 40} Z`;
}

/**
 * PLACEHOLDER for a scan of one of Yash's paintings. Draws a loose landscape
 * wash in SVG — a wet-in-wet sky, two ridges with darker dried edges, paper
 * granulation, and ragged unpainted margins — from four pigments and a seed.
 * Every instance says "Placeholder wash" on it so nobody mistakes it for his
 * work. When the scans exist, a plate's `Wash` is swapped for a `next/image`
 * loaded through `lib/images.ts` (intrinsic size + blur placeholder).
 *
 * `palette` is [sky, far ridge, near ridge, accents]. `band` is the wide,
 * unframed sky at the top of the page; `plate` (default) is a 4:3 painting
 * that fills its parent.
 */
export function Wash({
  palette,
  seed,
  variant = "plate",
  className,
}: {
  palette: readonly [Pigment, Pigment, Pigment, Pigment];
  seed: number;
  variant?: "plate" | "band";
  className?: string;
}) {
  // React ids can contain characters that break `url(#…)` references.
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rand = random(seed);
  const [sky, far, near, accent] = palette.map((p) => pigments[p].color);
  const band = variant === "band";
  const w = band ? 1440 : 400;
  const h = band ? 360 : 300;

  const farRidge = ridge(rand, w, h, h * (band ? 0.62 : 0.5), h * 0.22, band ? 9 : 6);
  const nearRidge = ridge(rand, w, h, h * (band ? 0.86 : 0.72), h * 0.16, band ? 7 : 5);
  // A few loose blooms along the near ridge: trees, if you squint.
  const blooms = Array.from({ length: band ? 0 : 3 + Math.floor(rand() * 3) }, () => ({
    cx: 30 + rand() * (w - 60),
    cy: h * (0.66 + rand() * 0.12),
    rx: 6 + rand() * 10,
    ry: 12 + rand() * 16,
  }));

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={cn("block size-full", className)}
    >
      <defs>
        {/* Wet-in-wet: big soft distortion, then blur, for the sky. */}
        <filter id={`${id}-wet`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="2" seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale={band ? 120 : 50} />
          <feGaussianBlur stdDeviation={band ? 14 : 6} />
        </filter>
        {/* A wash that dried in place: a wobbly edge, and pigment that settled
            unevenly — denser in some patches, thin in others. */}
        <filter id={`${id}-dry`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed={seed + 1} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed={seed + 4} result="patches" />
          <feColorMatrix
            in="patches"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.7 0 0 0 -0.25"
            result="density"
          />
          <feComposite in="shape" in2="density" operator="in" result="patchy" />
          <feGaussianBlur in="patchy" stdDeviation="0.9" />
        </filter>
        {/* Pigment settling into the paper's tooth. */}
        <filter id={`${id}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed={seed + 2} />
          <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.18  0 0 0 0 0.15  0 0 0 0.28 -0.1" />
        </filter>
        {/* The painted area stops short of the sheet on a soft, uneven edge. */}
        <filter id={`${id}-edge`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="3" seed={seed + 3} />
          <feDisplacementMap in="SourceGraphic" scale="18" />
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky} stopOpacity="0.7" />
          <stop offset="0.55" stopColor={sky} stopOpacity="0.18" />
          <stop offset="1" stopColor={sky} stopOpacity="0" />
        </linearGradient>
        {/* The band has no sheet edge; it fades into the page instead. */}
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect
            x={band ? -40 : 16}
            y={band ? -40 : 14}
            width={band ? w + 80 : w - 32}
            height={band ? h + 40 : h - 28}
            fill={band ? `url(#${id}-fade)` : "white"}
            filter={`url(#${id}-edge)`}
          />
        </mask>
      </defs>

      <g mask={`url(#${id}-mask)`} style={{ mixBlendMode: "multiply" }}>
        <rect x={-60} y={-60} width={w + 120} height={h * 0.8} fill={`url(#${id}-sky)`} filter={`url(#${id}-wet)`} />
        {band ? (
          <ellipse cx={w * (0.2 + rand() * 0.6)} cy={h * 0.25} rx={w * 0.18} ry={h * 0.3} fill={accent} opacity="0.22" filter={`url(#${id}-wet)`} />
        ) : null}
        <g filter={`url(#${id}-dry)`}>
          <path d={farRidge} fill={far} fillOpacity={band ? 0.3 : 0.6} />
          {/* Pigment runs to the edge of a drying wash and leaves a darker line. */}
          <path d={farRidge} fill="none" stroke={far} strokeOpacity={band ? 0.15 : 0.55} strokeWidth="1.2" />
          <path d={nearRidge} fill={near} fillOpacity={band ? 0.26 : 0.75} />
          <path d={nearRidge} fill="none" stroke={near} strokeOpacity={band ? 0.12 : 0.6} strokeWidth="1.2" />
          {blooms.map((b, i) => (
            <ellipse key={i} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={accent} fillOpacity="0.55" />
          ))}
        </g>
        {band ? null : <rect width={w} height={h} filter={`url(#${id}-grain)`} />}
      </g>
    </svg>
  );
}

/** The mono tag every placeholder carries until its scan replaces it. */
export function PlaceholderTag() {
  return <span>Placeholder wash</span>;
}

/** A single dab of one pigment, as on a painter's swatch card. */
export function Dab({ pigment, className }: { pigment: Pigment; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-3 shrink-0 rounded-[48%_52%_44%_56%/55%_45%_55%_45%]", className)}
      style={{
        // Darker at the rim, like a puddle of paint that dried from the edge in.
        background: `radial-gradient(circle at 45% 40%, color-mix(in oklch, ${pigments[pigment].color} 55%, transparent) 30%, ${pigments[pigment].color} 100%)`,
      }}
    />
  );
}

/**
 * A test strip on a swatch card: one pigment laid from full strength down to
 * a thin wash, the way a painter checks a new tube. The ragged right end is
 * where the brush ran dry. Placeholder for scanned strips from Yash's own
 * palette.
 */
export function SwatchStrip({ pigment, seed, className }: { pigment: Pigment; seed: number; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rand = random(seed);
  const color = pigments[pigment].color;
  const end = 150 + rand() * 30;
  return (
    <svg viewBox="0 0 200 28" aria-hidden preserveAspectRatio="none" className={cn("block h-7 w-full", className)}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={color} stopOpacity="0.95" />
          <stop offset="0.55" stopColor={color} stopOpacity="0.45" />
          <stop offset="1" stopColor={color} stopOpacity="0.12" />
        </linearGradient>
        <filter id={`${id}-e`} x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.2" numOctaves="2" seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>
      </defs>
      <g filter={`url(#${id}-e)`} style={{ mixBlendMode: "multiply" }}>
        <rect x="4" y="5" width={end} height="18" rx="2" fill={`url(#${id}-g)`} />
        {/* The dried edge at the start, where the brush was fullest. */}
        <rect x="4" y="5" width="3" height="18" fill={color} opacity="0.5" />
      </g>
    </svg>
  );
}

/**
 * A wash laid in from one edge of the sheet and left to dry: a broad, soft
 * band that fades into bare paper, a ragged wet edge, a few drips where the
 * board was tilted, and granulation in the paper's tooth. The page's own
 * painting, behind the text. `palette` is [main wash, second pigment dropped
 * in wet]. Placeholder, like every wash here.
 */
export function EdgeWash({
  edge,
  palette,
  seed,
  className,
}: {
  edge: "top" | "bottom";
  palette: readonly [Pigment, Pigment];
  seed: number;
  className?: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rand = random(seed);
  const [main, second] = palette.map((p) => pigments[p].color);
  const w = 1440;
  const h = 420;
  // The wet edge: a soft ridge line across the sheet, a little over halfway down.
  const depth = h * (0.5 + rand() * 0.1);
  const line = ridge(rand, w, h, depth, h * 0.18, 9);
  // Where the second pigment was dropped in while the sky was still wet.
  const pools = Array.from({ length: 2 + Math.floor(rand() * 2) }, () => ({
    cx: w * (0.1 + rand() * 0.8),
    cy: depth * (0.15 + rand() * 0.4),
    rx: w * (0.14 + rand() * 0.16),
    ry: depth * (0.25 + rand() * 0.3),
    o: 0.12 + rand() * 0.12,
  }));
  // Drips run from the wet edge, each a thin run with a bead at its end.
  const drips = Array.from({ length: 3 + Math.floor(rand() * 3) }, () => ({
    x: 80 + rand() * (w - 160),
    len: 50 + rand() * 170,
    wd: 3 + rand() * 3,
  }));
  const flip = edge === "bottom";
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMin slice"
      aria-hidden
      className={cn("pointer-events-none block size-full", className)}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <defs>
        <filter id={`${id}-wet`} x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.003 0.007" numOctaves="2" seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale="110" />
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id={`${id}-dry`} x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed={seed + 1} />
          <feDisplacementMap in="SourceGraphic" scale="22" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id={`${id}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="2" seed={seed + 2} />
          <feColorMatrix values="0 0 0 0 0.22  0 0 0 0 0.2  0 0 0 0 0.16  0 0 0 0.45 -0.16" />
        </filter>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={main} stopOpacity="0.8" />
          <stop offset="0.45" stopColor={main} stopOpacity="0.5" />
          <stop offset="0.8" stopColor={main} stopOpacity="0.22" />
          <stop offset="1" stopColor={main} stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          {/* The painted area ends on the wet edge; everything past it is bare paper. */}
          <path d={line} fill="white" transform={`translate(0 ${h + 40}) scale(1 -1)`} filter={`url(#${id}-dry)`} />
        </mask>
      </defs>
      <g style={{ mixBlendMode: "multiply" }}>
        <g mask={`url(#${id}-mask)`}>
          <rect x="-120" y="-120" width={w + 240} height={depth + 160} fill={`url(#${id}-fade)`} filter={`url(#${id}-wet)`} />
          {pools.map((p, i) => (
            <ellipse key={i} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill={second} opacity={p.o} filter={`url(#${id}-wet)`} />
          ))}
          {/* Pigment gathers along the wet edge as it dries. */}
          <path
            d={line}
            transform={`translate(0 ${h + 40}) scale(1 -1)`}
            fill="none"
            stroke={main}
            strokeOpacity="0.45"
            strokeWidth="2.5"
            filter={`url(#${id}-dry)`}
          />
          <rect width={w} height={h} filter={`url(#${id}-grain)`} />
        </g>
        <g filter={`url(#${id}-dry)`}>
          {drips.map((d, i) => (
            <g key={i}>
              <rect x={d.x} y={depth - 40} width={d.wd} height={d.len} rx={d.wd / 2} fill={main} opacity="0.45" />
              <circle cx={d.x + d.wd / 2} cy={depth - 40 + d.len} r={d.wd * 1.4} fill={main} opacity="0.5" />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

/**
 * One stroke of a loaded brush under a heading: full at the start, drying
 * out towards the end, with a wobble in the hand. Width follows the heading.
 */
export function BrushStroke({ pigment, seed, className }: { pigment: Pigment; seed: number; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rand = random(seed);
  const color = pigments[pigment].color;
  const y = 12 + (rand() - 0.5) * 4;
  return (
    <svg
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("pointer-events-none block h-3.5 w-full", className)}
    >
      <defs>
        <filter id={`${id}-f`} x="-5%" y="-40%" width="110%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.3" numOctaves="2" seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale="6" />
        </filter>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={color} stopOpacity="0.95" />
          <stop offset="0.7" stopColor={color} stopOpacity="0.7" />
          <stop offset="1" stopColor={color} stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <g filter={`url(#${id}-f)`} style={{ mixBlendMode: "multiply" }}>
        <path
          d={`M 6 ${y} C 90 ${y - 3}, 200 ${y + 4}, 300 ${y - 1} S 380 ${y + 2}, 394 ${y}`}
          fill="none"
          stroke={`url(#${id}-g)`}
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d={`M 10 ${y + 2} C 120 ${y}, 240 ${y + 5}, 360 ${y + 1}`}
          fill="none"
          stroke={color}
          strokeOpacity="0.35"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** Flicked droplets off a loaded brush. A few, never a storm. */
export function Splatter({ pigment, seed, className }: { pigment: Pigment; seed: number; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rand = random(seed);
  const color = pigments[pigment].color;
  const drops = Array.from({ length: 9 + Math.floor(rand() * 6) }, () => ({
    cx: rand() * 200,
    cy: rand() * 200,
    r: 0.8 + rand() * rand() * 5,
    o: 0.25 + rand() * 0.45,
  }));
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={cn("pointer-events-none block", className)}>
      <defs>
        <filter id={`${id}-f`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>
      </defs>
      <g filter={`url(#${id}-f)`} style={{ mixBlendMode: "multiply" }}>
        {drops.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={color} opacity={d.o} />
        ))}
      </g>
    </svg>
  );
}
