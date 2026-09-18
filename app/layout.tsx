import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import {
  Geist,
  Instrument_Serif,
  JetBrains_Mono,
  Newsreader,
} from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/layout/json-ld";
import {
  generatePersonStructuredData,
  generateWebSiteStructuredData,
} from "@/lib/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pedro Santos — Software Engineer & founder of Melro.io",
    template: "%s — Pedro Santos",
  },
  description:
    "Software engineer shipping production React and Next.js by day, building Melro.io on the side. Open to full-time and contract work. Here's what I'm working on right now.",
  keywords: [
    "Pedro Santos",
    "Software Engineer",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Web Development",
    "Portugal",
    "Melro.io",
    "Full Stack Developer",
    "Contract Developer",
    "React Native",
    "Tauri",
    "Cross-platform",
    "Desktop Apps",
  ],
  authors: [{ name: "Pedro Santos" }],
  creator: "Pedro Santos",
  publisher: "Pedro Santos",
  metadataBase: new URL("https://pedrosantos.dev"),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: "Pedro Santos — Writing" },
        { url: "/log/feed.xml", title: "Pedro Santos — The log" },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pedrosantos.dev",
    siteName: "pedrosantos.dev",
    title: "Pedro Santos — Software Engineer & founder of Melro.io",
    description:
      "Software engineer shipping production React and Next.js by day, building Melro.io on the side. Open to full-time and contract work.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pedro Santos — Software Engineer & founder of Melro.io",
    description:
      "Shipping production React/Next.js by day, building Melro.io on the side. Open to full-time and contract work.",
    creator: "@pcgs_tsx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personStructuredData = generatePersonStructuredData();
  const websiteStructuredData = generateWebSiteStructuredData();

  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <JsonLd data={personStructuredData} />
          <JsonLd data={websiteStructuredData} />
        </head>
        <body
          className={`${geistSans.variable} ${newsreader.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} min-h-screen bg-background font-sans antialiased`}
        >
          <ThemeProvider>
            <SmoothScroll>
              {children}
            </SmoothScroll>
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
