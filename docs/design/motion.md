# Motion

Alive, but the content stays the star. Motion confirms; it never performs.

## House curve and defaults (Decided)

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (`EASE` in
  `components/motion/reveal.tsx`) for anything entering.
- Reveals: 12px of travel, 500ms, once. Anything louder reads as decoration on
  a minimal layout.
- Exits: shorter than enters, `ease-in` — they get out of the way.
- No animation plays on page load except reveals and the route fade.

## Which component?

```
Is it a route change?
 └── PageTransition — already in app/layout.tsx; never add another
Is it content scrolling into view?
 ├── A list or grid of siblings → RevealGroup + RevealItem (0.06s stagger)
 └── A single block → Reveal (as="header" | "section" | "footer" | …)
Is it a response to hover or press?
 └── CSS transition, see the table below — not motion/react
Is it stateful UI (content swapping, size changing)?
 └── motion/react with a spring for size, the house curve for opacity/position,
     and a reduced-motion branch. ProfessionPill is the reference.
```

```tsx
// Correct — app/page.tsx
<RevealGroup as="ul">
  {writing.map((post) => <RevealItem as="li" key={post.title}>…</RevealItem>)}
</RevealGroup>

// Incorrect — each row triggers on its own, stagger is uneven
{writing.map((post) => <Reveal key={post.title}>…</Reveal>)}
```

All three take `as`. A list of siblings is `RevealGroup as="ul"` (or `"ol"`)
with `RevealItem as="li"` — a `div` list isn't announced as a list by screen
readers. `RevealGroup` adds `role="list"` itself for `ul`/`ol`. Keep the
default `div` only when the group isn't a list (e.g. a header row).

Don't raise `distance` above 12 or add delays beyond `0.05` to a `Reveal`.

## Route transitions

`PageTransition`: opacity only, 250ms, `easeOut`, enter-only. Animating the
outgoing page holds stale content on screen and reads as lag.

## Hover and press (CSS)

| Effect | Classes | Where |
| --- | --- | --- |
| Color shift | `transition-colors` (150ms default) | all text links, cards |
| Opacity dim | `transition-opacity hover:opacity-70` | `TextLink` |
| Icon nudge | `transition-transform duration-300 ease-out group-hover:translate-x-0.5` | `TextLink` trailing icon |
| Image zoom | `transition-transform duration-500 ease-out group-hover:scale-[1.02]` | reserved for linked image cards; none exist yet |
| Stepper | pill `transition-transform duration-500` house curve; tick `transition-[height,background-color] duration-300` | `WorkStrip` |
| Press | `transition-[scale] duration-150 ease-out active:scale-[0.96]` | `ProfessionPill` |

Never `transition-all` — name the property. Never scale above 1.02 on hover.
Hover-as-a-system is still open (see Pending in `DESIGN.md`): don't invent a
new hover effect; reuse a row from this table.

## ProfessionPill spec (Decided)

Interactive UI, so faster than reveals. Label swap: 10px vertical travel +
4px blur; enter 300ms house curve, exit 180ms ease-in. Width follows on a
zero-bounce spring (0.4s) because people click repeatedly and a spring
retargets mid-resize without a jolt.

## Sound

`cuelume` synthesizes UI sounds with Web Audio (no audio files). The only one
on the site is `play("tick")` in `WorkStrip`, taken from rithvika.work: on
pointer down on a stepper tick, and whenever a user scroll moves the strip to
a new card (one tick per card, like a detent). The scroll after a tick press
stays silent so it doesn't tick twice. Call `play()` where the sound belongs;
don't call the global `bind()`. Sound is feedback for something the user
did — never for hover, page scroll, or page load.

## Reduced motion (non-negotiable)

Every component in `components/motion/` early-returns a static version under
`useReducedMotion()`. Anything new using `motion/react` must do the same. CSS
transforms on press add `motion-reduce:transition-none`.
