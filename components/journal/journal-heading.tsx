/**
 * A section heading in the field journal: a roman numeral and a typed label
 * on an ink rule, with an optional aside (a count, a link) at the right end.
 * Numerals instead of icons, because a journal is ordered, not decorated.
 * `id` lets the rail's index jump to it.
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
    <div className="border-rule flex items-baseline justify-between gap-4 border-b pb-2">
      <h2 id={id} className="label flex items-baseline gap-3 font-medium scroll-mt-10">
        <span className="text-muted-foreground w-8">{numeral}.</span>
        {children}
      </h2>
      {aside && <div className="label text-muted-foreground">{aside}</div>}
    </div>
  );
}
