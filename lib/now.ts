export type NowItem = {
  label: string;
  description: string;
  href?: string;
};

export const nowItems: NowItem[] = [
  {
    label: "Day job",
    description:
      "Shipping features on a React + GraphQL team at Aubay Portugal. Emphasis on clean DX, tests that matter, and reliable iteration.",
  },
  {
    label: "Side project",
    description:
      "Melro.io — an ongoing experiment in tailored software for small businesses. Landing pages, internal tools, product decisions. All built in my own time.",
    href: "https://melro.io",
  },
  {
    label: "Focus",
    description:
      "React/Next.js architecture, TypeScript, and developer tooling. Learning React Native for real mobile needs.",
  },
  {
    label: "Open to",
    description:
      "Full-time roles and contract work. I deliver production web work and keep the side project alive either way.",
  },
];