<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# yashshenai.com

Personal portfolio for Yash Shenai, a product designer. Home, about, projects,
blog, resume. Deployed on Vercel.

`CLAUDE.md` is a one-line pointer to this file, so Claude Code, Codex, and
Cursor all read the same instructions. Edit this file, never that one.

`DESIGN.md` holds design principles and the visual system. Read it before
making any visual change, and record decisions there as they are made — this
file covers architecture, that one covers how the site should look and why.

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

A project with an `external` URL renders as a link-out card and gets **no**
detail page: `getRenderableSlugs` filters it out of `generateStaticParams`, the
route calls `notFound()`, and `sitemap.ts` skips it. Keep those three in sync.

In MDX, `<Figure>` and `<Gallery>` are pre-bound to the current entry in
`components/content/mdx.tsx`, so authors write `<Figure src="hero.jpg" />` with
a bare filename. `bleed` accepts `prose` | `wide` | `full`.

Prose styles are hand-rolled in the `prose` map in `components/content/mdx.tsx`
rather than using `@tailwindcss/typography` — the type scale is the thing most
worth tuning on this site, so it stays in one readable place.

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
  an event handler, or a hook — currently the header, theme toggle, and motion
  components.
- `Figure`, `Gallery`, and `ProjectCard` are async Server Components because
  they await image resolution. Keep them server-side.
- Route params are Promises in Next 16. Use the generated helpers:
  `PageProps<'/blog/[slug]'>`, then `await props.params`.
- Layout widths come from `<Container size="prose" | "default" | "wide">`.
  Do not hand-roll `max-w-*` on page wrappers.
- Site-wide constants (name, URL, nav, social) live in `lib/site.ts`.
- Colors are shadcn CSS variables in `app/globals.css` — a deliberately
  pure-neutral OKLCH ramp. Use `bg-background`, `text-muted-foreground`, etc.
  Never hardcode a hex value.
- Git: commit and push to the branch that is checked out, including `main`.
  Never create a branch, or commit or push to a new one, unless Yash
  explicitly asks for it.

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

The visual design is a placeholder pending real designs from Yash. Page bodies
(`app/page.tsx`, `app/about/page.tsx`, `app/resume/page.tsx`) contain filler
copy marked with comments. The infrastructure below them is real and tested.

`content/*/example/` are throwaway reference entries documenting the
frontmatter and components. Delete once real content exists — but keep at
least one entry per collection, or the image context module breaks.
