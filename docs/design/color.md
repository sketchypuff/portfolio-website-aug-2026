# Color

Source: `app/globals.css`. Light values live on `:root`, dark values on
`.dark`. `.inverted` flips a region to the other theme's set (light inside
`.dark`, dark otherwise) — used only by `SiteFooter`; the `@theme inline` block turns each `--token` into Tailwind classes
(`--muted-foreground` → `text-muted-foreground`, `bg-muted-foreground`, …).

## Where the colors come from

| Origin | Tokens | Status |
| --- | --- | --- |
| **Braun palette** — DR09 "Dieter Rams Palette" (Matus Hatala): red `#C5441F`, orange `#F07032`, brown `#40341F`, gray `#8B8178`, beige `#D9CAB8` | `--braun-*` primitives; every surface, text, border, and link token points at one or at a step derived from its hue | **Decided** (`braun` branch) — from Yash |
| **Project-defined** | `success` / `success-foreground` — green, hue 150 | **Decided** — confirmation only |
| **shadcn preset**, verbatim | `destructive` | **Default** |
| **Tailwind default, not a token** | the shadow color inside `shadow-xs` (black at 5% opacity) | **Default** — the one color on the site outside the token system |
| **Browser default** | text selection, caret, scrollbars | Unstyled |

The neutrals are warm, not gray: every surface and text token sits on the
palette's brown/beige hues (65–100). The one saturated hue is `link` — red in
light, orange in dark — and, for a confirmed action only, `success`.

## Braun palette (primitives)

`--braun-red`, `--braun-orange`, `--braun-brown`, `--braun-gray`,
`--braun-beige` on `:root` in `globals.css` — the five swatches verbatim.
Where a swatch fails contrast in its role, the token uses a step of the same
hue instead, never a new hue:

| Token | Light | Dark | Why |
| --- | --- | --- | --- |
| `background` | `#F6F5F0` | `#1E1912` | poster ground, lifted so red holds 4.56:1 / brown taken down to a deep ground |
| `muted-foreground` | `#6E655C` (5.2:1) | `--braun-gray` (4.58:1) | `#8B8178` is only 3.4:1 on the light ground |
| `muted` | `#E9E4DA` | `--braun-brown` | beige toward the ground, so placeholders stay quiet |

The primitives sit outside `@theme`, so they produce no `bg-braun-red`
classes. Components never reference one. To use one in a new role, add a
semantic token in `globals.css` that points at it, give it a dark value, and
document it here. Tailwind's palette colors stay banned.

## The layer rule

Components use the semantic classes below. Never write `oklch()`, a hex value,
`var(--…)` in a class, or a Tailwind palette color (`text-neutral-500`,
`text-blue-600`). Every token has a light and a dark value; a raw value has
only one, so it breaks in the other theme.

## Tokens in use

| Class | Light | Dark | Used for |
| --- | --- | --- | --- |
| `bg-background` | `#F6F5F0` | `#1E1912` | page (`body`, set in `globals.css` and `app/layout.tsx`); `ProfessionPill` surface |
| `text-foreground` | `--braun-brown` (10.9:1) | `#F6F5F0` (15.6:1) | all default text (inherited from `body`); prose `strong` |
| `text-muted-foreground` | `#6E655C` | `--braun-gray` | secondary text: intro paragraph, metadata, company names, dimmed titles, post subtitle, prose list numbers and bullets, figure captions, blockquotes; quiet-link hover |
| `bg-muted` | `#E9E4DA` | `--braun-brown` | empty image slots (`WorkCard`), image placeholders (`Figure`, `Gallery`), `IconCircle`, inline `code`, `pre` |
| `border-border` | `--braun-beige` | ground white 12% | default for every border (set on `*` in `globals.css`); `ProfessionPill`, prose `blockquote`, `hr`, table cells |
| `ring` (via `outline-ring/50`) | `--braun-gray` | `--braun-gray` | the focus outline on every element (set on `*` in `globals.css`) |
| `text-link` | `--braun-red` (4.56:1) | `--braun-orange` (5.88:1) | `TextLink`, `ThemeTextToggle`, the `ProfessionPill` icon, `CustomCursor` |
| `bg-success` / `text-success-foreground` | `0.52 0.14 150` / `0.985` (4.95:1) | `0.8 0.15 150` / `0.145` (11.2:1) | the `CopyEmail` tooltip once copied — nothing else |
| `text-destructive` / `border-destructive` | red, `0.577 0.245 27` | red, `0.704 0.191 22` | `MdxError` in `components/content/mdx.tsx` only |

Contrast ratios are against that theme's `background`. Dark `link` is the
palette's orange rather than the red, which drops to 3.2:1 on the dark ground.
Dark `border` is the light ground at 12% so it reads on any dark surface.

## Usage map by file

| File | Tokens |
| --- | --- |
| `app/globals.css`, `app/layout.tsx` | `background`, `foreground`, `border`, `ring/50` (global defaults) |
| `app/page.tsx` | `muted-foreground` (intro, metadata, dimmed titles, quiet-link hover), `foreground/50` (row hairline) |
| `components/text-link.tsx`, `components/theme-toggle.tsx` | `link` |
| `components/ui/tooltip.tsx`, `components/copy-email.tsx` | `foreground` / `background` (tooltip); `success` / `success-foreground` (copied) |
| `components/profession-pill.tsx` | `background`, `border`, `shadow-xs`, `link` (icon) |
| `components/work-strip.tsx` | `muted` (image slot, stepper pill), `muted-foreground` / `foreground` (stepper ticks) |
| `components/content/figure.tsx` | `muted` (placeholder), `muted-foreground` (caption) |
| `components/icon-circle.tsx` | `muted` (circle) |
| `components/content/post-nav.tsx` | `muted-foreground` (title hover) |
| `app/blog/[slug]/page.tsx` | `muted-foreground` (subtitle), `border` (header rule) |
| `components/content/mdx.tsx` | `muted`, `muted-foreground`, `foreground`, `border`, `destructive`, `muted-foreground/40` |

`app/design/page.tsx` renders every token as a swatch; it is a specimen, not a
usage. When a file starts or stops using a token, update this table.

## Tokens that exist but are not used

`primary`, `secondary`, `accent`, `popover`, `card`, `input`, `chart-1…5`,
`sidebar-*`. They ship with shadcn and are consumed inside shadcn primitives if
any get added to `components/ui/`. Do not use them in hand-written components —
they duplicate `muted`/`foreground`, and using them creates a second name for
the same color. `chart-1…5` are the five palette swatches.

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
      ├── An image slot, image placeholder, icon circle, or code? → bg-muted
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

The non-link uses of the link color are the `ProfessionPill` icon and
`CustomCursor` (`bg-link` square, `text-link` label). They are exceptions,
not precedents.
