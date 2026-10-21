"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { play } from "cuelume";
import { useReducedMotion } from "motion/react";
import { Dab, type Pigment } from "@/components/wash";
import { cn } from "@/lib/utils";

/** Width of one stepper button (the hit area); the tick sits in its centre. */
const STEP = 40;

/**
 * Horizontal strip of cards under a heading row: the section heading on the
 * left, a tick stepper on the right. The strip spans the
 * full viewport so cards flow off both edges while scrolling, but padding and
 * scroll-padding equal to the page gutter keep the first card (and every snap
 * point) aligned to the column.
 *
 * The gutter is computed in `cqw` against the page wrapper rather than `vw`,
 * so it excludes the scrollbar. 875px is the `home` Container width; the
 * 1.5rem / 2rem minimums are its px-6 / sm:px-8 padding.
 *
 * `heading` is the section's `SectionLabel`; `name` labels the stepper group; `labels` names each card for its
 * screen-reader text, in order. `swatches` (one pigment per card) turns the
 * stepper ticks into dabs of each card's paint, like the test swatches in a
 * sketchbook margin. `dimOnHover` fades every card but the hovered one
 * (hovering devices only).
 *
 * Nothing here animates on scroll or load: in the sketchbook, motion is
 * hover and press only.
 *
 * Needs an `@container` ancestor spanning the viewport (with `overflow-x-clip`)
 * — the home page wrapper is one.
 */
export function WorkStrip({
  heading,
  name,
  labels,
  swatches,
  dimOnHover = false,
  children,
}: {
  heading: React.ReactNode;
  name: string;
  labels: string[];
  swatches?: Pigment[];
  dimOnHover?: boolean;
  children: React.ReactNode;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  // Mirrors `active` so the scroll handler can tell when the card changes.
  const activeRef = useRef(0);
  // Set while a stepper click's scroll is in flight: the clicked tick is
  // selected at once, and scroll position is ignored until the strip settles,
  // so the pill doesn't trail the scroll through the cards in between.
  const settling = useRef<ReturnType<typeof setTimeout>>(null);
  const reduced = useReducedMotion();

  const select = useCallback((i: number, sound: boolean) => {
    if (i === activeRef.current) return;
    activeRef.current = i;
    setActive(i);
    if (sound) play("tick");
  }, []);

  // Card i is "current" when its snap point is the nearest one to the scroll
  // position. The last cards can't reach the snap edge on wide screens, so the
  // end of the scroll always selects the last card. A user scroll that
  // changes the card ticks, like pressing a stepper tick does.
  const sync = useCallback(
    (sound = false) => {
      const list = listRef.current;
      if (!list) return;
      const items = Array.from(list.children) as HTMLElement[];
      if (!items.length) return;
      const base = items[0].offsetLeft;
      const x = list.scrollLeft;
      if (x >= list.scrollWidth - list.clientWidth - 1) return select(items.length - 1, sound);
      let nearest = 0;
      items.forEach((item, i) => {
        if (Math.abs(item.offsetLeft - base - x) < Math.abs(items[nearest].offsetLeft - base - x)) nearest = i;
      });
      select(nearest, sound);
    },
    [select],
  );

  // Re-armed on every scroll event, so it fires once the strip stops moving.
  // A timer rather than `scrollend`, which older Safari lacks.
  const settle = useCallback(() => {
    if (settling.current) clearTimeout(settling.current);
    settling.current = setTimeout(() => {
      settling.current = null;
      sync();
    }, 120);
  }, [sync]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const onScroll = () => (settling.current ? settle() : sync(true));
    const onResize = () => sync();
    list.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      list.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (settling.current) clearTimeout(settling.current);
    };
  }, [sync, settle]);

  function goTo(i: number) {
    const list = listRef.current;
    const items = Array.from(list?.children ?? []) as HTMLElement[];
    if (!list || !items[i]) return;
    // Silent: the press already ticked, on pointer down.
    select(i, false);
    settle();
    list.scrollTo({ left: items[i].offsetLeft - items[0].offsetLeft, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        {heading}
        {/* -mr-[7px] puts the pill's right edge, not the button's, on the column edge. */}
        <div role="group" aria-label={name} className="relative -mr-[7px]">
          <span
            aria-hidden
            className="bg-muted absolute top-1/2 left-[7px] h-7 w-[26px] rounded-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ transform: `translate(${active * STEP}px, -50%)` }}
          />
          <ul role="list" className="relative flex items-center">
            {labels.map((label, i) => (
              <li key={i}>
                <button
                  type="button"
                  aria-current={i === active ? "true" : undefined}
                  // Cuelume's synthesized "tick", on pointer down like rithvika.work.
                  onPointerDown={() => play("tick")}
                  onClick={() => goTo(i)}
                  style={{ width: STEP }}
                  className="group focus-visible:ring-ring flex h-8 cursor-pointer items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="sr-only">{label}</span>
                  {swatches?.[i] ? (
                    <Dab
                      pigment={swatches[i]}
                      className={cn(
                        "transition-[scale,opacity] duration-300 motion-reduce:transition-none",
                        i === active ? "scale-125" : "opacity-55 group-hover:opacity-100 dark:opacity-80",
                      )}
                    />
                  ) : (
                    <span
                      aria-hidden
                      className={cn(
                        "w-0.5 rounded-full transition-[height,background-color] duration-300 motion-reduce:transition-none",
                        i === active ? "bg-foreground h-3.5" : "bg-muted-foreground group-hover:bg-foreground h-3",
                      )}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ul
        role="list"
        ref={listRef}
        className={cn(
          "mx-[calc(50%-50cqw)] flex snap-x snap-mandatory scroll-px-(--gutter) gap-6 overflow-x-auto px-(--gutter) [--gutter:max(1.5rem,calc((100cqw-875px)/2))] [scrollbar-width:none] sm:[--gutter:max(2rem,calc((100cqw-875px)/2))] [&::-webkit-scrollbar]:hidden",
          // Keyed on a hovered <li>, not the <ul>, so the gaps between cards
          // don't dim everything. Dimming is immediate (delay-0); un-dimming
          // waits 100ms (WorkCard's base delay), so crossing a gap to the next
          // card doesn't flash every card back to full.
          dimOnHover &&
            "[@media(hover:hover)]:[&:has(>li:hover)>li:not(:hover)>*]:opacity-50 [@media(hover:hover)]:[&:has(>li:hover)>li:not(:hover)>*]:delay-0",
        )}
      >
        {children}
      </ul>
    </div>
  );
}

/**
 * One card in a strip: a painting on its sheet of paper, with the text below.
 * `art` is the painting (a `Wash` placeholder until Yash's scans exist); it
 * sits on a `plate` — paper that stays lit in dark mode, because transparent
 * paint takes its light from the paper and goes muddy on a dark page.
 * `plate` cards are 570px (selected work), `study` cards 380px (other work).
 * The sheet's bottom margin carries pencil-style notes in mono: `note` on the
 * left (the `PlaceholderTag` for now), `number` on the right.
 *
 * The inner wrapper is what `WorkStrip dimOnHover` fades. Hovering the card
 * lets the wash spread a little inside its sheet (1.02, the house image zoom).
 */
export function WorkCard({
  art,
  size = "plate",
  note,
  number,
  children,
}: {
  art: React.ReactNode;
  size?: "plate" | "study";
  note?: React.ReactNode;
  number?: string;
  children: React.ReactNode;
}) {
  return (
    <li
      className={cn(
        "group/card max-w-[85vw] shrink-0 snap-start",
        size === "plate" ? "w-[570px]" : "w-[380px]",
      )}
    >
      <div className="transition-opacity delay-100 duration-200 ease-out group-hover/card:delay-0 motion-reduce:transition-none">
        <div className="bg-plate ring-foreground/5 relative rounded-[3px] p-2.5 pb-8 shadow-xs ring-1">
          <div className="aspect-[4/3] overflow-hidden">
            <div className="size-full transition-transform duration-500 ease-out will-change-transform group-hover/card:scale-[1.02] motion-reduce:transition-none">
              {art}
            </div>
          </div>
          <div className="text-plate-foreground absolute inset-x-3 bottom-2 flex justify-between gap-4 font-mono text-xs uppercase">
            <span>{note}</span>
            <span>{number}</span>
          </div>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </li>
  );
}
