import { Book, type Chapter, type OtherWork, type Post } from "@/components/book/book";
import type { Wash } from "@/components/book/plate";
import { Oneko } from "@/components/oneko";

// Hardcoded from the Figma "Home" frame until these have real entries in
// content/. Chapters are not linked yet for the same reason; a writing row
// links once its post exists.
// Each chapter's `wash` drives its PLACEHOLDER plate until Yash paints it.
const selectedWork: Chapter[] = [
  {
    numeral: "I",
    company: "Microsoft",
    title:
      "Design domain-based (accounting, marketing etc.) skill driven experiences for Excel and Powerpoint agent mode",
    wash: { sky: "cerulean", hills: "indigo", ground: "ochre", seed: 3 },
  },
  {
    numeral: "II",
    company: "Adobe",
    title: "Optimised image masking with a refined selection experience",
    wash: { sky: "ochre", hills: "sienna", ground: "sepia", seed: 11 },
  },
  {
    numeral: "III",
    company: "Adobe",
    title: "Increased engagement of the Heal tool by 15% through a Gen-AI feature",
    wash: { sky: "cerulean", hills: "sap", ground: "sienna", seed: 7 },
  },
  {
    numeral: "IV",
    company: "Postman",
    title: "Reduced time taken by developers in discovering new content and finding team resources",
    wash: { sky: "ochre", hills: "indigo", ground: "sap", seed: 19 },
  },
];

const frontispiece: Wash = { sky: "cerulean", hills: "sap", ground: "ochre", seed: 5 };

// `muted` mirrors the design: the first three titles are dimmed, the last two are not.
const otherWork: OtherWork[] = [
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

// `href` is set once a post exists in content/posts; unlinked rows stay plain text.
// Rendered newest first, whatever order they're listed in.
const writing: Post[] = [
  {
    date: "2025-07-20",
    title: "How to use storytelling in UX case studies to land more interviews",
    href: "/blog/storytelling-in-ux-case-studies",
  },
  {
    date: "2024-11-28",
    title: "22 things about industrial design they didn’t teach me in design school",
    href: "/blog/22-things-about-industrial-design",
  },
  {
    date: "2024-05-04",
    title: "Preparing for undergraduate design entrance exams in India",
    href: "/blog/design-entrance-exams-in-india",
  },
  {
    date: "2024-02-24",
    title: "An actionable guide on taking the first step towards learning UX design today",
    href: "/blog/first-step-learning-ux-design",
  },
  {
    date: "2024-01-27",
    title: "Thoughts on making UX portfolio websites for fresh graduates seeking a job in the industry",
    href: "/blog/ux-portfolio-websites-for-fresh-graduates",
  },
];

export default function HomePage() {
  // The page is prerendered, so this is the deploy date: the edition.
  const lastUpdated = new Date().toISOString();

  return (
    <div className="@container min-h-screen overflow-x-clip px-3 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
      <Oneko />
      <Book
        frontispiece={frontispiece}
        chapters={selectedWork}
        otherWork={otherWork}
        writing={writing}
        lastUpdated={lastUpdated}
      />
    </div>
  );
}
