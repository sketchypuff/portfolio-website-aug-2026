/**
 * Single source of truth for site-wide constants.
 * Anything that appears in metadata, the nav, or the footer lives here.
 */

/** Resume PDF on Google Drive. Every link to it opens in a new tab. */
const RESUME_URL =
  "https://drive.google.com/file/d/1h_eagfw47RlClGJTtwSf4VkBmmaUEd9K/view?usp=sharing";

export const site = {
  name: "Yash Shenai",
  role: "Product Designer",
  url: "https://yashshenai.com",
  description:
    "Product designer. Case studies, writing, and work in progress.",
  locale: "en_US",
  nav: [
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: RESUME_URL, label: "Resume" },
  ],
  resume: RESUME_URL,
  social: {
    email: "yashshenai@gmail.com",
    github: "https://github.com/yashshenai",
    linkedin: "https://www.linkedin.com/in/yashshenai",
    x: "",
  },
} as const;

export type NavItem = (typeof site.nav)[number];
