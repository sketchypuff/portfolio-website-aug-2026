import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}, ${site.role.toLowerCase()}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container size="prose" className="pt-16 pb-8 sm:pt-24">
      <Reveal as="header">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">About</h1>
      </Reveal>

      {/*
        Placeholder copy — replace with your own. Two or three short sections
        reads better here than one long block.
      */}
      <Reveal className="mt-10 space-y-5 leading-[1.75] text-pretty" delay={0.05}>
        <p>
          I am a product designer working on complex software. Most of my work
          lives in the unglamorous middle of a product — the flows that are used
          every day by people who did not choose to be there.
        </p>
        <p>
          Before this I did something else that taught me something useful.
          Write the real version here: where you started, what changed your mind
          about the work, and what you are trying to get better at now.
        </p>

        <h2 className="!mt-14 text-xl font-medium tracking-tight">How I work</h2>
        <p>
          A few sentences on your process, stated as opinions rather than
          methodology. Hiring managers read a lot of &ldquo;user-centered,
          data-informed&rdquo; — specifics are what stand out.
        </p>

        <h2 className="!mt-14 text-xl font-medium tracking-tight">Elsewhere</h2>
        <p>
          The fastest way to reach me is{" "}
          <a
            href={`mailto:${site.social.email}`}
            className="decoration-muted-foreground/40 hover:decoration-foreground underline underline-offset-[3px] transition-colors"
          >
            email
          </a>
          .
        </p>
      </Reveal>
    </Container>
  );
}
