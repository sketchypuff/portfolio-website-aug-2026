import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { CopyEmail } from "@/components/copy-email";
import { Entry, EntryList } from "@/components/journal/entry";
import { JournalHeading } from "@/components/journal/journal-heading";
import { JournalPage, MarginNote, RunningHead, TabRow, type Tab } from "@/components/journal/page-frame";
import { type WashColor, type WashPalette } from "@/components/journal/placeholder-wash";
import { SpecimenTag } from "@/components/journal/specimen-tag";
import { NoidaTime } from "@/components/noida-time";
import { Oneko } from "@/components/oneko";
import { ProfessionPill } from "@/components/profession-pill";
import { ThemeTextToggle } from "@/components/theme-toggle";
import { TextLink } from "@/components/text-link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Hardcoded until these have real entries in content/, so entries are not
// linked yet. `palette` and `seed` pick each placeholder wash; both go away
// when Yash's scanned plates replace them. `notes` (observed / found /
// changed) is the written part of each entry; none are written yet.
const selectedWork: {
  company: string;
  title: string;
  palette: WashPalette;
  seed: number;
}[] = [
  {
    company: "Microsoft",
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
    palette: "dawn",
    seed: 4,
  },
  {
    company: "Adobe",
    title: "Optimised image masking with a refined selection experience",
    palette: "dusk",
    seed: 11,
  },
  {
    company: "Adobe",
    title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
    palette: "monsoon",
    seed: 23,
  },
  {
    company: "Postman",
    title: "Reduced time taken by developers in discovering new content and finding team resources",
    palette: "ghat",
    seed: 8,
  },
];

// Loose leaves: smaller work, kept on specimen tags with one test dab each.
const otherWork: { title: string; swatch: WashColor }[] = [
  {
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
    swatch: "text-wash-sky",
  },
  { title: "Optimised image masking with a refined selection experience", swatch: "text-wash-sienna" },
  { title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature", swatch: "text-wash-sap" },
  { title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature", swatch: "text-wash-ochre" },
  {
    title: "Reduced time taken by developers in discovering new content and finding team resources",
    swatch: "text-wash-indigo",
  },
];

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

// The flyleaf: who keeps this journal, the way a naturalist's notebook opens.
const flyleaf = [
  { term: "Observer", detail: "Yash Shenai" },
  { term: "Station", detail: "Noida, India" },
  { term: "Field", detail: "Agentic AI in Excel and PowerPoint" },
  { term: "Trained", detail: "Industrial design, NID" },
];

const tabs: Tab[] = [
  { id: "selected-work", label: "Work", color: "text-wash-sky" },
  { id: "notes", label: "Notes", color: "text-wash-sap" },
  { id: "loose-leaves", label: "Leaves", color: "text-wash-sienna" },
  { id: "colophon", label: "Colophon", color: "text-wash-ochre" },
];

// Built from parts so the month is always three letters ("Sep", not en-GB's "Sept").
const dateParts = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDay(date: Date) {
  const part = (type: string) => dateParts.formatToParts(date).find((p) => p.type === type)?.value;
  return `${part("day")} ${part("month")} ${part("year")}`;
}

const quietLink = "hover:text-link transition-colors";

export default function HomePage() {
  // The page is prerendered, so this is the deploy date.
  const lastUpdated = new Date();
  const posts = writing.toSorted((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="@container min-h-screen overflow-x-clip px-3 py-4 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
      <Oneko />
      <JournalPage tabs={tabs}>
        <div className="flex flex-col gap-16 lg:gap-20">
          <div className="flex flex-col gap-6">
            <RunningHead>
              <span className="text-foreground">
                Field journal <span className="text-muted-foreground">· Vol. I</span>
              </span>
              <span className="text-muted-foreground hidden sm:inline">Noida · 28.54° N, 77.39° E</span>
              <span className="text-muted-foreground">p. 1</span>
            </RunningHead>
            <TabRow tabs={tabs} />
          </div>

          {/* The first page: who is writing, in their own hand, and the flyleaf. */}
          <header className="relative flex flex-col gap-10">
            <MarginNote>{formatDay(lastUpdated)}</MarginNote>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col items-start gap-1 text-[1.75rem] leading-tight font-medium sm:text-[2rem] lg:flex-row lg:items-baseline lg:gap-3">
                <h1 className="lg:whitespace-nowrap">Hi! I’m Yash, your neighbourhood</h1>
                <span className="text-2xl font-normal sm:text-[1.75rem] lg:text-[2rem]">
                  <ProfessionPill />
                </span>
              </div>
              <div className="max-w-[38rem] space-y-[0.9lh] text-[1.1875rem] leading-relaxed">
                <p>
                  Currently, I make agentic AI experiences feel <em>oh yeah!</em> at Microsoft.
                  Previously, I’ve worked at Adobe, Postman and Samsung.
                </p>
                <p className="text-muted-foreground">
                  I believe all software should be opinionated and delightful to use in order to be
                  called usable.
                </p>
              </div>
            </div>

            <div className="grid gap-x-12 gap-y-4 md:grid-cols-12">
              <dl className="grid gap-x-10 gap-y-2.5 sm:grid-cols-2 md:col-span-8">
                {flyleaf.map((row) => (
                  <div key={row.term} className="flex items-baseline gap-2.5">
                    <dt className="label text-muted-foreground shrink-0 pt-px">{row.term}</dt>
                    <span aria-hidden className="border-foreground/35 mb-1 flex-1 border-b border-dotted" />
                    <dd className="text-right text-[1.0625rem] leading-snug">{row.detail}</dd>
                  </div>
                ))}
              </dl>
              <nav
                aria-label="Main"
                className="label flex flex-wrap gap-x-5 gap-y-2 md:col-span-4 md:flex-col md:items-end md:gap-y-2"
              >
                <TextLink href={site.resume} icon={ArrowUpRightIcon} className="normal-case tracking-wide">
                  Résumé
                </TextLink>
                <TextLink href="/about" className="normal-case tracking-wide">
                  About
                </TextLink>
                <span className="normal-case tracking-wide">
                  <ThemeTextToggle />
                </span>
              </nav>
            </div>
          </header>

          <section className="flex flex-col gap-6">
            <JournalHeading
              id="selected-work"
              numeral="I"
              aside={`${String(selectedWork.length).padStart(2, "0")} entries`}
            >
              Selected work
            </JournalHeading>
            <EntryList label="Selected work">
              {selectedWork.map((item, i) => (
                <Entry
                  key={i}
                  index={i}
                  company={item.company}
                  title={item.title}
                  palette={item.palette}
                  seed={item.seed}
                />
              ))}
            </EntryList>
          </section>

          <section className="flex flex-col gap-2">
            <JournalHeading
              id="notes"
              numeral="II"
              aside={
                <TextLink href="/blog" className="normal-case tracking-wide">
                  Open blog
                </TextLink>
              }
            >
              Notes
            </JournalHeading>
            <ol role="list">
              {posts.map((post, i) => {
                const number = String(posts.length - i).padStart(2, "0");
                const content = (
                  <>
                    <MarginNote>{number}</MarginNote>
                    <time dateTime={post.date} className="label text-muted-foreground pt-1.5 sm:w-28 sm:shrink-0">
                      {formatDay(new Date(post.date))}
                    </time>
                    <span
                      className={cn(
                        "text-[1.1875rem] leading-snug text-pretty",
                        post.href && "group-hover:text-link transition-colors",
                      )}
                    >
                      {post.title}
                    </span>
                  </>
                );
                const row = "relative flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6";
                return (
                  <li key={post.title} className="border-border border-b">
                    {post.href ? (
                      <Link
                        href={post.href}
                        className={cn(row, "group focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:outline-none")}
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

          <section className="flex flex-col gap-8">
            <JournalHeading id="loose-leaves" numeral="III" aside="Other work">
              Loose leaves
            </JournalHeading>
            <ul role="list" className="grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
              {otherWork.map((item, i) => (
                <SpecimenTag key={i} index={i} color={item.swatch}>
                  {item.title}
                </SpecimenTag>
              ))}
            </ul>
          </section>

          <footer className="flex flex-col gap-8">
            <JournalHeading id="colophon" numeral="IV">
              Colophon
            </JournalHeading>
            <div className="grid gap-10 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <span className="label text-muted-foreground">Contact</span>
                <ul role="list" className="flex flex-col gap-0.5 text-[1.0625rem]">
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
              <div className="flex flex-col gap-2">
                <span className="label text-muted-foreground">Last entry</span>
                <time dateTime={lastUpdated.toISOString().slice(0, 10)} className="text-[1.0625rem]">
                  {formatDay(lastUpdated)}
                </time>
              </div>
              <div className="flex flex-col gap-2 text-[1.0625rem] sm:items-end sm:text-right">
                <span className="label text-muted-foreground">Conditions</span>
                <NoidaTime />
              </div>
            </div>
            <div className="label text-muted-foreground border-border flex flex-col justify-between gap-2 border-t pt-3 sm:flex-row">
              <span>Fauna sighted on this page: one cat, wandering</span>
              <span>Written in Alegreya, typed in Plex Mono · plates are placeholder washes until the scans are in</span>
            </div>
          </footer>
        </div>
      </JournalPage>
    </div>
  );
}
