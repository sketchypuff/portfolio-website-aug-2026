import Image from "next/image";
import { loadContentImage } from "@/lib/images";
import type { Collection } from "@/lib/content";
import { cn } from "@/lib/utils";

/** How far an image is allowed to break out of the prose column. */
export type Bleed = "prose" | "wide" | "full";

const BLEED_CLASS: Record<Bleed, string> = {
  prose: "",
  wide: "lg:-mx-24 xl:-mx-32",
  full: "lg:-mx-24 xl:-mx-40",
};

/**
 * `sizes` has to match the rendered width or the browser downloads the wrong
 * candidate. These track the max-widths in `components/content/mdx.tsx`.
 */
const BLEED_SIZES: Record<Bleed, string> = {
  prose: "(min-width: 768px) 42rem, 100vw",
  wide: "(min-width: 1280px) 64rem, (min-width: 1024px) 56rem, 100vw",
  full: "(min-width: 1280px) 72rem, (min-width: 1024px) 60rem, 100vw",
};

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
    <figure className={cn("my-10", BLEED_CLASS[bleed], className)}>
      <Image
        src={image}
        alt={alt ?? caption ?? ""}
        placeholder="blur"
        priority={priority}
        sizes={BLEED_SIZES[bleed]}
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
    <figure className={cn("my-10", BLEED_CLASS[bleed])}>
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
            sizes={
              columns === 3
                ? "(min-width: 640px) 20rem, 100vw"
                : "(min-width: 640px) 30rem, 100vw"
            }
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
