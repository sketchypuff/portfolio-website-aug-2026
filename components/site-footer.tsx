import Link from "next/link";
import { CopyEmail } from "@/components/copy-email";
import { NoidaTime } from "@/components/noida-time";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const quietLink = "text-muted-foreground hover:text-foreground transition-colors";

const pages = [
  { label: "Work", href: "/" },
  { label: "Writing", href: "/blog" },
  { label: "About", href: "/about" },
];

function Column({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <nav aria-label={label} className={cn("flex flex-col gap-1.5", className)}>
      <h2>{label}</h2>
      <ul role="list" className="flex flex-col items-start gap-1.5">
        {children}
      </ul>
    </nav>
  );
}

/**
 * Full-bleed footer band, after emmiwu.com: a clock column, then "Say hi" and
 * "Page" link columns, all mono uppercase. `inverted` gives the band the other
 * theme's tokens, so it is dark on a light page and light on a dark one,
 * without a single raw color.
 */
export function SiteFooter() {
  return (
    <footer className="inverted bg-background text-foreground font-mono text-sm uppercase">
      {/* Same frame as the home page, placed like emmiwu.com's footer: the
          clock under the sidebar, "Say hi" and "Page" on the card grid's
          second and third columns (first and second on narrow screens). */}
      <Reveal className="grid gap-10 px-6 pt-8 pb-24 sm:px-8 sm:pb-32 md:grid-cols-[260px_1fr] md:gap-8 lg:grid-cols-[300px_1fr]">
        <NoidaTime />
        <div className="@container">
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 @3xl:grid-cols-4">
            <Column label="Say hi" className="@3xl:col-start-2">
              <li>
                {/* Preflight resets text-transform on buttons, so restate it. */}
                <CopyEmail className={`${quietLink} uppercase`} />
              </li>
              <li>
                <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className={quietLink}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={site.resume} target="_blank" rel="noopener noreferrer" className={quietLink}>
                  Resumé
                </a>
              </li>
            </Column>
            <Column label="Page" className="@3xl:col-start-3">
              {pages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className={quietLink}>
                    {page.label}
                  </Link>
                </li>
              ))}
            </Column>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
