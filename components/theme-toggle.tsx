"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";

/**
 * Both labels and icons are rendered and swapped with CSS rather than with a
 * mounted flag. `next-themes` sets the `dark` class on <html> before first
 * paint, so this avoids a hydration mismatch, a layout shift, and the render-effect
 * round trip a `useState`/`useEffect` version would need.
 *
 * `resolvedTheme` is only read inside the click handler, where it is always
 * defined — never during render, which is what would desync on the server.
 */
function useToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  return () => setTheme(resolvedTheme === "dark" ? "light" : "dark");
}

/**
 * Theme switch for the home nav, styled like its links (link blue, label,
 * then a 24px icon). It names the theme it switches *to*.
 */
export function ThemeTextToggle() {
  const toggle = useToggleTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-link inline-flex cursor-pointer items-center gap-0.5 transition-opacity hover:opacity-70"
    >
      <span className="dark:hidden">Dark mode</span>
      <span className="hidden dark:inline">Light mode</span>
      <MoonIcon aria-hidden className="size-6 shrink-0 dark:hidden" />
      <SunIcon aria-hidden className="hidden size-6 shrink-0 dark:block" />
    </button>
  );
}
