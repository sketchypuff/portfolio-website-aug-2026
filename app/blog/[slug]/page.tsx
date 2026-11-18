import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { MDXComponents } from "mdx/types";
import GithubSlugger from "github-slugger";
import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import { CopyEmail } from "@/components/copy-email";
import { Mdx } from "@/components/content/mdx";
import { CaseLightbox } from "@/components/brutalist/case-lightbox";
import { CaseToc } from "@/components/brutalist/case-toc";
import { Grain } from "@/components/brutalist/grain";
import { ClickSound } from "@/components/brutalist/click-sound";
import { SquareCursor } from "@/components/brutalist/square-cursor";
import {
  formatShortDate,
  getAdjacentPosts,
  getEntry,
  getRenderableSlugs,
  readingTime,
} from "@/lib/content";
import { site } from "@/lib/site";

// Blog post page in the brutalist style: the case study page's shell (see
// docs/design/brutalist-home.md, "Blog post"), with figures kept inline.

export const dynamicParams = false;

export function generateStaticParams() {
  return getRenderableSlugs("posts");
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getEntry("posts", slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.summary,
    alternates: { canonical: post.href },
    openGraph: {
      type: "article",
      url: post.href,
      title: post.meta.title,
      description: post.meta.summary,
      publishedTime: post.meta.date,
    },
  };
}

type Section = { id: string; label: string; body: string };

/**
 * Splits a post into sections at each `##`. Text before the first one is the
 * Intro. Unlike the case study, figures stay where they are in the text.
 * Ids come from github-slugger, the same as rehype-slug's.
 */
function splitBody(body: string): Section[] {
  const slugger = new GithubSlugger();
  const [intro, ...chunks] = body.split(/^## /m);
  const sections = chunks.map((chunk) => {
    const newline = chunk.indexOf("\n");
    const label = (newline === -1 ? chunk : chunk.slice(0, newline)).trim();
    const rest = newline === -1 ? "" : chunk.slice(newline + 1);
    return { id: slugger.slug(label), label, body: rest.trim() };
  });
  return intro.trim() ? [{ id: "intro", label: "Intro", body: intro.trim() }, ...sections] : sections;
}

/**
 * Prose at the page's 14/20. Each section's body is a two-column grid: text
 * sits in the right half (max 480px), figures span both halves. The grid's
 * 20px row gap is the blank line between blocks.
 */
const prose: MDXComponents = {
  h3: (props) => <h3 className="text-muted-foreground scroll-mt-[14px] pt-[14px]" {...props} />,
  h4: (props) => <h4 className="text-muted-foreground" {...props} />,
  p: (props) => <p className="text-pretty" {...props} />,
  ul: (props) => <ul className="marker:text-muted-foreground list-disc pl-5" {...props} />,
  ol: (props) => <ol className="marker:text-muted-foreground list-decimal pl-5" {...props} />,
  li: (props) => <li className="[li+&]:mt-1" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-border text-muted-foreground border-l pl-[14px] [&>p+p]:mt-5" {...props} />
  ),
  hr: () => <hr className="border-border col-span-full border-dashed" />,
  strong: (props) => <strong className="font-medium" {...props} />,
  code: (props) => <code className="bg-muted px-1 font-mono text-[0.92em]" {...props} />,
  pre: (props) => (
    <pre className="bg-muted overflow-x-auto p-[14px] font-mono [&_code]:bg-transparent [&_code]:p-0" {...props} />
  ),
  table: (props) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props) => <th className="border-border text-muted-foreground border-b py-[7px] pr-[14px] text-left font-normal" {...props} />,
  td: (props) => <td className="border-border border-b py-[7px] pr-[14px] align-top" {...props} />,
  a: ({ href = "", ...props }) => {
    const className = "focus-visible:ring-ring rounded-xs underline focus-visible:ring-2 focus-visible:outline-none";
    if (href.startsWith("/") || href.startsWith("#")) return <Link href={href} className={className} {...props} />;
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props} />;
  },
};

const link = "focus-visible:ring-ring rounded-xs underline focus-visible:ring-2 focus-visible:outline-none";

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getEntry("posts", slug);
  if (!post) notFound();

  const { meta } = post;
  const { older, newer } = await getAdjacentPosts(slug);
  const sections = splitBody(post.body);

  return (
    <div className="brutalist bg-background text-foreground min-h-dvh font-sans text-sm leading-5 min-[1200px]:grid min-[1200px]:grid-cols-4">
      <aside className="flex flex-col justify-between gap-[14px] p-[14px] min-[1200px]:sticky min-[1200px]:top-0 min-[1200px]:h-dvh min-[1200px]:overflow-y-auto">
        <div className="flex flex-col gap-[14px] min-[1200px]:pb-[14px]">
          {/* Links home until the /blog index exists. */}
          <Link
            href="/"
            className="focus-visible:ring-ring flex w-fit items-center gap-[7px] rounded-xs focus-visible:ring-2 focus-visible:outline-none"
          >
            <ArrowLeftIcon aria-hidden className="size-3.5" />
            <span className="underline">Back</span>
          </Link>
          <div>
            <h1 className="text-pretty">{meta.title}</h1>
            <p className="text-muted-foreground text-pretty">{meta.summary}</p>
          </div>
          <dl className="text-muted-foreground">
            <div>
              <dt className="inline">Published: </dt>
              <dd className="inline">
                <time dateTime={meta.date}>{formatShortDate(meta.date)}</time>
              </dd>
            </div>
            <div>
              <dt className="inline">Reading time: </dt>
              <dd className="inline">{readingTime(post.body)} min</dd>
            </div>
          </dl>
        </div>
        <CaseToc sections={sections.map(({ id, label }) => ({ id, label }))} />
      </aside>

      <CaseLightbox>
        {/* selection-root keeps WebKit's selection fill inside the text column. */}
        <article className="selection-root flex flex-col px-[14px] pb-[14px] min-[1200px]:col-span-3 min-[1200px]:pl-0">
          {sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="pt-[14px]">
              <div className="border-border grid gap-y-5 border-t border-dashed pt-[14px] min-[810px]:grid-cols-2">
                <h2
                  id={`${section.id}-heading`}
                  className="text-muted-foreground min-[810px]:pr-[14px]"
                >
                  {section.label}
                </h2>
                {/* Text goes to the right half; figures and rules span both. */}
                <div className="contents [&>*:not(figure,hr)]:max-w-[480px] min-[810px]:[&>*:not(figure,hr)]:col-start-2">
                  <Mdx
                    source={section.body}
                    collection="posts"
                    slug={slug}
                    components={prose}
                    figureVariant="brutalist"
                  />
                </div>
              </div>
            </section>
          ))}

          {(older || newer) && (
            <nav aria-label="More posts" className="pt-[28px]">
              <div className="border-border grid gap-[14px] border-t border-dashed pt-[14px] min-[810px]:grid-cols-2">
                <div>
                  {older && (
                    <>
                      <p className="text-muted-foreground">Older</p>
                      <Link href={older.href} className={link}>
                        {older.meta.title}
                      </Link>
                    </>
                  )}
                </div>
                <div className="min-[810px]:max-w-[480px]">
                  {newer && (
                    <>
                      <p className="text-muted-foreground">Newer</p>
                      <Link href={newer.href} className={link}>
                        {newer.meta.title}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </nav>
          )}
        </article>
      </CaseLightbox>

      <footer className="flex flex-col items-center px-[14px] pt-[14px] pb-[90px] text-center min-[1200px]:col-span-4 min-[1200px]:pb-[14px]">
        <p className="text-muted-foreground">Have an idea in mind? Drop me a line!</p>
        <CopyEmail className="underline" variant="brutalist">
          {site.social.email}
        </CopyEmail>
      </footer>

      <Grain />
      <SquareCursor />
      <ClickSound />
    </div>
  );
}
