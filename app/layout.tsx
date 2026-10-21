import type { Metadata } from "next";
import { DM_Mono, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransition } from "@/components/motion/page-transition";
import "./globals.css";

// The painter's hand: a soft, old-style serif with optical sizes, so the
// headline is warm and the running text stays crisp. Everything written on
// the page is Fraunces.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

// Pencil notes in the margins: plate numbers, dates, pigment names.
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
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
      className={`${fraunces.variable} ${dmMono.variable} h-full antialiased`}
    >
      {/* The body is the desk; the painted sheet is laid on it by app/page.tsx. */}
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
