import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PostLink } from "@/components/post-link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on design, process, and the work in progress.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <Container className="pt-16 pb-8 sm:pt-24">
      <Reveal as="header">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Blog</h1>
        <p className="text-muted-foreground mt-4 leading-relaxed text-pretty">
          Notes on design, process, and whatever I am currently chewing on.
        </p>
      </Reveal>

      {posts.length > 0 ? (
        <RevealGroup className="divide-border mt-12 divide-y">
          {posts.map((entry) => (
            <RevealItem key={entry.slug}>
              <PostLink entry={entry} />
            </RevealItem>
          ))}
        </RevealGroup>
      ) : (
        <p className="text-muted-foreground mt-12 text-sm">
          No posts yet. Add one at{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
            content/posts/&lt;slug&gt;/index.mdx
          </code>
          .
        </p>
      )}
    </Container>
  );
}
