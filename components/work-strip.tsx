"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { play } from "cuelume";
import { useReducedMotion } from "motion/react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
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
 * screen-reader text, in order.
 *
 * Needs an `@container` ancestor spanning the viewport (with `overflow-x-clip`)
 * — the home page wrapper is one.
 */
export function WorkStrip({
  heading,
  name,
  labels,
  children,
}: {
  heading: React.ReactNode;
  name: string;
  labels: string[];
  children: React.ReactNode;
}) {
  // Typed as a div because RevealGroup models its props on the div variant
  // (see reveal.tsx); it is the <ul>, and only scroll APIs are used on it.
  const listRef = useRef<HTMLDivElement>(null);
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
      <Reveal className="flex items-center justify-between gap-4">
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
                  className="group focus-visible:ring-ring flex h-8 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="sr-only">{label}</span>
                  <span
                    aria-hidden
                    className={cn(
                      "w-0.5 rounded-full transition-[height,background-color] duration-300 motion-reduce:transition-none",
                      i === active ? "bg-foreground h-3.5" : "bg-muted-foreground group-hover:bg-foreground h-3",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <RevealGroup as="ul" ref={listRef} className="mx-[calc(50%-50cqw)] flex snap-x snap-mandatory scroll-px-(--gutter) gap-6 overflow-x-auto px-(--gutter) [--gutter:max(1.5rem,calc((100cqw-875px)/2))] [scrollbar-width:none] sm:[--gutter:max(2rem,calc((100cqw-875px)/2))] [&::-webkit-scrollbar]:hidden">
        {children}
      </RevealGroup>
    </div>
  );
}

/** One 570px card: a 4:3 image slot with its text below. */
export function WorkCard({ children }: { children: React.ReactNode }) {
  return (
    <RevealItem as="li" className="w-[570px] max-w-[85vw] shrink-0 snap-start">
      <div className="bg-muted aspect-[4/3] rounded-xl" />
      <div className="mt-5">{children}</div>
    </RevealItem>
  );
}
