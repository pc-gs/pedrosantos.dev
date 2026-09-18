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
        title="I build software for the web"
        subtitle="Software engineer, Belmonte, Portugal. React and Next.js by day, Melro.io on the side."
      />
    ),
    OG_SIZE,
  );
}