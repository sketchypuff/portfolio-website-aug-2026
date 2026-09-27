import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ProjectCard } from "@/components/project-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies and selected product design work.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <Container size="wide" className="pt-16 pb-8 sm:pt-24">
      <Reveal as="header" className="max-w-2xl">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Projects</h1>
        <p className="text-muted-foreground mt-4 leading-relaxed text-pretty">
          Case studies and selected work. Some entries link out to the live
          product or repository.
        </p>
      </Reveal>

      {projects.length > 0 ? (
        <RevealGroup as="ul" className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {projects.map((entry) => (
            <RevealItem as="li" key={entry.slug}>
              <ProjectCard entry={entry} />
            </RevealItem>
          ))}
        </RevealGroup>
      ) : (
        <p className="text-muted-foreground mt-16 text-sm">
          No projects yet. Add one at{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
            content/projects/&lt;slug&gt;/index.mdx
          </code>
          .
        </p>
      )}
    </Container>
  );
}
