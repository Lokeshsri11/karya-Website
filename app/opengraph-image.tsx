import { ImageResponse } from "next/og";

export const alt = "Karya: autonomy without the risk";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#14120f", color: "#ede6d9", fontFamily: "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40 }}>
          <div style={{ width: 22, height: 22, background: "#d9a14b" }} />
          kārya
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", fontSize: 84, lineHeight: 1, letterSpacing: "-0.04em" }}>
            Autonomy without&nbsp;<span style={{ color: "#d9a14b", fontStyle: "italic" }}>the risk.</span>
          </div>
          <div style={{ fontSize: 26, color: "#b9b0a0", fontFamily: "monospace" }}>sandboxed commands · undo every turn · enforced budgets · sessions that follow you</div>
        </div>
      </div>
    ),
    size,
  );
}
