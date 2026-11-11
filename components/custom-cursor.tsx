"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * The site pointer, after rachelchen.tech: a sharp link-blue square that replaces the
 * system cursor on desktop.
 *
 * - Resting: a 14px square, centred on the pointer.
 * - Over anything clickable: shrinks to 8px.
 * - Over selectable text (or a text field): becomes a 3×20 caret.
 * - Pressed: scales to 0.75.
 * - Over an element with `data-cursor-text`: the label types out beside the
 *   square, and deletes itself on the way out.
 *
 * Fine pointers wider than 768px only. Under reduced motion, or on touch, it
 * renders nothing and the system cursor stays. Over an `.inverted` band (the
 * footer) it inverts too, so it never disappears into the surface.
 */

type Mode = "rest" | "link" | "text";

const CLICKABLE = [
  "a[href]",
  "button",
  "[role='button']",
  "summary",
  "label[for]",
  "select",
  "input[type='submit']",
  "input[type='button']",
  "input[type='reset']",
  "input[type='checkbox']",
  "input[type='radio']",
  "[data-cursor-text]",
].join(", ");

const TEXT_FIELD =
  "textarea, [contenteditable='true'], input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio']):not([type='file']):not([type='color']):not([type='range'])";

const SIZES: Record<Mode, { w: number; h: number }> = {
  rest: { w: 14, h: 14 },
  link: { w: 8, h: 8 },
  text: { w: 3, h: 20 },
};

// Leaving text waits this long before the caret turns back into a square, so
// gaps between words and lines don't make it flicker.
const TEXT_EXIT_DELAY = 90;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const typeDuration = (text: string) => Math.min(40 + 12 * text.length, 160);

/** True when the point sits on (or within 6px of) a run of real text. */
function isOverText(x: number, y: number, el: Element) {
  if (el.closest(TEXT_FIELD)) return true;
  if (getComputedStyle(el).userSelect === "none") return false;

  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null;
  };
  const node =
    doc.caretPositionFromPoint?.(x, y)?.offsetNode ?? document.caretRangeFromPoint?.(x, y)?.startContainer;
  if (!node || node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) return false;

  const range = document.createRange();
  range.selectNodeContents(node);
  const rects = [...range.getClientRects()].filter((r) => r.width > 0);
  return rects.some((r) => x >= r.left - 6 && x <= r.right + 6 && y >= r.top - 6 && y <= r.bottom + 6);
}

function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 769px)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return fine;
}

export function CustomCursor() {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const enabled = fine && !reduced;

  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("rest");
  const [pressed, setPressed] = useState(false);
  const [onInverted, setOnInverted] = useState(false);
  const [target, setTarget] = useState("");
  const [typed, setTyped] = useState("");
  const typedRef = useRef("");

  // Hide the system cursor only while this one is drawn.
  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    return () => root.classList.remove("has-custom-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    let x = 0;
    let y = 0;
    let frame = 0;
    let inText = false;
    let textExit: number | undefined;

    const evaluate = () => {
      frame = 0;
      const root = rootRef.current;
      if (root) root.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      const el = document.elementFromPoint(x, y);
      if (!el) return;

      setOnInverted(!!el.closest(".inverted"));
      const labelled = el.closest("[data-cursor-text]");
      setTarget(labelled?.getAttribute("data-cursor-text") ?? "");

      if (el.closest(CLICKABLE)) {
        window.clearTimeout(textExit);
        textExit = undefined;
        inText = false;
        setMode("link");
      } else if (isOverText(x, y, el)) {
        window.clearTimeout(textExit);
        textExit = undefined;
        inText = true;
        setMode("text");
      } else if (inText) {
        textExit ??= window.setTimeout(() => {
          textExit = undefined;
          inText = false;
          setMode("rest");
        }, TEXT_EXIT_DELAY);
      } else {
        setMode("rest");
      }
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
      window.clearTimeout(textExit);
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

  const { w, h } = SIZES[mode];

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[100] transition-opacity duration-200 ease-out",
        visible ? "opacity-100" : "opacity-0",
        onInverted && "inverted",
      )}
    >
      <div
        className="flex items-center gap-2.5 transition-transform duration-100 ease-out"
        style={{
          translate: `${-w / 2}px ${-h / 2}px`,
          transform: `scale(${pressed && !typed ? 0.75 : 1})`,
          transformOrigin: `${w / 2}px center`,
        }}
      >
        <span
          className={cn(
            "bg-link shrink-0 transition-colors duration-150 ease-out",
            // The caret snaps in; the square eases between its two sizes.
            mode !== "text" && "transition-[width,height,background-color] duration-[120ms]",
          )}
          style={{ width: w, height: h }}
        />
        {typed && (
          <span className="text-link font-mono text-sm leading-none whitespace-nowrap uppercase">
            {typed}
          </span>
        )}
      </div>
    </div>
  );
}
