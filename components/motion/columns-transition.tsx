"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";

/**
 * The route transition between home and every other page: four strips, one
 * per grid column, cover the screen, the route changes under them, and they
 * lift away. Decided in docs/design/decisions.md ("Home ↔ page transition").
 *
 * - Forward (home → another page): strips rise from the bottom, left to
 *   right, then lift off the top.
 * - Back (another page → home): the mirror — they fall from the top, right to
 *   left, then drop off the bottom.
 *
 * Link clicks are intercepted so the cover can finish before navigating.
 * Browser back / forward can't be delayed, so the strips snap shut in the
 * `popstate` frame (before the new route renders) and only the reveal plays.
 * Moves that don't touch home use `PageTransition`'s fade instead.
 *
 * Renders nothing and intercepts nothing under reduced motion.
 */

type Dir = "forward" | "back";

const STRIP_MS = 220;
const STAGGER_MS = 40;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const COVERED = "scaleY(1)";
const OPEN = "scaleY(0)";

/** Whether a move between two paths gets the columns, and which way. */
export function columnsDirection(from: string, to: string): Dir | null {
  if (from === to) return null;
  if (from === "/") return "forward";
  if (to === "/") return "back";
  return null;
}

export function ColumnsTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const stripsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lastPath = useRef(pathname);
  const busy = useRef(false);
  const pending = useRef<{ path: string; resolve: () => void } | null>(null);
  const popReveal = useRef<{ path: string; dir: Dir } | null>(null);

  const strips = useCallback(
    () => stripsRef.current.filter((s): s is HTMLDivElement => s !== null),
    [],
  );

  /** One half of the sequence, staggered across the columns in `dir`'s order. */
  const sweep = useCallback(
    async (dir: Dir, phase: "cover" | "reveal") => {
      // Forward covers from the bottom and reveals off the top; back mirrors it.
      const origin = (dir === "forward") === (phase === "cover") ? "bottom" : "top";
      const ordered = dir === "forward" ? strips() : strips().reverse();
      const [from, to] = phase === "cover" ? [OPEN, COVERED] : [COVERED, OPEN];
      const animations = ordered.map((strip, i) => {
        strip.style.transformOrigin = origin;
        return strip.animate([{ transform: from }, { transform: to }], {
          duration: STRIP_MS,
          delay: i * STAGGER_MS,
          easing: EASE,
          fill: "forwards",
        });
      });
      await Promise.all(animations.map((a) => a.finished.catch(() => undefined)));
      // Hold the end state inline and drop the animations.
      strips().forEach((strip) => {
        strip.style.transform = to;
        strip.getAnimations().forEach((a) => a.cancel());
      });
    },
    [strips],
  );

  const reset = useCallback(() => {
    strips().forEach((strip) => {
      strip.getAnimations().forEach((a) => a.cancel());
      strip.style.transform = OPEN;
    });
    busy.current = false;
  }, [strips]);

  // Each route commit, before paint: resolve a link navigation waiting under
  // the cover, or reveal after a back / forward.
  useLayoutEffect(() => {
    lastPath.current = pathname;
    const link = pending.current;
    if (link && link.path === pathname) {
      pending.current = null;
      link.resolve();
    }
    const pop = popReveal.current;
    if (pop && pop.path === pathname) {
      popReveal.current = null;
      sweep(pop.dir, "reveal").finally(reset);
    }
  }, [pathname, sweep, reset]);

  /** `router.push`, resolved once the new route has committed (or after 4s, so a stall can't strand the cover). */
  const navigate = useCallback(
    (href: string, path: string) =>
      new Promise<void>((resolve) => {
        pending.current = { path, resolve };
        router.push(href);
        window.setTimeout(() => {
          if (pending.current?.path === path) {
            pending.current = null;
            resolve();
          }
        }, 4000);
      }),
    [router],
  );

  useEffect(() => {
    if (reduced) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin) return;
      const dir = columnsDirection(location.pathname, url.pathname);
      if (!dir) return;
      // Next's Link skips its own navigation when the default is prevented.
      e.preventDefault();
      if (busy.current) return;
      busy.current = true;
      (async () => {
        await sweep(dir, "cover");
        await navigate(url.pathname + url.search + url.hash, url.pathname);
        await sweep(dir, "reveal");
      })().finally(reset);
    };

    // The URL has already changed; the new route hasn't rendered yet.
    const onPopState = () => {
      if (busy.current) return;
      const dir = columnsDirection(lastPath.current, location.pathname);
      if (!dir) return;
      busy.current = true;
      strips().forEach((strip) => {
        strip.getAnimations().forEach((a) => a.cancel());
        strip.style.transform = COVERED;
      });
      popReveal.current = { path: location.pathname, dir };
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [reduced, navigate, sweep, reset, strips]);

  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[99] grid grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          ref={(el) => {
            stripsRef.current[i] = el;
          }}
          className="bg-foreground"
          style={{ transform: OPEN }}
        />
      ))}
    </div>
  );
}
