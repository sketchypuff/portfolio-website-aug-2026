"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import {
  GrainGradient,
  grainGradientPresets,
  MeshGradient,
  meshGradientPresets,
  SimplexNoise,
  simplexNoisePresets,
  SmokeRing,
  smokeRingPresets,
  Swirl,
  swirlPresets,
  Warp,
  warpPresets,
} from "@paper-design/shaders-react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { useDialKit, type DialConfig } from "dialkit";

/**
 * One project's page-background gradient: a name (the DialKit folder label)
 * and four colors. Raw hex is the one exception to the semantic-token rule —
 * the shader and the DialKit color pickers both need literal values.
 * See color.md.
 */
export type BackgroundPalette = { name: string; colors: [string, string, string, string] };

type Params = Record<string, unknown>;
type Preset = { name: string; params: Params };

/**
 * Paper's animated gradient shaders, compared live in DialKit. Each has its
 * own named presets; the selected one seeds that shader's sliders.
 */
const SHADERS = {
  mesh: { label: "Mesh gradient", Component: MeshGradient, presets: meshGradientPresets },
  grain: { label: "Grain gradient", Component: GrainGradient, presets: grainGradientPresets },
  warp: { label: "Warp", Component: Warp, presets: warpPresets },
  simplex: { label: "Simplex noise", Component: SimplexNoise, presets: simplexNoisePresets },
  swirl: { label: "Swirl", Component: Swirl, presets: swirlPresets },
  smoke: { label: "Smoke ring", Component: SmokeRing, presets: smokeRingPresets },
} as unknown as Record<
  string,
  { label: string; Component: React.ComponentType<Params & { className?: string }>; presets: Preset[] }
>;
type ShaderKey = keyof typeof SHADERS;

// String params, offered as selects. Paper doesn't re-export these enums from
// its React package, so they're listed here.
const CHOICES: Record<string, string[]> = {
  shape: ["corners", "wave", "dots", "truchet", "ripple", "blob", "sphere", "checks", "stripes", "edge"],
  fit: ["none", "contain", "cover"],
};
const SHAPES: Partial<Record<ShaderKey, string[]>> = {
  grain: ["corners", "wave", "dots", "truchet", "ripple", "blob", "sphere"],
  warp: ["checks", "stripes", "edge"],
};

// Slider ranges per param: [min, max, step?]. Unlisted numbers get [0, max(1, 2×)].
const RANGES: Record<string, [number, number, number?]> = {
  speed: [0, 5],
  scale: [0.1, 4],
  rotation: [0, 360, 1],
  offsetX: [-1, 1],
  offsetY: [-1, 1],
  softness: [0, 2],
  swirlIterations: [0, 20, 1],
  stepsPerColor: [1, 10, 1],
  bandCount: [1, 15, 1],
  noiseIterations: [1, 10, 1],
  noiseScale: [0, 5],
  innerShape: [0, 4],
};
const UNIT = ["distortion", "swirl", "grainMixer", "grainOverlay", "intensity", "noise", "proportion", "twist", "center", "noiseFrequency", "thickness", "radius", "shapeScale"];
// Not worth a slider on a full-viewport background; the preset's value stands.
const SKIP = ["originX", "originY", "worldWidth", "worldHeight", "frame", "colors", "colorBack"];

/** A DialKit control for one preset param, defaulting to the preset's value. */
function control(shader: ShaderKey, key: string, value: unknown) {
  if (typeof value === "string") {
    const options = key === "shape" ? (SHAPES[shader] ?? CHOICES.shape) : CHOICES[key];
    return options ? { type: "select" as const, options, default: value } : null;
  }
  if (typeof value !== "number") return null;
  const [min, max, step] = RANGES[key] ?? (UNIT.includes(key) ? [0, 1] : [0, Math.max(1, value * 2)]);
  return step
    ? [value, Math.min(min, value), Math.max(max, value), step]
    : [value, Math.min(min, value), Math.max(max, value)];
}

/**
 * How the gradient takes over the page background, both fading in over
 * `bg-background` while the shader settles: warm-up out of a turbulent,
 * zoomed-in state; grain dissolve out of noise. They drive whichever of these
 * params the selected shader has, so on a shader with none of them the
 * takeover is a plain fade.
 */
const TAKEOVERS = [
  { value: "warm-up", label: "Shader warm-up" },
  { value: "grain", label: "Grain dissolve" },
] as const;
type Takeover = (typeof TAKEOVERS)[number]["value"];
const TURBULENCE = ["distortion", "swirl", "twist", "noise"];
const GRAIN = ["grainMixer", "grainOverlay", "noise"];

const SHARED = {
  takeover: {
    mode: { type: "select", options: [...TAKEOVERS], default: "warm-up" },
    enter: [800, 100, 3000],
    exit: [350, 0, 2000],
    // Warm-up: how far zoomed in the shader starts, as a multiple of its scale.
    warmZoom: [3, 1, 6],
  },
  // Peak opacity over `bg-background`, so the gradient tints toward white in
  // light mode and toward black in dark mode, and text stays readable.
  intensity: [0.5, 0, 1],
  shader: {
    type: "select",
    options: Object.entries(SHADERS).map(([value, s]) => ({ value, label: s.label })),
    default: "mesh",
  },
} satisfies DialConfig;

/** How long the background holds after leaving a card, so crossing a gap between cards doesn't flash. */
const LEAVE_DELAY = 100;
const ENTER_EASE = [0.22, 1, 0.36, 1] as const; // house curve
const EXIT_EASE = [0.4, 0, 1, 1] as const; // ease-in: exits get out of the way

type HoverBackground = {
  enter: (index: number) => void;
  leave: (index: number) => void;
};

const HoverBackgroundContext = createContext<HoverBackground | null>(null);

/** For a card: call `enter(i)` / `leave(i)` on mouse hover. Null outside a provider. */
export function useHoverBackground() {
  return useContext(HoverBackgroundContext);
}

const noop = () => () => {};

/** Everything a layer needs to draw, resolved from the panel. */
type Look = {
  shader: ShaderKey;
  params: Params;
  presetColors: string[] | null;
  /** Only for shaders that have a back color (not mesh, warp, simplex). */
  colorBack: string | undefined;
  intensity: number;
  takeover: Takeover;
  enter: number;
  exit: number;
  warmZoom: number;
};

/**
 * Animates the whole page background while a card inside it is hovered: each
 * palette is a fixed, full-viewport Paper shader behind the page, and the
 * hovered card's layer takes over with the selected takeover. The newest layer
 * always sits on top, so moving between cards crossfades.
 *
 * Owns the "Page background" DialKit panel (dev only, `DialRoot` in
 * app/layout.tsx); in production the defaults apply — mesh gradient, its
 * Default preset, card colors.
 */
export function HoverBackgroundProvider({
  palettes,
  children,
}: {
  palettes: BackgroundPalette[];
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  // Stacking order: each activation puts that layer on top.
  const [stack, setStack] = useState<Record<number, number>>({});
  const leaving = useRef<ReturnType<typeof setTimeout>>(null);

  const enter = useCallback((index: number) => {
    if (leaving.current) clearTimeout(leaving.current);
    leaving.current = null;
    if (activeRef.current !== index) {
      setStack((s) => ({ ...s, [index]: Math.max(0, ...Object.values(s)) + 1 }));
    }
    activeRef.current = index;
    setActive(index);
  }, []);

  const leave = useCallback((index: number) => {
    if (leaving.current) clearTimeout(leaving.current);
    leaving.current = setTimeout(() => {
      leaving.current = null;
      if (activeRef.current !== index) return;
      activeRef.current = null;
      setActive(null);
    }, LEAVE_DELAY);
  }, []);
  useEffect(() => () => void (leaving.current && clearTimeout(leaving.current)), []);
  const value = useMemo(() => ({ enter, leave }), [enter, leave]);

  // The panel's shape depends on its own values: the preset select lists the
  // selected shader's presets, and the params folder holds that preset's
  // values. So the last-seen selection is kept here and the config rebuilt
  // from it; DialKit reconciles the panel when the config changes.
  const [selection, setSelection] = useState({ shader: "mesh" as ShaderKey, preset: "Default" });
  const shaderDef = SHADERS[selection.shader];
  const preset = shaderDef.presets.find((p) => p.name === selection.preset) ?? shaderDef.presets[0];
  // Keyed by shader and preset, so picking a preset starts its sliders from
  // that preset's values rather than carrying the previous ones over.
  const presetKey = `${selection.shader}Preset`;
  const folderKey = `${shaderDef.label} · ${preset.name}`;

  const config = useMemo(
    () =>
      ({
        ...SHARED,
        [presetKey]: {
          type: "select",
          options: shaderDef.presets.map((p) => p.name),
          default: preset.name,
        },
        // Off: each card's own palette, over a transparent back.
        presetColors: false,
        [folderKey]: Object.fromEntries(
          Object.entries(preset.params)
            .filter(([k]) => !SKIP.includes(k))
            .map(([k, v]) => [k, control(selection.shader, k, v)])
            .filter(([, c]) => c !== null),
        ),
        ...Object.fromEntries(
          palettes.map((p) => [
            p.name,
            { color1: p.colors[0], color2: p.colors[1], color3: p.colors[2], color4: p.colors[3] },
          ]),
        ),
      }) as DialConfig,
    [palettes, presetKey, folderKey, shaderDef, preset, selection.shader],
  );
  const dials = useDialKit("Page background", config) as Record<string, unknown> & {
    takeover: { mode: string; enter: number; exit: number; warmZoom: number };
    intensity: number;
    shader: string;
    presetColors: boolean;
  };

  // Follow the panel: a new shader starts on its first preset.
  const shader = (dials.shader in SHADERS ? dials.shader : "mesh") as ShaderKey;
  const pickedPreset = shader === selection.shader ? (dials[presetKey] as string | undefined) : undefined;
  const nextPreset = pickedPreset ?? SHADERS[shader].presets[0].name;
  if (shader !== selection.shader || nextPreset !== selection.preset) {
    setSelection({ shader, preset: nextPreset });
  }

  // The folder's values, falling back to the preset's while DialKit catches up
  // with a config change.
  const folder = (dials[folderKey] ?? {}) as Params;
  const params = { ...preset.params, ...folder };
  for (const k of SKIP) delete params[k];

  const look: Look = {
    shader: selection.shader,
    params,
    presetColors: dials.presetColors ? (preset.params.colors as string[]) : null,
    colorBack:
      "colorBack" in preset.params
        ? dials.presetColors
          ? (preset.params.colorBack as string)
          : "#00000000"
        : undefined,
    intensity: dials.intensity,
    takeover: dials.takeover.mode as Takeover,
    enter: dials.takeover.enter,
    exit: dials.takeover.exit,
    warmZoom: dials.takeover.warmZoom,
  };
  const colorsFor = (name: string) => Object.values(dials[name] as object) as string[];

  // Reduced motion: a plain fade, and the shader holds still.
  const reduced = !!useReducedMotion();

  // False on the server and during hydration, true after: a portal needs a DOM.
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  return (
    <HoverBackgroundContext.Provider value={value}>
      {children}
      {/* Portalled to <body> so no transformed ancestor (Reveal, PageTransition)
          can trap the fixed layer; -z-10 keeps it under the page, over the body fill. */}
      {hydrated &&
        createPortal(
          <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
            {palettes.map((p, i) => (
              <BackgroundLayer
                key={p.name}
                shown={active === i}
                z={stack[i] ?? 0}
                still={reduced}
                colors={look.presetColors ?? colorsFor(p.name)}
                look={look}
              />
            ))}
          </div>,
          document.body,
        )}
    </HoverBackgroundContext.Provider>
  );
}

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/**
 * One palette's layer. Its WebGL canvas mounts the first time it's shown
 * (browsers cap live contexts at ~16), then stays mounted. `p` runs 0 → 1 on
 * enter (house curve) and back on exit (ease-in); it drives the opacity and
 * how far the shader has settled. The shader animates only while p > 0.
 */
function BackgroundLayer({
  shown,
  z,
  still,
  colors,
  look,
}: {
  shown: boolean;
  z: number;
  still: boolean;
  colors: string[];
  look: Look;
}) {
  const [mounted, setMounted] = useState(false);
  // Adjusting state during render rather than in an effect, per React's docs.
  if (shown && !mounted) setMounted(true);

  const progress = useMotionValue(0);
  const [p, setP] = useState(0);
  useEffect(() => progress.on("change", setP), [progress]);

  const { enter, exit } = look;
  useEffect(() => {
    if (!mounted) return;
    const controls = shown
      ? animate(progress, 1, { duration: enter / 1000, ease: ENTER_EASE })
      : animate(progress, 0, { duration: exit / 1000, ease: EXIT_EASE });
    return () => controls.stop();
    // Only a change of `shown` retargets; duration tweaks apply from the next hover.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, mounted, progress]);

  if (!mounted) return null;

  // Turbulence the shader settles out of, 1 → 0 as the takeover completes.
  // Held at 0 under reduced motion, leaving a plain fade.
  const k = still ? 0 : 1 - p;
  const params = { ...look.params };
  const settle = look.takeover === "warm-up" ? TURBULENCE : GRAIN;
  for (const key of settle) {
    if (typeof params[key] === "number") params[key] = lerp(params[key] as number, 1, k);
  }
  if (look.takeover === "warm-up" && typeof params.scale === "number") {
    params.scale = params.scale * lerp(1, look.warmZoom, k);
  }

  const { Component } = SHADERS[look.shader];

  return (
    <div
      className="absolute inset-0"
      style={{
        zIndex: z,
        visibility: p === 0 ? "hidden" : undefined,
        opacity: p * look.intensity,
      }}
    >
      <Component
        // A different shader is a different program; remount its canvas.
        key={look.shader}
        {...params}
        colors={colors}
        {...(look.colorBack && { colorBack: look.colorBack })}
        speed={p > 0 && !still ? params.speed : 0}
        className="absolute inset-0"
      />
    </div>
  );
}
