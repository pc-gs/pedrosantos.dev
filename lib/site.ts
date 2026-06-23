export const siteConfig = {
  name: "Pedro Santos",
  domain: "pedrosantos.dev",
  url: "https://pedrosantos.dev",
  email: "pedrocarlos.ti@gmail.com",
  location: "Belmonte, Portugal",
  description:
    "Software engineer building web products with React, Next.js, and modern tooling. Open to new opportunities.",
  tagline: "Building web products with React, Next.js, and modern tooling.",
  availability: "Open to full-time and contract opportunities.",
} as const;

export const navItems = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
] as const;

export const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/pedrocarlos-ti",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/pedro-santos",
  },
  {
    label: "X",
    href: "https://x.com/pcgs_tsx",
  },
  {
    label: "Email",
    href: "mailto:pedrocarlos.ti@gmail.com",
  },
] as const;