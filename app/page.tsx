import { Container } from "@/components/container";
import {
  ArrowUpRightIcon,
  ClockIcon,
  CrownIcon,
  HandHeartIcon,
  IdentificationCardIcon,
  PenNibIcon,
  SmileyXEyesIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/ssr";
import { NoidaTime } from "@/components/noida-time";
import { ProfessionPill } from "@/components/profession-pill";
import { ThemeTextToggle } from "@/components/theme-toggle";
import { SectionLabel } from "@/components/section-label";
import { TextLink } from "@/components/text-link";
import { WorkCard, WorkStrip } from "@/components/work-strip";
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
    <div className="@container overflow-x-clip">
      <Container size="home" className="flex flex-col gap-20 pt-14 pb-16 text-base leading-snug font-medium">
        <Reveal as="header" className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4">
            {/* The paragraph keeps the Figma 436px measure; this row may run wider so
                every pill label fits beside the headline. Below md there isn't room
                for the longest one, so the pill always takes its own line there
                rather than jumping between lines as it cycles. */}
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
              <h1 className="font-bold md:whitespace-nowrap">Hi! I’m Yash, your neighbourhood</h1>
              <ProfessionPill />
            </div>
            <div className="text-muted-foreground max-w-[436px] space-y-[1lh]">
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
            <TextLink href={site.resume} icon={ArrowUpRightIcon}>
              Open resumé
            </TextLink>
            <TextLink href="/about" icon={SmileyXEyesIcon}>
              About
            </TextLink>
            <ThemeTextToggle />
          </nav>
        </Reveal>

        <section className="flex flex-col gap-8">
          <Reveal>
            <SectionLabel icon={CrownIcon}>Selected work</SectionLabel>
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
            <SectionLabel icon={PenNibIcon}>Writing</SectionLabel>
            <TextLink href="/blog" icon={ArrowUpRightIcon}>
              Open blog
            </TextLink>
          </Reveal>
          <RevealGroup as="ul">
            {writing.map((post) => (
              <RevealItem
                as="li"
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
            <SectionLabel icon={HandHeartIcon}>Other work</SectionLabel>
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
            <SectionLabel icon={IdentificationCardIcon}>
              Contact
            </SectionLabel>
            <ul role="list">
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
                <a
                  href={site.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-muted-foreground transition-colors"
                >
                  Resumé
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-8">
            <SectionLabel icon={WarningCircleIcon}>
              Last updated
            </SectionLabel>
            <time dateTime={lastUpdated.toISOString().slice(0, 10)}>{formatDay(lastUpdated)}</time>
          </div>
          <div className="flex flex-col gap-8 sm:items-end sm:text-right">
            <SectionLabel icon={ClockIcon}>
              Currently
            </SectionLabel>
            <NoidaTime />
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
