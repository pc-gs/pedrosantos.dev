import type { ReactElement } from "react";

/**
 * Shared "ink & paper" card used by every dynamic OG image.
 *
 * Deliberately dependency-free: satori (behind `ImageResponse`) only supports a
 * subset of CSS, so everything is inline styles and explicit flex containers.
 * The default sans is used because bundling a serif font file would mean
 * fetching binaries at build time.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const PAPER = "#FAF6F0";
const INK = "#1C1917";
const MUTED = "#57534E";
const HAIRLINE = "#E4DACB";
const BLUE = "#254B96";
const VIOLET = "#6D3FD1";

export function OgCard({
  eyebrow,
  title,
  subtitle,
  mark,
  accent = BLUE,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Violet ✦ mark for AI co-authored content. */
  mark?: string;
  accent?: string;
}): ReactElement {
  const titleSize = title.length > 64 ? 62 : title.length > 40 ? 76 : 88;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        backgroundColor: PAPER,
        color: INK,
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 999,
            backgroundColor: accent,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            lineHeight: 1.08,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.4,
              color: MUTED,
              maxWidth: 900,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${HAIRLINE}`,
          paddingTop: 26,
          fontSize: 24,
          color: MUTED,
        }}
      >
        <div style={{ display: "flex" }}>pedrosantos.dev</div>
        {mark && (
          <div style={{ display: "flex", color: VIOLET, letterSpacing: 2 }}>
            {mark}
          </div>
        )}
      </div>
    </div>
  );
}