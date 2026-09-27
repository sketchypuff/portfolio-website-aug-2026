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

## Post page (Decided — Figma "Blog", node `1132:2209`)

The page wrapper in `app/blog/[slug]/page.tsx` sets `font-medium`; every size
below is medium unless it says bold or regular. The header lives in that page; the body
comes from the `prose` map in `components/content/mdx.tsx`. Tune the body there;
never restyle prose elements at a call site.

| Element | Classes | Notes |
| --- | --- | --- |
| Title `h1` | `text-2xl font-bold` | 24px at every width (from Yash; Figma had 36/40). No `text-balance` |
| Subtitle (`summary`) | `text-2xl text-muted-foreground` | Figma black 40% → muted. No `text-pretty` |
| Meta | `text-2xl` | `6 min. read • 15 Aug, 2026` |
| `p`, `ul`, `ol` | `text-xl leading-8 font-normal` (20/32, regular) | `my-6`; consecutive `p` get `mt-8` (one blank line) |
| `ol` numbers | `font-mono text-muted-foreground` | hang 2px left of the text, text at `pl-[50px]` |
| `h2` | `text-2xl font-bold` | `mt-20 mb-6` — 80px before a section, 24px inside. No `text-balance` |
| `strong` | `font-semibold` | not in Figma; semibold against the regular body (from Yash) |
| `blockquote` | `text-xl leading-8 italic text-muted-foreground` | matches body size |
| `h3`, `code`, `pre`, `table` | — | **Provisional**: not in the frame; only re-scaled to sit with 20px body |
| `figcaption` | `text-sm` | muted, `leading-relaxed`, centered (`text-center text-balance`, from Yash) |

Figma sets body and meta at black 80%; they use `foreground` instead, so the
site keeps two text levels (decided 2026-09-27).

## Rules

- **Floor is 12px** (`text-xs`). Never use `text-[11px]` or smaller.
- **Sizes in use:** `text-xs`, `text-sm`, `text-base` (home), and on the
  post page `text-xl` (body, `h3`), `text-2xl` (`h2`, title, subtitle,
  meta). Nothing else exists.
- **Weights in use:** medium (500) default, regular (400) only for post
  paragraphs and lists, semibold (600) in `SectionLabel` and post `strong`,
  bold (700) for the home headline and post headings. Never `font-light` or `font-black`.
- Site pages use default tracking. No `tracking-tight` on page content.
- Numbers that update in place (the clock) use `tabular-nums`.
- Use real typographic characters in copy: `’` `“ ”` `—` `é` (as in "resumé").

```tsx
// Correct — home metadata, from app/page.tsx
<time className="text-muted-foreground shrink-0 font-mono text-sm uppercase">…</time>

// Incorrect — smaller size and no uppercase: not the home metadata style
<time className="text-muted-foreground font-mono text-xs">…</time>
```
