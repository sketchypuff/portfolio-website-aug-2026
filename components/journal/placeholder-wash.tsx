import { cn } from "@/lib/utils";

/**
 * Stand-in for one of Yash's scanned watercolour plates: a loose landscape
 * wash (sky, a far ridge, near land) drawn as SVG and roughened with
 * turbulence so its edges bleed and its pigment granulates. Every instance is
 * labelled as a placeholder by its caller. Replace each with a `Figure`-style
 * bundled scan (lib/images.ts) once the paintings exist, then delete this
 * file and the `--wash-*` tokens.
 *
 * Wash colors are `currentColor` set by token classes, so the palette stays
 * in globals.css. Inside a `group/entry`, hovering blooms the wash: it spreads
 * a little and a wetter sky layer comes up. Both are `motion-safe` only.
 */

const PALETTES = {
  dawn: {
    sky: "text-wash-sky",
    ridge: "text-wash-indigo",
    land: "text-wash-sap",
  },
  dusk: {
    sky: "text-wash-ochre",
    ridge: "text-wash-sienna",
    land: "text-wash-indigo",
  },
  monsoon: {
    sky: "text-wash-indigo",
    ridge: "text-wash-sky",
    land: "text-wash-sap",
  },
  ghat: {
    sky: "text-wash-sky",
    ridge: "text-wash-sap",
    land: "text-wash-sienna",
  },
  field: {
    sky: "text-wash-ochre",
    ridge: "text-wash-sap",
    land: "text-wash-sienna",
  },
} as const;

export type WashPalette = keyof typeof PALETTES;
export type WashColor = (typeof PALETTES)[WashPalette][keyof (typeof PALETTES)[WashPalette]];

/** The tube each wash colour stands for, for the key printed beside a plate. */
export const WASH_NAMES: Record<WashColor, string> = {
  "text-wash-sky": "Cerulean",
  "text-wash-sap": "Sap green",
  "text-wash-sienna": "Burnt sienna",
  "text-wash-ochre": "Yellow ochre",
  "text-wash-indigo": "Payne’s grey",
};

/** Sky, ridge, land: the three washes a palette lays down, in painting order. */
export function paletteColors(palette: WashPalette): WashColor[] {
  const { sky, ridge, land } = PALETTES[palette];
  return [sky, ridge, land];
}

// Small seeded generator so the same seed always draws the same hills, on the
// server and in every build.
function random(seed: number) {
  let t = seed * 9301 + 49297;
  return () => {
    t = (t * 9301 + 49297) % 233280;
    return t / 233280;
  };
}

/** A closed hill silhouette from `base` (y) down to the bottom of the plate. */
function hills(seed: number, base: number, amplitude: number) {
  const r = random(seed);
  const waves = [0, 1, 2].map(() => ({
    f: 0.006 + r() * 0.018,
    p: r() * Math.PI * 2,
    a: 0.4 + r() * 0.6,
  }));
  const points: string[] = [];
  for (let x = 14; x <= 386; x += 8) {
    const y = base - waves.reduce((sum, w) => sum + Math.sin(x * w.f + w.p) * w.a, 0) * amplitude;
    points.push(`${x},${y.toFixed(1)}`);
  }
  return `M14,296 L${points.join(" L")} L386,296 Z`;
}

export function PlaceholderWash({
  id,
  seed,
  palette,
  className,
}: {
  /** Unique per page: namespaces the SVG filter and gradient ids. */
  id: string;
  seed: number;
  palette: WashPalette;
  className?: string;
}) {
  const colors = PALETTES[palette];
  const wet = `${id}-wet`;
  const bleed = `${id}-bleed`;
  const fade = `${id}-fade`;
  const margin = `${id}-margin`;

  const ridge = hills(seed, 168, 18);
  const land = hills(seed + 7, 222, 13);

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={cn(
        "block size-full origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover/entry:scale-[1.04]",
        className,
      )}
    >
      <defs>
        {/* The class sets `color` here: a gradient's currentColor comes from
            where it is defined, not where it is used. */}
        <linearGradient id={fade} x1="0" y1="0" x2="0" y2="1" className={colors.sky}>
          <stop offset="0" stopColor="currentColor" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="currentColor" stopOpacity="0.32" />
          <stop offset="0.8" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        {/* Wet-in-wet: the sky is laid into wet paper, so its edges dissolve. */}
        <filter id={wet} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" seed={seed} result="flow" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="flow"
            scale="40"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur stdDeviation="7" />
        </filter>
        {/* Wet-on-dry: the hills keep a soft but definite edge where pigment
            pools, plus a little granulation from a fine noise mask. */}
        <filter id={bleed} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed={seed} result="flow" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="flow"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
            result="laid"
          />
          <feGaussianBlur in="laid" stdDeviation="1.1" result="soft" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="2"
            seed={seed + 3}
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.7 1.2"
            result="tooth"
          />
          <feComposite in="soft" in2="tooth" operator="in" />
        </filter>
        {/* The painted area stops short of the plate with a loose, uneven
            margin of bare paper, so no wash ends in a ruler-straight cut. */}
        <filter id={`${margin}-edge`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="2"
            seed={seed + 1}
            result="flow"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="flow"
            scale="26"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <mask id={margin} maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="300">
          <rect x="34" y="28" width="332" height="244" fill="white" filter={`url(#${margin}-edge)`} />
        </mask>
      </defs>

      <g mask={`url(#${margin})`}>
        <g filter={`url(#${wet})`} className={colors.sky}>
          <rect x="30" y="26" width="340" height="200" fill={`url(#${fade})`} />
          {/* The bloom: a wetter pass of the sky that comes up on hover. */}
          <ellipse
            cx="200"
            cy="90"
            rx="140"
            ry="50"
            fill="currentColor"
            className="opacity-0 transition-opacity duration-700 motion-safe:group-hover/entry:opacity-30"
          />
        </g>
        <g filter={`url(#${bleed})`}>
          <g className={colors.ridge}>
            <path d={ridge} fill="currentColor" fillOpacity="0.28" />
            <path d={ridge} fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.4" />
          </g>
          <g className={colors.land}>
            <path d={land} fill="currentColor" fillOpacity="0.45" />
            {/* Pigment pools at the edge of a drying wash. */}
            <path d={land} fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" />
          </g>
        </g>
      </g>
    </svg>
  );
}

/**
 * A single test dab, like the swatches a painter keeps beside a palette: a
 * bled circle of one wash color. Placeholder for the same reason as the plate.
 */
export function PlaceholderSwatch({
  id,
  seed,
  color,
  className,
}: {
  id: string;
  seed: number;
  color: WashColor;
  className?: string;
}) {
  const bleed = `${id}-dab`;
  return (
    <svg viewBox="0 0 60 60" aria-hidden className={cn("block", color, className)}>
      <defs>
        <filter id={bleed} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed={seed} result="flow" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="flow"
            scale="9"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <g filter={`url(#${bleed})`}>
        <circle cx="30" cy="30" r="21" fill="currentColor" fillOpacity="0.5" />
        <circle
          cx="30"
          cy="30"
          r="21"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.6"
        />
      </g>
    </svg>
  );
}
