/**
 * A division of the contents, set the way a novel sets one: centred small
 * caps between two rules. "PART ONE · SELECTED WORK". The part number gives
 * the book's order; the plain name keeps the section scannable for someone
 * who only came for the work.
 */
export function PartHeading({ part, title }: { part: string; title: string }) {
  return (
    <h3 className="caps text-muted-foreground flex items-center gap-4 text-sm">
      <span aria-hidden className="bg-rule h-px flex-1" />
      <span className="flex items-baseline gap-2">
        <span>{part}</span>
        <span aria-hidden>·</span>
        <span className="text-foreground">{title}</span>
      </span>
      <span aria-hidden className="bg-rule h-px flex-1" />
    </h3>
  );
}
