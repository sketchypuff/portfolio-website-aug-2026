import Image from "next/image";
import { loadContentImage } from "@/lib/images";
import type { Collection } from "@/lib/content";
import { cn } from "@/lib/utils";

/** How far an image is allowed to break out of the reading column. */
export type Bleed = "prose" | "wide" | "full";

/**
 * Bleed is a negative margin that centers the image on the column at a target
 * width, measured in `cqw` against the page's `@container` so the scrollbar is
 * excluded. `wide` is the Figma "Blog" image width (1323px); `full` is the page
 * less its gutters. Below `lg` every image is column width.
 */
const BLEED: Record<Bleed, string> = {
  prose: "",
  wide: "lg:mx-[calc((100%_-_min(1323px,_100cqw_-_4rem))_/_2)]",
  full: "lg:mx-[calc((100%_-_(100cqw_-_4rem))_/_2)]",
};

/** `Container size="article"`: 700px column, capped once the viewport fits it and the sm:px-8 gutters. */
const COLUMN = "700px";
const COLUMN_CAP = "764px";
/** `wide` stops growing at 1323px plus gutters. */
const WIDE = "1323px";
const WIDE_CAP = "1387px";
/** Gallery `sm:gap-4`. Below `sm` the gallery is a single column. */
const GAP = "1rem";

/**
 * `sizes` has to match the rendered width or the browser downloads a larger
 * candidate than it needs. Keep it in step with `BLEED` and `Container`.
 */
function imageSizes(bleed: Bleed, columns = 1): string {
  const col = (width: string) =>
    columns === 1 ? width : `calc((${width} - ${columns - 1} * ${GAP}) / ${columns})`;

  const large =
    bleed === "wide"
      ? [`(min-width: ${WIDE_CAP}) ${col(WIDE)}`, `(min-width: 1024px) ${col("calc(100vw - 4rem)")}`]
      : bleed === "full"
        ? [`(min-width: 1024px) ${col("calc(100vw - 4rem)")}`]
        : [];

  return [
    ...large,
    `(min-width: ${COLUMN_CAP}) ${col(COLUMN)}`,
    `(min-width: 640px) ${col("calc(100vw - 4rem)")}`,
    "calc(100vw - 3rem)",
  ].join(", ");
}

export type FigureProps = {
  collection: Collection;
  slug: string;
  /** Filename inside the entry's images/ directory, e.g. "hero.jpg". */
  src: string;
  alt?: string;
  /** Text, or JSX when the caption needs a link. */
  caption?: React.ReactNode;
  bleed?: Bleed;
  /** Set on the first above-the-fold image only. */
  priority?: boolean;
  className?: string;
};

/**
 * An async Server Component: the image is resolved through the bundler at
 * build time, so intrinsic dimensions and the blur placeholder come along
 * with it and nothing reflows on load.
 */
export async function Figure({
  collection,
  slug,
  src,
  alt,
  caption,
  bleed = "prose",
  priority = false,
  className,
}: FigureProps) {
  const image = await loadContentImage(collection, slug, src);

  return (
    <figure className={cn("my-20", BLEED[bleed], className)}>
      <Image
        src={image}
        alt={alt ?? (typeof caption === "string" ? caption : "")}
        placeholder="blur"
        priority={priority}
        sizes={imageSizes(bleed)}
        className="bg-muted h-auto w-full rounded-xl"
      />
      {caption ? (
        <figcaption className="text-muted-foreground mt-3 text-center text-sm leading-relaxed text-balance">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export type GalleryProps = {
  collection: Collection;
  slug: string;
  /** Filenames inside the entry's images/ directory. */
  images: string[];
  alt?: string;
  caption?: string;
  columns?: 2 | 3;
  bleed?: Bleed;
};

export async function Gallery({
  collection,
  slug,
  images,
  alt,
  caption,
  columns = 2,
  bleed = "wide",
}: GalleryProps) {
  const resolved = await Promise.all(
    images.map((file) => loadContentImage(collection, slug, file)),
  );

  return (
    <figure className={cn("my-20", BLEED[bleed])}>
      <div
        className={cn(
          "grid gap-3 sm:gap-4",
          columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {resolved.map((image, i) => (
          <Image
            key={images[i]}
            src={image}
            alt={alt ? `${alt} (${i + 1} of ${resolved.length})` : ""}
            placeholder="blur"
            sizes={imageSizes(bleed, columns)}
            className="bg-muted h-auto w-full rounded-xl"
          />
        ))}
      </div>
      {caption ? (
        <figcaption className="text-muted-foreground mt-3 text-center text-sm leading-relaxed text-balance">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
