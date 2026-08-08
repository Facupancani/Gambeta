import { ImageResponse } from "next/og";

// Same mark as icon.tsx, scaled up to Apple's expected touch-icon size.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 120,
          fontWeight: 700,
        }}
      >
        G
      </div>
    ),
    { ...size }
  );
}
