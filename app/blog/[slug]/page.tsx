import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import { Container } from "@/components/container";
import { IconCircle } from "@/components/icon-circle";
import { Mdx } from "@/components/content/mdx";
import { PostNav } from "@/components/content/post-nav";
import {
  formatDate,
  getAdjacentPosts,
  getEntry,
  getRenderableSlugs,
  readingTime,
} from "@/lib/content";

// Built from the Figma "Blog" frame (node 1132:2209).

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

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getEntry("posts", slug);
  if (!post) notFound();

  const { older, newer } = await getAdjacentPosts(slug);

  return (
    // `@container` is what wide figures measure their bleed against.
    <div className="@container overflow-x-clip pt-10 pb-16 font-medium">
      <Container size="articleWide">
        {/* Links home until the /blog index exists. */}
        <Link href="/" aria-label="Back to home" className="inline-flex rounded-full transition-opacity hover:opacity-70">
          <IconCircle icon={ArrowLeftIcon} />
        </Link>
      </Container>

      <Container size="article" className="mt-4">
        {/* selection-root keeps WebKit's selection fill inside the prose column. */}
        <article className="selection-root">
          <header className="border-border flex flex-col gap-3 border-b pb-3">
            <h1 className="text-2xl font-bold">{post.meta.title}</h1>
            <p className="text-muted-foreground text-2xl">{post.meta.summary}</p>
            <p className="text-2xl">
              {readingTime(post.body)} min. read •{" "}
              <time dateTime={post.meta.date}>{formatDate(post.meta.date)}</time>
            </p>
          </header>

          <div className="mt-20 *:first:mt-0 *:last:mb-0">
            <Mdx source={post.body} collection="posts" slug={slug} />
          </div>
        </article>
      </Container>

      <Container size="articleWide" className="mt-24">
        <PostNav older={older} newer={newer} />
      </Container>
    </div>
  );
}
