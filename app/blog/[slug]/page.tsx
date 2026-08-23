import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import { Mdx } from "@/components/content/mdx";
import { Figure } from "@/components/content/figure";
import { Reveal } from "@/components/motion/reveal";
import { formatDate, getEntry, getRenderableSlugs } from "@/lib/content";

export async function generateStaticParams() {
  return getRenderableSlugs("posts");
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const entry = await getEntry("posts", slug);
  if (!entry) return {};

  return {
    title: entry.meta.title,
    description: entry.meta.summary,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: entry.meta.title,
      description: entry.meta.summary,
      url: `/blog/${slug}`,
      publishedTime: entry.meta.date,
    },
    twitter: {
      card: "summary_large_image",
      title: entry.meta.title,
      description: entry.meta.summary,
    },
  };
}

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const entry = await getEntry("posts", slug);
  if (!entry) notFound();

  const { meta } = entry;

  return (
    <Container size="prose" className="pt-12 pb-8 sm:pt-16">
      <Reveal as="header">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground group inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-x-0.5" />
          Blog
        </Link>

        <h1 className="mt-8 text-2xl font-medium tracking-tight text-balance sm:text-3xl">
          {meta.title}
        </h1>
        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-3 text-sm">
          <time dateTime={meta.date} className="font-mono text-xs">
            {formatDate(meta.date)}
          </time>
        </div>
      </Reveal>

      {meta.cover ? (
        <Figure
          collection="posts"
          slug={slug}
          src={meta.cover}
          alt={meta.coverAlt}
          bleed="wide"
          priority
          className="mt-10 mb-0"
        />
      ) : null}

      <article className="mt-10">
        <Mdx source={entry.body} collection="posts" slug={slug} />
      </article>
    </Container>
  );
}
