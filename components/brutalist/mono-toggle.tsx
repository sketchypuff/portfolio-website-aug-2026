"use client";

import { useState } from "react";
import { SunIcon } from "@phosphor-icons/react";

/**
 * The sun at the top of the brutalist home page. It doesn't switch theme: it
 * flips the work images between color and grayscale by setting `data-mono` on
 * the nearest `.brutalist` wrapper, which the images read through
 * `group-data-mono/page:grayscale`.
 */
export function MonoToggle() {
  const [mono, setMono] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={mono}
      aria-label="Show work in black and white"
      onClick={(e) => {
        const next = !mono;
        setMono(next);
        const page = e.currentTarget.closest<HTMLElement>(".brutalist");
        if (page) page.toggleAttribute("data-mono", next);
      }}
      className="focus-visible:ring-ring -m-1 flex size-6 shrink-0 items-center justify-center rounded-sm focus-visible:ring-2 focus-visible:outline-none"
    >
      <SunIcon aria-hidden weight="bold" className="size-4" />
    </button>
  );
}
