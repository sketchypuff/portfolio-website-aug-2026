import { site } from "@/lib/site";
import { Container } from "./container";

export function SiteFooter() {
  const links = [
    site.social.email ? { href: `mailto:${site.social.email}`, label: "Email" } : null,
    site.social.linkedin ? { href: site.social.linkedin, label: "LinkedIn" } : null,
    site.social.github ? { href: site.social.github, label: "GitHub" } : null,
    site.social.x ? { href: site.social.x, label: "X" } : null,
  ].filter((l): l is { href: string; label: string } => l !== null);

  return (
    <footer className="mt-32">
      <Container size="wide">
        <div className="text-muted-foreground flex flex-col gap-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
