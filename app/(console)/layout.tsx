import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter-face",
  subsets: ["latin"],
  display: "swap",
});

/**
 * The agent console lives outside the (site) group: no bone paper, no site
 * header. It runs on its own night palette regardless of the theme toggle.
 */
export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${inter.variable} min-h-screen bg-con-bg font-inter text-con-ink antialiased selection:bg-con-amber/30`}
      style={{ colorScheme: "dark" }}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {children}
    </div>
  );
}
