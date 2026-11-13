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
    <div className="min-w-0 border border-line-2 bg-[#14120f] text-[#ede6d9]">
      <div className="flex flex-wrap items-center gap-[6px] border-b border-[#2a2620] px-[10px] py-2 font-mono text-[12px]">
        {FRAMES.map((fr, k) => (
          <button
            key={fr.key}
            onClick={() => setI(k)}
            aria-pressed={k === i}
            className={`cursor-pointer border px-[10px] py-[3px] ${
              k === i ? "border-[#d9a14b] bg-[#d9a14b] text-[#17130d]" : "border-[#3d372e] bg-transparent text-[#b9b0a0]"
            }`}
          >
            {fr.label}
          </button>
        ))}
        <span className="ml-auto text-[#8c8374]">real frame · not a mockup</span>
      </div>
      <div ref={scroller} className="no-scrollbar flex overflow-x-auto">
        <pre
          className="m-0 mx-auto w-max px-[18px] py-4 font-mono text-[clamp(10.5px,1.05vw,13.5px)] leading-[1.3]"
          dangerouslySetInnerHTML={{ __html: RENDERED[i] }}
        />
      </div>
      <div className="border-t border-[#2a2620] px-3 py-2 font-mono text-[12px] text-[#8c8374]">{f.cap}</div>
    </div>
  );
}
