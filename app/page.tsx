import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { CopyEmail } from "@/components/copy-email";
import { ClickSound } from "@/components/brutalist/click-sound";
import { SquareCursor } from "@/components/brutalist/square-cursor";
import { Grain } from "@/components/brutalist/grain";
import { ThemeSunToggle } from "@/components/brutalist/theme-sun-toggle";
import { formatShortDate, getPosts } from "@/lib/content";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import almCommunity from "@/assets/more-work/alm-community.png";
import almCourse from "@/assets/more-work/alm-course.png";
import almHome from "@/assets/more-work/alm-home.png";
import expressInterop from "@/assets/more-work/express-interop.png";
import eyeCareDevice from "@/assets/more-work/eye-care-device.png";
import psxAndroidHome from "@/assets/more-work/psx-android-home.png";
import psxWhatsNew from "@/assets/more-work/psx-whats-new.png";
import samsungCamera from "@/assets/more-work/samsung-camera.png";

// Hardcoded until these have real entries in content/. Cards without a case
// study yet point at the placeholder one; give each its own href once its
// project exists. The images are placeholders until there are project images to show.
const EXAMPLE = "/projects/example";
const work = [
  { title: "Microsoft", subtitle: "Excel & PowerPoint agent mode", href: EXAMPLE },
  { title: "Adobe", subtitle: "Image masking", href: "/projects/adobe-masks" },
  { title: "Adobe", subtitle: "Heal tool, Gen-AI", href: EXAMPLE },
  { title: "Postman", subtitle: "Content discovery", href: EXAMPLE },
];


// Smaller projects without a case study, from the "Extras" list on the Framer
// "Yash's Portfolio v2" home, images included. Not linked.
const moreWork: { label: string; title: string; image: StaticImageData }[] = [
  { label: "Adobe, 2024", title: "Increased Adobe Express MAU by 7% through interop with Photoshop Express", image: expressInterop },
  { label: "Adobe, 2024", title: "Entry points to new features on Photoshop Express", image: psxWhatsNew },
  { label: "Adobe, 2022", title: "Revamped a home screen to surface relevant courses to a company’s employees", image: almHome },
  { label: "Adobe, 2024", title: "Home screen for Photoshop Express Android", image: psxAndroidHome },
  { label: "Adobe, 2022", title: "Increased course enrollment by closing dead ends", image: almCourse },
  { label: "Adobe, 2022", title: "Transformed a learning platform into an interactive community", image: almCommunity },
  { label: "Samsung, 2021", title: "A video editing studio for Samsung Camera", image: samsungCamera },
  { label: "College project, 2021", title: "Preventive eye care device for IT workers", image: eyeCareDevice },
];

// Three columns of the work area at 1200px+, two at 810px+, one below.
const GRID_SIZES = "(min-width: 1200px) calc((100vw - 402px) / 3), (min-width: 810px) calc(50vw - 21px), calc(100vw - 28px)";

/** A list section's header: muted label and meta over a 1px rule, like Selected Works below 1200px. */
function ListHeader({ id, label, meta }: { id: string; label: string; meta: string }) {
  return (
    <div className="text-muted-foreground border-border flex justify-between border-b pb-px">
      <h2 id={id}>{label}</h2>
      <p>{meta}</p>
    </div>
  );
}

const row = "border-border grid grid-cols-[1fr_auto] gap-[14px] border-b py-[7px]";

// The grid cycles portrait, square, landscape, square, so every row of three
// mixes heights and the columns never line up into a plain table.
const ASPECTS = ["aspect-[4/5]", "aspect-square", "aspect-[4/3]", "aspect-square"];

const UPDATED = "2026-11-18";

// The sidebar's two link groups. Blog jumps to the Blog list below until a
// /blog index exists; the resume and socials open in a new tab.
const contents = [
  { label: "Blog", href: "#blog" },
  { label: "About", href: "/about" },
  { label: "Resumé", href: site.resume, external: true },
];

const socials = [
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "GitHub", href: site.social.github },
];

const link = "underline focus-visible:ring-ring rounded-xs focus-visible:ring-2 focus-visible:outline-none";

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div
      className="brutalist bg-background text-foreground min-h-dvh font-sans text-sm leading-5 min-[1200px]:flex"
    >
      <section className="flex min-h-[565px] shrink-0 flex-col p-[14px] min-[1200px]:sticky min-[1200px]:top-0 min-[1200px]:h-dvh min-[1200px]:min-h-0 min-[1200px]:w-[360px]">
        <div className="flex max-w-[560px] flex-col gap-[14px] min-[1200px]:max-w-none">
          <div className="flex flex-col items-start gap-[13px] min-[1200px]:flex-row min-[1200px]:items-center min-[1200px]:gap-3">
            <ThemeSunToggle />
            <h1>Hi, I’m {site.name}!</h1>
          </div>
          <div className="flex flex-col gap-[7px]">
            <p>
              I’m a product designer. Currently, I make agentic AI experiences feel{" "}
              <em className="oh-yeah whitespace-nowrap">oh yeah!</em> at Microsoft.
            </p>
            <p>
              I believe all software should be opinionated and delightful to use in order to be
              called usable.
            </p>
            <p>Previously, I’ve worked at Adobe, Postman, and Samsung.</p>
          </div>
          <nav aria-labelledby="contents-heading">
            <h2 id="contents-heading" className="text-muted-foreground">
              Table of Contents
            </h2>
            <ul className="mt-[7px] flex flex-col items-start gap-1">
              {contents.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noreferrer" className={link}>
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className={link}>
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <section aria-labelledby="socials-heading">
            <h2 id="socials-heading" className="text-muted-foreground">
              Socials
            </h2>
            <ul className="mt-[7px] flex flex-col items-start gap-1">
              {socials.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer" className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <CopyEmail className={link} variant="brutalist">
                  {site.social.email}
                </CopyEmail>
              </li>
            </ul>
          </section>
        </div>
      </section>

      <div className="min-w-0 flex-1 px-[14px] pb-[14px] min-[1200px]:pt-[14px]">
        <section aria-labelledby="work-heading">
          <div className="text-muted-foreground border-border mb-[13px] flex justify-between border-b min-[1200px]:sr-only">
            <h2 id="work-heading">Selected Works</h2>
            <p>
              Updated: <time dateTime={UPDATED}>{formatShortDate(UPDATED)}</time>
            </p>
          </div>

          <ul className="group/grid grid grid-cols-1 items-start gap-x-[14px] gap-y-[28px] min-[810px]:grid-cols-2 min-[1200px]:grid-cols-3">
            {work.map((item, i) => (
              <li
                key={i}
                className="transition-opacity duration-300 ease-out group-has-[li:hover]/grid:opacity-50 hover:opacity-100!"
              >
                <Link
                  href={item.href}
                  data-cursor-text="View case study"
                  className="focus-visible:ring-ring block focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
                >
                  <div
                    className={cn(
                      "bg-muted w-full",
                      ASPECTS[i % ASPECTS.length],
                    )}
                  />
                  <p className="mt-[7px]">{item.title}</p>
                  <p className="text-muted-foreground">{item.subtitle}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="blog" aria-labelledby="blog-heading" className="mt-[56px] scroll-mt-[14px]">
          <ListHeader id="blog-heading" label="Blog" meta={`${posts.length} posts`} />
          <ul className="group/blog">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="transition-opacity duration-300 ease-out group-has-[li:hover]/blog:opacity-50 hover:opacity-100!"
              >
                <Link
                  href={post.href}
                  data-cursor-text="Read"
                  className={cn(
                    row,
                    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-inset focus-visible:outline-none",
                  )}
                >
                  <span className="text-pretty">{post.meta.title}</span>
                  <time dateTime={post.meta.date} className="text-muted-foreground tabular-nums">
                    {formatShortDate(post.meta.date)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="more-work-heading" className="mt-[56px] pb-[34px] min-[1200px]:pb-0">
          <ListHeader id="more-work-heading" label="More Work" meta={`${moreWork.length} projects`} />
          <ul className="mt-[13px] grid grid-cols-1 items-start gap-x-[14px] gap-y-[28px] min-[810px]:grid-cols-2 min-[1200px]:grid-cols-3">
            {moreWork.map((item) => (
              <li key={item.title}>
                <Image
                  src={item.image}
                  alt=""
                  sizes={GRID_SIZES}
                  placeholder="blur"
                  className="bg-muted h-auto w-full"
                />
                <p className="mt-[7px]">{item.label}</p>
                <p className="text-muted-foreground text-pretty">{item.title}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="text-muted-foreground fixed right-[14px] bottom-[14px] min-[1200px]:right-auto min-[1200px]:left-[14px]">
        © {site.name}, 2026
      </p>

      <Grain />
      <SquareCursor />
      <ClickSound />
    </div>
  );
}
