"use client";

import { useState } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { CopyEmail } from "@/components/copy-email";
import { NoidaTime } from "@/components/noida-time";
import { ProfessionPill } from "@/components/profession-pill";
import { ThemeTextToggle } from "@/components/theme-toggle";
import { TextLink } from "@/components/text-link";
import { Leader } from "@/components/book/contents-spread";
import { PartHeading } from "@/components/book/part-heading";
import { Plate, PlaceholderWash, type Wash } from "@/components/book/plate";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export type Chapter = { numeral: string; company: string; title: string; wash: Wash };
export type Post = { date: string; title: string; href?: string };
export type OtherWork = { title: string; muted: boolean };

const BOOK_TITLE = "A portfolio in chapters";

// A contents page dates its pieces the long way: "20 July 2025".
const longDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * One opening of the book: the boards, the page block with its fore-edge,
 * and two pages. Below `lg` the two pages stack, verso first, each still a
 * full page with its running head and folio.
 */
function Spread({ verso, recto }: { verso: React.ReactNode; recto: React.ReactNode }) {
  return (
    <section className="bg-cloth shadow-book mx-auto w-full max-w-[1180px] rounded-[3px] p-2.5 sm:p-3">
      <div className="fore-edge bg-paper grid lg:grid-cols-2">
        {verso}
        {recto}
      </div>
    </section>
  );
}

/**
 * A page. The inner margin (towards the gutter) is narrower than the outer,
 * as in any well-set book, the running head sits at the top outer corner and
 * the folio at the bottom outer corner. The gutter is shaded where the page
 * curves into the binding.
 */
function Page({
  side,
  head,
  folio,
  className,
  children,
}: {
  side: "verso" | "recto";
  head: React.ReactNode;
  folio: string;
  className?: string;
  children: React.ReactNode;
}) {
  const verso = side === "verso";
  return (
    <div
      className={cn(
        "relative flex flex-col px-7 py-8 sm:px-10 sm:py-10 lg:min-h-[46rem] lg:py-12",
        verso ? "border-border border-b lg:border-b-0 lg:pr-10 lg:pl-14" : "lg:pr-14 lg:pl-10",
        "lg:after:pointer-events-none lg:after:absolute lg:after:inset-y-0 lg:after:w-14 lg:after:to-transparent",
        verso
          ? "lg:after:right-0 lg:after:bg-gradient-to-l lg:after:from-black/[0.09]"
          : "lg:after:left-0 lg:after:bg-gradient-to-r lg:after:from-black/[0.11]",
      )}
    >
      <header className={cn("caps text-muted-foreground mb-8 text-sm", verso ? "text-left" : "text-right")}>{head}</header>
      <div className={cn("flex flex-1 flex-col", className)}>{children}</div>
      <footer className={cn("caps text-muted-foreground figures mt-10 text-sm", verso ? "text-left" : "text-right")}>
        {folio}
      </footer>
    </div>
  );
}

/**
 * The book's front matter on the table: frontispiece and title page,
 * epigraph and preface, contents, list of plates and colophon. Hovering a
 * chapter in the contents rings its plate in the list of plates (and the
 * other way round); the frontispiece lifts its own tissue on hover.
 */
export function Book({
  frontispiece,
  chapters,
  otherWork,
  writing,
  lastUpdated,
}: {
  frontispiece: Wash;
  chapters: Chapter[];
  otherWork: OtherWork[];
  writing: Post[];
  lastUpdated: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const posts = writing.toSorted((a, b) => b.date.localeCompare(a.date));
  const edition = new Date(lastUpdated);

  return (
    <div className="flex flex-col gap-8 sm:gap-10 lg:gap-14">
      <Spread
        verso={
          <Page side="verso" head={BOOK_TITLE} folio="ii" className="justify-center">
            <Plate
              id="frontispiece"
              wash={frontispiece}
              numeral="Frontispiece"
              caption="A landscape, wet into wet"
              guarded
              className="mx-auto w-full max-w-[21rem]"
            />
          </Page>
        }
        recto={
          <Page side="recto" head="Title page" folio="iii" className="items-center justify-between text-center">
            <p className="caps text-base">Yash Shenai</p>
            <div className="flex flex-col items-center gap-8 py-10">
              <h1 className="flex flex-col items-center gap-1 text-[1.875rem] leading-tight sm:text-[2.125rem]">
                <span>Hi! I’m Yash,</span>
                <span>your neighbourhood</span>
                <ProfessionPill />
              </h1>
              <span aria-hidden className="text-rubric text-2xl">
                ❧
              </span>
              <p className="text-lg italic">{BOOK_TITLE}</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="caps text-muted-foreground text-sm">Noida · MMXXVI</p>
              <nav aria-label="Main" className="caps flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1 text-sm">
                <TextLink href={site.resume} icon={ArrowUpRightIcon}>
                  Résumé
                </TextLink>
                <TextLink href="/about">About the author</TextLink>
                <ThemeTextToggle />
              </nav>
            </div>
          </Page>
        }
      />

      <Spread
        verso={
          <Page side="verso" head={BOOK_TITLE} folio="iv" className="gap-14">
            <div className="flex flex-col items-center gap-5 pt-6 text-center">
              <p className="max-w-[24rem] text-lg leading-relaxed italic text-pretty">
                “All software should be opinionated and delightful to use in order to be called
                usable.”
              </p>
              <p className="caps text-muted-foreground text-sm">for Nana, who dropped in</p>
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="caps text-center text-base">Preface</h2>
              <div className="book-text space-y-[0.85lh] text-[1.0625rem] leading-relaxed">
                <p className="first-letter:text-rubric first-letter:float-left first-letter:mt-[0.1em] first-letter:mr-2.5 first-letter:text-[3.4rem] first-letter:leading-[0.78]">
                  Currently, I make agentic AI experiences feel <em>oh yeah!</em> at Microsoft.
                  Previously, I’ve worked at Adobe, Postman and Samsung. I trained as an industrial
                  designer at NID before moving to product design, and I still begin on paper, with
                  a fountain pen, before anything reaches Figma.
                </p>
                <p>
                  Each chapter that follows is a piece of work told as a story, and each opens on a
                  landscape painted in watercolour. The paintings are being made; until they are,
                  every plate in this edition says so.
                </p>
              </div>
            </div>
          </Page>
        }
        recto={
          <Page side="recto" head="Contents" folio="v" className="gap-10">
            <h2 className="caps text-center text-base">Contents</h2>
            <div className="flex flex-col gap-5">
              <PartHeading part="Part One" title="Selected work" />
              <ol role="list" onPointerLeave={() => setActive(null)}>
                {chapters.map((chapter, i) => (
                  <li
                    key={chapter.numeral}
                    onPointerEnter={() => setActive(i)}
                    className="border-border grid grid-cols-[2.5rem_1fr] gap-y-1.5 border-b py-4 first:pt-1"
                  >
                    <span className="text-rubric text-xl leading-snug">{chapter.numeral}</span>
                    <p className="text-[1.1875rem] leading-snug text-pretty">{chapter.title}</p>
                    <span />
                    <p className="caps text-muted-foreground flex items-baseline gap-3 text-sm">
                      <span>{chapter.company}</span>
                      <span
                        aria-hidden
                        className={cn(
                          "min-w-6 flex-1 self-end border-b transition-colors",
                          active === i ? "border-rubric border-solid" : "border-muted-foreground/60 border-dotted",
                        )}
                      />
                      <span className="italic normal-case tracking-normal">in draft</span>
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-5">
              <PartHeading part="Part Two" title="Other work" />
              <ol role="list">
                {otherWork.map((item, i) => (
                  <li
                    key={i}
                    className={cn(
                      "border-border grid grid-cols-[2.5rem_1fr] border-b py-2.5 text-base leading-snug first:pt-0",
                      item.muted && "text-muted-foreground",
                    )}
                  >
                    <span className="text-muted-foreground figures">{i + 1}</span>
                    <span className="text-pretty">{item.title}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Page>
        }
      />

      <Spread
        verso={
          <Page side="verso" head={BOOK_TITLE} folio="vi" className="gap-6">
            <PartHeading part="Part Three" title="Writing" />
            <ul role="list">
              {posts.map((post) => {
                const row = (
                  <>
                    <span className="text-[1.0625rem] leading-snug text-pretty">{post.title}</span>
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
                          "hover:text-link focus-visible:ring-ring -mx-2 rounded-sm px-2 transition-colors focus-visible:ring-2 focus-visible:outline-none",
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
            <p className="mt-2 text-center">
              <TextLink href="/blog">Read the whole shelf</TextLink>
            </p>
          </Page>
        }
        recto={
          <Page side="recto" head="List of plates · Colophon" folio="vii" className="gap-12">
            <div className="flex flex-col gap-6">
              <h2 className="caps text-center text-base">List of plates</h2>
              <ol role="list" className="grid grid-cols-2 gap-x-6 gap-y-5" onPointerLeave={() => setActive(null)}>
                {chapters.map((chapter, i) => (
                  <li
                    key={chapter.numeral}
                    onPointerEnter={() => setActive(i)}
                    className="flex flex-col gap-2"
                  >
                    <div
                      className={cn(
                        "relative aspect-[4/3] overflow-hidden ring-1 transition-shadow duration-200 ease-out motion-reduce:transition-none",
                        active === i ? "ring-rubric" : "ring-foreground/15",
                      )}
                    >
                      <PlaceholderWash id={`list-${i}`} wash={chapter.wash} />
                    </div>
                    <p className="caps flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0 text-sm">
                      <span className={cn("transition-colors", active === i ? "text-rubric" : "text-foreground")}>
                        Plate {chapter.numeral}
                      </span>
                      <span className="text-muted-foreground">{chapter.company}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-auto flex flex-col items-center gap-5 text-center">
              <span aria-hidden className="text-rubric text-xl">
                ❦
              </span>
              <h2 className="caps text-base">Colophon</h2>
              <p className="text-muted-foreground max-w-[26rem] text-[0.9375rem] leading-relaxed italic text-pretty">
                Set in Newsreader, in roman, italic and small capitals, and nothing else. Designed on
                paper with a Pilot Metropolitan, then in Figma, and bound with Next.js. The plates
                will be painted by the author.
              </p>
              <div className="mt-2 grid w-full gap-6 text-left text-[0.9375rem] sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <p className="caps text-muted-foreground text-sm">Correspondence</p>
                  <ul role="list">
                    <li>
                      <CopyEmail />
                    </li>
                    <li>
                      <a
                        href={site.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-link transition-colors"
                      >
                        LinkedIn
                      </a>
                    </li>
                    <li>
                      <a href={site.resume} target="_blank" rel="noopener noreferrer" className="hover:text-link transition-colors">
                        Résumé
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="caps text-muted-foreground text-sm">This edition</p>
                  <time dateTime={lastUpdated.slice(0, 10)} className="figures">
                    {longDate.format(edition)}
                  </time>
                </div>
                <div className="flex flex-col gap-1.5 sm:items-end sm:text-right">
                  <p className="caps text-muted-foreground text-sm">The author, now</p>
                  <NoidaTime />
                </div>
              </div>
            </div>
          </Page>
        }
      />
    </div>
  );
}
