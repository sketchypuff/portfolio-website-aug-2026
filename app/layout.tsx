import type { Metadata } from "next";
import { Alegreya, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransition } from "@/components/motion/page-transition";
import "./globals.css";

// The hand the journal is written in: a calligraphic book face with a real
// italic, so notes read as set by someone who holds a pen. Everything written
// on the page is Alegreya.
const alegreya = Alegreya({
  variable: "--font-alegreya",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Everything typed: entry numbers, dates, coordinates, the specimen labels.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  // Required for OG images and canonical URLs to resolve to absolute URLs.
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${alegreya.variable} ${plexMono.variable} h-full antialiased`}
    >
      {/* The body is the desk; the journal page is laid on it by app/page.tsx. */}
      <body className="bg-desk text-foreground flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main id="content" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
