import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { CopyEmail } from "@/components/copy-email";
import { NoidaTime } from "@/components/noida-time";
import { Oneko } from "@/components/oneko";
import { Pile, type Study } from "@/components/pile";
import { ProfessionPill } from "@/components/profession-pill";
import { ThemeTextToggle } from "@/components/theme-toggle";
import { TextLink } from "@/components/text-link";
import { Dab, type Pigment } from "@/components/wash";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Palette = readonly [Pigment, Pigment, Pigment, Pigment];

const pad = (n: number) => String(n).padStart(2, "0");

// Hardcoded from the Figma "Home" frame until these have real entries in
// content/. Sheets are not linked yet for the same reason; a writing row
// links once its post exists. `palette` and `seed` draw each sheet's
// placeholder wash ([sky, far ridge, near ridge, accents]); they go when the
// scans arrive.
const selectedWork: { company: string; title: string; palette: Palette; seed: number }[] = [
  {
    company: "Microsoft",
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
    palette: ["cerulean", "ultramarine", "sap", "indigo"],
    seed: 7,
  },
  {
    company: "Adobe",
    title: "Optimised image masking with a refined selection experience",
    palette: ["rose", "indigo", "sienna", "ochre"],
    seed: 21,
  },
  {
    company: "Adobe",
    title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
    palette: ["ochre", "sienna", "sap", "indigo"],
    seed: 34,
  },
  {
    company: "Postman",
    title: "Reduced time taken by developers in discovering new content and finding team resources",
    palette: ["cerulean", "sap", "ultramarine", "rose"],
    seed: 48,
  },
];

const otherWork: { title: string; palette: Palette; seed: number }[] = [
  {
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
    palette: ["ochre", "sap", "indigo", "sienna"],
    seed: 63,
  },
  {
    title: "Optimised image masking with a refined selection experience",
    palette: ["cerulean", "sap", "sienna", "indigo"],
    seed: 71,
  },
  {
    title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
    palette: ["rose", "ultramarine", "indigo", "sienna"],
    seed: 88,
  },
  {
    title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
    palette: ["ochre", "sienna", "indigo", "sap"],
    seed: 94,
  },
  {
    title: "Reduced time taken by developers in discovering new content and finding team resources",
    palette: ["cerulean", "ultramarine", "sap", "rose"],
    seed: 105,
  },
];

// Everything on the desk, in the order the pile lays it out: plates first.
const studies: Study[] = [
  ...selectedWork.map((w, i) => ({ kind: "plate" as const, number: `Pl. ${pad(i + 1)}`, ...w })),
  ...otherWork.map((w, i) => ({ kind: "study" as const, number: `St. ${pad(i + 1)}`, ...w })),
];

// Each writing row gets one dab in the margin.
const rowPigments: Pigment[] = ["ochre", "cerulean", "rose", "sap", "sienna"];

// `href` is set once a post exists in content/posts; unlinked rows stay plain text.
// Rendered newest first, whatever order they're listed in.
const writing: { date: string; title: string; href?: string }[] = [
  {
    date: "2025-07-20",
    title: "How to use storytelling in UX case studies to land more interviews",
    href: "/blog/storytelling-in-ux-case-studies",
  },
  {
    date: "2024-11-28",
    title: "22 things about industrial design they didn’t teach me in design school",
    href: "/blog/22-things-about-industrial-design",
  },
  {
    date: "2024-05-04",
    title: "Preparing for undergraduate design entrance exams in India",
    href: "/blog/design-entrance-exams-in-india",
  },
  {
    date: "2024-02-24",
    title: "An actionable guide on taking the first step towards learning UX design today",
    href: "/blog/first-step-learning-ux-design",
  },
  {
    date: "2024-01-27",
    title: "Thoughts on making UX portfolio websites for fresh graduates seeking a job in the industry",
    href: "/blog/ux-portfolio-websites-for-fresh-graduates",
  },
];

// Short numeric dates, the way a painter dates a study in the corner.
const shortDate = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const quietLink = "hover:text-link transition-colors";

export default function HomePage() {
  // The page is prerendered, so this is the deploy date.
  const lastUpdated = new Date();
  const posts = writing.toSorted((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="paper-grain @container min-h-screen overflow-x-clip px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
      <Oneko />
      <div className="mx-auto grid max-w-[1480px] gap-14 lg:grid-cols-[21rem_1fr] lg:gap-14 xl:grid-cols-[23rem_1fr] xl:gap-20">
        {/* The notes pencilled beside the pile. */}
        <aside className="flex flex-col gap-10 text-[15px] leading-relaxed lg:pt-2">
          <div className="note border-rule flex items-baseline justify-between gap-4 border-b pb-2.5">
            <span className="text-foreground">Yash Shenai</span>
            <span className="text-muted-foreground">Sketchbook · Noida</span>
          </div>

          <header className="flex flex-col gap-5">
            <div className="flex flex-col items-start gap-1.5 text-xl leading-snug font-medium">
              <h1>Hi! I’m Yash, your neighbourhood</h1>
              <ProfessionPill />
            </div>
            <div className="space-y-[1lh]">
              <p>
                Currently, I make agentic AI experiences feel <strong>oh yeah!</strong> at Microsoft.
                Previously, I’ve worked at Adobe, Postman and Samsung.
              </p>
              <p className="text-muted-foreground">
                I believe all software should be opinionated and delightful to use in order to be
                called usable.
              </p>
            </div>
            <nav aria-label="Main" className="flex flex-wrap gap-x-5 gap-y-1.5">
              <TextLink href={site.resume} icon={ArrowUpRightIcon}>
                Résumé
              </TextLink>
              <TextLink href="/about">About</TextLink>
              <ThemeTextToggle />
            </nav>
          </header>

          <section className="flex flex-col gap-3">
            <div className="note border-rule flex items-baseline justify-between gap-4 border-b pb-2">
              <h2 className="font-medium">Notes</h2>
              <TextLink href="/blog" className="normal-case tracking-normal">
                Open blog
              </TextLink>
            </div>
            <ol role="list">
              {posts.map((post, i) => {
                const pigment = rowPigments[i % rowPigments.length];
                const content = (
                  <>
                    <Dab pigment={pigment} className="mt-[0.45rem] size-2.5 self-start" />
                    <span className="flex flex-col gap-0.5">
                      <span className={cn("text-sm leading-snug text-pretty", post.href && "group-hover:text-link transition-colors")}>
                        {post.title}
                      </span>
                      <time dateTime={post.date} className="note text-muted-foreground">
                        {shortDate.format(new Date(post.date))}
                      </time>
                    </span>
                  </>
                );
                const row = "grid grid-cols-[0.625rem_1fr] gap-x-3 py-2.5";
                return (
                  <li key={post.title} className="border-border border-b">
                    {post.href ? (
                      <Link
                        href={post.href}
                        className={cn(row, "group focus-visible:ring-ring -mx-2 rounded-sm px-2 focus-visible:ring-2 focus-visible:outline-none")}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className={row}>{content}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          <footer className="grid grid-cols-2 gap-x-6 gap-y-6 text-sm">
            <div className="flex flex-col gap-1.5">
              <span className="note text-muted-foreground">Contact</span>
              <ul role="list" className="flex flex-col gap-0.5">
                <li>
                  <CopyEmail />
                </li>
                <li>
                  <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className={quietLink}>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={site.resume} target="_blank" rel="noopener noreferrer" className={quietLink}>
                    Résumé
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <span className="note text-muted-foreground">Last wash</span>
                <time dateTime={lastUpdated.toISOString().slice(0, 10)}>{shortDate.format(lastUpdated)}</time>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="note text-muted-foreground">Currently</span>
                <NoidaTime />
              </div>
            </div>
            <p className="note text-muted-foreground col-span-2 border-t pt-3">
              Set in DM Mono on cold-press paper · every wash is a placeholder until my scans replace it
            </p>
          </footer>
        </aside>

        {/* The desk: the sheets are the index of the work. */}
        <section aria-label="Work" className="flex flex-col gap-6 lg:pb-10">
          <div className="note flex items-baseline justify-between gap-4 lg:hidden">
            <h2 className="font-medium">Work</h2>
            <span className="text-muted-foreground">Pl. selected · St. other</span>
          </div>
          <Pile studies={studies} label="Work" />
          <p className="note text-muted-foreground mt-[6%] hidden justify-end gap-6 lg:flex">
            <span>Pl. — plates, selected work</span>
            <span>St. — studies, other work</span>
          </p>
        </section>
      </div>
    </div>
  );
}
