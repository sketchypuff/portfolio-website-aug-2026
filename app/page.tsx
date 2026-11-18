import Link from "next/link";
import { CopyEmail } from "@/components/copy-email";
import { DotCursor } from "@/components/brutalist/dot-cursor";
import { Grain } from "@/components/brutalist/grain";
import { MonoToggle } from "@/components/brutalist/mono-toggle";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Hardcoded until these have real entries in content/. Cards without a case
// study yet point at the placeholder one; give each its own href once its
// project exists. The images are placeholders until there are project images to show.
const EXAMPLE = "/projects/example";
const work = [
  { title: "Microsoft", subtitle: "Excel & PowerPoint agent mode", href: EXAMPLE },
  { title: "Adobe", subtitle: "Image masking", href: "/projects/adobe-masks" },
  { title: "Adobe", subtitle: "Heal tool, Gen-AI", href: EXAMPLE },
  { title: "Postman", subtitle: "Content discovery", href: EXAMPLE },
];

// The grid cycles portrait, square, landscape, square, so every row of three
// mixes heights and the columns never line up into a plain table.
const ASPECTS = ["aspect-[4/5]", "aspect-square", "aspect-[4/3]", "aspect-square"];

const UPDATED = "18.11.2026";

const links = [
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "GitHub", href: site.social.github },
  { label: "Resumé", href: site.resume },
];

const link = "underline focus-visible:ring-ring rounded-xs focus-visible:ring-2 focus-visible:outline-none";

export default function HomePage() {
  return (
    <div
      className="brutalist group/page bg-background text-foreground min-h-dvh font-sans text-sm leading-5 min-[1200px]:flex"
    >
      <section className="flex min-h-[565px] shrink-0 flex-col p-[14px] min-[1200px]:sticky min-[1200px]:top-0 min-[1200px]:h-dvh min-[1200px]:min-h-0 min-[1200px]:w-[360px]">
        <div className="flex max-w-[560px] flex-col gap-[14px] min-[1200px]:max-w-none">
          <div className="flex flex-col items-start gap-[13px] min-[1200px]:flex-row min-[1200px]:items-center min-[1200px]:gap-3">
            <MonoToggle />
            <h1>Hi, I’m {site.name}!</h1>
          </div>
          <div className="flex flex-col gap-[7px]">
            <p>
              I’m a product designer. Currently, I make agentic AI experiences feel oh yeah! at
              Microsoft.
            </p>
            <p>
              I believe all software should be opinionated and delightful to use in order to be
              called usable.
            </p>
            <p>Previously, I’ve worked at Adobe, Postman, and Samsung.</p>
          </div>
          <ul className="flex flex-col items-start gap-1">
            <li>
              <CopyEmail className={link}>{site.social.email}</CopyEmail>
            </li>
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" className={link}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="work-heading" className="min-w-0 flex-1 px-[14px] pb-[14px] min-[1200px]:pt-[14px]">
        <div className="text-muted-foreground border-border mb-[13px] flex justify-between border-b min-[1200px]:sr-only">
          <h2 id="work-heading">Selected Works</h2>
          <p>Updated: {UPDATED}</p>
        </div>

        <ul className="group/grid grid grid-cols-1 items-start gap-x-[14px] gap-y-[28px] min-[810px]:grid-cols-2 min-[1200px]:grid-cols-3">
          {work.map((item, i) => (
            <li
              key={i}
              className="transition-opacity duration-300 ease-out group-has-[li:hover]/grid:opacity-50 hover:opacity-100!"
            >
              <Link
                href={item.href}
                data-cursor-text="View case study"
                className="focus-visible:ring-ring block focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
              >
                <div
                  className={cn(
                    "bg-muted w-full transition-[filter] duration-300 group-data-mono/page:grayscale",
                    ASPECTS[i % ASPECTS.length],
                  )}
                />
                <p className="mt-[7px]">{item.title}</p>
                <p className="text-muted-foreground">{item.subtitle}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-muted-foreground fixed right-[14px] bottom-[14px] min-[1200px]:right-auto min-[1200px]:left-[14px]">
        © {site.name}, 2026
      </p>

      <Grain />
      <DotCursor />
    </div>
  );
}
