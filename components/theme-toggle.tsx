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
 * Theme switch, set like the other links. It names the light you switch
 * to: the book is read by daylight, or by lamplight on its dark cloth.
 */
export function ThemeTextToggle() {
  const toggle = useToggleTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-link decoration-link/40 hover:decoration-link inline-flex cursor-pointer items-baseline underline decoration-1 underline-offset-[0.25em] transition-[text-decoration-color]"
    >
      <span className="dark:hidden">Lamplight</span>
      <span className="hidden dark:inline">Daylight</span>
    </button>
  );
}
