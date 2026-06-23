export type NowItem = {
  label: string;
  description: string;
  href?: string;
};

export const nowItems: NowItem[] = [
  {
    label: "Day job",
    description:
      "Software engineer at Aubay Portugal — React, GraphQL, and modern testing in an agile team.",
  },
  {
    label: "Side project",
    description:
      "An early-stage product for tailored software solutions — building it in my own time at",
    href: "https://melro.io",
  },
  {
    label: "Learning",
    description:
      "React Native specialization and exploring AI-assisted development workflows.",
  },
  {
    label: "Open to",
    description:
      "Full-time roles and contract work where I can contribute fully and keep shipping on the side.",
  },
];