import Link from "next/link";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import type { MDXComponents } from "mdx/types";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Figure, Gallery, type FigureProps, type GalleryProps } from "./figure";
import type { Collection } from "@/lib/content";

/**
 * Prose styles live here rather than in a typography plugin so the type scale
 * stays legible and tweakable in one place — it is the thing most worth
 * tuning on a text-and-image site.
 *
 * Sizes and spacing are from the Figma "Blog" frame: 20/32 body, 24px bold
 * headings, 24px between elements in a section, 80px between sections.
 */
const prose: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-20 mb-6 scroll-mt-24 text-2xl font-bold text-balance" {...props} />
  ),
  // Not in the Figma frame yet — Provisional.
  h3: (props) => (
    <h3 className="mt-14 mb-4 scroll-mt-24 text-xl font-bold text-balance" {...props} />
  ),
  // One blank line (32px) between consecutive paragraphs, 24px next to anything else.
  p: (props) => <p className="my-6 text-xl leading-8 text-pretty [p+&]:mt-8" {...props} />,
  ul: (props) => (
    <ul
      className="marker:text-muted-foreground my-6 list-disc space-y-1 pl-[50px] text-xl leading-8"
      {...props}
    />
  ),
  // Mono, muted numbers hanging 2px left of the text; the text starts 50px in (Figma).
  ol: (props) => (
    <ol
      className="my-6 space-y-1 pl-[50px] text-xl leading-8 [counter-reset:list] [&>li]:relative [&>li]:[counter-increment:list] [&>li]:before:text-muted-foreground [&>li]:before:absolute [&>li]:before:right-[calc(100%+2px)] [&>li]:before:font-mono [&>li]:before:content-[counter(list)_'.']"
      {...props}
    />
  ),
  li: (props) => <li {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-border text-muted-foreground my-8 border-l-2 pl-5 italic"
      {...props}
    />
  ),
  hr: () => <hr className="border-border my-20" />,
  strong: (props) => <strong className="font-bold text-foreground" {...props} />,
  code: (props) => (
    <code
      className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.85em] before:content-none after:content-none"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="bg-muted my-8 overflow-x-auto rounded-xl p-4 font-mono text-base leading-relaxed"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-base" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border-border border-b px-3 py-2 text-left font-bold" {...props} />
  ),
  td: (props) => <td className="border-border border-b px-3 py-2 align-top" {...props} />,
  a: ({ href = "", ...props }) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    const className =
      "decoration-muted-foreground/40 hover:decoration-foreground underline underline-offset-[3px] transition-colors";

    if (isInternal) {
      return <Link href={href} className={className} {...props} />;
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props} />
    );
  },
};

type MdxProps = {
  source: string;
  collection: Collection;
  slug: string;
};

/**
 * Renders an entry's MDX body.
 *
 * `Figure` and `Gallery` are bound to the entry here, so authors write
 * `<Figure src="hero.jpg" />` and never repeat the collection or slug.
 */
export function Mdx({ source, collection, slug }: MdxProps) {
  const components: MDXComponents = {
    ...prose,
    Figure: (props: Omit<FigureProps, "collection" | "slug">) => (
      <Figure collection={collection} slug={slug} {...props} />
    ),
    Gallery: (props: Omit<GalleryProps, "collection" | "slug">) => (
      <Gallery collection={collection} slug={slug} {...props} />
    ),
  };

  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
      }}
      onError={MdxError}
    />
  );
}

function MdxError({ error }: { error: Error }) {
  // Surfaced in the build log and on the page rather than failing silently —
  // a broken shortcode in one post should be obvious, not invisible.
  console.error("MDX render error:", error);
  return (
    <div className="border-destructive/40 text-destructive my-8 rounded-lg border p-4 text-sm">
      <p className="font-medium">This section failed to render.</p>
      <p className="mt-1 font-mono text-xs opacity-80">{error.message}</p>
    </div>
  );
}
