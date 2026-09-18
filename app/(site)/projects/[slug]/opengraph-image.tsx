import { ImageResponse } from "next/og";
import { getAllProjects, getProjectBySlug } from "@/content/projects";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const alt = "Case study on pedrosantos.dev";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow={`Work · ${project?.period ?? ""}`}
        title={project?.title ?? "Work"}
        subtitle={project?.tagline}
      />
    ),
    OG_SIZE,
  );
}