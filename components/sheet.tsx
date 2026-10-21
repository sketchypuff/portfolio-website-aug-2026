import { Dab, PlaceholderTag, pigments, type Pigment } from "@/components/wash";
import { cn } from "@/lib/utils";

/**
 * A sheet pinned up on the page: a painting on its own lit paper, with the
 * notes a painter pencils into the margin of a study (the plate number, the
 * pigments used) and the project's line underneath.
 *
 * `art` is the painting (a `Wash` placeholder until Yash's scans exist). The
 * sheet is `plate`, paper that stays lit in dark mode, because transparent
 * paint takes its light from the paper. `size="study"` is the smaller sheet
 * used for other work.
 *
 * Hovering lifts the sheet off the page and lets the wash re-wet: it spreads
 * a touch and its colour comes up. Both are `motion-safe`.
 */
export function Sheet({
  art,
  number,
  palette,
  size = "plate",
  children,
}: {
  art: React.ReactNode;
  number: string;
  palette: readonly Pigment[];
  size?: "plate" | "study";
  children: React.ReactNode;
}) {
  const shown = palette.slice(0, 3);
  return (
    <li className="group/sheet flex flex-col gap-4">
      <div
        className={cn(
          "bg-plate text-plate-foreground shadow-sheet relative rounded-sm",
          size === "plate" ? "p-3 pb-9 sm:p-4 sm:pb-10" : "p-2.5 pb-8",
          "transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "motion-safe:group-hover/sheet:shadow-sheet-lifted motion-safe:group-hover/sheet:-translate-y-1",
          "motion-reduce:transition-none",
        )}
      >
        <div className="border-plate-rule relative aspect-[4/3] overflow-hidden border">
          <div className="size-full transition-[transform,filter] duration-700 ease-out will-change-transform motion-safe:group-hover/sheet:scale-[1.025] motion-safe:group-hover/sheet:saturate-[1.12] motion-reduce:transition-none">
            {art}
          </div>
        </div>
        {/* The margin notes, pencilled under the painting. */}
        <div
          className={cn(
            "note absolute inset-x-3 bottom-3 flex items-baseline justify-between gap-3 sm:inset-x-4",
            size === "study" && "inset-x-2.5 bottom-2.5 sm:inset-x-2.5",
          )}
        >
          <span className="flex items-baseline gap-2">
            <span className="text-foreground/70">{number}</span>
            <span className="hidden items-baseline gap-1.5 sm:flex">
              {shown.map((p) => (
                <span key={p} className="flex items-baseline gap-1" title={pigments[p].name}>
                  <Dab pigment={p} className="size-2.5 self-center" />
                </span>
              ))}
            </span>
          </span>
          <PlaceholderTag />
        </div>
      </div>
      <div className="flex flex-col gap-1 px-0.5">{children}</div>
    </li>
  );
}

/**
 * The sheets of one section, pinned up in a grid. Hovering one quiets the
 * others (hover devices only).
 */
export function SheetGrid({
  label,
  columns = 2,
  children,
}: {
  label: string;
  columns?: 2 | 3;
  children: React.ReactNode;
}) {
  return (
    <ul
      role="list"
      aria-label={label}
      className={cn(
        "grid gap-x-8 gap-y-12",
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
        "[&>li]:transition-opacity [&>li]:duration-300 [&>li]:ease-out motion-reduce:[&>li]:transition-none",
        "[@media(hover:hover)]:[&:has(>li:hover)>li:not(:hover)]:opacity-60",
      )}
    >
      {children}
    </ul>
  );
}
