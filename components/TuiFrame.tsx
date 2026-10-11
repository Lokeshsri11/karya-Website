"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { APPROVAL, WELCOME } from "./tuiFrames";

const FRAMES = [
  { key: "welcome", label: "start", lines: WELCOME, cap: "karya -demo · the welcome screen" },
  { key: "approval", label: "edit approval", lines: APPROVAL, cap: "an edit waiting on you · side-by-side diff" },
] as const;

// Half-block glyphs (▀ ▄ █) don't fill the 1.3 line box, so the pixel logo
// breaks into stripes. Redraw each one as a cell painted top/bottom in CSS.
const BLOCKS = /<span style="([^"]*)">([^<]*[▀▄█][^<]*)<\/span>/g;
function cells(html: string) {
  return html.replace(BLOCKS, (_, css: string, text: string) => {
    const fg = /(?:^|;)color:(#[0-9a-f]{6})/.exec(css)?.[1] ?? "currentColor";
    const bg = /background:(#[0-9a-f]{6})/.exec(css)?.[1] ?? "transparent";
    return [...text]
      .map((ch) => {
        const tb = ch === "▀" ? [fg, bg] : ch === "▄" ? [bg, fg] : ch === "█" ? [fg, fg] : null;
        if (!tb) return `<span style="${css}">${ch}</span>`;
        return `<span class="tui-cell" style="--t:${tb[0]};--b:${tb[1]}"></span>`;
      })
      .join("");
  });
}
const RENDERED = FRAMES.map((f) => f.lines.map(cells).join("\n"));

// A real frame of the TUI, captured from a terminal. It keeps the TUI's own
// dark palette in both site themes, the way a screenshot would.
export default function TuiFrame() {
  const [i, setI] = useState(0);
  const f = FRAMES[i];
  // On narrow screens the frame scrolls sideways; start it centered so the
  // logo and the centered welcome text are in view.
  const scroller = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [i]);
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
      <div ref={scroller} className="noscroll" style={{ overflowX: "auto", display: "flex" }}>
        <pre
          className="mono tui-pre"
          style={{ margin: 0, padding: "16px 18px", fontSize: "clamp(10.5px,1.05vw,13.5px)", lineHeight: 1.3, width: "max-content", marginInline: "auto" }}
          dangerouslySetInnerHTML={{ __html: RENDERED[i] }}
        />
      </div>
      <div className="mono" style={{ padding: "8px 12px", borderTop: "1px solid #2a2620", fontSize: 12, color: "#8c8374" }}>{f.cap}</div>
    </div>
  );
}
