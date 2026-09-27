"use client";

import { usePathname } from "next/navigation";

/**
 * The home page carries its own nav and footer row, so global chrome passed
 * through here is dropped on `/` and rendered everywhere else.
 */
export function HideOnHome({ children }: { children: React.ReactNode }) {
  return usePathname() === "/" ? null : children;
}
