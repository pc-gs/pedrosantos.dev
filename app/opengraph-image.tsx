import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const alt = "Pedro Santos — software engineer and founder of Melro.io";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="pedrosantos.dev"
        title="Building for the web. Logging what I learn."
        subtitle="Software engineer — React, Next.js, Tauri. Co-written with AI where marked ✦"
      />
    ),
    OG_SIZE,
  );
}