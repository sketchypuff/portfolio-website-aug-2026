import { cn } from "@/lib/utils";

export type IconName =
  | "arrow-up-right"
  | "clock"
  | "crown-pixel"
  | "hand-heart-pixel"
  | "identification-card"
  | "ink-pen-pixel"
  | "shapes"
  | "smiley-x-eyes"
  | "warning-circle";

/**
 * Renders an SVG from `public/icons/` as a CSS mask filled with the current
 * text color. The files are exported from Figma untouched; masking lets them
 * follow link color and dark mode without editing the artwork. Non-square
 * icons are centred and contained inside the 24px box, which matches how
 * Figma insets them.
 */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  const url = `url(/icons/${name}.svg)`;
  return (
    <span
      aria-hidden
      className={cn("inline-block size-6 shrink-0 bg-current", className)}
      style={{
        maskImage: url,
        WebkitMaskImage: url,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
