import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import { CopyEmail } from "@/components/copy-email";
import { CaseLightbox } from "@/components/brutalist/case-lightbox";
import { Grain } from "@/components/brutalist/grain";
import { ClickSound } from "@/components/brutalist/click-sound";
import { SquareCursor } from "@/components/brutalist/square-cursor";
import { site } from "@/lib/site";
import badminton from "@/assets/about/badminton.jpg";
import books from "@/assets/about/books.jpg";
import chopta from "@/assets/about/chopta.png";
import doggo from "@/assets/about/doggo.jpg";
import manali from "@/assets/about/manali.png";
import manaliSmile from "@/assets/about/manali-smile.jpg";
import piano from "@/assets/about/piano.jpg";
import sketching from "@/assets/about/sketching.jpg";

// About page, after the layout of emmiwu.com/about (numbered rows of photos
// and text beside a fixed intro) in the brutalist style. Copy, quotes and
// photos are from the "Hello" page of the Framer "Yash's Portfolio v2" site.
// See docs/design/brutalist-home.md, "About".

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a product designer from Mumbai, based in Noida, India.`,
  alternates: { canonical: "/about" },
};

type Photo = { src: StaticImageData; alt: string };

const rows: { label: string; text: React.ReactNode; photos: Photo[] }[] = [
  {
    label: "Where I’m from",
    text: (
      <p>
        From Mumbai, based in Noida, India. I studied industrial design, taught myself product
        design, and credit my design journey to a broken tailbone (don’t ask!).
      </p>
    ),
    photos: [
      { src: manaliSmile, alt: "Yash smiling outdoors in Manali" },
      { src: sketching, alt: "Yash sketching" },
      { src: chopta, alt: "Yash on a trek in Chopta" },
    ],
  },
  {
    label: "How I work",
    text: (
      <>
        <p>
          I believe software should be opinionated and delightful to use in order to be truly
          functional. I aim to make users’ eyes shine when they use software I design (hehe).
        </p>
        <dl className="mt-5 flex flex-col gap-[14px]">
          <div>
            <dt>I proactively seek feedback</dt>
            <dd className="text-muted-foreground">
              I never shy away from asking for feedback on my work, have retrospective
              conversations with my stakeholders, and eagerly welcome advice.
            </dd>
          </div>
          <div>
            <dt>I always sharpen the axe first</dt>
            <dd className="text-muted-foreground">
              I promptly seek out people to talk to and ask questions to gain clarity and figure
              things out. What I don’t know, I learn fast.
            </dd>
          </div>
          <div>
            <dt>I adapt to the situation</dt>
            <dd className="text-muted-foreground">
              I’ve learnt to forgo the ideal design process. I take a situation on its merits and
              solve problems with what’s at hand. Get-started-and-figure-it-out energy!
            </dd>
          </div>
        </dl>
      </>
    ),
    photos: [
      { src: manali, alt: "Yash smiling in Manali" },
      { src: doggo, alt: "Yash with a dog" },
    ],
  },
  {
    label: "Outside of design",
    text: (
      <p>
        When not designing, you’ll find me sipping chai (you knew that), reading the 105 unread
        books in my home library, updating my Goodreads profile, beating someone at badminton, or
        painting landscapes in watercolour.
      </p>
    ),
    photos: [
      { src: books, alt: "Two novels on a desk: Conversations with Friends and Norwegian Wood" },
      { src: badminton, alt: "Yash serving on a badminton court" },
      { src: piano, alt: "A piano with sheet music on its stand" },
    ],
  },
];

const quotes = [
  {
    quote: "Yash demonstrates a high degree of eagerness to do whatever it takes to get the job done.",
    name: "Himanshu Seth",
    role: "Sr. Design Manager at Adobe",
  },
  {
    quote: "He is always open to feedback, constantly grew in terms of craft and problem understanding.",
    name: "Sapna Nayak",
    role: "Design Manager at Postman",
  },
  {
    quote: "He brings an infectious energy and enthusiasm in all spaces that he is part of.",
    name: "Varun Shyam",
    role: "Design Manager at Adobe",
  },
];

const links = [
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "GitHub", href: site.social.github },
  { label: "Resumé", href: site.resume },
];

const link = "underline focus-visible:ring-ring rounded-xs focus-visible:ring-2 focus-visible:outline-none";

// Photo cells: a third of the two-thirds photo area at 1200px+ (the content
// is three of four columns), a third of two of three columns at 810px+.
const PHOTO_SIZES =
  "(min-width: 1200px) calc((75vw - 14px) * 2 / 9), (min-width: 810px) calc((100vw - 28px) * 2 / 9), calc((100vw - 28px) / 3)";

const pad = (n: number) => String(n).padStart(2, "0");

/** A numbered row: dashed rule, label and text in the right third, the media in the left two. */
function Row({ index, label, text, media }: { index: number; label: string; text: React.ReactNode; media: React.ReactNode }) {
  const id = `about-${index}`;
  return (
    <section aria-labelledby={id} className="pt-[14px]">
      <div className="border-border grid gap-[14px] border-t border-dashed pt-[14px] min-[810px]:grid-cols-3">
        <div className="min-[810px]:order-2">
          <h2 id={id} className="text-muted-foreground">
            [{pad(index)}] {label}
          </h2>
          <div className="mt-[7px] max-w-[480px] text-pretty">{text}</div>
        </div>
        <div className="min-[810px]:order-1 min-[810px]:col-span-2">{media}</div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="brutalist bg-background text-foreground min-h-dvh font-sans text-sm leading-5 min-[1200px]:grid min-[1200px]:grid-cols-4">
      <aside className="flex flex-col gap-[14px] p-[14px] min-[1200px]:sticky min-[1200px]:top-0 min-[1200px]:h-dvh">
        <Link
          href="/"
          className="focus-visible:ring-ring flex w-fit items-center gap-[7px] rounded-xs focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowLeftIcon aria-hidden className="size-3.5" />
          <span className="underline">Back</span>
        </Link>
        <div className="flex max-w-[560px] flex-col gap-[7px]">
          <h1>About</h1>
          <p className="text-pretty">
            Hi, I’m {site.name}, a product designer. Currently, I make agentic AI experiences feel
            oh yeah! at Microsoft.
          </p>
          <p className="text-pretty">Previously, I’ve worked at Adobe, Postman, and Samsung.</p>
        </div>
        <ul className="flex flex-col items-start gap-1">
          <li>
            <CopyEmail className={link} variant="brutalist">
              {site.social.email}
            </CopyEmail>
          </li>
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noreferrer" className={link}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <CaseLightbox>
        <main className="px-[14px] pb-[14px] min-[1200px]:col-span-3 min-[1200px]:pl-0">
          {rows.map((row, i) => (
            <Row
              key={row.label}
              index={i + 1}
              label={row.label}
              text={row.text}
              media={
                <ul className="grid grid-cols-3 gap-[7px]">
                  {row.photos.map((photo) => (
                    <li key={photo.alt}>
                      <button
                        type="button"
                        data-lightbox
                        data-cursor-text="Enlarge"
                        aria-label={`Enlarge image: ${photo.alt}`}
                        className="focus-visible:ring-ring block w-full focus-visible:ring-2 focus-visible:outline-none data-focus-returned:ring-0"
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          sizes={PHOTO_SIZES}
                          placeholder="blur"
                          // The first row is above the fold.
                          priority={i === 0}
                          className="bg-muted aspect-[3/4] w-full object-cover"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              }
            />
          ))}

          <Row
            index={rows.length + 1}
            label="Kind words"
            text={<p>From people I’ve worked with. Thanks, y’all!</p>}
            media={
              <ul className="grid gap-[14px] min-[810px]:grid-cols-3">
                {quotes.map((q) => (
                  <li key={q.name}>
                    <figure>
                      <blockquote className="text-pretty">“{q.quote}”</blockquote>
                      <figcaption className="text-muted-foreground mt-[7px]">
                        {q.name}, {q.role}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            }
          />
        </main>
      </CaseLightbox>


      <Grain />
      <SquareCursor />
      <ClickSound />
    </div>
  );
}
