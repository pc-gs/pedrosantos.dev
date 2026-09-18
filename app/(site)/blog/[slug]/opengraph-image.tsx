import { ImageResponse } from "next/og";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const alt = "Essay on pedrosantos.dev";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow="Writing"
        title={post?.title ?? "Writing — Pedro Santos"}
        subtitle={post?.description}
        mark={post?.coWritten ? "co-written · human-edited" : undefined}
      />
    ),
    OG_SIZE,
  );
}