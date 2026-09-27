# Color

Source: `app/globals.css`. Light values live on `:root`, dark values on
`.dark`; the `@theme inline` block turns each `--token` into Tailwind classes
(`--muted-foreground` → `text-muted-foreground`, `bg-muted-foreground`, …).

## Where the colors come from

| Origin | Tokens | Status |
| --- | --- | --- |
| **shadcn `neutral` preset**, verbatim (`components.json` → `"baseColor": "neutral"`) | every gray: `background`, `foreground`, `muted`, `muted-foreground`, `border`, `ring`, plus `destructive` and all the unused ones | **Default** — generated, never compared against Figma |
| **Project-defined, from Figma** | `link` — `#2148f9` in light; a lighter blue in dark for contrast | **Decided** |
| **Tailwind default, not a token** | the shadow color inside `shadow-xs` (black at 5% opacity) | **Default** — the one color on the site outside the token system |
| **Browser default** | text selection, caret, scrollbars | Unstyled |

The whole ramp has zero chroma — pure gray — so the only hue on the site is
`link`. Replacing the grays with Figma values is a change to `globals.css`
only; nothing else hardcodes them.

## The layer rule

Components use the semantic classes below. Never write `oklch()`, a hex value,
`var(--…)` in a class, or a Tailwind palette color (`text-neutral-500`,
`text-blue-600`). Every token has a light and a dark value; a raw value has
only one, so it breaks in the other theme.

## Tokens in use

| Class | Light | Dark | Used for |
| --- | --- | --- | --- |
| `bg-background` | `oklch(1 0 0)` white | `0.145` | page (`body`, set in `globals.css` and `app/layout.tsx`); `ProfessionPill` surface |
| `text-foreground` | `0.145` | `0.985` | all default text (inherited from `body`); prose `strong` |
| `text-muted-foreground` | `0.556` | `0.708` | secondary text: intro paragraph, metadata, company names, dimmed titles, figure captions, blockquotes; quiet-link hover |
| `bg-muted` | `0.97` | `0.269` | empty image slots (`WorkCard`), image placeholders (`Figure`, `Gallery`), inline `code`, `pre` |
| `border-border` | `0.922` | white 10% | default for every border (set on `*` in `globals.css`); `ProfessionPill`, prose `blockquote`, `hr`, table cells |
| `ring` (via `outline-ring/50`) | `0.708` | `0.556` | the focus outline on every element (set on `*` in `globals.css`) |
| `text-link` | `oklch(0.512 0.262 266)` = `#2148f9` | `oklch(0.72 0.15 262)` | `TextLink`, `ThemeTextToggle`, the `ProfessionPill` icon |
| `text-destructive` / `border-destructive` | red, `0.577 0.245 27` | red, `0.704 0.191 22` | `MdxError` in `components/content/mdx.tsx` only |

Grays are listed by OKLCH lightness (`0.145` = `oklch(0.145 0 0)`). Dark
`link` is lighter and less saturated than light `link` so it holds contrast
on the dark background — it is not an inversion. Dark `border` is translucent
white so it reads on any dark surface.

## Usage map by file

| File | Tokens |
| --- | --- |
| `app/globals.css`, `app/layout.tsx` | `background`, `foreground`, `border`, `ring/50` (global defaults) |
| `app/page.tsx` | `muted-foreground` (intro, metadata, dimmed titles, quiet-link hover), `foreground/50` (row hairline) |
| `components/text-link.tsx`, `components/theme-toggle.tsx` | `link` |
| `components/profession-pill.tsx` | `background`, `border`, `shadow-xs`, `link` (icon) |
| `components/work-strip.tsx` | `muted` (image slot) |
| `components/content/figure.tsx` | `muted` (placeholder), `muted-foreground` (caption) |
| `components/content/mdx.tsx` | `muted`, `muted-foreground`, `foreground`, `border`, `destructive`, `muted-foreground/40` |

`app/design/page.tsx` renders every token as a swatch; it is a specimen, not a
usage. When a file starts or stops using a token, update this table.

## Tokens that exist but are not used

`primary`, `secondary`, `accent`, `popover`, `card`, `input`, `chart-1…5`,
`sidebar-*`. They ship with shadcn and are consumed inside shadcn primitives if
any get added to `components/ui/`. Do not use them in hand-written components —
they are neutral grays that duplicate `muted`/`foreground`, and using them
creates a second name for the same color. (`sidebar-primary` in dark mode is
shadcn's stock blue, unrelated to `link`.)

## Opacity modifiers

Opacity on a token is allowed only in these existing combinations. Anything
else is a new token decision — add it to `globals.css` and this table instead.

| Combination | Where | Why |
| --- | --- | --- |
| `border-foreground/50` + `border-b-[0.5px]` | home writing rows | Figma hairline |
| `decoration-muted-foreground/40` | prose links | underline quieter than text |
| `outline-ring/50` | every element, `globals.css` | shadcn default focus outline |
| `border-destructive/40` | `MdxError` | error box |

## What background do I use?

```
Is it the page itself?
 ├── Yes → bg-background (already on body — don't repeat it)
 └── No
      ├── An image slot, image placeholder, or code? → bg-muted
      ├── A raised control on the page (the ProfessionPill)?
      │    → bg-background + border-border + shadow-xs
      └── Anything else → no background. This site separates with space, not boxes.
```

## What text color do I use?

```
Is it a navigation link or the theme switch?
 ├── Yes → TextLink / ThemeTextToggle (text-link) — see links.md
 └── No
      ├── Primary content: titles, body, labels → inherit (foreground)
      ├── Secondary: metadata, dates, company names, intro paragraph,
      │   dimmed titles, captions → text-muted-foreground
      └── An error → text-destructive
```

Two text levels carry the site. Never add a third gray
(`text-muted-foreground/70` and the like) — hierarchy below muted comes from
size or case, not a lighter gray.

```tsx
// Correct — app/page.tsx
<p className="text-muted-foreground font-mono text-sm uppercase">{item.company}</p>

// Incorrect — palette color, breaks dark mode and bypasses the ramp
<p className="text-neutral-500 font-mono text-sm uppercase">{item.company}</p>
```

The one non-link use of blue is the `ProfessionPill` icon, taken from Figma.
It is an exception, not a precedent.
