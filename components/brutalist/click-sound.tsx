"use client";

import { useEffect } from "react";
import { play, sounds, type SoundName } from "cuelume";

const CLICKABLE = "a[href], button, [role='button'], summary, [data-sound]";

function soundFor(target: EventTarget | null): SoundName | null {
  if (!(target instanceof Element)) return null;
  const el = target.closest<HTMLElement>(CLICKABLE);
  if (!el || el.matches(":disabled, [aria-disabled='true']")) return null;
  const named = el.dataset.sound;
  if (named === "none") return null;
  return named && named in sounds ? (named as SoundName) : "press";
}

/**
 * The brutalist pages' click sound, from `cuelume`: a muted `press` when a
 * link, button, or lightbox image is pressed. An element can ask for another
 * sound with `data-sound="<name>"` (the theme toggle uses `toggle`) or none
 * with `data-sound="none"`.
 *
 * Plays on pointer down, which is when a physical button clicks, and on
 * keyboard activation (a `click` with `detail === 0`), so it isn't
 * mouse-only. Never on hover, scroll, or page load. cuelume is a silent
 * no-op when Web Audio is unavailable or blocked. Renders nothing.
 */
export function ClickSound() {
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const sound = soundFor(e.target);
      if (sound) play(sound);
    };
    const onClick = (e: MouseEvent) => {
      if (e.detail !== 0) return;
      const sound = soundFor(e.target);
      if (sound) play(sound);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
