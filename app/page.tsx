import Link from "next/link";
import { ProfessionPill } from "@/components/profession-pill";
import { SiteFooter } from "@/components/site-footer";
import { ThemeInlineToggle } from "@/components/theme-toggle";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Hardcoded until these have real entries in content/. Other work repeats its
// entries to fill the grid at its intended volume (8); swap in real projects
// as they're written up. Cards are not linked yet.
const selectedWork = [
  {
    company: "Microsoft",
    title: "Made Copilot’s memory visible on mobile, with control over what it keeps and forgets",
  },
  {
    company: "Microsoft",
    title: "Helped users ground Copilot prompts on mobile with files, skills, people and meeting recordings",
  },
  {
    company: "Microsoft",
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
  },
  { company: "Adobe", title: "Optimised image masking with a refined selection experience" },
  { company: "Adobe", title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature" },
  { company: "Adobe", title: "Redesigned the Adobe Learning Manager homepage to improve content discovery" },
  { company: "Adobe", title: "Improved course enrollment on Adobe Learning Manager" },
  { company: "Adobe", title: "Improved peer-to-peer engagement on Adobe Learning Manager" },
  {
    company: "Postman",
    title: "Reduced time taken by developers in discovering new content and finding team resources",
  },
  { company: "Samsung", title: "Designed video editing experiences for Samsung Camera" },
];

const otherWorkEntries = [
  "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
  "Optimised image masking with a refined selection experience",
  "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
  "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
  "Reduced time taken by developers in discovering new content and finding team resources",
];

const otherWork = Array.from({ length: 8 }, (_, i) => otherWorkEntries[i % otherWorkEntries.length]);

// Rendered newest first, whatever order they're listed in.
const writing: { date: string; title: string; href: string }[] = [
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

const pages = [
  { label: "Work", href: "/", current: true },
  { label: "Writing", href: "/blog" },
  { label: "About", href: "/about" },
];

// Built from parts so the month is always three letters ("Sep", not en-GB's "Sept").
const dateParts = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDay(date: string) {
  const parts = dateParts.formatToParts(new Date(date));
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${part("day")} ${part("month")} ${part("year")}`;
}

const mono = "font-mono text-sm uppercase";
const quietBlue = "text-link transition-opacity hover:opacity-70";

/**
 * The "[ ]" marker, after emmiwu.com. A dot fills the brackets when `on`, or
 * while its `group` ancestor is hovered or focused.
 */
function Marker({ on }: { on?: boolean }) {
  return (
    <span aria-hidden className="relative whitespace-pre">
      [ ]
      <span
        className={cn(
          "bg-foreground absolute top-1/2 left-1/2 size-1 -translate-1/2 rounded-full transition-opacity duration-150",
          on ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
      />
    </span>
  );
}

function SectionHeading({ id, label, count }: { id: string; label: string; count: number }) {
  return (
    <h2 id={id} className={cn(mono, "text-muted-foreground flex items-baseline gap-2")}>
      <span className="text-foreground">{label}</span>
      <span className="tabular-nums">[{String(count).padStart(2, "0")}]</span>
    </h2>
  );
}

const cardGrid = "grid grid-cols-2 gap-x-3 @3xl:grid-cols-4";
const imageSlot = "bg-muted aspect-[268.75/264] w-full";

export default function HomePage() {
  return (
    <>
      <div className="grid gap-12 px-6 pt-14 pb-24 text-base leading-snug font-medium sm:px-8 md:grid-cols-[260px_1fr] md:gap-8 lg:grid-cols-[300px_1fr]">
        <Reveal as="aside" className="flex flex-col gap-[1lh] md:sticky md:top-14 md:self-start">
          <div className="flex flex-col items-start gap-2">
            <h1 className="font-bold">Hi! I’m Yash, your neighbourhood</h1>
            <ProfessionPill />
          </div>
          <p className="text-muted-foreground">
            Currently, I make agentic AI experiences feel oh yeah! at Microsoft. Previously, I’ve
            worked at Adobe, Postman and Samsung.
          </p>
          <p className="text-muted-foreground">
            <ThemeInlineToggle />, say hello on{" "}
            <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className={quietBlue}>
              LinkedIn
            </a>{" "}
            or{" "}
            <a href={site.resume} target="_blank" rel="noopener noreferrer" className={quietBlue}>
              open my resumé
            </a>
            .
          </p>
          <nav aria-label="Main" className={cn(mono, "flex flex-col gap-1.5 pt-4")}>
            {pages.map((page) => (
              <Link
                key={page.label}
                href={page.href}
                aria-current={page.current ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-2 transition-colors",
                  page.current ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Marker on={page.current} />
                {page.label}
              </Link>
            ))}
          </nav>
        </Reveal>

        <div className="@container flex flex-col gap-28">
          <section aria-labelledby="selected-work" className="flex flex-col gap-5">
            <Reveal>
              <SectionHeading id="selected-work" label="Selected work" count={selectedWork.length} />
            </Reveal>
            <RevealGroup as="ul" className={cn(cardGrid, "gap-y-10")}>
              {selectedWork.map((item, i) => (
                <RevealItem as="li" key={i}>
                  <div data-cursor-text="Open case study" className="flex flex-col gap-3">
                    <div className={imageSlot} />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm leading-snug">{item.title}</h3>
                      {/* Below lg (phones, tablets) there's no cursor label, so the card
                          says "View" itself; on large screens the cursor does. */}
                      <div className={cn(mono, "text-muted-foreground flex items-baseline justify-between gap-4")}>
                        <p>{item.company}</p>
                        <p className="flex shrink-0 items-center gap-1.5 lg:hidden">
                          View <Marker />
                        </p>
                      </div>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </section>

          <section aria-labelledby="blog" className="flex flex-col gap-5">
            <Reveal className="flex items-baseline justify-between gap-4">
              <SectionHeading id="blog" label="Blog" count={writing.length} />
              <Link
                href="/blog"
                className={cn(
                  mono,
                  "group text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
                )}
              >
                More posts <Marker />
              </Link>
            </Reveal>
            <RevealGroup as="ul" className="border-foreground/50 border-t-[0.5px]">
              {writing
                .toSorted((a, b) => b.date.localeCompare(a.date))
                .map((post) => (
                  <RevealItem as="li" key={post.href} className="border-foreground/50 border-b-[0.5px]">
                    <Link
                      href={post.href}
                      data-cursor-text="Read"
                      className="group focus-visible:ring-ring -mx-3 grid gap-1 rounded-lg px-3 py-3 focus-visible:ring-2 focus-visible:outline-none sm:grid-cols-[9rem_1fr] sm:items-baseline sm:gap-6"
                    >
                      <time dateTime={post.date} className={cn(mono, "text-muted-foreground")}>
                        {formatDay(post.date)}
                      </time>
                      <p className="group-hover:text-muted-foreground transition-colors">{post.title}</p>
                    </Link>
                  </RevealItem>
                ))}
            </RevealGroup>
          </section>

          <section aria-labelledby="other-work" className="flex flex-col gap-5">
            <Reveal>
              <SectionHeading id="other-work" label="Other work" count={otherWork.length} />
            </Reveal>
            <RevealGroup as="ul" className={cn(cardGrid, "gap-y-8")}>
              {otherWork.map((title, i) => (
                <RevealItem as="li" key={i} className="flex flex-col gap-3">
                  <div className={imageSlot} />
                  <h3 className="text-sm leading-snug">{title}</h3>
                </RevealItem>
              ))}
            </RevealGroup>
          </section>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
