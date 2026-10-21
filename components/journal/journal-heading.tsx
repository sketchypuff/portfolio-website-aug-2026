/**
 * A section heading in the field journal: a roman numeral and a mono label on
 * a pencil rule, with an optional aside (a count, a link) at the right end.
 * Replaces `SectionLabel` on home in this world; numerals instead of icons
 * because a journal is ordered, not decorated.
 */
export function JournalHeading({
  numeral,
  children,
  aside,
}: {
  numeral: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="border-foreground/40 flex items-baseline justify-between gap-4 border-b pb-2">
      <h2 className="flex items-baseline gap-3 font-mono text-xs font-medium tracking-wider uppercase">
        <span className="text-muted-foreground w-6">{numeral}.</span>
        {children}
      </h2>
      {aside && (
        <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">{aside}</div>
      )}
    </div>
  );
}
