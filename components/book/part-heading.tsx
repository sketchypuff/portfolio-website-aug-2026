/**
 * A division of the contents: "PART ONE ——— SELECTED WORK". The part number
 * gives the book's order; the plain name keeps the section scannable for
 * someone who only came for the work.
 */
export function PartHeading({ part, title }: { part: string; title: string }) {
  return (
    <h3 className="text-muted-foreground flex items-center gap-3 font-mono text-xs uppercase">
      <span>{part}</span>
      <span aria-hidden className="bg-border h-px flex-1" />
      <span className="text-foreground">{title}</span>
    </h3>
  );
}
