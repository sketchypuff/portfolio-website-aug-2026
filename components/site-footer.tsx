import Link from "next/link";
import { Container } from "@/components/container";
import { CopyEmail } from "@/components/copy-email";
import { NoidaTime } from "@/components/noida-time";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";

const quietLink = "text-muted-foreground hover:text-foreground transition-colors";

const pages = [
  { label: "Work", href: "/" },
  { label: "Writing", href: "/blog" },
  { label: "About", href: "/about" },
];

function Column({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <nav aria-label={label} className="flex flex-col gap-1.5">
      <h2>{label}</h2>
      <ul role="list" className="flex flex-col items-start gap-1.5">
        {children}
      </ul>
    </nav>
  );
}

/**
 * Full-bleed footer band, after emmiwu.com: a clock column, then "Say hi" and
 * "Page" link columns, all mono uppercase. The `dark` class scopes the dark
 * token palette to the band, so it stays dark in both themes without a single
 * raw color; in dark mode a hairline top border separates it from the page.
 */
export function SiteFooter() {
  return (
    <footer className="dark bg-background text-foreground border-t-[0.5px] border-transparent font-mono text-sm uppercase dark:border-border">
      <Container size="home">
        <Reveal className="grid gap-10 pt-8 pb-24 sm:grid-cols-3 sm:gap-6 sm:pb-32">
          <NoidaTime />
          <Column label="Say hi">
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
          <Column label="Page">
            {pages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className={quietLink}>
                  {page.label}
                </Link>
              </li>
            ))}
          </Column>
        </Reveal>
      </Container>
    </footer>
  );
}
