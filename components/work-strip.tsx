import { RevealGroup, RevealItem } from "@/components/motion/reveal";

/**
 * Horizontal strip of cards. It spans the full viewport so cards flow off both
 * edges while scrolling, but padding and scroll-padding equal to the page
 * gutter keep the first card (and every snap point) aligned to the column.
 *
 * The gutter is computed in `cqw` against the page wrapper rather than `vw`,
 * so it excludes the scrollbar. 875px is the `home` Container width; the
 * 1.5rem / 2rem minimums are its px-6 / sm:px-8 padding.
 *
 * Needs an `@container` ancestor spanning the viewport (with `overflow-x-clip`)
 * — the home page wrapper is one.
 */
export function WorkStrip({ children }: { children: React.ReactNode }) {
  return (
    <RevealGroup as="ul" className="mx-[calc(50%-50cqw)] flex snap-x snap-mandatory scroll-px-(--gutter) gap-6 overflow-x-auto px-(--gutter) [--gutter:max(1.5rem,calc((100cqw-875px)/2))] [scrollbar-width:none] sm:[--gutter:max(2rem,calc((100cqw-875px)/2))] [&::-webkit-scrollbar]:hidden">
      {children}
    </RevealGroup>
  );
}

/** One 570px card: a 4:3 image slot with its text below. */
export function WorkCard({ children }: { children: React.ReactNode }) {
  return (
    <RevealItem as="li" className="w-[570px] max-w-[85vw] shrink-0 snap-start">
      <div className="bg-muted aspect-[4/3] rounded-xl" />
      <div className="mt-5">{children}</div>
    </RevealItem>
  );
}
