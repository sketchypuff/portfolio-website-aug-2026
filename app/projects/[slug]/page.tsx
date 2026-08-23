import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import { Mdx } from "@/components/content/mdx";
import { Figure } from "@/components/content/figure";
import { Reveal } from "@/components/motion/reveal";
import { getEntry, getRenderableSlugs } from "@/lib/content";

export async function generateStaticParams() {
  return getRenderableSlugs("projects");
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const entry = await getEntry("projects", slug);
  if (!entry) return {};

  return {
    title: entry.meta.title,
    description: entry.meta.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: "article",
      title: entry.meta.title,
      description: entry.meta.summary,
      url: `/projects/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: entry.meta.title,
      description: entry.meta.summary,
    },
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const entry = await getEntry("projects", slug);

  // Link-out projects have no case study to show.
  if (!entry || entry.meta.external) notFound();

  const { meta } = entry;

  const facts = [
    meta.year ? { label: "Year", value: meta.year } : null,
    meta.role ? { label: "Role", value: meta.role } : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <Container size="prose" className="pt-12 pb-8 sm:pt-16">
      <Reveal as="header">
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-foreground group inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-x-0.5" />
          Projects
        </Link>

        <h1 className="mt-8 text-2xl font-medium tracking-tight text-balance sm:text-3xl">
          {meta.title}
        </h1>
        <p className="text-muted-foreground mt-4 leading-relaxed text-pretty">{meta.summary}</p>

        {facts.length > 0 ? (
          <dl className="border-border mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t pt-6 text-sm">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-muted-foreground text-xs">{fact.label}</dt>
                <dd className="mt-1">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Reveal>

      {meta.cover ? (
        <Figure
          collection="projects"
          slug={slug}
          src={meta.cover}
          alt={meta.coverAlt}
          bleed="wide"
          priority
          className="mt-10 mb-0"
        />
      ) : null}

      <article className="mt-10">
        <Mdx source={entry.body} collection="projects" slug={slug} />
      </article>
    </Container>
  );
}
