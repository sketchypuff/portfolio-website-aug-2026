# Color

Source: `app/globals.css`. A pure-neutral OKLCH ramp (zero chroma) from the
shadcn `neutral` base, plus one hue: `--link`.

## The layer rule

Components use the semantic Tailwind classes below. Never write `oklch()`, a
hex value, `var(--…)` in a class, or a Tailwind palette color
(`text-neutral-500`, `text-blue-600`). Every token has a light and a dark
value; a raw value has only one, so it breaks in the other theme.

## Tokens in use (Decided)

| Class | Light | Dark | Used for |
| --- | --- | --- | --- |
| `bg-background` | white | `0.145` | page, pill surface |
| `text-foreground` | `0.145` | `0.985` | default text (set on `body`) |
| `text-muted-foreground` | `0.556` | `0.708` | secondary text, metadata, dimmed titles |
| `bg-muted` | `0.97` | `0.269` | image placeholders, card fills, inline code |
| `border-border` | `0.922` | white/10% | default borders (set globally on `*`) |
| `ring-ring` | `0.708` | `0.556` | focus rings |
| `text-link` | `#2148f9` | `oklch(0.72 0.15 262)` | `TextLink`, `ThemeTextToggle` (+ one exception below) |
| `text-destructive` / `border-destructive` | red | red | `MdxError` in `components/content/mdx.tsx` only |

Dark `link` is lighter than light `link` so it holds contrast on the dark
background — it is not an inversion. Dark `border` is translucent white so it
reads on every dark surface.

## Tokens that exist but are not used

`primary`, `secondary`, `accent`, `popover`, `card`, `input`, `chart-1…5`,
`sidebar-*`. They ship with shadcn and are consumed inside shadcn primitives if
any get added to `components/ui/`. Do not use them in hand-written components —
they are all neutral grays that duplicate `muted`/`foreground`, and using them
creates a second name for the same color.

## Opacity modifiers

Opacity on a token is allowed only in these existing combinations. Anything
else is a new token decision — add it to `globals.css` and this table instead.

| Combination | Where | Why |
| --- | --- | --- |
| `border-foreground/50` + `border-b-[0.5px]` | home writing rows | Figma hairline |
| `decoration-muted-foreground/40` | prose links | underline quieter than text |
| `bg-background/80`, `/60` with `backdrop-blur-md` | `SiteHeader` | frosted sticky header |
| `text-muted-foreground/70` | `ProjectCard` role line | third text level (Provisional) |
| `border-destructive/40` | `MdxError` | error box |

## What background do I use?

```
Is it the page itself?
 ├── Yes → bg-background (already on body — don't repeat it)
 └── No
      ├── An image slot, image placeholder, card fill, or code? → bg-muted
      ├── A raised control on the page (the ProfessionPill)?
      │    → bg-background + border-border + shadow-xs
      └── Anything else → no background. This site separates with space, not boxes.
```

## What text color do I use?

```
Is it a link that navigates on the home page, or the home nav's theme switch?
 ├── Yes → TextLink / ThemeTextToggle (text-link) — see links.md
 └── No
      ├── Primary content: titles, body, labels → inherit (foreground)
      ├── Secondary: metadata, dates, company names, intro paragraph,
      │   dimmed titles → text-muted-foreground
      └── An error → text-destructive
```

Two text levels carry the site. A third gray (`/70`) exists once, on a
Provisional component — do not spread it.

```tsx
// Correct — app/page.tsx
<p className="text-muted-foreground font-mono text-sm uppercase">{item.company}</p>

// Incorrect — palette color, breaks dark mode and bypasses the ramp
<p className="text-neutral-500 font-mono text-sm uppercase">{item.company}</p>
```

The one non-link use of blue is the `ProfessionPill` icon (`text-link`), taken
from Figma. It is an exception, not a precedent.
