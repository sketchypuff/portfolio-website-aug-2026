import Link from "next/link";
import { Container } from "@/components/container";
import { ProjectCard } from "@/components/project-card";
import { PostLink } from "@/components/post-link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getFeaturedProjects, getPosts } from "@/lib/content";
import { site } from "@/lib/site";

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getFeaturedProjects(4), getPosts()]);
  const recent = posts.slice(0, 3);

  return (
    <Container size="wide" className="pt-16 pb-8 sm:pt-24">
      <Reveal as="section" className="max-w-2xl">
        <h1 className="text-2xl font-medium tracking-tight text-balance sm:text-3xl">
          {site.name}
        </h1>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed text-pretty sm:text-lg">
          {/* Replace this with your own positioning line — two sentences at most. */}
          Product designer working on complex software. I care about the parts of
          a product people never notice: the defaults, the empty states, the
          moment something finally makes sense.
        </p>
      </Reveal>

      {projects.length > 0 ? (
        <section className="mt-24 sm:mt-32">
          <Reveal className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-medium tracking-tight">Selected work</h2>
            <Link
              href="/projects"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              All projects
            </Link>
          </Reveal>

          <RevealGroup className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {projects.map((entry) => (
              <RevealItem key={entry.slug}>
                <ProjectCard entry={entry} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      ) : null}

      {recent.length > 0 ? (
        <section className="mt-24 sm:mt-32">
          <Reveal className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-medium tracking-tight">Writing</h2>
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              All posts
            </Link>
          </Reveal>

          <RevealGroup className="divide-border mt-4 divide-y">
            {recent.map((entry) => (
              <RevealItem key={entry.slug}>
                <PostLink entry={entry} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      ) : null}
    </Container>
  );
}
