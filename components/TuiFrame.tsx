"use client";

import { useState } from "react";
import { APPROVAL, WELCOME } from "./tuiFrames";

const FRAMES = [
  { key: "welcome", label: "start", lines: WELCOME, cap: "karya -demo · the welcome screen" },
  { key: "approval", label: "edit approval", lines: APPROVAL, cap: "an edit waiting on you · side-by-side diff" },
] as const;

// A real frame of the TUI, captured from a terminal. It keeps the TUI's own
// dark palette in both site themes, the way a screenshot would.
export default function TuiFrame() {
  const [i, setI] = useState(0);
  const f = FRAMES[i];
  return (
    <div style={{ border: "1px solid var(--line-2)", background: "#14120f", color: "#ede6d9", minWidth: 0 }}>
      <div className="mono" style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", padding: "8px 10px", borderBottom: "1px solid #2a2620", fontSize: 12 }}>
        {FRAMES.map((fr, k) => (
          <button
            key={fr.key}
            onClick={() => setI(k)}
            aria-pressed={k === i}
            style={{ font: "inherit", cursor: "pointer", padding: "3px 10px", border: `1px solid ${k === i ? "#d9a14b" : "#3d372e"}`, background: k === i ? "#d9a14b" : "transparent", color: k === i ? "#17130d" : "#b9b0a0" }}
          >
            {fr.label}
          </button>
        ))}
        <span style={{ marginLeft: "auto", color: "#8c8374" }}>real frame · not a mockup</span>
      </div>
      <div className="noscroll" style={{ overflowX: "auto" }}>
        <pre
          className="mono tui-pre"
          style={{ margin: 0, padding: "16px 18px", fontSize: "clamp(10.5px,1.05vw,13.5px)", lineHeight: 1.3, width: "max-content" }}
          dangerouslySetInnerHTML={{ __html: f.lines.join("\n") }}
        />
      </div>
      <div className="mono" style={{ padding: "8px 12px", borderTop: "1px solid #2a2620", fontSize: 12, color: "#8c8374" }}>{f.cap}</div>
    </div>
  );
}
