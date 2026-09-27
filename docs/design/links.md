# Links

Four link treatments exist. Every link on the site is one of them; a fifth is
drift. Pick by where the link sits, not by how important it feels.

```
Is it in SiteHeader, SiteFooter, or a "← Blog" back link?
 └── Yes → chrome link — muted, brightens to foreground on hover
Is it on the home page?
 ├── Standalone navigation (intro nav, the link beside a SectionLabel)
 │     → <TextLink> — blue, trailing icon
 └── An item in a list or row (Contact column, a row that links out)
       → quiet link — foreground, dims to muted on hover
Is it on an inner page?
 └── Any other link — in running text, or on a standalone title in a list
       → prose link — underlined, inherits text color
       (Exception: a whole card or row that is one link, like ProjectCard and
        PostLink, has no underline — it dims its title on hover instead.)
```

The hover rule underneath all four: **a link moves toward the other text
level on hover.** Foreground links dim; muted links brighten; blue links drop
to 70% opacity.

## TextLink (Decided)

`components/text-link.tsx`. Props: `href`, `icon` (a Phosphor icon), children.
Absolute URLs open in a new tab automatically; site paths use `next/link`.

- Icon: `ArrowUpRightIcon` by default, for every destination — pages, lists,
  files, other sites. The single exception is the About link, which uses
  `SmileyXEyesIcon` because it points at Yash as a person. Don't add more
  playful exceptions without a Figma source.
- Always 24px — the component sets it.
- It is the only link on the site that uses `text-link`. The one other blue
  text is `ThemeTextToggle` (below).
- Home page only until inner pages are redesigned.

```tsx
// Correct — app/page.tsx
<TextLink href="/blog" icon={ArrowUpRightIcon}>Open blog</TextLink>

// Incorrect — hand-rolled blue link, no icon, no new-tab handling
<Link href="/blog" className="text-link hover:underline">Open blog</Link>
```

## ThemeTextToggle (Decided)

`components/theme-toggle.tsx`. The home nav's theme switch, under About. A
button, not a link, but styled exactly like `TextLink` (blue, 24px trailing
icon, 70% on hover) so the nav reads as one set of controls. The label names
the theme it switches *to* ("Dark mode" / "Light mode"), and label and icon
swap with `dark:` classes so the first paint is already correct. Inner pages
use the icon-only `ThemeToggle` in `SiteHeader`.

## Prose link (Provisional)

Defined as the `a` entry in the `prose` map in `components/content/mdx.tsx`:

```
decoration-muted-foreground/40 hover:decoration-foreground underline underline-offset-[3px] transition-colors
```

In MDX, write a plain Markdown link — the map applies it. In TSX (about page,
404, a linked title in an inner-page list) the class string is currently
repeated by hand. Copy it exactly; never vary the offset or opacity.

## Quiet link (Decided, home only)

`hover:text-muted-foreground transition-colors` on foreground text. Used for
the Contact list in the home footer row. External targets add
`target="_blank" rel="noopener noreferrer"`.

**Linked rows on home** (derived from the rules above, not yet in Figma): when
a home row links somewhere, the whole row is one `<a>` with `group`, the
foreground text gets `group-hover:text-muted-foreground transition-colors`,
and muted text stays muted. The hairline border stays on the `RevealItem`,
not the link.

## Chrome link (Provisional)

`text-muted-foreground hover:text-foreground transition-colors`, `text-sm`.
Active nav item is `text-foreground` with `aria-current="page"`. Back links add
a leading `ArrowLeftIcon` (`size-3.5`) that nudges `-translate-x-0.5` on
group hover.

## Rules for every link

- External (`http…`) → `target="_blank" rel="noopener noreferrer"`. `mailto:`
  → neither.
- The resumé is `site.resume` from `lib/site.ts`, always external. Never link
  to a `/resume` route; it doesn't exist.
- Internal navigation uses `next/link`, never a bare `<a>`.
- Card- or row-shaped links (`ProjectCard`, `PostLink`) are one `<a>` wrapping
  the whole thing with `group`; hover effects inside use `group-hover:`.
- A row-shaped link gets `-mx-3 px-3 rounded-lg` plus the focus ring (see
  components.md). The negative margin lets the ring clear the text by 12px
  while the text stays aligned with the column. Without it the ring sits on
  the glyphs.
- External marker: home rows show none. Inner-page cards and rows follow
  `ProjectCard` — a trailing `ArrowUpRightIcon`, `size-3.5`, nudging
  up-right on group hover. A site-wide rule is pending (see `DESIGN.md`).
- Icon-only links need `aria-label`. Decorative icons beside text get
  `aria-hidden`.
