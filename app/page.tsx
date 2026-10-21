import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { CopyEmail } from "@/components/copy-email";
import { NoidaTime } from "@/components/noida-time";
import { Oneko } from "@/components/oneko";
import { ProfessionPill } from "@/components/profession-pill";
import { ThemeTextToggle } from "@/components/theme-toggle";
import { TextLink } from "@/components/text-link";
import {
  BrushStroke,
  Dab,
  EdgeWash,
  PlaceholderTag,
  Splatter,
  SwatchStrip,
  Wash,
  pigments,
  type Pigment,
} from "@/components/wash";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Palette = readonly [Pigment, Pigment, Pigment, Pigment];

const pad = (n: number) => String(n).padStart(2, "0");

// Hardcoded from the Figma "Home" frame until these have real entries in
// content/. Paintings are not linked yet for the same reason; a writing row
// links once its post exists. `palette` and `seed` draw each placeholder
// wash ([sky, far ridge, near ridge, accents]); they go when the scans arrive.
const selectedWork: { company: string; title: string; palette: Palette; seed: number }[] = [
  {
    company: "Microsoft",
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
    palette: ["cerulean", "ultramarine", "sap", "indigo"],
    seed: 7,
  },
  {
    company: "Adobe",
    title: "Optimised image masking with a refined selection experience",
    palette: ["rose", "indigo", "sienna", "ochre"],
    seed: 21,
  },
  {
    company: "Adobe",
    title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
    palette: ["ochre", "sienna", "sap", "indigo"],
    seed: 34,
  },
  {
    company: "Postman",
    title: "Reduced time taken by developers in discovering new content and finding team resources",
    palette: ["cerulean", "sap", "ultramarine", "rose"],
    seed: 48,
  },
];

const otherWork: { title: string; palette: Palette; seed: number }[] = [
  {
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
    palette: ["ochre", "sap", "indigo", "sienna"],
    seed: 63,
  },
  {
    title: "Optimised image masking with a refined selection experience",
    palette: ["cerulean", "sap", "sienna", "indigo"],
    seed: 71,
  },
  {
    title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
    palette: ["rose", "ultramarine", "indigo", "sienna"],
    seed: 88,
  },
  {
    title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
    palette: ["ochre", "sienna", "indigo", "sap"],
    seed: 94,
  },
  {
    title: "Reduced time taken by developers in discovering new content and finding team resources",
    palette: ["cerulean", "ultramarine", "sap", "rose"],
    seed: 105,
  },
];

// Each writing row gets one bloom of pigment in the margin; hovering it lays
// a faint wash of the same pigment behind the row.
const rowPigments: Pigment[] = ["ochre", "cerulean", "rose", "sap", "sienna"];

// `href` is set once a post exists in content/posts; unlinked rows stay plain text.
// Rendered newest first, whatever order they're listed in.
const writing: { date: string; title: string; href?: string }[] = [
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

// Short numeric dates, the way a painter dates a study in the corner.
const shortDate = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * A section heading painted onto the sheet: a pencil numeral, the title in
 * italic, and one stroke of a loaded brush underneath. The stroke's pigment
 * is the section's colour.
 */
function PaintedHeading({
  numeral,
  pigment,
  seed,
  aside,
  children,
}: {
  numeral: string;
  pigment: Pigment;
  seed: number;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="flex flex-col gap-1">
        <span className="note text-muted-foreground">{numeral}</span>
        <h2 className="relative inline-block text-[1.75rem] leading-none italic sm:text-[2rem]">
          <span className="relative z-10 px-1">{children}</span>
          <BrushStroke pigment={pigment} seed={seed} className="absolute inset-x-[-0.3em] -bottom-2 h-5" />
        </h2>
      </div>
      {aside && <div className="note text-muted-foreground pb-1">{aside}</div>}
    </div>
  );
}

/** A painting on the sheet: no frame, just the wash with its own ragged edge. */
function Painting({
  palette,
  seed,
  className,
}: {
  palette: Palette;
  seed: number;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-[4/3] overflow-visible", className)}>
      <div className="size-full transition-[transform,filter] duration-700 ease-out will-change-transform motion-safe:group-hover/painting:scale-[1.02] motion-safe:group-hover/painting:saturate-[1.15] motion-reduce:transition-none">
        <Wash palette={palette} seed={seed} />
      </div>
    </div>
  );
}

const quietLink = "hover:text-link transition-colors";

export default function HomePage() {
  // The page is prerendered, so this is the deploy date.
  const lastUpdated = new Date();
  const posts = writing.toSorted((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="@container min-h-screen overflow-x-clip px-3 py-4 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
      <Oneko />
      <article className="paper-grain bg-background shadow-sheet relative isolate mx-auto w-full max-w-[1280px] overflow-hidden">
        {/* The sheet's own painting: a sky wash down from the top edge, an earth
            wash up from the bottom, and a few flicked drops. Behind everything. */}
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[340px] sm:h-[480px]">
          <EdgeWash edge="top" palette={["cerulean", "ultramarine"]} seed={3} />
        </div>
        <Splatter pigment="ultramarine" seed={5} className="absolute top-[14%] right-[6%] -z-10 w-28 opacity-80 sm:w-40" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[300px] sm:h-[420px]">
          <EdgeWash edge="bottom" palette={["ochre", "sienna"]} seed={9} />
        </div>
        <Splatter pigment="sienna" seed={11} className="absolute bottom-[10%] left-[4%] -z-10 w-24 opacity-80 sm:w-36" />

        <div className="flex flex-col gap-24 px-6 pt-7 pb-16 sm:px-12 sm:pt-9 lg:gap-28 lg:px-20 lg:pt-10">
          <div className="flex flex-col gap-16 lg:gap-20">
            <div className="note border-rule flex items-baseline justify-between gap-4 border-b pb-2.5">
              <span className="text-foreground">Yash Shenai</span>
              <span className="text-muted-foreground hidden sm:inline">Watercolour · product design</span>
              <span className="text-muted-foreground">Noida</span>
            </div>

            <header className="grid gap-10 lg:grid-cols-12">
              <div className="flex flex-col gap-7 lg:col-span-9">
                <h1 className="max-w-[18ch] text-[1.9rem] leading-[1.08] sm:text-[2.75rem] lg:text-[3.25rem]">
                  Hi! I’m Yash, your neighbourhood{" "}
                  <span className="relative inline-block whitespace-nowrap">
                    <span className="relative z-10">
                      <ProfessionPill />
                    </span>
                    {/* A swatch of ochre laid down first, the way a painter tests a colour. */}
                    <BrushStroke
                      pigment="ochre"
                      seed={17}
                      className="absolute inset-x-[-0.25em] bottom-[0.02em] -z-0 h-[0.7em]"
                    />
                  </span>
                </h1>
                <div className="max-w-[36rem] space-y-[0.9lh] text-[1.1875rem] leading-relaxed">
                  <p>
                    Currently, I make agentic AI experiences feel <em>oh yeah!</em> at Microsoft.
                    Previously, I’ve worked at Adobe, Postman and Samsung.
                  </p>
                  <p className="text-muted-foreground">
                    I believe all software should be opinionated and delightful to use in order to be
                    called usable.
                  </p>
                </div>
              </div>
              <nav
                aria-label="Main"
                className="flex flex-wrap gap-x-5 gap-y-2 text-[1.0625rem] lg:col-span-3 lg:flex-col lg:items-end lg:pt-3"
              >
                <TextLink href={site.resume} icon={ArrowUpRightIcon}>
                  Résumé
                </TextLink>
                <TextLink href="/about">About</TextLink>
                <ThemeTextToggle />
              </nav>
            </header>
          </div>

          <section className="flex flex-col gap-12">
            <PaintedHeading numeral="01" pigment="cerulean" seed={21} aside={`${pad(selectedWork.length)} plates`}>
              Selected work
            </PaintedHeading>
            <ul
              role="list"
              aria-label="Selected work"
              className={cn(
                "grid gap-x-12 gap-y-16 sm:grid-cols-2",
                "[&>li]:transition-opacity [&>li]:duration-300 motion-reduce:[&>li]:transition-none",
                "[@media(hover:hover)]:[&:has(>li:hover)>li:not(:hover)]:opacity-60",
              )}
            >
              {selectedWork.map((item, i) => (
                <li key={i} className="group/painting flex flex-col gap-5">
                  <Painting palette={item.palette} seed={item.seed} />
                  <div className="flex flex-col gap-2 px-1">
                    <p className="note text-muted-foreground flex items-baseline justify-between gap-3">
                      <span>
                        Pl. {pad(i + 1)} <span className="text-foreground/70">· {item.company}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        {item.palette.slice(0, 3).map((p) => (
                          <Dab key={p} pigment={p} className="size-2.5" />
                        ))}
                      </span>
                    </p>
                    <p className="text-[1.375rem] leading-snug text-pretty">{item.title}</p>
                    <p className="note text-muted-foreground">
                      <PlaceholderTag />
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="relative flex flex-col gap-8">
            {/* A pale wash of hills behind the notes, so the middle of the sheet
                is painted too. Faint enough to read through. */}
            <div
              aria-hidden
              className="absolute inset-x-[-5rem] -top-24 -z-10 h-[calc(100%+12rem)] opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)] sm:inset-x-[-10rem]"
            >
              <Wash palette={["ochre", "sap", "sienna", "indigo"]} seed={53} variant="band" />
            </div>
            <PaintedHeading
              numeral="02"
              pigment="sap"
              seed={29}
              aside={
                <TextLink href="/blog" className="normal-case tracking-normal">
                  Open blog
                </TextLink>
              }
            >
              Writing
            </PaintedHeading>
            <ol role="list" className="max-w-[46rem]">
              {posts.map((post, i) => {
                const pigment = rowPigments[i % rowPigments.length];
                const content = (
                  <>
                    <Dab pigment={pigment} className="mt-2 size-3.5 self-start" />
                    <span className="flex flex-col gap-1">
                      <span
                        className={cn(
                          "text-[1.25rem] leading-snug text-pretty",
                          post.href && "group-hover:text-link transition-colors",
                        )}
                      >
                        {post.title}
                      </span>
                      <time dateTime={post.date} className="note text-muted-foreground">
                        {shortDate.format(new Date(post.date))}
                      </time>
                    </span>
                  </>
                );
                const row = "grid grid-cols-[0.875rem_1fr] gap-x-4 py-4";
                return (
                  <li key={post.title} className="border-border border-b">
                    {post.href ? (
                      <Link
                        href={post.href}
                        className={cn(
                          row,
                          "group focus-visible:ring-ring relative isolate -mx-3 rounded-sm px-3 focus-visible:ring-2 focus-visible:outline-none",
                        )}
                      >
                        {/* A faint wash spreads behind the row on hover. */}
                        <span
                          aria-hidden
                          className="absolute inset-y-1 left-0 -z-10 w-2/3 opacity-0 blur-md transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none"
                          style={{
                            background: `radial-gradient(closest-side, color-mix(in oklch, ${pigments[pigment].color} 40%, transparent), transparent)`,
                          }}
                        />
                        {content}
                      </Link>
                    ) : (
                      <div className={row}>{content}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="flex flex-col gap-12">
            <PaintedHeading numeral="03" pigment="sienna" seed={37} aside="Studies">
              Other work
            </PaintedHeading>
            <ul
              role="list"
              aria-label="Other work"
              className={cn(
                "grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
                "[&>li]:transition-opacity [&>li]:duration-300 motion-reduce:[&>li]:transition-none",
                "[@media(hover:hover)]:[&:has(>li:hover)>li:not(:hover)]:opacity-60",
              )}
            >
              {otherWork.map((item, i) => (
                <li key={i} className="group/painting flex flex-col gap-4">
                  <Painting palette={item.palette} seed={item.seed} />
                  <div className="flex flex-col gap-1.5 px-1">
                    <p className="note text-muted-foreground">St. {pad(i + 1)}</p>
                    <p className="text-[1.0625rem] leading-snug text-pretty">{item.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <footer className="flex flex-col gap-10 pt-6">
            <PaintedHeading numeral="04" pigment="ultramarine" seed={41} aside="Colophon">
              Palette
            </PaintedHeading>
            <ul role="list" className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 lg:grid-cols-7">
              {(Object.keys(pigments) as Pigment[]).map((pigment, i) => (
                <li key={pigment} className="flex flex-col gap-1">
                  <SwatchStrip pigment={pigment} seed={i * 11 + 5} className="h-8" />
                  <span className="note text-muted-foreground flex justify-between gap-2">
                    <span className="text-foreground/80">{pigments[pigment].name}</span>
                    <span>{pad(i + 1)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="grid gap-10 text-[1.0625rem] sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <span className="note text-muted-foreground">Contact</span>
                <ul role="list" className="flex flex-col gap-0.5">
                  <li>
                    <CopyEmail />
                  </li>
                  <li>
                    <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className={quietLink}>
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a href={site.resume} target="_blank" rel="noopener noreferrer" className={quietLink}>
                      Résumé
                    </a>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <span className="note text-muted-foreground">Last wash</span>
                <time dateTime={lastUpdated.toISOString().slice(0, 10)}>{shortDate.format(lastUpdated)}</time>
              </div>
              <div className="flex flex-col gap-2 sm:items-end sm:text-right">
                <span className="note text-muted-foreground">Currently</span>
                <NoidaTime />
              </div>
            </div>
            <p className="note text-muted-foreground border-rule border-t pt-3">
              Written in Fraunces, pencilled in DM Mono · every wash on this sheet is a placeholder until
              my own scans replace it
            </p>
          </footer>
        </div>
      </article>
    </div>
  );
}
