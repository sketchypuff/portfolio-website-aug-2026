import Link from "next/link";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * A link written in fountain-pen ink: `link` blue with a dotted underline
 * that firms up on hover, the way a pen pressed harder leaves a solid line.
 * An optional trailing icon marks links that leave the page. Absolute URLs
 * open in a new tab; site paths use client routing.
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
    "text-link group inline-flex items-baseline gap-1 underline decoration-dotted decoration-1 underline-offset-[0.3em] transition-[text-decoration-color] hover:decoration-solid",
    className,
  );
  const content = (
    <>
      {children}
      {Icon && (
        <Icon
          aria-hidden
          className="size-[1em] shrink-0 self-center transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
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
