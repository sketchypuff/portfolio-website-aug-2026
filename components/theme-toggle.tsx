"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";

/**
 * Both icons are rendered and swapped with CSS rather than with a mounted
 * flag. `next-themes` sets the `dark` class on <html> before first paint, so
 * this avoids a hydration mismatch, a layout shift, and the render-effect
 * round trip a `useState`/`useEffect` version would need.
 *
 * `resolvedTheme` is only read inside the click handler, where it is always
 * defined — never during render, which is what would desync on the server.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <MoonIcon className="size-4 dark:hidden" />
      <SunIcon className="hidden size-4 dark:block" />
    </button>
  );
}
