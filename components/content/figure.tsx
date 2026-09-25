import Image from "next/image";
import { loadContentImage } from "@/lib/images";
import type { Collection } from "@/lib/content";
import { cn } from "@/lib/utils";

/** How far an image is allowed to break out of the prose column. */
export type Bleed = "prose" | "wide" | "full";

/**
 * The class sets the negative margin; `lg` and `xl` repeat it in rem per side
 * so `sizes` can be derived from it. Change both together — Tailwind needs the
 * class as a literal string, so it can't be generated from the numbers.
 */
const BLEED: Record<Bleed, { className: string; lg: number; xl: number }> = {
  prose: { className: "", lg: 0, xl: 0 },
  wide: { className: "lg:-mx-24 xl:-mx-32", lg: 6, xl: 8 },
  full: { className: "lg:-mx-24 xl:-mx-40", lg: 6, xl: 10 },
};

/** `Container size="prose"`: max-w-2xl (42rem) less sm:px-8 on both sides. */
const COLUMN = 38;
/** The column caps out once the viewport reaches max-w-2xl. */
const COLUMN_CAP = "672px";
/** Gallery `sm:gap-4`. Below `sm` the gallery is a single column. */
const GAP = 1;

/**
 * `sizes` has to match the rendered width or the browser downloads a larger
 * candidate than it needs. Derived from the layout above rather than written
 * by hand so the two can't drift. Rounded up to the next quarter rem.
 */
function imageSizes(bleed: Bleed, columns = 1): string {
  const { lg, xl } = BLEED[bleed];
  const gaps = GAP * (columns - 1);
  const col = (width: number) => `${Math.ceil(((width - gaps) / columns) * 4) / 4}rem`;

  return [
    `(min-width: 1280px) ${col(COLUMN + 2 * xl)}`,
    `(min-width: 1024px) ${col(COLUMN + 2 * lg)}`,
    `(min-width: ${COLUMN_CAP}) ${col(COLUMN)}`,
    `(min-width: 640px) calc((100vw - 4rem - ${gaps}rem) / ${columns})`,
    "calc(100vw - 3rem)",
  ].join(", ");
}

export type FigureProps = {
  collection: Collection;
  slug: string;
  /** Filename inside the entry's images/ directory, e.g. "hero.jpg". */
  src: string;
  alt?: string;
  caption?: string;
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
    <figure className={cn("my-10", BLEED[bleed].className, className)}>
      <Image
        src={image}
        alt={alt ?? caption ?? ""}
        placeholder="blur"
        priority={priority}
        sizes={imageSizes(bleed)}
        className="bg-muted h-auto w-full rounded-lg"
      />
      {caption ? (
        <figcaption className="text-muted-foreground mt-3 text-sm leading-relaxed">
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
    <figure className={cn("my-10", BLEED[bleed].className)}>
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
            className="bg-muted h-auto w-full rounded-lg"
          />
        ))}
      </div>
      {caption ? (
        <figcaption className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
