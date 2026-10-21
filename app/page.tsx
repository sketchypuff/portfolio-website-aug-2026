import Link from "next/link";
import { Container } from "@/components/container";
import {
  ArrowUpRightIcon,
  ClockIcon,
  CrownIcon,
  HandHeartIcon,
  IdentificationCardIcon,
  PaletteIcon,
  PenNibIcon,
  SmileyXEyesIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/ssr";
import { CopyEmail } from "@/components/copy-email";
import { NoidaTime } from "@/components/noida-time";
import { Oneko } from "@/components/oneko";
import { ProfessionPill } from "@/components/profession-pill";
import { ThemeTextToggle } from "@/components/theme-toggle";
import { SectionLabel } from "@/components/section-label";
import { TextLink } from "@/components/text-link";
import { WorkCard, WorkStrip } from "@/components/work-strip";
import { Dab, PlaceholderTag, Wash, pigments, type Pigment } from "@/components/wash";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Palette = readonly [Pigment, Pigment, Pigment, Pigment];

// Hardcoded from the Figma "Home" frame until these have real entries in
// content/. Cards are not linked yet for the same reason; a writing row links
// once its post exists. `palette` and `seed` draw each card's placeholder
// wash ([sky, far ridge, near ridge, accents]); they go when the scans arrive.
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
    palette: ["cerulean", "indigo", "sienna", "sap"],
    seed: 52,
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

// Hovering a writing row lays a faint wash of one of these behind it, in turn.
const rowWashes: Pigment[] = ["ochre", "cerulean", "rose", "sap", "sienna"];

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

// Built from parts so the month is always three letters ("Sep", not en-GB's "Sept").
const dateParts = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDay(date: Date) {
  const part = (type: string) => dateParts.formatToParts(date).find((p) => p.type === type)?.value;
  return `${part("day")} ${part("month")} ${part("year")}`;
}

const writingRow = "flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-12";

function WritingRowContent({ date, title, linked }: { date: string; title: string; linked?: boolean }) {
  return (
    <>
      <time dateTime={date} className="text-muted-foreground shrink-0 font-mono text-sm uppercase">
        {formatDay(new Date(date))}
      </time>
      <p className={cn("sm:text-right", linked && "group-hover:text-muted-foreground transition-colors")}>
        {title}
      </p>
    </>
  );
}

const plateNumber = (i: number) => `Pl. ${String(i + 1).padStart(2, "0")}`;

export default function HomePage() {
  // The page is prerendered, so this is the deploy date.
  const lastUpdated = new Date();

  return (
    <div className="paper-grain @container relative isolate overflow-x-clip">
      {/* The page's first wash, bleeding down from the top edge. Light mode
          only: on the dark page, paint lives on lit paper and nowhere else. */}
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[420px] opacity-70 dark:hidden">
        <Wash palette={["cerulean", "ultramarine", "sap", "ochre"]} seed={3} variant="band" />
      </div>
      <p className="text-plate-foreground absolute top-3 right-4 font-mono text-xs uppercase dark:hidden">
        <PlaceholderTag />
      </p>
      <Oneko />
      <Container size="home" className="flex flex-col gap-20 pt-14 pb-16 text-base leading-snug font-medium">
        <div className="flex flex-col gap-12">
          <div className="text-muted-foreground border-foreground/50 flex justify-between gap-4 border-b-[0.5px] pb-3 font-mono text-sm uppercase">
            <span>Yash Shenai’s sketchbook</span>
            <span className="text-right">Noida, India</span>
          </div>

          <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4">
              {/* The paragraph keeps the Figma 436px measure; this row may run wider so
                  every pill label fits beside the headline. Below md there isn't room
                  for the longest one, so the pill always takes its own line there
                  rather than jumping between lines as it cycles. */}
              <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                <h1 className="font-bold md:whitespace-nowrap">Hi! I’m Yash, your neighbourhood</h1>
                <ProfessionPill />
              </div>
              <div className="text-muted-foreground max-w-[436px] space-y-[1lh]">
                <p>
                  Currently, I make agentic AI experiences feel oh yeah! at Microsoft. Previously,
                  I’ve worked at Adobe, Postman and Samsung.
                </p>
                <p>
                  I believe all software should be opinionated and delightful to use in order to be
                  called usable.
                </p>
              </div>
            </div>

            <nav aria-label="Main" className="flex flex-col items-start gap-0.5 sm:items-end">
              <TextLink href={site.resume} icon={ArrowUpRightIcon}>
                Open resumé
              </TextLink>
              <TextLink href="/about" icon={SmileyXEyesIcon}>
                About
              </TextLink>
              <ThemeTextToggle />
            </nav>
          </header>
        </div>

        <section>
          <WorkStrip
            heading={<SectionLabel icon={CrownIcon}>Selected work</SectionLabel>}
            name="Selected work"
            dimOnHover
            labels={selectedWork.map((item) => `${item.company} – ${item.title}`)}
            swatches={selectedWork.map((item) => item.palette[1])}
          >
            {selectedWork.map((item, i) => (
              <WorkCard
                key={i}
                art={<Wash palette={item.palette} seed={item.seed} />}
                note={<PlaceholderTag />}
                number={plateNumber(i)}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-muted-foreground font-mono text-sm uppercase">{item.company}</p>
                  <span className="flex gap-1">
                    {item.palette.slice(0, 3).map((pigment) => (
                      <Dab key={pigment} pigment={pigment} />
                    ))}
                  </span>
                </div>
                <p className="mt-1">{item.title}</p>
              </WorkCard>
            ))}
          </WorkStrip>
        </section>

        <section className="flex flex-col gap-8">
          <div className="flex items-start justify-between gap-4">
            <SectionLabel icon={PenNibIcon}>Writing</SectionLabel>
            <TextLink href="/blog" icon={ArrowUpRightIcon}>
              Open blog
            </TextLink>
          </div>
          <ul role="list">
            {writing.toSorted((a, b) => b.date.localeCompare(a.date)).map((post, i) => (
              <li key={post.title} className="border-foreground/50 border-b-[0.5px]">
                {post.href ? (
                  <Link
                    href={post.href}
                    className={cn(
                      writingRow,
                      "group focus-visible:ring-ring relative isolate -mx-3 rounded-lg px-3 focus-visible:ring-2 focus-visible:outline-none",
                    )}
                  >
                    {/* A faint wash spreads behind the row on hover. Opacity is the
                        only thing that transitions; the blur is static. */}
                    <span
                      aria-hidden
                      className="absolute inset-y-1 right-0 -z-10 w-2/3 opacity-0 blur-md transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none dark:group-hover:opacity-40"
                      style={{
                        background: `radial-gradient(closest-side, color-mix(in oklch, ${pigments[rowWashes[i % rowWashes.length]].color} 45%, transparent), transparent)`,
                      }}
                    />
                    <WritingRowContent date={post.date} title={post.title} linked />
                  </Link>
                ) : (
                  <div className={writingRow}>
                    <WritingRowContent date={post.date} title={post.title} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <WorkStrip
            heading={<SectionLabel icon={HandHeartIcon}>Other work</SectionLabel>}
            name="Other work"
            labels={otherWork.map((item) => item.title)}
            swatches={otherWork.map((item) => item.palette[1])}
          >
            {otherWork.map((item, i) => (
              <WorkCard
                key={i}
                size="study"
                art={<Wash palette={item.palette} seed={item.seed} />}
                note={<PlaceholderTag />}
                number={`St. ${String(i + 1).padStart(2, "0")}`}
              >
                <p className={cn(item.muted && "text-muted-foreground")}>{item.title}</p>
              </WorkCard>
            ))}
          </WorkStrip>
        </section>

        <footer className="flex flex-col gap-16">
          <div className="grid gap-12 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
            <div className="flex flex-col gap-8">
              <SectionLabel icon={IdentificationCardIcon}>Contact</SectionLabel>
              <ul role="list">
                <li>
                  <CopyEmail />
                </li>
                <li>
                  {site.social.linkedin ? (
                    <a
                      href={site.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-muted-foreground transition-colors"
                    >
                      LinkedIn
                    </a>
                  ) : (
                    "LinkedIn"
                  )}
                </li>
                <li>
                  <a
                    href={site.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-muted-foreground transition-colors"
                  >
                    Resumé
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-8">
              <SectionLabel icon={WarningCircleIcon}>Last updated</SectionLabel>
              <time dateTime={lastUpdated.toISOString().slice(0, 10)}>{formatDay(lastUpdated)}</time>
            </div>
            <div className="flex flex-col gap-8 sm:items-end sm:text-right">
              <SectionLabel icon={ClockIcon}>Currently</SectionLabel>
              <NoidaTime />
            </div>
          </div>

          {/* The colophon: what the paint means, and the palette it's mixed from. */}
          <div className="border-foreground/50 grid gap-8 border-t-[0.5px] pt-8 sm:grid-cols-[1fr_auto] sm:gap-12">
            <div className="flex flex-col gap-4">
              <SectionLabel icon={PaletteIcon}>Colophon</SectionLabel>
              <p className="text-muted-foreground max-w-[436px]">
                A wash goes down loose and wet, and the happy accidents are kept. Then come the
                layers, each one deciding a little more. That’s how I paint, and how I design.
                Every painting here is a placeholder wash until I scan my own.
              </p>
            </div>
            <ul role="list" className="grid grid-cols-2 gap-x-6 gap-y-2 self-end sm:grid-cols-1">
              {(Object.keys(pigments) as Pigment[]).map((pigment) => (
                <li key={pigment} className="text-muted-foreground flex items-center gap-2 font-mono text-xs uppercase">
                  <Dab pigment={pigment} />
                  {pigments[pigment].name}
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </Container>
    </div>
  );
}
