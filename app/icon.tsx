import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1E1008",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            color: "#C9A96E",
            fontSize: 22,
            fontWeight: 300,
            letterSpacing: "-0.01em",
          }}
        >
          H
        </div>
      </div>
    ),
    { ...size }
  );
}
