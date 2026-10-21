import Link from "next/link";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * A link as a book sets one: ink blue with a hairline underline that darkens
 * on hover. An optional trailing icon marks links that leave the book.
 * Absolute URLs open in a new tab; site paths use client routing.
 */
export function TextLink({
  href,
  icon: Icon,
  className,
  children,
}: {
  href: string;
  icon?: PhosphorIcon;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn(
    "text-link decoration-link/40 hover:decoration-link group inline-flex items-baseline gap-1 underline decoration-1 underline-offset-[0.25em] transition-[text-decoration-color]",
    className,
  );
  const content = (
    <>
      {children}
      {Icon && (
        <Icon
          aria-hidden
          className="size-[0.9em] shrink-0 self-center transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
        />
      )}
    </>
  );

  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
