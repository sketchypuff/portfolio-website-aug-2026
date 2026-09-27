import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

/**
 * Filesystem-backed content layer.
 *
 * Every entry is a directory so that images can sit next to the prose:
 *
 *   content/posts/my-post/
 *     index.mdx
 *     images/hero.jpg
 *
 * The directory name is the URL slug. Images are resolved by `lib/images.ts`.
 */

export const CONTENT_DIR = path.join(process.cwd(), "content");

export type Collection = "posts" | "projects";

export type PostMeta = {
  title: string;
  summary: string;
  /** ISO date, e.g. 2026-08-20 */
  date: string;
  /** Filename inside the entry's images/ directory. */
  cover?: string;
  coverAlt?: string;
};

export type ProjectMeta = {
  title: string;
  summary: string;
  date: string;
  cover?: string;
  coverAlt?: string;
  /** Displayed on the card, e.g. "2026" or "2024 — 2025". */
  year?: string;
  /** Your role, e.g. "Product Design, Prototyping". */
  role?: string;
  /**
   * When set, the card links straight out to this URL and no case study
   * page is generated. Leave unset for a full case study.
   */
  external?: string;
  /** Pulls the project onto the home page. */
  featured?: boolean;
  /** Lower sorts first. Ties fall back to date, newest first. */
  order?: number;
};

export type MetaFor<C extends Collection> = C extends "posts"
  ? PostMeta
  : ProjectMeta;

export type Entry<C extends Collection> = {
  slug: string;
  collection: C;
  meta: MetaFor<C>;
  /** Raw MDX body with frontmatter stripped. */
  body: string;
  /** Route path, or the external URL for link-out projects. */
  href: string;
};

function fail(collection: string, slug: string, message: string): never {
  throw new Error(`content/${collection}/${slug}/index.mdx — ${message}`);
}

function requireString(
  value: unknown,
  field: string,
  collection: string,
  slug: string,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    fail(collection, slug, `frontmatter "${field}" is required and must be a non-empty string`);
  }
  return value;
}

function optionalString(value: unknown, field: string, collection: string, slug: string) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    fail(collection, slug, `frontmatter "${field}" must be a string`);
  }
  return value;
}

function parseMeta<C extends Collection>(
  collection: C,
  slug: string,
  data: Record<string, unknown>,
): MetaFor<C> {
  const title = requireString(data.title, "title", collection, slug);
  const summary = requireString(data.summary, "summary", collection, slug);
  const date = requireString(data.date, "date", collection, slug);

  if (Number.isNaN(Date.parse(date))) {
    fail(collection, slug, `frontmatter "date" is not a valid date: ${date}`);
  }

  const base = {
    title,
    summary,
    date,
    cover: optionalString(data.cover, "cover", collection, slug),
    coverAlt: optionalString(data.coverAlt, "coverAlt", collection, slug),
  };

  if (collection === "posts") return base as MetaFor<C>;

  return {
    ...base,
    year: optionalString(data.year, "year", collection, slug),
    role: optionalString(data.role, "role", collection, slug),
    external: optionalString(data.external, "external", collection, slug),
    featured: data.featured === true,
    order: typeof data.order === "number" ? data.order : undefined,
  } as MetaFor<C>;
}

/**
 * `date` frontmatter is often unquoted in YAML, which gray-matter turns into a
 * Date. Normalise back to an ISO day string so sorting and rendering agree.
 */
function normaliseDates(data: Record<string, unknown>) {
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10);
  }
  return data;
}

export const getSlugs = cache(async (collection: Collection): Promise<string[]> => {
  const dir = path.join(CONTENT_DIR, collection);
  let dirents;
  try {
    dirents = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return dirents
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
    .map((d) => d.name);
});

export const getEntry = cache(
  async <C extends Collection>(collection: C, slug: string): Promise<Entry<C> | null> => {
    const file = path.join(CONTENT_DIR, collection, slug, "index.mdx");
    let raw: string;
    try {
      raw = await fs.readFile(file, "utf8");
    } catch {
      return null;
    }

    const { data, content } = matter(raw);
    const meta = parseMeta(collection, slug, normaliseDates(data));
    const external = (meta as ProjectMeta).external;

    return {
      slug,
      collection,
      meta,
      body: content,
      href: external ?? `/${collection === "posts" ? "blog" : "projects"}/${slug}`,
    };
  },
);

async function getAll<C extends Collection>(collection: C): Promise<Entry<C>[]> {
  const slugs = await getSlugs(collection);
  const entries = await Promise.all(slugs.map((slug) => getEntry(collection, slug)));
  return entries.filter((e): e is Entry<C> => e !== null);
}

/** Newest first. */
export const getPosts = cache(async (): Promise<Entry<"posts">[]> => {
  const posts = await getAll("posts");
  return posts.sort((a, b) => Date.parse(b.meta.date) - Date.parse(a.meta.date));
});

/** Explicit `order` first, then newest first. */
export const getProjects = cache(async (): Promise<Entry<"projects">[]> => {
  const projects = await getAll("projects");
  return projects.sort((a, b) => {
    const ao = a.meta.order ?? Number.MAX_SAFE_INTEGER;
    const bo = b.meta.order ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return Date.parse(b.meta.date) - Date.parse(a.meta.date);
  });
});

export const getFeaturedProjects = cache(async (limit = 3) => {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.meta.featured);
  return (featured.length > 0 ? featured : projects).slice(0, limit);
});

/**
 * Slugs for `generateStaticParams`. Link-out projects are excluded — they have
 * no case study page to render.
 */
export const getRenderableSlugs = cache(async (collection: Collection) => {
  const entries = await getAll(collection);
  return entries
    .filter((e) => !(e.meta as ProjectMeta).external)
    .map((e) => ({ slug: e.slug }));
});

/**
 * The posts either side of `slug` by date. `older` is on the left of the post
 * page, `newer` on the right; either is null at the ends of the list.
 */
export const getAdjacentPosts = cache(async (slug: string) => {
  const posts = await getPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  return {
    newer: i > 0 ? posts[i - 1] : null,
    older: i >= 0 && i < posts.length - 1 ? posts[i + 1] : null,
  };
});

/** Minutes to read at ~200 words a minute, rounded up. Counts MDX tags too, which is close enough. */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Built from parts so the month is always three letters ("Sep", not "Sept").
const dateParts = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "15 Aug, 2026" — the post page format, from the Figma "Blog" frame. */
export function formatDate(date: string): string {
  const parts = dateParts.formatToParts(new Date(date));
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${part("day")} ${part("month")}, ${part("year")}`;
}
