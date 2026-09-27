# Typography

Fonts: Geist Sans (`font-sans`, default) and Geist Mono (`font-mono`), loaded
in `app/layout.tsx` with `antialiased` on `<html>`. No other families.

Mono means "metadata or label" — dates, company names, section labels, code.
Never set prose or titles in mono.

## Home scale (Decided — from Figma)

Set once on the home `Container`: `text-base leading-snug font-medium`.
Children inherit; don't restate them.

| Role | Classes | Example |
| --- | --- | --- |
| Body, titles, links | inherited: 16px, medium, `leading-snug` | work card title |
| Intro headline | `font-bold` (same 16px) | "Hi! I'm Yash…" |
| Secondary body | `text-muted-foreground` | intro paragraph |
| Section label | `SectionLabel` (mono, `text-sm`, semibold, uppercase) | SELECTED WORK |
| Metadata | `text-muted-foreground font-mono text-sm uppercase` | MICROSOFT, 14 AUG 2025 |
| Paragraph gap | `space-y-[1lh]` | one blank line between paragraphs |

Hierarchy on home comes from weight and case, not size. Everything is 16px or
14px. Do not add a larger heading size to the home page — the headline is bold
16px on purpose, so the work cards are the loudest thing on the page.

## Prose (Provisional)

Defined once in the `prose` map in `components/content/mdx.tsx`. Tune the type
scale there; never restyle prose elements at a call site. These styles predate
the redesign — expect them to change when the article page is designed.

| Element | Size | Other |
| --- | --- | --- |
| `p`, `ul`, `ol` | 16px | `leading-[1.75]`, `my-5`, `text-pretty` |
| `h2` | `text-xl` | `mt-14 mb-4`, medium, `tracking-tight` |
| `h3` | `text-base` | `mt-10 mb-3`, medium, `tracking-tight` |
| `strong` | — | `font-medium` (not bold) |
| `code` | `0.85em` | mono, `bg-muted` |
| `pre`, `table` | `text-sm` | |
| `figcaption` | `text-sm` | muted, `leading-relaxed` |

1.75 leading is for long-form reading at the `prose` width (`max-w-2xl`,
~70 characters). Short UI text uses `leading-snug` or `leading-relaxed`.

## Rules

- **Floor is 12px** (`text-xs`). Never use `text-[11px]` or smaller.
- **Sizes in use:** `text-xs`, `text-sm`, `text-base`, and `text-xl` (prose
  `h2` only). Nothing else exists. A page-title size for new pages is not
  decided yet — take it from Figma, don't pick one.
- **Weights in use:** medium (500) default, semibold (600) only in
  `SectionLabel`, bold (700) only for the home headline. Never `font-light`
  or `font-black`.
- `tracking-tight` goes on prose headings only. Home text uses default
  tracking.
- Numbers that update in place (the clock) use `tabular-nums`.
- Use real typographic characters in copy: `’` `“ ”` `—` `é` (as in "resumé").

```tsx
// Correct — home metadata, from app/page.tsx
<time className="text-muted-foreground shrink-0 font-mono text-sm uppercase">…</time>

// Incorrect — smaller size and no uppercase: not the home metadata style
<time className="text-muted-foreground font-mono text-xs">…</time>
```
