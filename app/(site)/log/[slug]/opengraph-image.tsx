import { ImageResponse } from "next/og";
import { getAllLogSlugs, getLogEntryBySlug } from "@/lib/log";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const alt = "Log entry on pedrosantos.dev";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllLogSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getLogEntryBySlug(slug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow={`The log · ${entry?.date ?? ""}`}
        title={entry?.title ?? "The log"}
        subtitle={entry?.description}
        mark={
          entry?.aiAssisted
            ? `drafted with ${entry.model ?? "AI"} · edited by Pedro`
            : undefined
        }
      />
    ),
    OG_SIZE,
  );
}