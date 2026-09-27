"use client";

import { useSyncExternalStore } from "react";

const format = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** "10:25 pm" → "10:25pm" */
function now() {
  return format.format(new Date()).replace(/\s/g, "").toLowerCase();
}

// Ticks every 30s so the minute never visibly lags. The snapshot is a string,
// so React only re-renders when the displayed minute actually changes.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}

/**
 * Live local time in Noida. The prerendered HTML carries the build time;
 * React swaps in the real time right after hydration.
 */
export function NoidaTime() {
  const time = useSyncExternalStore(subscribe, now, now);
  return (
    <span suppressHydrationWarning className="tabular-nums">
      Noida, {time}
    </span>
  );
}
