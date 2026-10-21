import Link from "next/link";
import { Container } from "@/components/container";
import { ArrowRightIcon, ArrowUpRightIcon, SmileyXEyesIcon } from "@phosphor-icons/react/ssr";
import { CopyEmail } from "@/components/copy-email";
import { Entry, EntrySpread } from "@/components/journal/entry";
import { JournalHeading } from "@/components/journal/journal-heading";
import { PlaceholderSwatch, type WashColor, type WashPalette } from "@/components/journal/placeholder-wash";
import { NoidaTime } from "@/components/noida-time";
import { Oneko } from "@/components/oneko";
import { ProfessionPill } from "@/components/profession-pill";
import { ThemeTextToggle } from "@/components/theme-toggle";
import { TextLink } from "@/components/text-link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Hardcoded until these have real entries in content/, so entries are not
// linked yet. `palette` and `seed` pick each placeholder wash; both go away
// when Yash's scanned plates replace them.
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

// Loose leaves: smaller work, kept as specimen tags with one test dab each.
const otherWork: { title: string; swatch: WashColor }[] = [
  {
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
    swatch: "text-wash-sky",
  },
  {
    title: "Optimised image masking with a refined selection experience",
    swatch: "text-wash-sienna",
  },
  {
    title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
    swatch: "text-wash-sap",
  },
  {
    title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
    swatch: "text-wash-ochre",
  },
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

const label = "text-muted-foreground font-mono text-xs tracking-wider uppercase";
const writingRow =
  "grid grid-cols-[3.25rem_1fr] gap-x-4 gap-y-1 py-3 sm:grid-cols-[3.25rem_7.5rem_1fr] sm:items-baseline";
const quietLink = "hover:text-link transition-colors";

export default function HomePage() {
  // The page is prerendered, so this is the deploy date.
  const lastUpdated = new Date();
  const posts = writing.toSorted((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="@container overflow-x-clip">
      <Oneko />
      <Container size="wide" className="flex flex-col gap-24 pt-8 pb-16 font-serif text-base leading-snug">
        <header className="flex flex-col gap-12">
          {/* Running head, as at the top of every page of the journal. */}
          <div className={cn(label, "border-foreground/40 flex justify-between gap-4 border-b pb-2")}>
            <span>Field journal</span>
            <span className="hidden sm:inline">Notes from product design, kept on paper first</span>
            <span>28.54° N, 77.39° E</span>
          </div>

          <div className="grid gap-10 md:grid-cols-12">
            <div className="flex flex-col gap-5 md:col-span-8">
              <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
                <h1 className="text-2xl font-medium lg:whitespace-nowrap">
                  Hi! I’m Yash, your neighbourhood
                </h1>
                <span className="font-sans text-base font-medium">
                  <ProfessionPill />
                </span>
              </div>
              <div className="text-muted-foreground max-w-[34rem] space-y-[1lh] text-lg">
                <p>
                  Currently, I make agentic AI experiences feel <em className="text-foreground">oh yeah!</em>{" "}
                  at Microsoft. Previously, I’ve worked at Adobe, Postman and Samsung.
                </p>
                <p>
                  I believe all software should be opinionated and delightful to use in order to be called
                  usable.
                </p>
              </div>
            </div>

            <nav
              aria-label="Main"
              className="flex flex-col items-start gap-1 md:col-span-3 md:col-start-10 md:items-end"
            >
              <span className={cn(label, "mb-1")}>Index</span>
              <TextLink href={site.resume} icon={ArrowUpRightIcon}>
                Open resumé
              </TextLink>
              <TextLink href="/about" icon={SmileyXEyesIcon}>
                About
              </TextLink>
              <ThemeTextToggle />
            </nav>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
            {flyleaf.map((row) => (
              <div key={row.term} className="border-border flex flex-col gap-1 border-t pt-2">
                <dt className={label}>{row.term}</dt>
                <dd>{row.detail}</dd>
              </div>
            ))}
          </dl>
        </header>

        <section className="flex flex-col gap-10">
          <JournalHeading numeral="I" aside={`${String(selectedWork.length).padStart(2, "0")} entries`}>
            Selected work
          </JournalHeading>
          <EntrySpread label="Selected work">
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
          </EntrySpread>
        </section>

        <section className="flex flex-col gap-4">
          <JournalHeading
            numeral="II"
            aside={
              <Link
                href="/blog"
                className="text-link group inline-flex items-center gap-1 transition-opacity hover:opacity-70"
              >
                Open blog
                <ArrowRightIcon
                  aria-hidden
                  className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
            }
          >
            Writing
          </JournalHeading>
          <ol role="list">
            {posts.map((post, i) => {
              const content = (
                <>
                  <span className={cn(label, "pt-0.5")}>No. {String(posts.length - i).padStart(2, "0")}</span>
                  <time
                    dateTime={post.date}
                    className={cn(label, "col-start-2 row-start-2 sm:row-start-1 pt-0.5")}
                  >
                    {formatDay(new Date(post.date))}
                  </time>
                  <span
                    className={cn(
                      "col-start-2 row-start-1 text-lg sm:col-start-3",
                      post.href && "group-hover:text-link transition-colors",
                    )}
                  >
                    {post.title}
                  </span>
                </>
              );
              return (
                <li key={post.title} className="border-border border-b">
                  {post.href ? (
                    <Link
                      href={post.href}
                      className={cn(
                        writingRow,
                        "group focus-visible:ring-ring -mx-2 rounded-sm px-2 focus-visible:ring-2 focus-visible:outline-none",
                      )}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className={writingRow}>{content}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        <section className="flex flex-col gap-8">
          <JournalHeading numeral="III" aside="Loose leaves">
            Other work
          </JournalHeading>
          <ul role="list" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otherWork.map((item, i) => (
              <li
                key={i}
                className="bg-paper text-paper-foreground shadow-paper relative flex gap-4 rounded-[3px] p-4 pl-5"
              >
                {/* The punched hole of a specimen tag. */}
                <span
                  aria-hidden
                  className="border-paper-rule bg-background absolute top-3 right-3 size-2.5 rounded-full border"
                />
                <PlaceholderSwatch
                  id={`leaf-${i}`}
                  seed={i * 5 + 2}
                  color={item.swatch}
                  className="size-11 shrink-0"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-paper-muted font-mono text-xs tracking-wider uppercase">
                    Specimen {String(i + 1).padStart(2, "0")}
                  </span>
                  <p>{item.title}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer className="flex flex-col gap-8">
          <JournalHeading numeral="IV">Colophon</JournalHeading>
          <div className="grid gap-10 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <span className={label}>Contact</span>
              <ul role="list">
                <li>
                  <CopyEmail />
                </li>
                <li>
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={quietLink}
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={site.resume} target="_blank" rel="noopener noreferrer" className={quietLink}>
                    Resumé
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <span className={label}>Last entry</span>
              <time dateTime={lastUpdated.toISOString().slice(0, 10)}>{formatDay(lastUpdated)}</time>
            </div>
            <div className="flex flex-col gap-2 sm:items-end sm:text-right">
              <span className={label}>Currently</span>
              <NoidaTime />
            </div>
          </div>
          <div
            className={cn(
              label,
              "border-border flex flex-col justify-between gap-2 border-t pt-3 sm:flex-row",
            )}
          >
            <span>Fauna sighted on this page: one cat, wandering</span>
            <span>Plates are placeholder washes until the scans are in</span>
          </div>
        </footer>
      </Container>
    </div>
  );
}
