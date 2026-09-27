/**
 * Single source of truth for site-wide constants.
 * Anything used in more than one place — metadata, the home page — lives here.
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
  resume: RESUME_URL,
  social: {
    email: "yashshenai@gmail.com",
    github: "https://github.com/yashshenai",
    linkedin: "https://www.linkedin.com/in/yashshenai",
    x: "",
  },
} as const;
