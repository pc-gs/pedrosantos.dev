export type ProjectStatus = "shipped" | "ongoing" | "experimental" | "archived";

export type ProjectLink = {
  label: string;
  href: string;
  kind?: "live" | "source" | "docs" | "other";
};

export type CaseStudySection = {
  thesis: string;
  body: string;
};

export type CaseStudy = {
  tldr: string;
  problem: CaseStudySection;
  approach: CaseStudySection;
  outcome: CaseStudySection;
  learnings?: string[];
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  role: string;
  status: ProjectStatus;
  period: string;
  year: number;
  featured: boolean;
  order: number;
  tags: string[];
  stack: string[];
  links: ProjectLink[];
  cover?: string;
  caseStudy: CaseStudy;
  highlights?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime?: string;
  draft?: boolean;
  body: string;
  content: string;
  /** Co-authorship disclosure — the "made with AI" process box */
  coWritten?: boolean;
  process?: {
    notes: string;
    prompts: string[];
    humanEdit: string;
  };
};

export type LogEntry = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  /** True when the entry was drafted with AI help and human-edited */
  aiAssisted: boolean;
  /** Model that assisted, when aiAssisted (e.g. "GLM", "Claude") */
  model?: string;
  /** The actual prompt that seeded the insight — shown in a disclosure */
  prompt?: string;
  draft?: boolean;
  readingTime: string;
  body: string;
  content: string;
};

/**
 * The subset of a log entry needed to render it in a feed or list
 * (no markdown body / reading time). Lets client components accept
 * plain projections of `LogEntry` without faking the full shape.
 */
export type LogEntryPreview = Pick<
  LogEntry,
  "slug" | "title" | "description" | "date" | "tags" | "aiAssisted" | "model" | "prompt"
>;

export type NowKind =
  | "building"
  | "working"
  | "learning"
  | "reading"
  | "writing"
  | "exploring";

export type NowItem = {
  id: string;
  kind: NowKind;
  text: string;
  href?: string;
  date: string;
};

export type UseItem = {
  name: string;
  /** One-line note on what it's for — keep it specific. */
  detail?: string;
  href?: string;
};

export type UsesGroup = {
  id: string;
  title: string;
  note?: string;
  items: UseItem[];
};

;

export type EducationItem = {
  title: string;
  org: string;
  period: string;
  note: string;
};

export type SocialLink = {
  name: string;
  href: string;
  icon: "github" | "linkedin" | "x" | "mail";
};

export type Availability = {
  open: boolean;
  types: ("full-time" | "contract")[];
  note?: string;
};

export type Profile = {
  name: string;
  role: string;
  tagline: string;
  intro: string;
  location: string;
  email: string;
  avatarUrl: string;
  stack: string[];
  socials: SocialLink[];
  availability: Availability;
  founded: { name: string; url: string; role: string; blurb: string };
};

/** Where a study track is at — no fake progress bars, just the stage. */
export type StudyState = "exploring" | "learning" | "applying";

export type StudyResource = {
  label: string;
  href?: string;
};

/**
 * A study track: something I'm actively learning, with the log entries
 * that show the work. Shown on the home page and on /studies.
 */
export type Study = {
  id: string;
  title: string;
  /** Why this matters to me — first person, specific. */
  why: string;
  state: StudyState;
  /** When the track entered the bench, "YYYY-MM". */
  since: string;
  /** Last time the track moved, ISO date. */
  updatedAt: string;
  /** Log entry slugs (content/log) that belong to this track. */
  logSlugs: string[];
  resources?: StudyResource[];
};
