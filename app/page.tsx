import Link from "next/link";
import { Container } from "@/components/container";
import { Icon, type IconName } from "@/components/icon";
import { NoidaTime } from "@/components/noida-time";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Hardcoded from the Figma "Home" frame until these have real entries in
// content/. Cards and rows are not linked yet for the same reason.
const selectedWork = [
  {
    company: "Microsoft",
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
  },
  { company: "Adobe", title: "Optimised image masking with a refined selection experience" },
  { company: "Adobe", title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature" },
  {
    company: "Postman",
    title: "Reduced time taken by developers in discovering new content and finding team resources",
  },
];

// `muted` mirrors the design: the first three titles are dimmed, the last two are not.
const otherWork = [
  {
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
    muted: true,
  },
  { title: "Optimised image masking with a refined selection experience", muted: true },
  { title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature", muted: true },
  { title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature", muted: false },
  {
    title: "Reduced time taken by developers in discovering new content and finding team resources",
    muted: false,
  },
];

const writing = [
  { date: "2025-08-14", title: "How to use storytelling in UX case studies to land more interviews" },
  { date: "2025-08-14", title: "22 things about industrial design they didn’t teach me in design school" },
  { date: "2025-08-14", title: "Preparing for undergraduate design entrance exams in India" },
  { date: "2025-08-14", title: "An actionable guide on taking the first step towards learning UX design today" },
];

// Built from parts so the month is always three letters ("Sep", not en-GB's "Sept").
const dateParts = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDay(date: Date) {
  const part = (type: string) => dateParts.formatToParts(date).find((p) => p.type === type)?.value;
  return `${part("day")} ${part("month")} ${part("year")}`;
}

export default function HomePage() {
  // The page is prerendered, so this is the deploy date.
  const lastUpdated = new Date();

  return (
    <div className="overflow-x-clip">
      <Container size="home" className="flex flex-col gap-20 pt-14 pb-16 text-base leading-snug font-medium">
        <Reveal as="header" className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-[436px] flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-bold">Hi! I’m Yash, your neighbourhood</h1>
              <span className="bg-background border-border inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 shadow-xs">
                <Icon name="shapes" className="text-link" />
                product designer
              </span>
            </div>
            <div className="text-muted-foreground space-y-[1lh]">
              <p>
                Currently, I make agentic AI experiences feel oh yeah! at Microsoft. Previously,
                I’ve worked at Adobe, Postman and Samsung.
              </p>
              <p>
                I believe all software should be opinionated and delightful to use in order to be
                called usable.
              </p>
            </div>
          </div>

          <nav aria-label="Main" className="flex flex-col items-start gap-0.5 sm:items-end">
            <TextLink href="/resume" icon="arrow-up-right">
              Open resumé
            </TextLink>
            <TextLink href="/about" icon="smiley-x-eyes">
              About
            </TextLink>
          </nav>
        </Reveal>

        <section className="flex flex-col gap-8">
          <Reveal>
            <SectionLabel icon="crown-pixel">Selected work</SectionLabel>
          </Reveal>
          <WorkStrip>
            {selectedWork.map((item, i) => (
              <WorkCard key={i}>
                <p className="text-muted-foreground font-mono text-sm uppercase">{item.company}</p>
                <p className="mt-1">{item.title}</p>
              </WorkCard>
            ))}
          </WorkStrip>
        </section>

        <section className="flex flex-col gap-8">
          <Reveal className="flex items-start justify-between gap-4">
            <SectionLabel icon="ink-pen-pixel">Writing</SectionLabel>
            <TextLink href="/blog" icon="arrow-up-right">
              Open blog
            </TextLink>
          </Reveal>
          <RevealGroup>
            {writing.map((post) => (
              <RevealItem
                key={post.title}
                className="border-foreground/50 flex flex-col gap-1 border-b-[0.5px] py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-12"
              >
                <time dateTime={post.date} className="text-muted-foreground shrink-0 font-mono text-sm uppercase">
                  {formatDay(new Date(post.date))}
                </time>
                <p className="sm:text-right">{post.title}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        <section className="flex flex-col gap-8">
          <Reveal>
            <SectionLabel icon="hand-heart-pixel">Other work</SectionLabel>
          </Reveal>
          <WorkStrip>
            {otherWork.map((item, i) => (
              <WorkCard key={i}>
                <p className={cn(item.muted && "text-muted-foreground")}>{item.title}</p>
              </WorkCard>
            ))}
          </WorkStrip>
        </section>

        <Reveal as="footer" className="grid gap-12 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
          <div className="flex flex-col gap-8">
            <SectionLabel icon="identification-card">
              Contact
            </SectionLabel>
            <ul>
              <li>
                <a href={`mailto:${site.social.email}`} className="hover:text-muted-foreground transition-colors">
                  Email
                </a>
              </li>
              <li>
                {site.social.linkedin ? (
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-muted-foreground transition-colors"
                  >
                    LinkedIn
                  </a>
                ) : (
                  "LinkedIn"
                )}
              </li>
              <li>
                <Link href="/resume" className="hover:text-muted-foreground transition-colors">
                  Resumé
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-8">
            <SectionLabel icon="warning-circle">
              Last updated
            </SectionLabel>
            <time dateTime={lastUpdated.toISOString().slice(0, 10)}>{formatDay(lastUpdated)}</time>
          </div>
          <div className="flex flex-col gap-8 sm:items-end sm:text-right">
            <SectionLabel icon="clock">
              Currently
            </SectionLabel>
            <NoidaTime />
          </div>
        </Reveal>
      </Container>
    </div>
  );
}

function SectionLabel({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 font-mono text-sm font-semibold uppercase">
      {children}
      <Icon name={icon} />
    </h2>
  );
}

function TextLink({ href, icon, children }: { href: string; icon: IconName; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-link group inline-flex items-center gap-0.5 transition-opacity hover:opacity-70"
    >
      {children}
      <Icon name={icon} className="transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
    </Link>
  );
}

/**
 * Horizontal strip of cards. It starts on the content column and bleeds to the
 * right edge of the viewport, so the cut-off card signals that it scrolls.
 */
function WorkStrip({ children }: { children: React.ReactNode }) {
  return (
    <RevealGroup className="mr-[calc(50%-50vw)] flex snap-x snap-mandatory gap-6 overflow-x-auto pr-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {children}
    </RevealGroup>
  );
}

function WorkCard({ children }: { children: React.ReactNode }) {
  return (
    <RevealItem className="w-[570px] max-w-[85vw] shrink-0 snap-start">
      <div className="bg-muted aspect-[4/3] rounded-xl" />
      <div className="mt-5">{children}</div>
    </RevealItem>
  );
}
