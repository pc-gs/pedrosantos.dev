import { getAllLogEntries } from "@/lib/log";
import { getAllPosts } from "@/lib/blog";
import { getAllProjects } from "@/content/projects";
import { profile } from "@/content/profile";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedrosantos.dev";

/**
 * /llms.txt — a plain-text digest for language models and AI agents, following
 * the llms.txt convention: a short summary, then the canonical pages with
 * one-line descriptions.
 */
export function GET() {
  const posts = getAllPosts();
  const log = getAllLogEntries();
  const projects = getAllProjects();

  const lines = [
    `# ${profile.name}`,
    ``,
    `> ${profile.role} based in ${profile.location}. ${profile.tagline}`,
    ``,
    `${profile.intro}`,
    ``,
    `Availability: ${profile.availability.open ? `open to ${profile.availability.types.join(" and ")} work. ${profile.availability.note ?? ""}` : "not currently open to new work."}`,
    `Contact: ${profile.email} · ${SITE_URL}/contact`,
    `Stack: ${profile.stack.join(", ")}`,
    ``,
    `This site is written in English, by a human, with AI drafting assistance`,
    `disclosed on every entry that used it (marked ✦ / "co-written"). Log entries`,
    `include the actual prompt that seeded them.`,
    ``,
    `## Pages`,
    ``,
    `- [Home](${SITE_URL}/): current focus, the log, selected work and writing.`,
    `- [The log](${SITE_URL}/log): short entries on what ${profile.name} is learning. Most recent first.`,
    `- [Writing](${SITE_URL}/blog): longer essays, each with a "how this post was made" box.`,
    `- [Projects](${SITE_URL}/projects): case studies — problem, approach, outcome, learnings.`,
    `- [About](${SITE_URL}/about): narrative background and how he works.`,
    `- [Now](${SITE_URL}/now): snapshot of current work and focus.`,
    `- [Uses](${SITE_URL}/uses): tools, stack and the typefaces behind this site.`,
    `- [Contact](${SITE_URL}/contact): form and direct channels.`,
    ``,
    `## Feeds`,
    ``,
    `- [Writing RSS](${SITE_URL}/rss.xml)`,
    `- [Log RSS](${SITE_URL}/log/feed.xml)`,
    ``,
    `## Writing`,
    ``,
    ...posts.map(
      (p) =>
        `- [${p.title}](${SITE_URL}/blog/${p.slug}) (${p.date}${p.coWritten ? ", co-written with AI" : ""}): ${p.description}`,
    ),
    ``,
    `## Log`,
    ``,
    ...log.map(
      (e) =>
        `- [${e.title}](${SITE_URL}/log/${e.slug}) (${e.date}${e.aiAssisted ? `, co-written with AI${e.model ? ` · ${e.model}` : ""}` : ""}): ${e.description}`,
    ),
    ``,
    `## Projects`,
    ``,
    ...projects.map(
      (p) =>
        `- [${p.title}](${SITE_URL}/projects/${p.slug}) (${p.period}, ${p.status}): ${p.summary}`,
    ),
    ``,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}