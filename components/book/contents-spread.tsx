"use client";

import { useState } from "react";
import { Plate, PlaceholderWash, type Wash } from "@/components/book/plate";
import { PartHeading } from "@/components/book/part-heading";
import { cn } from "@/lib/utils";

export type Chapter = { numeral: string; company: string; title: string; wash: Wash };

/**
 * The home page as an open book. The verso (left page) holds the
 * frontispiece under its tissue guard; the recto (right page) is the title
 * page and contents. Hovering a chapter lifts the tissue and turns the plate
 * to that chapter's painting, a quiet crossfade that is instant under
 * reduced motion. Off a chapter, the tissue settles back over the
 * frontispiece.
 *
 * Below `lg` there is no facing page: the frontispiece sits above the title
 * and each chapter carries its own plate inline, so nothing depends on hover.
 *
 * `titlePage` and `after` are server-rendered and slotted into the recto.
 */
export function ContentsSpread({
  frontispiece,
  chapters,
  titlePage,
  after,
}: {
  frontispiece: Wash;
  chapters: Chapter[];
  titlePage: React.ReactNode;
  after: React.ReactNode;
}) {
  const [active, setActive] = useState<number | null>(null);
  const plates = [
    { id: "frontispiece", wash: frontispiece, numeral: "Frontispiece", caption: "A landscape, wet into wet" },
    ...chapters.map((c, i) => ({
      id: `chapter-${i}`,
      wash: c.wash,
      numeral: `Plate ${c.numeral}`,
      caption: c.company,
    })),
  ];
  const shown = active === null ? 0 : active + 1;

  return (
    <div className="grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
      {/* The verso. Decorative: every caption repeats a chapter already in the contents. */}
      <div aria-hidden className="relative hidden lg:block">
        {/* The gutter, where the two pages meet. */}
        <span className="bg-rule absolute inset-y-0 -right-10 w-px" />
        <div className="sticky top-10 flex flex-col gap-10">
          <div className="grid">
            {plates.map((plate, i) => (
              <Plate
                key={plate.id}
                {...plate}
                guarded
                lifted={active !== null}
                className={cn(
                  "[grid-area:1/1] transition-opacity duration-300 ease-out motion-reduce:transition-none",
                  i === shown ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
          {/* A book's "list of plates": every frontispiece at once, so the paintings
              are never only a hover away. The current one is ringed in rubric. */}
          <div className="flex flex-col gap-3">
            <p className="caps text-muted-foreground text-sm">List of plates</p>
            <ol className="grid grid-cols-4 gap-3">
              {chapters.map((chapter, i) => (
                <li
                  key={chapter.numeral}
                  onPointerEnter={() => setActive(i)}
                  onPointerLeave={() => setActive(null)}
                  className="flex flex-col gap-1.5"
                >
                  <div
                    className={cn(
                      "bg-paper rounded-sm p-1.5 ring-1 transition-shadow duration-200 ease-out motion-reduce:transition-none",
                      active === i ? "ring-rubric" : "ring-foreground/10",
                    )}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <PlaceholderWash id={`mini-${i}`} wash={chapter.wash} />
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-center text-sm transition-colors",
                      active === i ? "text-rubric" : "text-muted-foreground",
                    )}
                  >
                    {chapter.numeral}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-16">
        <Plate {...plates[0]} shape="landscape" className="lg:hidden" />
        {titlePage}

        <section aria-labelledby="contents" className="flex flex-col gap-8">
          <h2 id="contents" className="caps text-center text-base">
            Contents
          </h2>
          <PartHeading part="Part One" title="Selected work" />
          <ol
            role="list"
            className="[@media(hover:hover)]:[&:has(>li:hover)>li:not(:hover)>*]:opacity-50 [@media(hover:hover)]:[&:has(>li:hover)>li:not(:hover)>*]:delay-0"
          >
            {chapters.map((chapter, i) => (
              <li
                key={chapter.numeral}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
              >
                <div className="border-border border-b py-5 transition-opacity delay-100 duration-200 ease-out motion-reduce:transition-none">
                  <Plate
                    id={`chapter-${i}-inline`}
                    wash={chapter.wash}
                    numeral={`Plate ${chapter.numeral}`}
                    caption={chapter.company}
                    shape="landscape"
                    className="mb-5 lg:hidden"
                  />
                  <div className="grid grid-cols-[3rem_1fr] gap-y-2">
                    <span className="text-rubric text-xl leading-snug">{chapter.numeral}</span>
                    <p className="text-xl leading-snug text-pretty">{chapter.title}</p>
                    <span />
                    <p className="caps text-muted-foreground flex items-baseline gap-3 text-sm">
                      <span>{chapter.company}</span>
                      <Leader />
                      <span className="italic normal-case tracking-normal">in draft</span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {after}
      </div>
    </div>
  );
}

/** A dotted leader, the row of dots a contents page runs from a title to its folio. */
export function Leader() {
  return <span aria-hidden className="border-muted-foreground/60 min-w-6 flex-1 border-b border-dotted" />;
}
