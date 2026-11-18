"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Fraction of the remaining distance covered each frame: a short, soft trail. */
const FOLLOW = 0.25;
const SIZE = 32;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const typeDuration = (text: string) => Math.min(40 + 12 * text.length, 160);

/**
 * The brutalist home page's pointer: a 32px white dot in `mix-blend-exclusion`,
 * so it inverts whatever it passes over. It trails the pointer slightly.
 *
 * Over an element with `data-cursor-text`, that label types out beside the
 * dot and deletes itself on the way out (ported from `CustomCursor` on
 * `main`). The label blends with the dot, so it reads on any surface.
 *
 * Replaces `CustomCursor` on the brutalist pages (that one bows out there).
 * Fine pointers wider than 768px only; on touch or under reduced motion it
 * renders nothing and the system cursor stays.
 */
export function DotCursor() {
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);
  const [visible, setVisible] = useState(false);
  const [target, setTarget] = useState("");
  const [typed, setTyped] = useState("");
  const typedRef = useRef("");
  const dotRef = useRef<HTMLDivElement>(null);
  const enabled = fine && !reduced;

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 769px)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const point = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let frame = 0;
    let started = false;

    const readLabel = () => {
      const el = document.elementFromPoint(point.x, point.y);
      setTarget(el?.closest("[data-cursor-text]")?.getAttribute("data-cursor-text") ?? "");
    };

    const tick = () => {
      pos.x += (point.x - pos.x) * FOLLOW;
      pos.y += (point.y - pos.y) * FOLLOW;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x - SIZE / 2}px, ${pos.y - SIZE / 2}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      point.x = e.clientX;
      point.y = e.clientY;
      // Start on the pointer rather than gliding in from the corner.
      if (!started) {
        started = true;
        pos.x = point.x;
        pos.y = point.y;
      }
      setVisible(true);
      readLabel();
    };
    const onLeave = (e: PointerEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };

    frame = requestAnimationFrame(tick);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerout", onLeave);
    // Content moves under a still pointer when the page scrolls.
    window.addEventListener("scroll", readLabel, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-custom-cursor");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
      window.removeEventListener("scroll", readLabel);
    };
  }, [enabled]);

  // Types the label in, or deletes it back out, a character per frame on an
  // ease-out over at most 160ms.
  useEffect(() => {
    const from = typedRef.current;
    const text = target || from;
    if (!text) return;
    const duration = typeDuration(text);
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const count = target
        ? Math.round(easeOutCubic(t) * target.length)
        : Math.round((1 - easeOutCubic(t)) * from.length);
      typedRef.current = text.slice(0, count);
      setTyped(typedRef.current);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[13] flex items-center gap-[7px] mix-blend-exclusion transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <span className="size-8 shrink-0 rounded-full bg-white" />
      {typed && <span className="font-sans text-sm leading-5 whitespace-nowrap text-white">{typed}</span>}
    </div>
  );
}
