"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BooksIcon, PaintBrushIcon, PenNibIcon, RacquetIcon, ShapesIcon } from "@phosphor-icons/react";

// Order and copy from the Figma "profession pill" component set (node
// `1137:2706`), where each variant changes to the next on click.
const professions = [
  { label: "product designer", icon: ShapesIcon },
  { label: "watercolour artist", icon: PaintBrushIcon },
  { label: "badminton player", icon: RacquetIcon },
  { label: "poet", icon: PenNibIcon },
  { label: "book hoarder", icon: BooksIcon },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * The "product designer" pill in the home intro. Clicking cycles through the
 * other things Yash is.
 *
 * The outgoing label lifts away while the next one rises in, both with a
 * light blur so the swap reads as one morph rather than two separate fades.
 * The pill's width follows the new label on a zero-bounce spring, which stays
 * smooth when clicks interrupt a resize in progress. Under reduced motion the
 * label and width change instantly.
 */
export function ProfessionPill() {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const { label, icon: Icon } = professions[index];

  // Track the label's natural width. The exiting label is popped out of flow,
  // so this only ever measures the incoming one.
  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setWidth(el.offsetWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      type="button"
      onClick={() => setIndex((i) => (i + 1) % professions.length)}
      className="bg-background border-border inline-flex shrink-0 cursor-pointer items-center rounded-lg border px-2 py-1 shadow-xs transition-[scale] duration-150 ease-out select-none active:scale-[0.96] motion-reduce:transition-none"
    >
      <motion.span
        className="relative inline-flex overflow-hidden"
        // `auto` until measured, so the server render and first paint match.
        animate={{ width: width ?? "auto" }}
        initial={false}
        transition={reduced ? { duration: 0 } : { type: "spring", duration: 0.4, bounce: 0 }}
      >
        <span ref={measureRef} className="inline-flex w-max">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={label}
              aria-live="polite"
              className="inline-flex items-center gap-1.5 whitespace-nowrap"
              initial={reduced ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.3, ease: EASE_OUT },
              }}
              exit={
                reduced
                  ? { opacity: 0, transition: { duration: 0 } }
                  : {
                      opacity: 0,
                      y: -10,
                      filter: "blur(4px)",
                      transition: { duration: 0.18, ease: "easeIn" },
                    }
              }
            >
              <Icon aria-hidden className="text-link size-6 shrink-0" />
              {label}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.span>
    </button>
  );
}
