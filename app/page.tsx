import Link from "next/link";
import { Container } from "@/components/container";
import { CopyEmail } from "@/components/copy-email";
import { Entry, EntryList } from "@/components/journal/entry";
import { JournalHeading } from "@/components/journal/journal-heading";
import { PlaceholderSwatch, type WashColor, type WashPalette } from "@/components/journal/placeholder-wash";
import { Rail, type RailSection } from "@/components/journal/rail";
import { NoidaTime } from "@/components/noida-time";
import { Oneko } from "@/components/oneko";
import { ProfessionPill } from "@/components/profession-pill";
import { TextLink } from "@/components/text-link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Hardcoded until these have real entries in content/, so entries are not
// linked yet. `palette` and `seed` pick each placeholder wash; both go away
// when Yash's scanned plates replace them. `notes` (observed / found /
// changed) is the ink under each plate; none are written yet.
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

const sections: RailSection[] = [
  { id: "selected-work", numeral: "I", label: "Selected work" },
  { id: "writing", numeral: "II", label: "Writing" },
  { id: "loose-leaves", numeral: "III", label: "Loose leaves" },
  { id: "colophon", numeral: "IV", label: "Colophon" },
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

const writingRow =
  "grid grid-cols-[3.25rem_1fr] gap-x-4 gap-y-1 py-3.5 sm:grid-cols-[3.25rem_7.5rem_1fr] sm:items-baseline";
const quietLink = "hover:text-link transition-colors";

export default function HomePage() {
  // The page is prerendered, so this is the deploy date.
  const lastUpdated = new Date();
  const posts = writing.toSorted((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="@container overflow-x-clip">
      <Oneko />
      <Container size="wide" className="pt-8 pb-20 text-base leading-snug lg:pt-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-3">
            <Rail sections={sections} />
          </div>

          <div className="flex min-w-0 flex-col gap-20 lg:col-span-9 lg:gap-24">
            {/* The first page: who is writing, in their own hand. */}
            <header className="flex flex-col gap-6 lg:pt-1">
              <div className="flex flex-col items-start gap-2 text-[1.75rem] leading-tight font-medium lg:flex-row lg:items-baseline lg:gap-3">
                <h1 className="lg:whitespace-nowrap">Hi! I’m Yash, your neighbourhood</h1>
                <span className="text-xl font-normal lg:text-[1.75rem]">
                  <ProfessionPill />
                </span>
              </div>
              <div className="max-w-[36rem] space-y-[1lh] text-lg leading-relaxed">
                <p>
                  Currently, I make agentic AI experiences feel <em>oh yeah!</em> at Microsoft.
                  Previously, I’ve worked at Adobe, Postman and Samsung.
                </p>
                <p className="text-muted-foreground">
                  I believe all software should be opinionated and delightful to use in order to be
                  called usable. I design on paper first, and I paint landscapes wet and loose. This
                  journal keeps both.
                </p>
              </div>
            </header>

            <section className="flex flex-col gap-2">
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
                id="writing"
                numeral="II"
                aside={
                  <TextLink href="/blog" className="normal-case tracking-normal">
                    Open blog
                  </TextLink>
                }
              >
                Writing
              </JournalHeading>
              <ol role="list" className="border-border border-b">
                {posts.map((post, i) => {
                  const content = (
                    <>
                      <span className="label text-muted-foreground pt-1">
                        No. {String(posts.length - i).padStart(2, "0")}
                      </span>
                      <time
                        dateTime={post.date}
                        className="label text-muted-foreground col-start-2 row-start-2 pt-1 sm:row-start-1"
                      >
                        {formatDay(new Date(post.date))}
                      </time>
                      <span
                        className={cn(
                          "col-start-2 row-start-1 text-lg leading-snug text-pretty sm:col-start-3",
                          post.href && "group-hover:text-link transition-colors",
                        )}
                      >
                        {post.title}
                      </span>
                    </>
                  );
                  return (
                    <li key={post.title} className="border-border border-t">
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
              <JournalHeading id="loose-leaves" numeral="III" aside="Other work">
                Loose leaves
              </JournalHeading>
              <ul role="list" className="grid gap-5 sm:grid-cols-2">
                {otherWork.map((item, i) => (
                  <li
                    key={i}
                    className="bg-paper text-paper-foreground shadow-paper relative flex gap-4 rounded-sm p-4 pr-10"
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
                      className="mt-0.5 size-10 shrink-0"
                    />
                    <div className="flex flex-col gap-1.5">
                      <span className="label text-paper-muted">Specimen {String(i + 1).padStart(2, "0")}</span>
                      <p className="leading-snug text-pretty">{item.title}</p>
                    </div>
                  </li>
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
                  <ul role="list" className="flex flex-col gap-0.5">
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
                        Résumé
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="label text-muted-foreground">Last entry</span>
                  <time dateTime={lastUpdated.toISOString().slice(0, 10)}>{formatDay(lastUpdated)}</time>
                </div>
                <div className="flex flex-col gap-2 sm:items-end sm:text-right">
                  <span className="label text-muted-foreground">Currently</span>
                  <NoidaTime />
                </div>
              </div>
              <div className="label text-muted-foreground border-border flex flex-col justify-between gap-2 border-t pt-3 sm:flex-row">
                <span>Fauna sighted on this page: one cat, wandering</span>
                <span>Set in Literata and Plex Mono · plates are placeholder washes until the scans are in</span>
              </div>
            </footer>
          </div>
        </div>
      </Container>
    </div>
  );
}
