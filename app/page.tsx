import Link from "next/link";
import { Container } from "@/components/container";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { CopyEmail } from "@/components/copy-email";
import { NoidaTime } from "@/components/noida-time";
import { Oneko } from "@/components/oneko";
import { ProfessionPill } from "@/components/profession-pill";
import { Sheet, SheetGrid } from "@/components/sheet";
import { ThemeTextToggle } from "@/components/theme-toggle";
import { TextLink } from "@/components/text-link";
import { Dab, PlaceholderTag, SwatchStrip, Wash, pigments, type Pigment } from "@/components/wash";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Palette = readonly [Pigment, Pigment, Pigment, Pigment];

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

// `muted` mirrors the design: the first three titles are dimmed, the last two are not.
const otherWork: { title: string; muted: boolean; palette: Palette; seed: number }[] = [
  {
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
    muted: true,
    palette: ["ochre", "sap", "indigo", "sienna"],
    seed: 63,
  },
  {
    title: "Optimised image masking with a refined selection experience",
    muted: true,
    palette: ["cerulean", "sap", "sienna", "indigo"],
    seed: 71,
  },
  {
    title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
    muted: true,
    palette: ["rose", "ultramarine", "indigo", "sienna"],
    seed: 88,
  },
  {
    title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
    muted: false,
    palette: ["ochre", "sienna", "indigo", "sap"],
    seed: 94,
  },
  {
    title: "Reduced time taken by developers in discovering new content and finding team resources",
    muted: false,
    palette: ["cerulean", "ultramarine", "sap", "rose"],
    seed: 105,
  },
];

// Each writing row gets one dab in the margin; hovering it lays a faint wash
// of the same pigment behind the row.
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

const pad = (n: number) => String(n).padStart(2, "0");

/** A section heading as a pencil note on a ruled line, with a count or link at the right. */
function RuledHeading({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="border-rule flex items-baseline justify-between gap-4 border-b pb-2">
      <h2 className="note font-medium">{children}</h2>
      {aside && <div className="note text-muted-foreground">{aside}</div>}
    </div>
  );
}

const quietLink = "hover:text-link transition-colors";

export default function HomePage() {
  // The page is prerendered, so this is the deploy date.
  const lastUpdated = new Date();
  const posts = writing.toSorted((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="paper-grain @container relative isolate overflow-x-clip">
      {/* The page's first wash, bleeding down from the top edge. Light mode
          only: on the dark desk, paint lives on lit sheets and nowhere else. */}
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[460px] opacity-70 dark:hidden">
        <Wash palette={["cerulean", "ultramarine", "sap", "ochre"]} seed={3} variant="band" />
      </div>
      <p className="note text-plate-foreground absolute top-3 right-4 hidden sm:block dark:hidden">
        <PlaceholderTag />
      </p>
      <Oneko />
      <Container size="wide" className="flex flex-col gap-24 pt-6 pb-20 text-[15px] leading-relaxed">
        <div className="flex flex-col gap-14">
          {/* The masthead, pencilled across the top of the sheet. */}
          <div className="note border-rule flex justify-between gap-4 border-b pb-2.5">
            <span>Yash Shenai · Sketchbook</span>
            <span className="text-muted-foreground hidden sm:inline">Landscapes, wet and loose</span>
            <span className="text-right">Noida, India</span>
          </div>

          <header className="grid gap-10 md:grid-cols-12">
            <div className="flex flex-col gap-6 md:col-span-8">
              <div className="flex flex-col items-start gap-2 text-xl leading-snug font-medium lg:flex-row lg:items-baseline lg:gap-3">
                <h1 className="lg:whitespace-nowrap">Hi! I’m Yash, your neighbourhood</h1>
                <ProfessionPill />
              </div>
              <div className="max-w-[34rem] space-y-[1lh]">
                <p>
                  Currently, I make agentic AI experiences feel <strong>oh yeah!</strong> at Microsoft.
                  Previously, I’ve worked at Adobe, Postman and Samsung.
                </p>
                <p className="text-muted-foreground">
                  I believe all software should be opinionated and delightful to use in order to be
                  called usable. A wash goes down loose and wet, keeps its happy accidents, and is then
                  refined in layers. That is how I paint, and how I design.
                </p>
              </div>
            </div>
            <nav
              aria-label="Main"
              className="flex flex-col items-start gap-1.5 md:col-span-3 md:col-start-10 md:items-end md:pt-1"
            >
              <TextLink href={site.resume} icon={ArrowUpRightIcon}>
                Résumé
              </TextLink>
              <TextLink href="/about">About</TextLink>
              <ThemeTextToggle />
            </nav>
          </header>
        </div>

        <section className="flex flex-col gap-10">
          <RuledHeading aside={`${pad(selectedWork.length)} plates`}>Selected work</RuledHeading>
          <SheetGrid label="Selected work">
            {selectedWork.map((item, i) => (
              <Sheet
                key={i}
                number={`Pl. ${pad(i + 1)}`}
                palette={item.palette}
                art={<Wash palette={item.palette} seed={item.seed} />}
              >
                <p className="note text-muted-foreground">{item.company}</p>
                <p className="text-base leading-snug font-normal text-pretty">{item.title}</p>
              </Sheet>
            ))}
          </SheetGrid>
        </section>

        <section className="flex flex-col gap-4">
          <RuledHeading aside={<TextLink href="/blog" className="normal-case tracking-normal">Open blog</TextLink>}>
            Writing
          </RuledHeading>
          <ol role="list">
            {posts.map((post, i) => {
              const pigment = rowPigments[i % rowPigments.length];
              const content = (
                <>
                  <Dab pigment={pigment} className="mt-1.5 size-3 self-start" />
                  <span className={cn("text-base leading-snug text-pretty", post.href && "group-hover:text-link transition-colors")}>
                    {post.title}
                  </span>
                  <time dateTime={post.date} className="note text-muted-foreground col-start-2 sm:col-start-3 sm:pt-1">
                    {shortDate.format(new Date(post.date))}
                  </time>
                </>
              );
              const row =
                "grid grid-cols-[0.75rem_1fr] gap-x-4 gap-y-1 py-3.5 sm:grid-cols-[0.75rem_1fr_auto] sm:items-baseline";
              return (
                <li key={post.title} className="border-border border-b">
                  {post.href ? (
                    <Link
                      href={post.href}
                      className={cn(
                        row,
                        "group focus-visible:ring-ring relative isolate -mx-3 rounded-sm px-3 focus-visible:ring-2 focus-visible:outline-none",
                      )}
                    >
                      {/* A faint wash spreads behind the row on hover. Opacity is the
                          only thing that transitions; the blur is static. */}
                      <span
                        aria-hidden
                        className="absolute inset-y-1 left-0 -z-10 w-2/3 opacity-0 blur-md transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none dark:group-hover:opacity-35"
                        style={{
                          background: `radial-gradient(closest-side, color-mix(in oklch, ${pigments[pigment].color} 40%, transparent), transparent)`,
                        }}
                      />
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

        <section className="flex flex-col gap-10">
          <RuledHeading aside="Studies">Other work</RuledHeading>
          <SheetGrid label="Other work" columns={3}>
            {otherWork.map((item, i) => (
              <Sheet
                key={i}
                size="study"
                number={`St. ${pad(i + 1)}`}
                palette={item.palette}
                art={<Wash palette={item.palette} seed={item.seed} />}
              >
                <p className={cn("leading-snug text-pretty", item.muted && "text-muted-foreground")}>{item.title}</p>
              </Sheet>
            ))}
          </SheetGrid>
        </section>

        <footer className="flex flex-col gap-10">
          <RuledHeading aside="Colophon">Palette</RuledHeading>
          <div className="grid gap-10 lg:grid-cols-12">
            {/* The swatch card: every pigment on the page, tested on its own sheet. */}
            <div className="bg-plate text-plate-foreground shadow-sheet rounded-sm p-4 sm:p-5 lg:col-span-7">
              <ul role="list" className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {(Object.keys(pigments) as Pigment[]).map((pigment, i) => (
                  <li key={pigment} className="flex flex-col gap-0.5">
                    <SwatchStrip pigment={pigment} seed={i * 11 + 5} />
                    <span className="note flex justify-between gap-3">
                      <span>{pigments[pigment].name}</span>
                      <span className="opacity-70">{pad(i + 1)}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="note mt-5 flex justify-between gap-4 border-t pt-3" style={{ borderColor: "var(--plate-rule)" }}>
                <span>Swatch card</span>
                <PlaceholderTag />
              </p>
            </div>

            <div className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
              <p className="text-muted-foreground text-pretty">
                Set in DM Mono on cold-press paper. Every painting here is a placeholder until my own
                scans replace it; the paper tooth is a stand-in for a scan of my own sheet.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="note text-muted-foreground">Last wash</span>
                    <time dateTime={lastUpdated.toISOString().slice(0, 10)}>{shortDate.format(lastUpdated)}</time>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="note text-muted-foreground">Currently</span>
                    <NoidaTime />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </Container>
    </div>
  );
}
