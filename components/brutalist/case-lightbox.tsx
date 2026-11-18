"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type Shot = { src: string; alt: string };

/** The widest candidate in an `<img>`'s srcset, so the lightbox isn't stuck at the column size. */
function largestSrc(img: HTMLImageElement) {
  const candidates = img.srcset
    .split(",")
    .map((part) => part.trim().split(/\s+/))
    .map(([url, w]) => ({ url, w: Number.parseInt(w ?? "0", 10) }))
    .filter((c) => c.url);
  if (candidates.length === 0) return img.currentSrc || img.src;
  return candidates.reduce((a, b) => (b.w > a.w ? b : a)).url;
}

const button =
  "underline focus-visible:ring-ring rounded-xs focus-visible:ring-2 focus-visible:outline-none disabled:no-underline disabled:opacity-50";

/**
 * Lightbox for a case study's media column. Every `[data-lightbox]` button
 * inside `children` opens it on its image; Prev / Next (and ← / →) step
 * through them in page order, Esc or a click on the backdrop closes it.
 *
 * Brutalist styling: the page's own dark background, 14px padding, Geist
 * 14/20, underlined text buttons, a muted counter. The image is contained,
 * at the largest size its srcset offers. Fades in and out over 200ms
 * (instant under reduced motion). Focus moves to Close on open, stays inside
 * while open, and returns to the image that opened it.
 */
export function CaseLightbox({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [shots, setShots] = useState<Shot[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  const open = index !== null;
  const shot = open ? shots[index] : undefined;

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setIndex((i) => (i === null ? i : Math.min(shots.length - 1, Math.max(0, i + delta)))),
    [shots.length],
  );

  function onClick(e: React.MouseEvent) {
    const trigger = (e.target as Element).closest<HTMLElement>("[data-lightbox]");
    if (!trigger || !rootRef.current) return;
    const triggers = [...rootRef.current.querySelectorAll<HTMLElement>("[data-lightbox]")];
    const list = triggers.map((t) => {
      const img = t.querySelector("img");
      return { src: img ? largestSrc(img) : "", alt: img?.alt ?? "" };
    });
    triggerRef.current = trigger;
    setShots(list);
    setIndex(triggers.indexOf(trigger));
  }

  // Lock the page behind it, take focus, and give it back on close.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    return () => {
      root.style.overflow = previous;
      if (!trigger) return;
      // Closing with Esc is a key press, so the browser would draw the image's
      // focus-visible ring on the way back. Hide it until focus moves on.
      trigger.setAttribute("data-focus-returned", "");
      trigger.addEventListener("blur", () => trigger.removeAttribute("data-focus-returned"), { once: true });
      trigger.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>("button:not(:disabled)")];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  const fade = reduced ? { duration: 0 } : { duration: 0.2, ease: EASE_OUT };

  return (
    <div ref={rootRef} onClick={onClick} className="contents">
      {children}
      <AnimatePresence>
        {shot && index !== null && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Image ${index + 1} of ${shots.length}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
            onClick={(e) => {
              // The backdrop closes it; the image and the controls don't.
              if (e.target === e.currentTarget || (e.target as Element).hasAttribute("data-backdrop")) close();
            }}
            data-cursor-text="Close"
            className="bg-background text-foreground fixed inset-0 z-30 flex flex-col gap-[14px] p-[14px] font-sans text-sm leading-5"
          >
            <div data-cursor-text="" className="flex justify-between">
              <p className="text-muted-foreground tabular-nums">
                {index + 1} / {shots.length}
              </p>
              <button ref={closeRef} type="button" onClick={close} className={button}>
                Close
              </button>
            </div>

            <div data-backdrop className="flex min-h-0 flex-1 items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- already an optimised next/image URL */}
              <img
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                data-cursor-text=""
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div data-cursor-text="" className="flex items-end justify-between gap-[14px]">
              <p className="text-muted-foreground max-w-[480px] text-pretty">{shot.alt}</p>
              <div className="flex shrink-0 gap-[14px]">
                <button type="button" onClick={() => step(-1)} disabled={index === 0} className={button}>
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  disabled={index === shots.length - 1}
                  className={button}
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
