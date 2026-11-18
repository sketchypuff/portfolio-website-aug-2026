"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * The brutalist pages' pointer: a sharp white square in `mix-blend-exclusion`,
 * so it inverts whatever it passes over. After the `braun` branch's
 * `CustomCursor`, in this page's monochrome palette instead of an accent.
 *
 * - Resting: 14px, centred on the pointer.
 * - Over anything clickable: shrinks to 8px (120ms).
 * - Pressed: scales to 0.75.
 * - Over an element with `data-cursor-text`: the label types out 7px right of
 *   the square over at most 160ms, and deletes itself on the way out.
 *
 * Replaces `CustomCursor` on the brutalist pages (that one bows out there).
 * Fine pointers wider than 768px only; on touch or under reduced motion it
 * renders nothing and the system cursor stays.
 */

const CLICKABLE = [
  "a[href]",
  "button",
  "[role='button']",
  "summary",
  "label[for]",
  "select",
  "input",
  "textarea",
  "[data-cursor-text]",
].join(", ");

const REST = 14;
const LINK = 8;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const typeDuration = (text: string) => Math.min(40 + 12 * text.length, 160);

export function SquareCursor() {
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);
  const [visible, setVisible] = useState(false);
  const [overLink, setOverLink] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [target, setTarget] = useState("");
  const [typed, setTyped] = useState("");
  const typedRef = useRef("");
  const rootRef = useRef<HTMLDivElement>(null);
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

    let x = 0;
    let y = 0;
    let frame = 0;

    const evaluate = () => {
      frame = 0;
      if (rootRef.current) rootRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const el = document.elementFromPoint(x, y);
      setOverLink(!!el?.closest(CLICKABLE));
      setTarget(el?.closest("[data-cursor-text]")?.getAttribute("data-cursor-text") ?? "");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(evaluate);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      setVisible(true);
      schedule();
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = (e: PointerEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointerout", onLeave);
    // Content moves under a still pointer when the page scrolls.
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-custom-cursor");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onLeave);
      window.removeEventListener("scroll", schedule);
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

  const size = overLink ? LINK : REST;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[100] mix-blend-exclusion transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className="relative transition-transform duration-100 ease-out"
        style={{
          translate: `${-size / 2}px ${-size / 2}px`,
          transform: `scale(${pressed && !typed ? 0.75 : 1})`,
          transformOrigin: `${size / 2}px center`,
        }}
      >
        <span
          className="block bg-white transition-[width,height] duration-[120ms] ease-out"
          style={{ width: size, height: size }}
        />
        {/* Positioned off the square so the label never shifts it off-centre. */}
        {typed && (
          <span
            className="absolute top-1/2 -translate-y-1/2 font-sans text-sm leading-5 whitespace-nowrap text-white"
            style={{ left: size + 7 }}
          >
            {typed}
          </span>
        )}
      </div>
    </div>
  );
}
