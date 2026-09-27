import Link from "next/link";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

/**
 * Blue nav link with a trailing icon — the only place the `link` accent is
 * used for text. Absolute URLs open in a new tab; site paths use client
 * routing. See docs/design/links.md for when to use it.
 */
export function TextLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: PhosphorIcon;
  children: React.ReactNode;
}) {
  const className = "text-link group inline-flex items-center gap-0.5 transition-opacity hover:opacity-70";
  const content = (
    <>
      {children}
      <Icon
        aria-hidden
        className="size-6 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
      />
    </>
  );

  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
