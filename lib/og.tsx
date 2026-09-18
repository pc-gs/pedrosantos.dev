import type { ReactElement } from "react";

/**
 * Shared Bancada card used by every dynamic OG image.
 *
 * Deliberately dependency-free: satori (behind `ImageResponse`) only supports a
 * subset of CSS, so everything is inline styles and explicit flex containers.
 * The default sans is used because bundling a font file would mean fetching
 * binaries at build time. No ✦ glyph here on purpose: satori would try to
 * download a fallback font for it (and log a build warning), so the AI mark is
 * drawn with shapes and plain words instead.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BONE = "#F4F1E9";
const INK = "#14161A";
const MUTED = "#625C50";
const HAIRLINE = "#D8D2C2";
const ORANGE = "#FF4D00";
const VIOLET = "#6B3FD4";

export function OgCard({
  eyebrow,
  title,
  subtitle,
  mark,
  accent = ORANGE,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** AI co-authorship disclosure, drawn without the ✦ glyph. */
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
        backgroundColor: BONE,
        color: INK,
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              backgroundColor: ORANGE,
              border: `3px solid ${INK}`,
              color: INK,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            PS
          </div>
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

        {mark && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: `1px solid ${VIOLET}`,
              color: VIOLET,
              fontSize: 20,
              letterSpacing: 1,
              padding: "8px 16px",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                backgroundColor: VIOLET,
              }}
            />
            {mark}
          </div>
        )}
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
        <div style={{ display: "flex" }}>
          Software Engineer · Belmonte, Portugal
        </div>
      </div>
    </div>
  );
}
