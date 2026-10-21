import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { ThemeTextToggle } from "@/components/theme-toggle";
import { TextLink } from "@/components/text-link";
import { PlaceholderSwatch, WASH_NAMES, type WashColor } from "@/components/journal/placeholder-wash";
import { site } from "@/lib/site";

export type RailSection = { id: string; numeral: string; label: string };

// The flyleaf: who keeps this journal, the way a naturalist's notebook opens.
const observer = [
  { term: "Observer", detail: "Yash Shenai" },
  { term: "Station", detail: "Noida, India" },
  { term: "Field", detail: "Agentic AI in Excel and PowerPoint" },
  { term: "Trained", detail: "Industrial design, NID" },
];

const key: WashColor[] = ["text-wash-sky", "text-wash-sap", "text-wash-sienna", "text-wash-ochre", "text-wash-indigo"];

/**
 * The journal's margin, kept at the left of the page on wide screens and
 * pinned while the entries scroll past: the running head, the flyleaf, an
 * index of the sections, and the key to the pigments used on this page.
 * Below `lg` it is the top of the page instead.
 */
export function Rail({ sections }: { sections: RailSection[] }) {
  return (
    <aside className="lg:sticky lg:top-10 lg:self-start">
      <div className="flex flex-col gap-10">
        <div className="border-rule flex flex-col gap-1 border-b pb-3">
          <p className="label flex items-baseline justify-between gap-4">
            <span className="text-foreground font-medium">Field journal</span>
            <span className="text-muted-foreground">Vol. I</span>
          </p>
          <p className="label text-muted-foreground">28.54° N, 77.39° E</p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-1">
          {observer.map((row) => (
            <div key={row.term} className="flex flex-col gap-0.5">
              <dt className="label text-muted-foreground">{row.term}</dt>
              <dd className="text-base leading-snug">{row.detail}</dd>
            </div>
          ))}
        </dl>

        <nav aria-label="Index" className="flex flex-col gap-3">
          <p className="label text-muted-foreground">Index</p>
          <ol role="list" className="flex flex-col gap-1.5">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="hover:text-link group flex items-baseline gap-3 text-base transition-colors"
                >
                  <span className="label text-muted-foreground group-hover:text-link w-8 shrink-0 transition-colors">
                    {s.numeral}.
                  </span>
                  <span>{s.label}</span>
                </a>
              </li>
            ))}
          </ol>
          <ul role="list" className="border-border mt-1 flex flex-col gap-1.5 border-t pt-3 text-base">
            <li>
              <TextLink href={site.resume} icon={ArrowUpRightIcon}>
                Résumé
              </TextLink>
            </li>
            <li>
              <TextLink href="/about">About</TextLink>
            </li>
            <li>
              <ThemeTextToggle />
            </li>
          </ul>
        </nav>

        <div className="hidden flex-col gap-3 lg:flex">
          <p className="label text-muted-foreground">Key · pigments on this page</p>
          <ul role="list" className="flex flex-col gap-1.5">
            {key.map((color, i) => (
              <li key={color} className="label text-muted-foreground flex items-center gap-2.5">
                <PlaceholderSwatch id={`key-${i}`} seed={i * 7 + 3} color={color} className="size-3.5" />
                <span>{WASH_NAMES[color]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
