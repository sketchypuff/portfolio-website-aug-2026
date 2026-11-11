"use client";

// Throwaway prototype — /proto/home, after emmiwu.com. Delete with the decision.
import Link from "next/link";
import { ProfessionPill } from "@/components/profession-pill";
import { useTheme } from "next-themes";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Copied from app/page.tsx for the prototype.
const selectedWorkBase = [
  {
    company: "Microsoft",
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
  },
  { company: "Adobe", title: "Optimised image masking with a refined selection experience" },
  { company: "Adobe", title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature" },
  {
    company: "Postman",
    title: "Reduced time taken by developers in discovering new content and finding team resources",
  },
];

const otherWorkBase = [
  "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
  "Optimised image masking with a refined selection experience",
  "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
  "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
  "Reduced time taken by developers in discovering new content and finding team resources",
];

// Ten of each, cycling the real entries — placeholder volume, not new projects.
const selectedWork = Array.from({ length: 11 }, (_, i) => selectedWorkBase[i % selectedWorkBase.length]);
const otherWork = Array.from({ length: 8 }, (_, i) => otherWorkBase[i % otherWorkBase.length]);

const writing = [
  {
    date: "2025-07-20",
    title: "How to use storytelling in UX case studies to land more interviews",
    href: "/blog/storytelling-in-ux-case-studies",
  },
  {
    date: "2024-11-28",
    title: "22 things about industrial design they didn’t teach me in design school",
    href: "/blog/22-things-about-industrial-design",
  },
  {
    date: "2024-05-04",
    title: "Preparing for undergraduate design entrance exams in India",
    href: "/blog/design-entrance-exams-in-india",
  },
  {
    date: "2024-02-24",
    title: "An actionable guide on taking the first step towards learning UX design today",
    href: "/blog/first-step-learning-ux-design",
  },
  {
    date: "2024-01-27",
    title: "Thoughts on making UX portfolio websites for fresh graduates seeking a job in the industry",
    href: "/blog/ux-portfolio-websites-for-fresh-graduates",
  },
];

const dateParts = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
function formatDay(date: string) {
  const parts = dateParts.formatToParts(new Date(date));
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${part("day")} ${part("month")} ${part("year")}`;
}

const SECTIONS = [
  { id: "selected-work", label: "Selected work", count: selectedWork.length },
  { id: "blog", label: "Blog", count: writing.length },
  { id: "other-work", label: "Other work", count: otherWork.length },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

const mono = "font-mono text-sm uppercase";

/** Emmi's "[ ]" marker: a dot appears inside the brackets when `on`. */
function Marker({ on, className }: { on?: boolean; className?: string }) {
  return (
    <span aria-hidden className={cn("relative whitespace-pre", className)}>
      [ ]
      <span
        className={cn(
          "bg-foreground absolute top-1/2 left-1/2 size-1 -translate-1/2 rounded-full transition-opacity duration-150",
          on ? "opacity-100" : "opacity-0",
          "group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
      />
    </span>
  );
}

/** Inline theme switch; the label swaps with CSS so it never mismatches on hydration. */
function InlineThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="text-link cursor-pointer transition-opacity hover:opacity-70"
    >
      <span className="dark:hidden">Switch to dark mode</span>
      <span className="hidden dark:inline">Switch to light mode</span>
    </button>
  );
}

function Bio({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[1lh] text-base leading-snug font-medium">
      <div className="flex flex-col items-start gap-2">
        <h1 className="font-bold">Hi! I’m Yash, your neighbourhood</h1>
        <ProfessionPill />
      </div>
      <p className="text-muted-foreground">
        Currently, I make agentic AI experiences feel oh yeah! at Microsoft. Previously, I’ve worked at
        Adobe, Postman and Samsung.
      </p>
      <p className="text-muted-foreground">
        <InlineThemeToggle />, say hello on{" "}
        <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-link hover:opacity-70">
          LinkedIn
        </a>{" "}
        or{" "}
        <a href={site.resume} target="_blank" rel="noopener noreferrer" className="text-link hover:opacity-70">
          open my resumé
        </a>
        .
      </p>
      {children}
    </div>
  );
}

function SectionHeading({ id, label, count }: { id: string; label: string; count: number }) {
  return (
    <h2 id={`${id}-heading`} className={cn(mono, "text-muted-foreground flex items-baseline gap-2")}>
      <span className="text-foreground">{label}</span>
      <span className="tabular-nums">[{String(count).padStart(2, "0")}]</span>
    </h2>
  );
}

function SelectedWork() {
  return (
    <ul role="list" className="grid grid-cols-2 gap-x-3 gap-y-10 @3xl:grid-cols-4">
      {selectedWork.map((item, i) => (
        <li key={i}>
          <a href="#" data-cursor-text="Open case study" className="group flex flex-col gap-3 focus-visible:outline-none">
            <div className="bg-muted aspect-[268.75/264] w-full transition-opacity group-active:opacity-80" />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm leading-snug font-medium">{item.title}</h3>
              <div className={cn(mono, "text-muted-foreground flex items-baseline justify-between gap-4")}>
                <p>{item.company}</p>
                <p className="group-hover:text-foreground flex shrink-0 items-center gap-1.5 transition-colors">
                  View <Marker />
                </p>
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

function Blog() {
  return (
    <ul role="list" className="border-foreground/50 border-t-[0.5px]">
      {writing.map((post) => (
        <li key={post.href} className="border-foreground/50 border-b-[0.5px]">
          <Link
            href={post.href}
            data-cursor-text="Read"
            className="group grid gap-1 py-3 sm:grid-cols-[9rem_1fr_auto] sm:items-baseline sm:gap-6"
          >
            <time dateTime={post.date} className={cn(mono, "text-muted-foreground")}>
              {formatDay(post.date)}
            </time>
            <p className="group-hover:text-muted-foreground text-base leading-snug font-medium transition-colors">
              {post.title}
            </p>
            <span className={cn(mono, "text-muted-foreground hidden items-center gap-1.5 sm:flex")}>
              Read <Marker />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function OtherWork() {
  return (
    <ul role="list" className="grid grid-cols-2 gap-x-3 gap-y-8 @3xl:grid-cols-4">
      {otherWork.map((title, i) => (
        <li key={i} className="flex flex-col gap-3">
          <div className="bg-muted aspect-[268.75/264] w-full" />
          <h3 className="text-sm leading-snug font-medium">{title}</h3>
          <p className={cn(mono, "text-muted-foreground -mt-2")}>Coming soon</p>
        </li>
      ))}
    </ul>
  );
}

const BODIES: Record<SectionId, () => React.ReactNode> = {
  "selected-work": SelectedWork,
  blog: Blog,
  "other-work": OtherWork,
};

function Section({ id }: { id: SectionId }) {
  const s = SECTIONS.find((x) => x.id === id)!;
  const Body = BODIES[id];
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="flex scroll-mt-14 flex-col gap-5">
      <SectionHeading {...s} />
      <Body />
    </section>
  );
}

/** Sidebar left, content right — Emmi's frame. */
function Frame({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid gap-12 px-6 pt-14 pb-24 sm:px-8 md:grid-cols-[260px_1fr] md:gap-8 lg:grid-cols-[300px_1fr]">
      <aside className="md:sticky md:top-14 md:self-start">{sidebar}</aside>
      <div className="@container">{children}</div>
    </div>
  );
}

const PAGES = [
  { label: "Work", href: "/proto/home", current: true },
  { label: "Writing", href: "/blog" },
  { label: "About", href: "/about" },
];

function Index() {
  const nav = (
    <nav aria-label="Main" className={cn(mono, "flex flex-col gap-1.5 pt-4")}>
      {PAGES.map((page) => (
        <Link
          key={page.label}
          href={page.href}
          aria-current={page.current ? "page" : undefined}
          className={cn(
            "group flex items-center gap-2 transition-colors",
            page.current ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Marker on={page.current} />
          {page.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <Frame sidebar={<Bio>{nav}</Bio>}>
      <div className="flex flex-col gap-28">
        {SECTIONS.map((s) => (
          <Section key={s.id} id={s.id} />
        ))}
      </div>
    </Frame>
  );
}

export default function HomeProto() {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex-1">
        <Index />
      </div>
      <SiteFooter />
    </div>
  );
}
