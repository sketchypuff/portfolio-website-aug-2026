"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Section = { id: string; label: string };

/**
 * Where the reader is in a case study: which section, and how far through it.
 * A section runs from its own top to the next one's; the last runs to the
 * bottom of the page, so it reaches 100% when the page can't scroll further.
 */
function useProgress(sections: Section[]) {
  const [state, setState] = useState({ active: 0, progress: 0 });

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const starts = sections.map((s, i) => {
        const el = document.getElementById(s.id);
        const top = i === 0 || !el ? 0 : el.getBoundingClientRect().top + y;
        return Math.min(top, max);
      });

      let active = 0;
      starts.forEach((start, i) => {
        if (y >= start) active = i;
      });
      const start = starts[active];
      const end = active < starts.length - 1 ? starts[active + 1] : max;
      const progress = end > start ? Math.min(1, Math.max(0, (y - start) / (end - start))) : 1;
      setState((prev) =>
        prev.active === active && prev.progress === Math.round(progress * 100) / 100
          ? prev
          : { active, progress: Math.round(progress * 100) / 100 },
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sections]);

  return state;
}

function useJump() {
  const reduced = useReducedMotion();
  return (id: string, index: number) => {
    const el = document.getElementById(id);
    const top = index === 0 || !el ? 0 : el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };
}

const percent = (p: number) => `${Math.round(p * 100)}%`;

/**
 * The section index for case studies and blog posts. On wide screens it sits at the bottom of
 * the sticky sidebar: every section listed, the current one marked with a
 * 7px dot, full opacity, and its progress. Below 1200px it becomes a light
 * bar pinned to the bottom of the screen showing the current section, which
 * expands into the full list.
 */
export function CaseToc({ sections }: { sections: Section[] }) {
  const { active, progress } = useProgress(sections);
  const jump = useJump();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav aria-label="Sections" className="hidden min-[1200px]:block">
        <ol className="flex flex-col gap-1">
          {sections.map((s, i) => {
            const current = i === active;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => jump(s.id, i)}
                  aria-current={current ? "location" : undefined}
                  className="focus-visible:ring-ring flex items-center rounded-xs focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "shrink-0 rounded-full transition-all duration-300 ease-out",
                      current ? "bg-foreground mr-[7px] size-[7px]" : "bg-border mr-0 size-px",
                    )}
                  />
                  <span
                    className={cn(
                      "transition-opacity duration-300 ease-out",
                      current ? "opacity-100" : "opacity-50",
                    )}
                  >
                    {s.label}
                  </span>
                  {current && <span className="ml-[7px] tabular-nums">{percent(progress)}</span>}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <nav
        aria-label="Sections"
        className="bg-foreground text-background fixed inset-x-[14px] bottom-[14px] z-20 min-[1200px]:hidden"
      >
        {open && (
          <ol id="case-toc-list" className="flex max-h-[60dvh] flex-col gap-1 overflow-y-auto px-[14px] pt-[14px]">
            {sections.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    jump(s.id, i);
                  }}
                  aria-current={i === active ? "location" : undefined}
                  className={cn("py-0.5", i === active ? "opacity-100" : "opacity-50")}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        )}
        <div className="flex items-center justify-between p-[14px]">
          <p>
            {sections[active]?.label}{" "}
            <span className="ml-[7px] tabular-nums opacity-50">{percent(progress)}</span>
          </p>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="case-toc-list"
            onClick={() => setOpen((o) => !o)}
            className="-my-2 py-2 underline"
          >
            {open ? "Collapse" : "Expand"}
          </button>
        </div>
      </nav>
    </>
  );
}
