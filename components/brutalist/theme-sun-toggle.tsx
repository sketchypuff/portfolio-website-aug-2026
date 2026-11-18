"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";

/**
 * The icon beside the name on the brutalist home: switches the site between
 * light and dark. It shows the theme it switches *to* — a sun in dark mode, a
 * moon in light mode.
 *
 * Icons and labels are both rendered and swapped with the `dark:` variant,
 * since next-themes sets `.dark` on <html> before first paint: no mounted
 * flag, no hydration mismatch. `resolvedTheme` is only read on click.
 */
export function ThemeSunToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      data-sound="toggle"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="focus-visible:ring-ring -m-1 flex size-6 shrink-0 items-center justify-center rounded-sm focus-visible:ring-2 focus-visible:outline-none"
    >
      <span className="sr-only dark:hidden">Switch to dark mode</span>
      <span className="sr-only hidden dark:inline">Switch to light mode</span>
      <MoonIcon aria-hidden weight="bold" className="size-4 dark:hidden" />
      <SunIcon aria-hidden weight="bold" className="hidden size-4 dark:block" />
    </button>
  );
}
