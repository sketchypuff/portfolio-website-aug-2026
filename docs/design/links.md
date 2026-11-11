# Links

Three link treatments exist. Every link on the site is one of them; a fourth
is a design decision, not an improvisation — record it here first.

```
Is it inside running text in an MDX entry?
 └── Yes → prose link — underlined, inherits text color
Is it standalone navigation (the intro nav, the link beside a SectionLabel)?
 └── Yes → <TextLink> — link color, trailing icon
Is it an item in a list or a whole row that links out?
 └── Yes → quiet link — foreground, dims to muted on hover
```

The hover rule underneath all three: **a link moves toward the other text
level on hover.** Foreground links dim to muted; link-colored links drop to 70%
opacity.

## TextLink (Decided)

`components/text-link.tsx`. Props: `href`, `icon` (a Phosphor icon), children.
Absolute URLs open in a new tab automatically; site paths use `next/link`.

- Icon: `ArrowUpRightIcon` by default, for every destination — pages, lists,
  files, other sites. The single exception is the About link, which uses
  `SmileyXEyesIcon` because it points at Yash as a person. Don't add more
  playful exceptions without a Figma source.
- Always 24px — the component sets it.
- It is the only link on the site that uses `text-link`. The one other link-colored
  text is `ThemeTextToggle` (below).

```tsx
// Correct — app/page.tsx
<TextLink href="/blog" icon={ArrowUpRightIcon}>Open blog</TextLink>

// Incorrect — hand-rolled colored link, no icon, no new-tab handling
<Link href="/blog" className="text-link hover:underline">Open blog</Link>
```

## ThemeInlineToggle (Decided, home v2)

`components/theme-toggle.tsx`. The home intro's theme switch, written into the
sentence "Switch to dark mode, say hello on LinkedIn or open my resumé." Link
link color, no icon, 70% on hover; names the theme it switches *to*, swapped with
`dark:` classes like `ThemeTextToggle`.

## ThemeTextToggle (Decided)

`components/theme-toggle.tsx`. The old home nav's theme switch, under About
(now only on `/design`). A button, not a link, but styled exactly
like `TextLink` (link color, 24px trailing icon, 70% on hover) so the nav reads as
one set of controls. The label names the theme it switches *to* ("Dark mode"
/ "Light mode"), and label and icon swap with `dark:` classes so the first
paint is already correct.

## Quiet link (Decided)

`hover:text-muted-foreground transition-colors` on foreground text. Used for
the `PostNav` titles (as `group-hover:`, the whole side is one link).

**Inverted quiet link** — `text-muted-foreground hover:text-foreground
transition-colors`, for a list of links under a foreground label, where the
links must read quieter than the label. Used in `SiteFooter`. Its "Email" is
a copy button (`CopyEmail`) wearing the same treatment, not a `mailto:` link.

**Icon-only circles** (the post page back link): an `IconCircle` inside a
`Link` with an `aria-label`, dimming to `opacity-70` on hover.

**Linked rows** (derived from the rules above, not yet in Figma): when a row
links somewhere, the whole row is one `<a>` with `group`, the foreground text
gets `group-hover:text-muted-foreground transition-colors`, and muted text
stays muted. The row's border stays on the `RevealItem`, not the link. Focus
treatment is in [components.md](components.md#focus).

## Prose link (Provisional — not in the Figma frame)

The `a` entry in the `prose` map in `components/content/mdx.tsx`:

```
decoration-muted-foreground/40 hover:decoration-foreground underline underline-offset-[3px] transition-colors
```

In MDX, write a plain Markdown link — the map applies it. Never restyle it at a
call site.

## Rules for every link

- External (`http…`) → `target="_blank" rel="noopener noreferrer"`. `mailto:`
  → neither.
- The resumé is `site.resume` from `lib/site.ts`, always external. Never link
  to a `/resume` route; it doesn't exist.
- Internal navigation uses `next/link`, never a bare `<a>`.
- Icon-only links need `aria-label`. Decorative icons beside text get
  `aria-hidden`.
