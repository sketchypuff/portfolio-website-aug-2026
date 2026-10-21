import { Dab, PlaceholderTag, SwatchStrip, Wash, pigments, type Pigment } from "@/components/wash";
import { cn } from "@/lib/utils";

type Palette = readonly [Pigment, Pigment, Pigment, Pigment];

export type Study = {
  kind: "plate" | "study";
  number: string;
  company?: string;
  title: string;
  palette: Palette;
  seed: number;
};

/**
 * Where each sheet lies on the desk at `lg`: left and width as a percentage
 * of the desk's width, top as a percentage of its height, and its angle. Plates first, then
 * studies, then the swatch card, in the order the sheets are listed.
 */
const PLACES = [
  // Plates: two loose rows. Their captions are never covered.
  { l: 2, t: 1, w: 42, r: -2.5 },
  { l: 54, t: 4, w: 42, r: 2 },
  { l: 6, t: 44, w: 42, r: 1.5 },
  { l: 56, t: 48, w: 42, r: -2 },
  // Studies: tucked over the corners of the paintings, in the gaps between.
  { l: 40, t: 0, w: 20, r: 4 },
  { l: 78, t: 39, w: 20, r: -5 },
  { l: 0, t: 39, w: 20, r: -6 },
  { l: 45, t: 46, w: 20, r: 3 },
  { l: 24, t: 39, w: 20, r: 2.5 },
  // The swatch card, bottom left.
  { l: 4, t: 80, w: 24, r: -2 },
];

const lift =
  "transition-[rotate,scale,filter,opacity,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

/**
 * One sheet of cold-press paper with a painting on it and the painter's
 * pencil notes in its margin: the plate number, where it is from, the title,
 * and the three pigments. The sheet is the unit of the whole site: a project
 * is a sheet on the desk.
 */
function SheetFace({ study }: { study: Study }) {
  const plate = study.kind === "plate";
  return (
    <article className="bg-plate text-plate-foreground paper-grain p-[4%] pb-[5%]">
      <div className="border-plate-rule relative aspect-[4/3] overflow-hidden border">
        <div className="size-full transition-[transform,filter] duration-700 ease-out will-change-transform motion-safe:group-hover/sheet:scale-[1.03] motion-safe:group-hover/sheet:saturate-[1.12] motion-reduce:transition-none">
          <Wash palette={study.palette} seed={study.seed} />
        </div>
      </div>
      <div className="note mt-[4%] flex items-baseline justify-between gap-2 text-[10px] leading-tight sm:text-[11px]">
        <span className="text-plate-ink/75">
          {study.number}
          {study.company && <span className="text-plate-foreground"> · {study.company}</span>}
        </span>
        <span className="flex items-center gap-1">
          {study.palette.slice(0, 3).map((p) => (
            <Dab key={p} pigment={p} className="size-2" />
          ))}
        </span>
      </div>
      <p
        className={cn(
          "text-plate-ink mt-1.5 leading-snug font-normal text-pretty",
          plate ? "text-[13px]" : "text-[12px]",
        )}
      >
        {study.title}
      </p>
      <p className="note text-plate-foreground mt-2 text-[10px]">
        <PlaceholderTag />
      </p>
    </article>
  );
}

/** The swatch card: every pigment on the desk, tested as a strip on its own sheet. */
function SwatchCard() {
  return (
    <article className="bg-plate text-plate-foreground paper-grain p-[5%]">
      <ul role="list" className="flex flex-col gap-1">
        {(Object.keys(pigments) as Pigment[]).map((pigment, i) => (
          <li key={pigment} className="flex flex-col">
            <SwatchStrip pigment={pigment} seed={i * 11 + 5} className="h-4" />
            <span className="note flex justify-between text-[10px]">
              <span>{pigments[pigment].name}</span>
              <span className="opacity-70">{String(i + 1).padStart(2, "0")}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="note border-plate-rule mt-3 flex justify-between border-t pt-2 text-[10px]">
        <span>Swatch card</span>
        <PlaceholderTag />
      </p>
    </article>
  );
}

/**
 * The pile: every sheet laid on the desk at its own angle, overlapping the
 * way studies do when you tip them out of a folder. It is the index of the
 * work. Hovering a sheet squares it up, lifts it to the top and brings the
 * paint up; the rest go soft and quiet underneath (hover devices only).
 *
 * At `lg` the desk is a 3:4 board and the sheets sit where `PLACES` puts
 * them: studies overlap the paintings' corners, never a plate's caption, so
 * every title is readable at rest.
 * Below that they flow in a grid, each tilted a degree, so nothing depends
 * on absolute positions on a phone.
 */
export function Pile({ studies, label }: { studies: Study[]; label: string }) {
  const sheets: React.ReactNode[] = [
    ...studies.map((s) => <SheetFace key={s.number} study={s} />),
    <SwatchCard key="swatches" />,
  ];
  return (
    <ul
      role="list"
      aria-label={label}
      className={cn(
        "relative grid grid-cols-2 gap-5 sm:gap-6 lg:block lg:aspect-[3/4] lg:w-full",
        "[@media(hover:hover)]:[&:has(>li:hover)>li:not(:hover)]:opacity-70 [@media(hover:hover)]:[&:has(>li:hover)>li:not(:hover)]:blur-[1.5px]",
      )}
    >
      {sheets.map((sheet, i) => {
        const place = PLACES[i % PLACES.length];
        const plate = i < studies.length && studies[i].kind === "plate";
        return (
          <li
            key={i}
            style={
              {
                "--l": `${place.l}%`,
                "--t": `${place.t}%`,
                "--w": `${place.w}%`,
                "--r": `${place.r}deg`,
              } as React.CSSProperties
            }
            className={cn(
              "group/sheet shadow-sheet hover:shadow-sheet-lifted relative hover:z-30 hover:scale-[1.03] hover:rotate-0",
              lift,
              "max-lg:odd:-rotate-1 max-lg:even:rotate-1",
              plate && "col-span-2",
              i === sheets.length - 1 && "col-span-2 sm:col-span-1",
              "lg:absolute lg:top-(--t) lg:left-(--l) lg:w-(--w) lg:rotate-(--r)",
            )}
          >
            {sheet}
          </li>
        );
      })}
    </ul>
  );
}
