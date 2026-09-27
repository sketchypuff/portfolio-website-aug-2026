"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();

  // Home carries its own nav in the intro.
  if (pathname === "/") return null;

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 backdrop-blur-md">
      <Container size="wide">
        <nav className="flex h-16 items-center justify-between gap-6" aria-label="Main">
          <Link
            href="/"
            className="hover:text-muted-foreground -mx-1 rounded px-1 text-sm font-medium tracking-tight transition-colors"
          >
            {site.name}
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <ul className="flex items-center gap-1 sm:gap-2">
              {site.nav.map((item) => {
                const itemClass = "rounded-md px-2 py-1 text-sm transition-colors sm:px-3";

                // External items (the resume on Drive) open in a new tab and are never "active".
                if (item.href.startsWith("http")) {
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(itemClass, "text-muted-foreground hover:text-foreground")}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                }

                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        itemClass,
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  );
}
