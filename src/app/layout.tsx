import type { Metadata } from "next";
import { Bebas_Neue, Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Brand typography: Bebas Neue for headings (tall, condensed, poster-like —
// matches the streetwear/sportswear benchmark, e.g. myrsport.com.ar), Inter
// for body text (neutral, highly legible). Both free via next/font/google.
// Bebas Neue isn't a variable font, so it needs an explicit weight.
const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_TITLE = "Gambeta — Botines de fútbol";
const SITE_DESCRIPTION =
  "Botines, pelotas, canilleras y medias para jugadores amateurs apasionados por el fútbol. Coordinamos por WhatsApp.";

export const metadata: Metadata = {
  // Needed to resolve relative URLs (like the auto-detected icon.tsx/
  // opengraph-image.tsx below) into absolute ones for og:image etc. Same
  // env var already used by sitemap.ts/robots.ts.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Gambeta",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Gambeta",
    locale: "es_AR",
    type: "website",
    // No `images` here on purpose — Next auto-detects opengraph-image.tsx
    // (root) and each route's own (e.g. producto/[slug]) and merges them in.
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  // icon/apple-icon links are auto-injected from icon.tsx/apple-icon.tsx —
  // no manual `icons` field needed.
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${inter.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
