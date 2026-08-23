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
 */
const prose: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-14 mb-4 scroll-mt-24 text-xl font-medium tracking-tight text-balance"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-10 mb-3 scroll-mt-24 text-base font-medium tracking-tight text-balance"
      {...props}
    />
  ),
  p: (props) => <p className="my-5 leading-[1.75] text-pretty" {...props} />,
  ul: (props) => <ul className="my-5 list-disc space-y-2 pl-5 leading-[1.75]" {...props} />,
  ol: (props) => <ol className="my-5 list-decimal space-y-2 pl-5 leading-[1.75]" {...props} />,
  li: (props) => <li className="pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-border text-muted-foreground my-8 border-l-2 pl-5 italic"
      {...props}
    />
  ),
  hr: () => <hr className="border-border my-14" />,
  strong: (props) => <strong className="font-medium text-foreground" {...props} />,
  code: (props) => (
    <code
      className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.85em] before:content-none after:content-none"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="bg-muted my-8 overflow-x-auto rounded-lg p-4 font-mono text-sm leading-relaxed"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border-border border-b px-3 py-2 text-left font-medium" {...props} />
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
