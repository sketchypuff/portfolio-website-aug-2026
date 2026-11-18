"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ColumnsTransition, columnsDirection } from "./columns-transition";

/**
 * Route transitions. Moves to or from home get `ColumnsTransition` (strips
 * cover the change); every other route change gets a short fade.
 *
 * The fade is deliberately enter-only: animating the outgoing page means
 * holding the old content on screen while the user waits, which reads as lag
 * rather than polish. Keyed on pathname so each navigation replays it, and
 * skipped when the columns already cover the change.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  // The previous pathname, updated during render (React's "storing information
  // from previous renders" pattern) so the new page's first render knows it.
  const [current, setCurrent] = useState(pathname);
  const [previous, setPrevious] = useState(pathname);
  if (current !== pathname) {
    setPrevious(current);
    setCurrent(pathname);
  }

  if (reduced) return <>{children}</>;

  const covered = columnsDirection(previous, pathname) !== null;

  return (
    <>
      <motion.div
        key={pathname}
        initial={covered ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {children}
      </motion.div>
      <ColumnsTransition />
    </>
  );
}
