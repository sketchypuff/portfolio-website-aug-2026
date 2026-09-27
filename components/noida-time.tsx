"use client";

import { useSyncExternalStore } from "react";

const format = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

// 24-hour clock and weekday in Noida, to pick the activity line.
const parts = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  hourCycle: "h23",
  weekday: "short",
});

// A best guess at what Yash is doing, checked top to bottom: the first entry
// whose hours contain the current Noida hour wins. `until` is exclusive.
const weekday = [
  { until: 6, doing: "probably asleep" },
  { until: 8, doing: "pretending to be a morning person" },
  { until: 10, doing: "chai first, pixels second" },
  { until: 13, doing: "deep in Figma" },
  { until: 14, doing: "at lunch" },
  { until: 19, doing: "in a meeting, probably" },
  { until: 21, doing: "painting, or trying to" },
  { until: 24, doing: "reading in bed" },
];

const weekend = [
  { until: 6, doing: "probably asleep" },
  { until: 9, doing: "on the badminton court" },
  { until: 13, doing: "hunting for books" },
  { until: 14, doing: "at lunch" },
  { until: 19, doing: "painting something" },
  { until: 24, doing: "reading in bed" },
];

function doing(date: Date) {
  const p = Object.fromEntries(parts.formatToParts(date).map((x) => [x.type, x.value]));
  const schedule = p.weekday === "Sat" || p.weekday === "Sun" ? weekend : weekday;
  return schedule.find((slot) => Number(p.hour) < slot.until)!.doing;
}

/** "10:25 pm" → "10:25pm", plus the activity, as one string. */
function now() {
  const date = new Date();
  return `${format.format(date).replace(/\s/g, "").toLowerCase()}|${doing(date)}`;
}

// Ticks every 30s so the minute never visibly lags. The snapshot is a string,
// so React only re-renders when the displayed minute actually changes.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}

/**
 * Live local time in Noida, with a guess at what Yash is up to underneath.
 * The prerendered HTML carries the build time; React swaps in the real time
 * right after hydration.
 */
export function NoidaTime() {
  const [time, activity] = useSyncExternalStore(subscribe, now, now).split("|");
  return (
    <span className="flex flex-col">
      <span suppressHydrationWarning className="tabular-nums">
        Noida, {time}
      </span>
      <span suppressHydrationWarning className="text-muted-foreground">
        {activity}
      </span>
    </span>
  );
}
