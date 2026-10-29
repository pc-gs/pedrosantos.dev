import { getAllProjects } from "@/content/projects";
import { studies } from "@/content/studies";
import { getAllPosts } from "@/lib/blog";
import { getAllLogEntries } from "@/lib/log";

/**
 * The changelog: every dated thing on the site, in one stream.
 *
 * Nothing here is written by hand. Rows come from log entries, essays,
 * project milestones and study tracks, so the home page can never drift
 * from the content it points to.
 */

/** What the filter groups rows by. */
export type TimelineKind = "work" | "note" | "learning";

/** What the row says it is. */
export type TimelineLabel =
  | "started"
  | "shipped"
  | "update"
  | "note"
  | "essay"
  | "studying";

export type TimelineItem = {
  id: string;
  /** ISO date, or "YYYY-MM" when only the month is known. */
  date: string;
  kind: TimelineKind;
  label: TimelineLabel;
  title: string;
  /** Project name for milestones, so the row reads "Mira — …". */
  context?: string;
  description?: string;
  href: string;
  /** Drafted with a model: shows the ✦ mark. */
  ai?: boolean;
};

export type TimelineRelease = {
  /** "2026.09" */
  version: string;
  /** "2026-09", for sorting and dateTime attributes. */
  month: string;
  items: TimelineItem[];
};

function sortKey(date: string) {
  return date.length === 7 ? `${date}-00` : date;
}

export function getTimeline(): TimelineItem[] {
  const notes: TimelineItem[] = getAllLogEntries().map((entry) => ({
    id: `log-${entry.slug}`,
    date: entry.date,
    kind: "note",
    label: "note",
    title: entry.title,
    description: entry.description,
    href: `/log/${entry.slug}`,
    ai: entry.aiAssisted,
  }));

  const essays: TimelineItem[] = getAllPosts().map((post) => ({
    id: `essay-${post.slug}`,
    date: post.date,
    kind: "note",
    label: "essay",
    title: post.title,
    description: post.description,
    href: `/blog/${post.slug}`,
    ai: post.coWritten,
  }));

  const milestones: TimelineItem[] = getAllProjects().flatMap((project) =>
    (project.milestones ?? []).map((milestone) => ({
      id: `work-${project.slug}-${milestone.date}`,
      date: milestone.date,
      kind: "work" as const,
      label: milestone.kind,
      title: milestone.title,
      context: project.title,
      href: `/work/${project.slug}`,
    })),
  );

  const tracks: TimelineItem[] = studies.map((study) => ({
    id: `study-${study.id}`,
    date: study.since,
    kind: "learning",
    label: "studying",
    title: study.title,
    href: `/studies#${study.id}`,
  }));

  return [...notes, ...essays, ...milestones, ...tracks].sort((a, b) =>
    sortKey(a.date) < sortKey(b.date) ? 1 : -1,
  );
}

/** The stream grouped by month, newest first. Each month reads as a release. */
export function groupByRelease(items: TimelineItem[]): TimelineRelease[] {
  const releases: TimelineRelease[] = [];
  for (const item of items) {
    const month = item.date.slice(0, 7);
    let release = releases.at(-1);
    if (!release || release.month !== month) {
      release = { month, version: month.replace("-", "."), items: [] };
      releases.push(release);
    }
    release.items.push(item);
  }
  return releases;
}

/** "v2026.09": the month of the newest thing on the site. */
export function getCurrentVersion(): string {
  const latest = getTimeline()[0];
  return latest ? `v${latest.date.slice(0, 7).replace("-", ".")}` : "v0";
}
