import { ImageResponse } from "next/og";

// Root OG image — used as the link-preview image for any route that
// doesn't define its own (the PDP already generates a per-product one
// dynamically in producto/[slug]/page.tsx via the product's real photo).
// Same sampled brand colors as icon.tsx.
export const alt = "Gambeta — Botines de fútbol";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#090f0b",
          padding: "0 90px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 6,
            color: "#32ce69",
            marginBottom: 24,
          }}
        >
          BOTINES · PELOTAS · CANILLERAS · MEDIAS
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 150,
            fontWeight: 700,
            letterSpacing: 4,
            color: "#f3f6f4",
            lineHeight: 1,
          }}
        >
          GAMBETA
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            width: 140,
            height: 8,
            background: "#32ce69",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
