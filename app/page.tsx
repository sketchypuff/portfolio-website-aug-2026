import Link from "next/link";
import { Container } from "@/components/container";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { CopyEmail } from "@/components/copy-email";
import { NoidaTime } from "@/components/noida-time";
import { Oneko } from "@/components/oneko";
import { ProfessionPill } from "@/components/profession-pill";
import { ThemeTextToggle } from "@/components/theme-toggle";
import { TextLink } from "@/components/text-link";
import { ContentsSpread, Leader, type Chapter } from "@/components/book/contents-spread";
import { PartHeading } from "@/components/book/part-heading";
import type { Wash } from "@/components/book/plate";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Hardcoded from the Figma "Home" frame until these have real entries in
// content/. Chapters are not linked yet for the same reason; a writing row
// links once its post exists.
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

// A contents page dates its pieces the long way: "20 July 2025".
const longDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const quietLink = "hover:text-link transition-colors";

export default function HomePage() {
  // The page is prerendered, so this is the deploy date.
  const lastUpdated = new Date();

  const titlePage = (
    <header className="flex flex-col items-center gap-8 text-center">
      <p className="caps text-muted-foreground text-sm">A portfolio in chapters</p>
      <div className="flex flex-col items-center gap-1 text-[1.875rem] leading-tight">
        <h1>Hi! I’m Yash, your neighbourhood</h1>
        <ProfessionPill />
      </div>
      {/* The epigraph: the one belief the whole book argues for. */}
      <p className="max-w-[26rem] text-lg leading-relaxed italic text-pretty">
        “All software should be opinionated and delightful to use in order to be called usable.”
      </p>
      <p className="caps text-muted-foreground text-sm">for Nana, who dropped in</p>
      <div className="mt-4 max-w-[34rem] space-y-[1lh] text-left text-lg leading-relaxed">
        <p className="first-letter:text-rubric first-letter:float-left first-letter:mt-2 first-letter:mr-2.5 first-letter:text-[3.6rem] first-letter:leading-[0.75] first-letter:font-normal">
          Currently, I make agentic AI experiences feel <em>oh yeah!</em> at Microsoft. Previously,
          I’ve worked at Adobe, Postman and Samsung. I was trained as an industrial designer, I
          design on paper before I design in Figma, and I paint landscapes wet and loose. Each
          chapter that follows opens on one of those paintings.
        </p>
      </div>
    </header>
  );

  const after = (
    <>
      <section aria-label="Other work" className="flex flex-col gap-6">
        <PartHeading part="Part Two" title="Other work" />
        <ul role="list">
          {otherWork.map((item, i) => (
            <li
              key={i}
              className={cn(
                "border-border grid grid-cols-[3rem_1fr] border-b py-3 text-lg leading-snug",
                item.muted && "text-muted-foreground",
              )}
            >
              <span className="text-muted-foreground figures">{i + 1}</span>
              <span className="text-pretty">{item.title}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Writing" className="flex flex-col gap-6">
        <PartHeading part="Part Three" title="Writing" />
        <ul role="list">
          {writing.toSorted((a, b) => b.date.localeCompare(a.date)).map((post) => {
            const row = (
              <>
                <span className="text-lg leading-snug text-pretty">{post.title}</span>
                <span className="hidden flex-1 self-stretch sm:flex sm:items-baseline">
                  <Leader />
                </span>
                <time dateTime={post.date} className="text-muted-foreground figures shrink-0 text-sm italic">
                  {longDate.format(new Date(post.date))}
                </time>
              </>
            );
            const rowClass = "flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-3";
            return (
              <li key={post.title} className="border-border border-b">
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
              </li>
            );
          })}
        </ul>
        <p className="text-center">
          <TextLink href="/blog">Read the whole shelf</TextLink>
        </p>
      </section>
    </>
  );

  return (
    <div className="@container overflow-x-clip">
      <Oneko />
      <Container size="wide" className="flex flex-col gap-16 pt-8 pb-20 text-base leading-snug">
        {/* The running head, as at the top of every printed page. */}
        <header className="border-rule caps flex flex-col gap-3 border-b pb-3 text-sm sm:flex-row sm:items-baseline sm:justify-between">
          <p>
            Yash Shenai <span className="text-muted-foreground">· Product designer</span>
          </p>
          <nav aria-label="Main" className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <TextLink href={site.resume} icon={ArrowUpRightIcon}>
              Résumé
            </TextLink>
            <TextLink href="/about">About the author</TextLink>
            <ThemeTextToggle />
          </nav>
        </header>

        <ContentsSpread
          frontispiece={frontispiece}
          chapters={selectedWork}
          titlePage={titlePage}
          after={after}
        />

        {/* The colophon: how the book was made, then where to find its author. */}
        <footer className="border-rule mx-auto mt-8 flex w-full max-w-xl flex-col items-center gap-6 border-t pt-12 text-center">
          <span aria-hidden className="text-rubric text-2xl">
            ❦
          </span>
          <h2 className="caps text-base">Colophon</h2>
          <p className="text-muted-foreground text-base leading-relaxed italic text-pretty">
            Set in Newsreader, in roman, italic and small capitals, and nothing else. Designed on
            paper with a Pilot Metropolitan, then in Figma, and bound with Next.js. The frontispieces
            will be painted in watercolour by the author; until then each plate is marked as a
            placeholder under its tissue.
          </p>
          <div className="mt-4 grid w-full gap-8 text-left sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <p className="caps text-muted-foreground text-sm">Correspondence</p>
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
                    Résumé
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <p className="caps text-muted-foreground text-sm">This edition</p>
              <time dateTime={lastUpdated.toISOString().slice(0, 10)} className="figures">
                {longDate.format(lastUpdated)}
              </time>
            </div>
            <div className="flex flex-col gap-2 sm:items-end sm:text-right">
              <p className="caps text-muted-foreground text-sm">The author, now</p>
              <NoidaTime />
            </div>
          </div>
        </footer>
      </Container>
    </div>
  );
}
