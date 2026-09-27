import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { IconCircle } from "@/components/icon-circle";
import type { Entry } from "@/lib/content";

type Neighbour = Pick<Entry<"posts">, "href" | "meta"> | null;

/**
 * Previous/next row at the foot of a post (Figma "Blog"). Older on the left,
 * newer on the right; a side is left empty at either end of the list.
 */
export function PostNav({ older, newer }: { older: Neighbour; newer: Neighbour }) {
  if (!older && !newer) return null;

  const linkClass = "group flex max-w-[306px] items-center gap-4";
  const titleClass = "group-hover:text-muted-foreground transition-colors";

  return (
    <nav aria-label="More posts" className="flex items-center justify-between gap-6">
      {older ? (
        <Link href={older.href} className={linkClass}>
          <IconCircle icon={ArrowLeftIcon} />
          <span className={titleClass}>
            <span className="sr-only">Older post: </span>
            {older.meta.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {newer ? (
        <Link href={newer.href} className={`${linkClass} text-right`}>
          <span className={titleClass}>
            <span className="sr-only">Newer post: </span>
            {newer.meta.title}
          </span>
          <IconCircle icon={ArrowRightIcon} />
        </Link>
      ) : null}
    </nav>
  );
}
