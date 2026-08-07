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

export const metadata: Metadata = {
  title: {
    default: "Gambeta — Botines de fútbol",
    template: "%s — Gambeta",
  },
  description:
    "Botines, pelotas, canilleras y medias para jugadores amateurs apasionados por el fútbol. Coordinamos por WhatsApp.",
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
