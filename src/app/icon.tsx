import { ImageResponse } from "next/og";

// Code-generated favicon (replaces the stock Next.js default). Colors are
// the exact hex values sampled from the real CSS variables in
// globals.css (--background/--primary), read via a canvas probe in the
// running app — not guessed from the oklch() source, since next/og's
// renderer (Satori) doesn't support oklch().
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#090f0b",
          color: "#32ce69",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        G
      </div>
    ),
    { ...size }
  );
}
