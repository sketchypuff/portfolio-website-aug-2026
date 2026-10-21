import Link from "next/link";
import { Container } from "@/components/container";
import { ArrowUpRightIcon, SmileyXEyesIcon } from "@phosphor-icons/react/ssr";
import { CopyEmail } from "@/components/copy-email";
import { NoidaTime } from "@/components/noida-time";
import { Oneko } from "@/components/oneko";
import { ProfessionPill } from "@/components/profession-pill";
import { ThemeTextToggle } from "@/components/theme-toggle";
import { TextLink } from "@/components/text-link";
import { ContentsSpread, Leader, type Chapter } from "@/components/book/contents-spread";
import { PartHeading } from "@/components/book/part-heading";
import type { Wash } from "@/components/book/plate";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Hardcoded from the Figma "Home" frame until these have real entries in
// content/. Cards are not linked yet for the same reason; a writing row links
// once its post exists.
// Each chapter's `wash` drives its PLACEHOLDER frontispiece until Yash paints it.
const selectedWork: Chapter[] = [
  {
    numeral: "I",
    company: "Microsoft",
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
    wash: { sky: "cerulean", hills: "indigo", ground: "ochre", seed: 3 },
  },
  {
    numeral: "II",
    company: "Adobe",
    title: "Optimised image masking with a refined selection experience",
    wash: { sky: "ochre", hills: "sienna", ground: "sepia", seed: 11 },
  },
  {
    numeral: "III",
    company: "Adobe",
    title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
    wash: { sky: "cerulean", hills: "sap", ground: "sienna", seed: 7 },
  },
  {
    numeral: "IV",
    company: "Postman",
    title: "Reduced time taken by developers in discovering new content and finding team resources",
    wash: { sky: "ochre", hills: "indigo", ground: "sap", seed: 19 },
  },
];

const frontispiece: Wash = { sky: "cerulean", hills: "sap", ground: "ochre", seed: 5 };

// `muted` mirrors the design: the first three titles are dimmed, the last two are not.
const otherWork = [
  {
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
    muted: true,
  },
  { title: "Optimised image masking with a refined selection experience", muted: true },
  { title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature", muted: true },
  { title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature", muted: false },
  {
    title: "Reduced time taken by developers in discovering new content and finding team resources",
    muted: false,
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

const quietLink = "hover:text-muted-foreground transition-colors";

export default function HomePage() {
  // The page is prerendered, so this is the deploy date.
  const lastUpdated = new Date();

  const titlePage = (
    <Reveal as="header" className="flex flex-col gap-6">
      <p className="text-muted-foreground font-mono text-xs uppercase">A portfolio in chapters</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="font-serif text-[1.75rem] leading-tight font-normal">
          Hi! I’m Yash, your neighbourhood
        </h1>
        <ProfessionPill />
      </div>
      <div className="max-w-[34rem] space-y-[1lh] font-serif text-lg leading-relaxed font-normal">
        <p className="first-letter:text-rubric first-letter:float-left first-letter:mt-1.5 first-letter:mr-2 first-letter:text-[3.4rem] first-letter:leading-[0.8]">
          Currently, I make agentic AI experiences feel <em>oh yeah!</em> at Microsoft. Previously,
          I’ve worked at Adobe, Postman and Samsung.
        </p>
        <p className="text-muted-foreground">
          I believe all software should be opinionated and delightful to use in order to be
          called usable.
        </p>
      </div>
    </Reveal>
  );

  const after = (
    <>
      <section aria-label="Other work" className="flex flex-col gap-4">
        <PartHeading part="Part Two" title="Other work" />
        <RevealGroup as="ul">
          {otherWork.map((item, i) => (
            <RevealItem
              as="li"
              key={i}
              className={cn(
                "border-border border-b py-3 font-serif text-base font-normal",
                item.muted && "text-muted-foreground",
              )}
            >
              {item.title}
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section aria-label="Writing" className="flex flex-col gap-4">
        <PartHeading part="Part Three" title="Writing" />
        <RevealGroup as="ul">
          {writing.toSorted((a, b) => b.date.localeCompare(a.date)).map((post) => {
            const row = (
              <>
                <span className="font-serif text-base font-normal text-pretty">{post.title}</span>
                <span className="hidden flex-1 self-stretch sm:flex sm:items-baseline">
                  <Leader />
                </span>
                <time
                  dateTime={post.date}
                  className="text-muted-foreground shrink-0 font-mono text-xs uppercase"
                >
                  {formatDay(new Date(post.date))}
                </time>
              </>
            );
            const rowClass = "flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-3";
            return (
              <RevealItem as="li" key={post.title} className="border-border border-b">
                {post.href ? (
                  <Link
                    href={post.href}
                    className={cn(
                      rowClass,
                      quietLink,
                      "focus-visible:ring-ring -mx-3 rounded-sm px-3 focus-visible:ring-2 focus-visible:outline-none",
                    )}
                  >
                    {row}
                  </Link>
                ) : (
                  <div className={rowClass}>{row}</div>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
        <div>
          <TextLink href="/blog" icon={ArrowUpRightIcon}>
            Open blog
          </TextLink>
        </div>
      </section>
    </>
  );

  return (
    <div className="@container overflow-x-clip">
      <Oneko />
      <Container size="wide" className="flex flex-col gap-14 pt-8 pb-16 text-base leading-snug font-medium">
        {/* Running head, as at the top of a printed page. */}
        <Reveal
          as="header"
          className="border-border flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="font-mono text-xs uppercase">
            Yash Shenai <span className="text-muted-foreground">· Product designer</span>
          </p>
          <nav aria-label="Main" className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <TextLink href={site.resume} icon={ArrowUpRightIcon}>
              Open resumé
            </TextLink>
            <TextLink href="/about" icon={SmileyXEyesIcon}>
              About
            </TextLink>
            <ThemeTextToggle />
          </nav>
        </Reveal>

        <ContentsSpread
          frontispiece={frontispiece}
          chapters={selectedWork}
          titlePage={titlePage}
          after={after}
        />

        {/* The colophon: how the book was made, then where to find its author. */}
        <Reveal as="footer" className="border-border mx-auto flex w-full max-w-xl flex-col items-center gap-8 border-t pt-12 text-center">
          <span aria-hidden className="text-rubric font-serif text-2xl">
            ❦
          </span>
          <h2 className="font-serif text-sm uppercase tracking-[0.2em]">Colophon</h2>
          <p className="text-muted-foreground font-serif text-base leading-relaxed font-normal italic text-pretty">
            Set in Newsreader and Geist Mono. Designed on paper with a Pilot Metropolitan, then in
            Figma, and built with Next.js. The frontispieces will be painted in watercolour by the
            author; until then, each plate is marked as a placeholder.
          </p>
          <div className="grid w-full gap-8 text-left sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground font-mono text-xs uppercase">Contact</p>
              <ul role="list">
                <li>
                  <CopyEmail />
                </li>
                <li>
                  {site.social.linkedin ? (
                    <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className={quietLink}>
                      LinkedIn
                    </a>
                  ) : (
                    "LinkedIn"
                  )}
                </li>
                <li>
                  <a href={site.resume} target="_blank" rel="noopener noreferrer" className={quietLink}>
                    Resumé
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground font-mono text-xs uppercase">This edition</p>
              <time dateTime={lastUpdated.toISOString().slice(0, 10)}>{formatDay(lastUpdated)}</time>
            </div>
            <div className="flex flex-col gap-2 sm:items-end sm:text-right">
              <p className="text-muted-foreground font-mono text-xs uppercase">Currently</p>
              <NoidaTime />
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
