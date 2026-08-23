import type { Metadata } from "next";
import { Download } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume and experience for ${site.name}.`,
  alternates: { canonical: "/resume" },
};

/** Drop the file at public/resume.pdf to enable the download link. */
const RESUME_PDF = "/resume.pdf";

type Role = {
  company: string;
  title: string;
  period: string;
  location?: string;
  points: string[];
};

// Placeholder — replace with your real history.
const experience: Role[] = [
  {
    company: "Company",
    title: "Product Designer 2",
    period: "2024 — Present",
    location: "Remote",
    points: [
      "One line on scope: what surface you own and who it serves.",
      "One line on a shipped outcome, with a number if you have one.",
      "One line on influence beyond your own projects.",
    ],
  },
  {
    company: "Previous Company",
    title: "Product Designer",
    period: "2022 — 2024",
    points: [
      "What you were responsible for.",
      "What changed because you were there.",
    ],
  },
];

const education = [
  { school: "University", credential: "Degree", period: "2018 — 2022" },
];

export default function ResumePage() {
  return (
    <Container size="prose" className="pt-16 pb-8 sm:pt-24">
      <Reveal as="header" className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Resume</h1>
          <p className="text-muted-foreground mt-3 text-sm">
            {site.role} · {site.social.email}
          </p>
        </div>
        <a
          href={RESUME_PDF}
          className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors"
        >
          <Download className="size-3.5" />
          PDF
        </a>
      </Reveal>

      <Reveal className="mt-14" delay={0.05}>
        <h2 className="text-sm font-medium tracking-tight">Experience</h2>
        <div className="mt-6 space-y-10">
          {experience.map((role) => (
            <div key={`${role.company}-${role.period}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-sm font-medium">
                  {role.title}
                  <span className="text-muted-foreground font-normal"> · {role.company}</span>
                </h3>
                <span className="text-muted-foreground font-mono text-xs">{role.period}</span>
              </div>
              {role.location ? (
                <p className="text-muted-foreground/70 mt-1 text-xs">{role.location}</p>
              ) : null}
              <ul className="text-muted-foreground mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                {role.points.map((point) => (
                  <li key={point} className="pl-1">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-14" delay={0.05}>
        <h2 className="text-sm font-medium tracking-tight">Education</h2>
        <div className="mt-6 space-y-4">
          {education.map((item) => (
            <div
              key={item.school}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
            >
              <h3 className="text-sm font-medium">
                {item.credential}
                <span className="text-muted-foreground font-normal"> · {item.school}</span>
              </h3>
              <span className="text-muted-foreground font-mono text-xs">{item.period}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </Container>
  );
}
