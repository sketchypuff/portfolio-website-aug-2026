import type { Metadata } from "next";
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CrownIcon,
  PenNibIcon,
  SmileyXEyesIcon,
} from "@phosphor-icons/react/ssr";
import { Container } from "@/components/container";
import { Figure } from "@/components/content/figure";
import { PostNav } from "@/components/content/post-nav";
import { IconCircle } from "@/components/icon-circle";
import { Mdx } from "@/components/content/mdx";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { NoidaTime } from "@/components/noida-time";
import { ProfessionPill } from "@/components/profession-pill";
import { SectionLabel } from "@/components/section-label";
import { TextLink } from "@/components/text-link";
import { ThemeTextToggle } from "@/components/theme-toggle";
import { WorkCard, WorkStrip } from "@/components/work-strip";

// A living style guide: every specimen below is the real component or the real
// class string, so this page can't drift from the site. Unlisted — not in the
// nav or sitemap, and noindex. The rules behind it are in DESIGN.md.
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

// Tailwind needs literal class names, so each swatch spells its class out.
// `origin` mirrors the table in docs/design/color.md.
const colors = [
  { token: "background", swatch: "bg-background", use: "Page, pill surface", origin: "shadcn neutral" },
  { token: "foreground", swatch: "bg-foreground", use: "Default text", origin: "shadcn neutral" },
  { token: "muted-foreground", swatch: "bg-muted-foreground", use: "Secondary text, metadata", origin: "shadcn neutral" },
  { token: "muted", swatch: "bg-muted", use: "Image slots, placeholders, code", origin: "shadcn neutral" },
  { token: "border", swatch: "bg-border", use: "Default borders", origin: "shadcn neutral" },
  { token: "ring", swatch: "bg-ring", use: "Focus outline, at 50%", origin: "shadcn neutral" },
  { token: "link", swatch: "bg-link", use: "TextLink, ThemeTextToggle, pill icon", origin: "Figma · #2148f9" },
  { token: "destructive", swatch: "bg-destructive", use: "MdxError only", origin: "shadcn neutral" },
];

// The blue scale is primitives-only (no utility classes), so swatches read the
// variables directly. Step 600 is the light-mode link.
const blueSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const containers = [
  { size: "prose", note: "max-w-2xl · reading column" },
  { size: "default", note: "max-w-3xl" },
  { size: "home", note: "875px column · the home page" },
  { size: "wide", note: "max-w-5xl" },
  { size: "article", note: "700px column · post body (Figma Blog)" },
  { size: "articleWide", note: "1323px · post back link, prev/next, wide images" },
] as const;

const radii = [
  { name: "rounded-xl", className: "rounded-xl", use: "Work cards, figures, pre" },
  { name: "rounded-lg", className: "rounded-lg", use: "Pill, row focus ring" },
  { name: "rounded", className: "rounded", use: "Inline code" },
];

const proseSample = `Body copy at 20/32, held to the 700px article column. Links look
like [this one](#prose), **strong** is bold, and \`code\` sits on muted.

## Prose h2

1. Numbered lists hang a mono, muted number
2. Two or three lines, no more

- Bulleted lists share the same indent

### Prose h3

> Blockquotes are muted and italic, with a border on the left.`;

export default function DesignPage() {
  return (
    <div className="@container overflow-x-clip pb-8">
      <Container size="home" className="pt-16 sm:pt-24">
        <Reveal as="header" className="max-w-2xl">
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Design system</h1>
          <p className="text-muted-foreground mt-4 leading-relaxed text-pretty">
            Every token and shared component on the site, rendered from the real code. The
            rules for when to use what are in <Code>DESIGN.md</Code> and <Code>docs/design/</Code>.
          </p>
        </Reveal>
      </Container>

      <Section title="Color" source="app/globals.css · docs/design/color.md">
        <p className="text-muted-foreground mb-6 flex flex-wrap items-center gap-x-3 text-sm">
          Showing the current theme. <ThemeTextToggle />
        </p>
        <ul role="list" className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {colors.map((c) => (
            <li key={c.token}>
              <div className={`${c.swatch} border-border aspect-[4/3] rounded-lg border`} />
              <p className="mt-3 font-mono text-xs">{c.token}</p>
              <p className="text-muted-foreground mt-1 text-xs">{c.use}</p>
              <p className="text-muted-foreground mt-1 font-mono text-xs">{c.origin}</p>
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground mt-12 mb-4 text-sm">
          Blue scale — primitives in <Code>globals.css</Code>, built from the link blue (600).
          Not used by components directly.
        </p>
        <ul role="list" className="grid grid-cols-11 gap-1 sm:gap-2">
          {blueSteps.map((step) => (
            <li key={step}>
              <div
                className="border-border aspect-square rounded-md border sm:aspect-[3/4]"
                style={{ backgroundColor: `var(--blue-${step})` }}
              />
              <p className={`mt-2 font-mono text-xs ${step === 600 ? "font-semibold" : "text-muted-foreground"}`}>
                {step}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Typography" source="app/page.tsx · Decided">
        <div className="space-y-6 text-base leading-snug font-medium">
          <Specimen label="Headline · font-bold, 16px">
            <p className="font-bold">Hi! I’m Yash, your neighbourhood</p>
          </Specimen>
          <Specimen label="Body · inherited 16px medium, leading-snug">
            <p>Design domain-based skill driven experiences for Excel and PowerPoint.</p>
          </Specimen>
          <Specimen label="Secondary · text-muted-foreground">
            <p className="text-muted-foreground">
              Currently, I make agentic AI experiences feel oh yeah! at Microsoft.
            </p>
          </Specimen>
          <Specimen label="Metadata · font-mono text-sm uppercase, muted">
            <p className="text-muted-foreground font-mono text-sm uppercase">Microsoft · 14 Aug 2025</p>
          </Specimen>
          <Specimen label="SectionLabel">
            <SectionLabel icon={CrownIcon}>Selected work</SectionLabel>
          </Specimen>
        </div>
      </Section>

      <Section title="Prose" source="components/content/mdx.tsx · Decided from Figma Blog, except h3, quote, code, table">
        <div className="max-w-[700px] font-medium">
          <Mdx source={proseSample} collection="posts" slug="example" />
        </div>
      </Section>

      <Section title="Links" source="docs/design/links.md">
        <div className="space-y-6">
          <Specimen label="TextLink · home navigation">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-base font-medium">
              <TextLink href="#links" icon={ArrowUpRightIcon}>
                Open blog
              </TextLink>
              <TextLink href="#links" icon={SmileyXEyesIcon}>
                About
              </TextLink>
            </div>
          </Specimen>
          <Specimen label="ThemeTextToggle · home nav theme switch">
            <div className="text-base font-medium">
              <ThemeTextToggle />
            </div>
          </Specimen>
          <Specimen label="Quiet link · home lists (class string from app/page.tsx)">
            <a href="#links" className="hover:text-muted-foreground text-base font-medium transition-colors">
              Email
            </a>
          </Specimen>
          <Specimen label="Prose link · running text">
            <Mdx source="Read more [about the work](#links)." collection="posts" slug="example" />
          </Specimen>
        </div>
      </Section>

      <Section title="Home components" source="Decided">
        <div className="space-y-10 text-base leading-snug font-medium">
          <Specimen label="ProfessionPill · click to cycle">
            <ProfessionPill />
          </Specimen>
          <Specimen label="NoidaTime">
            <NoidaTime />
          </Specimen>
          <Specimen label="WorkStrip + WorkCard · scrolls sideways">
            <WorkStrip>
              <WorkCard>
                <p className="text-muted-foreground font-mono text-sm uppercase">Company</p>
                <p className="mt-1">A work card with a company line and a title</p>
              </WorkCard>
              <WorkCard>
                <p className="text-muted-foreground">An “Other work” card, title only and muted</p>
              </WorkCard>
            </WorkStrip>
          </Specimen>
        </div>
      </Section>

      <Section title="Content components" source="components/content/ · rendered from content/posts/example">
        <div className="space-y-10 text-base leading-snug font-medium">
          <Specimen label="Figure · bleed prose, with caption">
            <div className="max-w-[700px]">
              <Figure collection="posts" slug="example" src="example.jpg" caption="A caption sits below, muted." className="my-0" />
            </div>
          </Specimen>
          <Specimen label="IconCircle · post back link (components/icon-circle.tsx)">
            <IconCircle icon={ArrowLeftIcon} />
          </Specimen>
          <Specimen label="PostNav · older left, newer right">
            <PostNav
              older={{ href: "#content-components", meta: { title: "An older post with a title that wraps onto two lines", summary: "", date: "2026-01-01" } }}
              newer={{ href: "#content-components", meta: { title: "A newer post", summary: "", date: "2026-02-01" } }}
            />
          </Specimen>
        </div>
      </Section>

      <Section title="Motion" source="components/motion/ · docs/design/motion.md">
        <p className="text-muted-foreground mb-6 text-sm">
          RevealGroup + RevealItem, 0.06s stagger. Reload the page with this in view to replay.
          Hover effects are on the links above; press feedback is on the pill.
        </p>
        <RevealGroup as="ul" className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <RevealItem as="li" key={i} className="bg-muted aspect-square rounded-lg" />
          ))}
        </RevealGroup>
      </Section>

      <Section title="Radius" source="--radius: 0.625rem">
        <ul role="list" className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {radii.map((r) => (
            <li key={r.name}>
              <div className={`bg-muted aspect-[4/3] ${r.className}`} />
              <p className="mt-3 font-mono text-xs">{r.name}</p>
              <p className="text-muted-foreground mt-1 text-xs">{r.use}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Icons" source="Phosphor · @phosphor-icons/react">
        <ul role="list" className="flex flex-wrap items-end gap-8">
          {[
            { size: "size-6", use: "Home, 24px" },
            
          ].map((icon) => (
            <li key={icon.size} className="flex flex-col items-start gap-3">
              <PenNibIcon aria-hidden className={icon.size} />
              <div>
                <p className="font-mono text-xs">{icon.size}</p>
                <p className="text-muted-foreground mt-1 text-xs">{icon.use}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Container size="home" className="mt-20">
        <h2 className="text-xl font-medium tracking-tight">Page widths</h2>
        <p className="text-muted-foreground mt-1 font-mono text-xs">components/container.tsx</p>
      </Container>
      <div className="mt-6 space-y-3">
        {containers.map((c) => (
          <Container key={c.size} size={c.size}>
            <div className="bg-muted rounded-lg px-4 py-3">
              <p className="font-mono text-xs">{c.size}</p>
              <p className="text-muted-foreground mt-1 text-xs">{c.note}</p>
            </div>
          </Container>
        ))}
      </div>
    </div>
  );
}

function Section({
  title,
  source,
  children,
}: {
  title: string;
  source: string;
  children: React.ReactNode;
}) {
  const id = title.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "");
  return (
    <Container size="home" className="mt-20">
      <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
        <h2 id={`${id}-title`} className="text-xl font-medium tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground mt-1 font-mono text-xs">{source}</p>
        <div className="border-border mt-6 border-t pt-8">{children}</div>
      </section>
    </Container>
  );
}

function Specimen({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-muted-foreground mb-2 font-mono text-xs">{label}</p>
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.85em]">{children}</code>;
}
