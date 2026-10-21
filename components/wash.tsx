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
