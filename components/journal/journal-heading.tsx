import { MarginNote } from "@/components/journal/page-frame";

/**
 * A section heading written in the journal: the numeral in the margin, the
 * title in small capitals on an ink rule, and an optional aside (a count, a
 * link) at the right end. `id` is what the fore-edge tabs jump to.
 */
export function JournalHeading({
  id,
  numeral,
  children,
  aside,
}: {
  id?: string;
  numeral: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="border-rule relative flex items-baseline justify-between gap-4 border-b pb-1.5">
      <MarginNote className="text-foreground">{numeral}.</MarginNote>
      <h2
        id={id}
        className="font-serif text-xl font-medium tracking-wider [font-variant-caps:all-small-caps] scroll-mt-10"
      >
        {children}
      </h2>
      {aside && <div className="label text-muted-foreground">{aside}</div>}
    </div>
  );
}
