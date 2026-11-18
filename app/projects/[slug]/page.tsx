import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import { notFound } from "next/navigation";
import type { MDXComponents } from "mdx/types";
import { CopyEmail } from "@/components/copy-email";
import { Mdx } from "@/components/content/mdx";
import { CaseToc } from "@/components/brutalist/case-toc";
import { DotCursor } from "@/components/brutalist/dot-cursor";
import { Grain } from "@/components/brutalist/grain";
import { getEntry, getRenderableSlugs, type ProjectMeta } from "@/lib/content";
import { loadContentImage } from "@/lib/images";
import { site } from "@/lib/site";

// Case study page, after the Plyń Framer template's project page (see
// docs/design/brutalist-home.md, "Case study"). The template's white frame and
// its Close / Prev / Next bar are left out on purpose.

export const dynamicParams = false;

export function generateStaticParams() {
  return getRenderableSlugs("projects");
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getEntry("projects", slug);
  if (!project || project.meta.external) return {};
  return {
    title: project.meta.title,
    description: project.meta.summary,
    alternates: { canonical: project.href },
  };
}

type Media = { src: string; alt: string };
type Section = { id: string; label: string; body: string; media: Media[] };

const FIGURE = /<Figure\s([\s\S]*?)\/>/g;
const attr = (attrs: string, name: string) =>
  attrs.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? "";
const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * Splits a case study body into the intro (everything before the first `##`,
 * shown in the sidebar) and one section per `##`. A section's `<Figure>`s are
 * lifted out of its text: the text fills the label / text row, and the images
 * run full width beneath it.
 */
function splitBody(body: string) {
  const [intro, ...chunks] = body.split(/^## /m);
  const sections: Section[] = chunks.map((chunk) => {
    const newline = chunk.indexOf("\n");
    const label = (newline === -1 ? chunk : chunk.slice(0, newline)).trim();
    const rest = newline === -1 ? "" : chunk.slice(newline + 1);
    const media = [...rest.matchAll(FIGURE)].map(([, attrs]) => ({
      src: attr(attrs, "src"),
      alt: attr(attrs, "alt"),
    }));
    return { id: slugify(label), label, body: rest.replace(FIGURE, "").trim(), media };
  });
  return { intro: intro.trim(), sections };
}

/** Everything in the case study is 14/20; paragraphs are a blank line apart. */
const sectionText: MDXComponents = {
  p: (props) => <p className="text-pretty [p+&]:mt-5" {...props} />,
  ul: (props) => <ul className="mt-5 list-disc pl-5 first:mt-0" {...props} />,
  ol: (props) => <ol className="mt-5 list-decimal pl-5 first:mt-0" {...props} />,
  strong: (props) => <strong className="font-medium" {...props} />,
};
const introText: MDXComponents = {
  ...sectionText,
  p: (props) => <p className="text-pretty [p+&]:mt-2" {...props} />,
};

// Media column: three of the four 1200px+ columns less the right gutter;
// full width less both gutters below that.
const SIZES = "(min-width: 1200px) calc(75vw - 14px), calc(100vw - 28px)";

async function CaseMedia({ slug, media, priority }: { slug: string; media: Media; priority?: boolean }) {
  const image = await loadContentImage("projects", slug, media.src);
  return (
    <Image
      src={image}
      alt={media.alt}
      sizes={SIZES}
      placeholder="blur"
      priority={priority}
      className="bg-muted h-auto w-full"
    />
  );
}

function Details({ meta }: { meta: ProjectMeta }) {
  const rows = [
    ["Client", meta.client],
    ["Agency", meta.agency],
    ["Role", meta.role],
    ["Year", meta.year],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  if (rows.length === 0) return null;
  return (
    <dl className="text-muted-foreground">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="inline">{label}: </dt>
          <dd className="inline">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = await getEntry("projects", slug);
  if (!project || project.meta.external) notFound();

  const { meta } = project;
  const { intro, sections } = splitBody(project.body);
  const toc = [{ id: "context", label: "Context" }, ...sections.map(({ id, label }) => ({ id, label }))];

  return (
    <div className="brutalist bg-background text-foreground min-h-dvh font-sans text-sm leading-5 min-[1200px]:grid min-[1200px]:grid-cols-4">
      <aside className="flex flex-col justify-between gap-[14px] p-[14px] min-[1200px]:sticky min-[1200px]:top-0 min-[1200px]:h-dvh">
        <div className="flex flex-col gap-[14px] min-[1200px]:pb-[14px]">
          <Link
            href="/"
            className="focus-visible:ring-ring flex w-fit items-center gap-[7px] rounded-xs focus-visible:ring-2 focus-visible:outline-none"
          >
            <ArrowLeftIcon aria-hidden className="size-3.5" />
            <span className="underline">Back</span>
          </Link>
          <div>
            <h1>{meta.title}</h1>
            <p className="text-muted-foreground">{meta.summary}</p>
          </div>
          {intro && (
            <div>
              <Mdx source={intro} collection="projects" slug={slug} components={introText} />
            </div>
          )}
          <Details meta={meta} />
        </div>
        <CaseToc sections={toc} />
      </aside>

      <div className="flex flex-col gap-px px-[14px] pb-[14px] min-[1200px]:col-span-3 min-[1200px]:pt-[14px] min-[1200px]:pl-0">
        <div id="context">
          {meta.cover && (
            <CaseMedia slug={slug} media={{ src: meta.cover, alt: meta.coverAlt ?? "" }} priority />
          )}
        </div>

        {sections.map((section) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="flex flex-col gap-px">
            <div className="pt-[14px]">
              <div className="border-border grid gap-[14px] border-t border-dashed py-[14px] min-[810px]:grid-cols-2 min-[810px]:gap-0">
                <h2 id={`${section.id}-heading`} className="text-muted-foreground">
                  {section.label}
                </h2>
                <div className="max-w-[480px]">
                  <Mdx source={section.body} collection="projects" slug={slug} components={sectionText} />
                </div>
              </div>
            </div>
            {section.media.map((m) => (
              <CaseMedia key={m.src} slug={slug} media={m} />
            ))}
          </section>
        ))}
      </div>

      <footer className="flex flex-col items-center px-[14px] pt-[14px] pb-[90px] text-center min-[1200px]:col-span-4 min-[1200px]:pb-[14px]">
        <p className="text-muted-foreground">Have an idea in mind? Drop me a line!</p>
        <CopyEmail className="underline">{site.social.email}</CopyEmail>
      </footer>

      <Grain />
      <DotCursor />
    </div>
  );
}
