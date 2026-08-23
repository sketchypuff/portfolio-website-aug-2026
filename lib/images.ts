import type { StaticImageData } from "next/image";
import type { Collection } from "./content";

/**
 * Resolves an image that lives next to its MDX file.
 *
 * Content images are loaded through the bundler rather than served from
 * `public/` so that Next can hand us intrinsic width/height and a blur
 * placeholder for free — that is what keeps image-heavy pages from shifting
 * as they load.
 *
 * The template literals below intentionally start with a static prefix. The
 * bundler turns each into a context module over that subtree, so every file
 * under `content/<collection>/` is available at runtime. Splitting the two
 * collections into separate functions keeps those context modules narrow.
 */

async function loadPostImage(slug: string, file: string): Promise<StaticImageData> {
  return (await import(`@/content/posts/${slug}/images/${file}`)).default;
}

async function loadProjectImage(slug: string, file: string): Promise<StaticImageData> {
  return (await import(`@/content/projects/${slug}/images/${file}`)).default;
}

export async function loadContentImage(
  collection: Collection,
  slug: string,
  file: string,
): Promise<StaticImageData> {
  const normalised = file.replace(/^\.?\//, "").replace(/^images\//, "");
  try {
    return collection === "posts"
      ? await loadPostImage(slug, normalised)
      : await loadProjectImage(slug, normalised);
  } catch {
    throw new Error(
      `Missing image: content/${collection}/${slug}/images/${normalised}\n` +
        `Referenced from content/${collection}/${slug}/index.mdx. ` +
        `Check the filename and that the file is committed.`,
    );
  }
}
