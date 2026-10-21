import type { Metadata } from "next";
import { DM_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransition } from "@/components/motion/page-transition";
import "./globals.css";

// The only face on the page. A light mono reads like pencil notes in a
// sketchbook margin: even, quiet, and never competing with the paint. The
// paintings are the typography here.
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
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
    <html lang="en" suppressHydrationWarning className={`${dmMono.variable} h-full antialiased`}>
      <body className="bg-background text-foreground flex min-h-full flex-col">
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
