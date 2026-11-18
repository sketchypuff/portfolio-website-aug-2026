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

/**
 * `brutalist`: the blog post page's figures. They span the section row (both
 * halves), with square corners, no vertical margin (the row's gap spaces
 * them), a left-aligned muted 14/20 caption 7px below, and the image as a
 * `CaseLightbox` trigger.
 */
export type FigureVariant = "default" | "brutalist";

/** Matches the brutalist post's section row: three of four columns at 1200px+. */
const BRUTALIST_SIZES = "(min-width: 1200px) calc(75vw - 14px), calc(100vw - 28px)";

function LightboxTrigger({ alt, children }: { alt: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      data-lightbox
      data-cursor-text="Enlarge"
      aria-label={alt ? `Enlarge image: ${alt}` : "Enlarge image"}
      className="focus-visible:ring-ring block w-full focus-visible:ring-2 focus-visible:outline-none data-focus-returned:ring-0"
    >
      {children}
    </button>
  );
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
  variant?: FigureVariant;
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
  variant = "default",
}: FigureProps) {
  const image = await loadContentImage(collection, slug, src);
  const altText = alt ?? (typeof caption === "string" ? caption : "");

  if (variant === "brutalist") {
    return (
      <figure className={cn("col-span-full", className)}>
        <LightboxTrigger alt={altText}>
          <Image
            src={image}
            alt={altText}
            placeholder="blur"
            priority={priority}
            sizes={BRUTALIST_SIZES}
            className="bg-muted h-auto w-full"
          />
        </LightboxTrigger>
        {caption ? (
          <figcaption className="text-muted-foreground mt-[7px] max-w-[480px] text-pretty">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className={cn("my-20", BLEED[bleed], className)}>
      <Image
        src={image}
        alt={altText}
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
  variant?: FigureVariant;
};

export async function Gallery({
  collection,
  slug,
  images,
  alt,
  caption,
  columns = 2,
  bleed = "wide",
  variant = "default",
}: GalleryProps) {
  const resolved = await Promise.all(
    images.map((file) => loadContentImage(collection, slug, file)),
  );

  if (variant === "brutalist") {
    return (
      <figure className="col-span-full">
        <div className={cn("grid gap-px", columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
          {resolved.map((image, i) => {
            const label = alt ? `${alt} (${i + 1} of ${resolved.length})` : "";
            return (
              <LightboxTrigger key={images[i]} alt={label}>
                <Image
                  src={image}
                  alt={label}
                  placeholder="blur"
                  sizes={`(min-width: 640px) calc((100vw - 28px) / ${columns}), ${BRUTALIST_SIZES}`}
                  className="bg-muted h-auto w-full"
                />
              </LightboxTrigger>
            );
          })}
        </div>
        {caption ? (
          <figcaption className="text-muted-foreground mt-[7px] max-w-[480px] text-pretty">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

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
