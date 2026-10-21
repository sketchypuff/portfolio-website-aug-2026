"use client";

import { useTheme } from "next-themes";

/**
 * Both labels are rendered and swapped with CSS rather than with a mounted
 * flag. `next-themes` sets the `dark` class on <html> before first paint, so
 * this avoids a hydration mismatch, a layout shift, and the render-effect
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
 * Theme switch, written like the other ink links. It names what it switches
 * to, in the journal's own terms: the lamp goes on at night.
 */
export function ThemeTextToggle() {
  const toggle = useToggleTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-link inline-flex cursor-pointer items-baseline underline decoration-dotted decoration-1 underline-offset-[0.3em] transition-[text-decoration-color] hover:decoration-solid"
    >
      <span className="dark:hidden">Lamp on</span>
      <span className="hidden dark:inline">Lamp off</span>
    </button>
  );
}
