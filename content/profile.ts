import type { Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Pedro Santos",
  role: "Software Engineer",
  tagline:
    "I make software, break it, fix it, and learn something along the way. Shipping production React and Next.js by day; building Melro.io on the side.",
  intro:
    "Hey, I'm Pedro Santos. I ship production React and Next.js work during the day and build my own things on the side. I love the web, and with AI as a drafting partner I'm learning to build professionally and securely for any environment: browser, phone, desktop. Here's what I'm working on right now. If something resonates, let's talk.",
  location: "Belmonte, Portugal",
  email: "pedrocarlos.ti@gmail.com",
  avatarUrl: "https://avatars.githubusercontent.com/u/18473317?v=4",
  stack: ["React", "Next.js", "TypeScript", "React Native", "Tauri"],
  socials: [
    { name: "GitHub", href: "https://github.com/pc-gs", icon: "github" },
    { name: "LinkedIn", href: "https://linkedin.com/in/pedro-santos", icon: "linkedin" },
    { name: "X", href: "https://x.com/pcgs_tsx", icon: "x" },
    { name: "Email", href: "mailto:pedrocarlos.ti@gmail.com", icon: "mail" },
  ],
  availability: {
    open: true,
    types: ["full-time", "contract"],
    note: "Open to full-time roles and contract work. Remote-friendly, EU timezones.",
  },
  founded: {
    name: "Melro.io",
    url: "https://melro.io",
    role: "Founder & engineer",
    blurb:
      "A long-term side experiment — software for local businesses. Not the main headline, but the place where I learn to build like a founder, not just an engineer.",
  },
};
