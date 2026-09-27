<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# yashshenai.com

Personal portfolio for Yash Shenai, a product designer. Right now the site is
the home page, blog post pages (`/blog/[slug]`), and an unlisted `/design`
style guide; the about, projects, and blog index pages are being rebuilt from
scratch. The resume is a PDF on Google Drive
(`site.resume` in `lib/site.ts`), not a page — every resume link opens it in a
new tab. Deployed on Vercel.

`CLAUDE.md` is a one-line pointer to this file, so Claude Code, Codex, and
Cursor all read the same instructions. Edit this file, never that one.

`DESIGN.md` is the root of the design system: its hard rules, which parts are
Decided vs Provisional, and an index into `docs/design/` (color, typography,
layout, links, components, motion, decision log). Read it before any visual
change and open the topic file the task needs. Update those docs in the same
change as the code — a new component, token, or visual decision is not done
until it is documented there. This file covers architecture; those cover how
the site looks and why.

## Commands

```bash
npm run dev      # dev server (Turbopack) on :3000
npm run build    # production build — run before claiming a change works
npm run start    # serve the production build
npm run lint     # eslint
npx tsc --noEmit # typecheck
npx next typegen # regenerate route types after adding/renaming a route
```

There is no test suite. `npm run build` is the gate: it typechecks and
prerenders every route, so a broken image reference or bad frontmatter fails
the build rather than reaching the site.

## Stack

Next.js 16 (App Router, Turbopack) · React 19.2 · TypeScript · Tailwind v4 ·
shadcn/ui (`radix-nova`, neutral) · MDX via `next-mdx-remote-client` ·
`motion` · `next-themes` · Vercel Analytics.

## Content architecture

This is the part worth understanding before editing anything.

Content is filesystem-backed, not a CMS. Each entry is a **directory** so that
images sit next to the prose:

```
content/
  posts/<slug>/index.mdx + images/*
  projects/<slug>/index.mdx + images/*
```

The directory name is the URL slug. `lib/content.ts` reads these with
`gray-matter`, validates frontmatter, and exposes `getPosts`, `getProjects`,
`getEntry`, `getFeaturedProjects`, `getRenderableSlugs`. Frontmatter validation
throws with the offending file path — that is deliberate, so content mistakes
surface at build time.

### Images — the non-obvious part

Content images are **not** served from `public/`. They are loaded through the
bundler by `lib/images.ts` using a dynamic `import()` with a static path
prefix, which makes Next emit a context module over `content/<collection>/`.

That indirection buys automatic intrinsic width/height and a blur placeholder,
which is what keeps image-heavy pages from shifting as they load. It is also
why `content/posts/` and `content/projects/` must each contain at least one
directory with an `images/` folder — an empty tree gives the bundler nothing to
build a context from.

Two separate loader functions exist (`loadPostImage`, `loadProjectImage`) purely
to keep each context module scoped to one collection. Do not merge them into
one function with a dynamic collection segment.

### Authoring

Frontmatter is validated in `parseMeta` in `lib/content.ts` — that function is
the schema. Posts need `title`, `summary`, `date`. Projects add optional
`year`, `role`, `external`, `featured`, `order`.

A project with an `external` URL is a link-out with **no** detail page.
`getRenderableSlugs` already filters those out; when the project detail route
is rebuilt, use it for `generateStaticParams`, call `notFound()` for external
entries, and skip them in `sitemap.ts`. Keep those three in sync.

`app/blog/[slug]/page.tsx` renders posts: `generateStaticParams` from
`getRenderableSlugs`, `dynamicParams = false`, and `sitemap.ts` lists every
post. Reading time (`readingTime`) and the older/newer links
(`getAdjacentPosts`) come from `lib/content.ts`. No route renders projects
yet.

In MDX, `<Figure>` and `<Gallery>` are pre-bound to the current entry in
`components/content/mdx.tsx`, so authors write `<Figure src="hero.jpg" />` with
a bare filename. `bleed` accepts `prose` | `wide` | `full`.

Prose styles are hand-rolled in the `prose` map in `components/content/mdx.tsx`
rather than using `@tailwindcss/typography` — the type scale is the thing most
worth tuning on this site, so it stays in one readable place.

### Page-local data

A list that only one page shows (home's work strips, a /uses list) is a typed
array at the top of that page. Only things with their own detail page go in
`content/`. Don't put page copy in `lib/site.ts` — that file is for values
used in more than one place.

### The /design route

`app/design/page.tsx` is an unlisted, `noindex` style guide. Keep it out of
the home nav and `app/sitemap.ts`. It must import real components, never copies,
so it cannot drift.

### Adding a page

A new route needs, besides the page itself: an entry in `app/sitemap.ts`
(listed by hand), a link from somewhere (the home nav in `app/page.tsx` is
hand-written), and `npx next typegen`. There is no global header or footer —
each page carries its own navigation, like home, until a shared one is
designed.

## Motion

`components/motion/` holds the vocabulary. `Reveal` for single elements,
`RevealGroup` + `RevealItem` for staggered lists, `PageTransition` for route
changes.

House defaults: 12px of travel, 500ms, `cubic-bezier(0.22, 1, 0.36, 1)`, once
only. The route transition is enter-only on purpose — animating the outgoing
page holds stale content on screen and reads as lag.

Every motion component early-returns a static version under
`useReducedMotion()`. Preserve that in anything new.

## Conventions

- Server Components by default. `"use client"` only where there is state,
  an event handler, or a hook — currently the theme toggle, motion
  components, `NoidaTime`, and `ProfessionPill`.
- There is no global header or footer. `app/layout.tsx` renders only the page
  (inside `PageTransition`); home carries its own nav and footer row.
- Icons come from Phosphor (`@phosphor-icons/react`; `/ssr` in Server
  Components). There is no custom icon set; don't add SVGs to `public/`
  for icons Phosphor already has.
- `Figure` and `Gallery` are async Server Components because
  they await image resolution. Keep them server-side.
- Route params are Promises in Next 16. Use the generated helpers:
  `PageProps<'/blog/[slug]'>`, then `await props.params`. Run
  `npx next typegen` after adding a route so the helper knows it.
- Layout widths come from `<Container size="home" | "article" | "articleWide" | "prose" | "default" | "wide">`.
  Do not hand-roll `max-w-*` on page wrappers.
- Site-wide constants (name, URL, resume, social) live in `lib/site.ts`.
- Colors are shadcn CSS variables in `app/globals.css` — a deliberately
  pure-neutral OKLCH ramp. Use `bg-background`, `text-muted-foreground`, etc.
  Never hardcode a hex value.
- Git: never commit or push unless Yash explicitly asks — finishing a task
  is not permission. When asked, commit and push to the branch that is
  checked out, including `main`. Never create a branch, or commit or push to
  a new one, unless Yash explicitly asks for it.

## Open graph

**Not yet wired up.** The decision was one static card for the whole site
(not per-post generated cards). To enable it, drop a 1200×630 PNG at
`app/opengraph-image.png` — Next's file convention picks it up automatically
and applies it to every route. No code change needed.

`metadataBase` is already set from `lib/site.ts`, which is what makes the OG
URL resolve absolutely. Per-post cards were considered and deferred; adding
them later means dropping an `opengraph-image.tsx` into each `[slug]`
directory.

## Design status

The home page (`app/page.tsx`) is built from the Figma "Home" frame. Its
project cards and writing rows are hardcoded arrays for now. A writing row
links to its post once the post exists in `content/posts/` (set `href`); the
rest, and the project cards, are not linked yet. Its `/about` and `/blog`
links point at pages that don't exist yet, so they hit Next's default 404
until those pages are rebuilt. The infrastructure below the pages is real
and tested.

`content/projects/example/` is a throwaway reference entry documenting the
project frontmatter. Delete it once a real project exists. Each collection
must keep at least one entry with an `images/` folder, or the image context
module breaks — for posts, `storytelling-in-ux-case-studies` covers that.
