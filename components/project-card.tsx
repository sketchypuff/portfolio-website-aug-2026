import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { loadContentImage } from "@/lib/images";
import type { Entry } from "@/lib/content";

/**
 * Card for the projects grid.
 *
 * Works for both shapes: entries with an `external` URL link straight out,
 * everything else links to its case study page.
 */
export async function ProjectCard({ entry }: { entry: Entry<"projects"> }) {
  const { meta, slug, href } = entry;
  const isExternal = Boolean(meta.external);
  const cover = meta.cover ? await loadContentImage("projects", slug, meta.cover) : null;

  const Wrapper = isExternal ? "a" : Link;
  const linkProps = isExternal
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <Wrapper {...linkProps} className="group focus-visible:ring-ring block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none">
      {cover ? (
        <div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={cover}
            alt={meta.coverAlt ?? ""}
            placeholder="blur"
            fill
            sizes="(min-width: 1024px) 30rem, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="group-hover:text-muted-foreground inline-flex items-center gap-1 text-sm font-medium tracking-tight transition-colors">
            {meta.title}
            {isExternal ? (
              <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            ) : null}
          </h3>
          {meta.year ? (
            <span className="text-muted-foreground shrink-0 font-mono text-xs">{meta.year}</span>
          ) : null}
        </div>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed text-pretty">
          {meta.summary}
        </p>
        {meta.role ? (
          <p className="text-muted-foreground/70 mt-2 text-xs">{meta.role}</p>
        ) : null}
      </div>
    </Wrapper>
  );
}
