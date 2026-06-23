export const siteConfig = {
  name: "Pedro Santos",
  domain: "pedrosantos.dev",
  url: "https://pedrosantos.dev",
  email: "pedrocarlos.ti@gmail.com",
  location: "Belmonte, Portugal",
  description:
    "Software engineer shipping React/Next.js work and building side projects. Open to full-time roles and contract work.",
  tagline: "React and Next.js by day, Melro.io on the side.",
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