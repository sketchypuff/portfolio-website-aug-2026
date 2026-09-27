# yashshenai.com

Personal portfolio. Currently the home page; about, projects, and blog are
being rebuilt. The content pipeline below is in place for them.

Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · MDX · Vercel.

## Develop

```bash
npm install
npm run dev
```

## Add a post

```
content/posts/my-post/
  index.mdx
  images/hero.jpg
```

```mdx
---
title: My post
summary: One sentence for the listing and link previews.
date: 2026-08-23
cover: hero.jpg
---

Prose is plain Markdown.

<Figure src="hero.jpg" caption="Optional caption." />
<Figure src="detail.jpg" bleed="wide" />
<Gallery images={["a.jpg", "b.jpg"]} />
```

Images go in the entry's `images/` folder and are referenced by bare filename.
Dimensions and blur placeholders are derived automatically at build time.

## Add a project

Same shape under `content/projects/`, with optional `year`, `role`, `featured`,
and `order` frontmatter.

Add an `external: https://…` URL to make it a link-out with no case study
page.

## Before pushing

```bash
npm run build
```

The build typechecks and prerenders every route, so bad frontmatter or a
missing image fails here rather than in production.

Architecture notes and conventions live in [AGENTS.md](AGENTS.md).
