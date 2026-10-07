// Converts tmux `capture-pane -e` output into HTML spans. Handles the SGR
// codes the karya TUI emits: truecolor fg/bg, bold, italic, resets.
import { readFileSync } from "node:fs";
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function convert(src, collapse) {
  let lines = src.replace(/\n+$/, "").split("\n");
  if (collapse) {
    const out = []; let blank = 0;
    for (const l of lines) { const b = l.replace(/\x1b\[[0-9;]*m/g, "").trim() === ""; blank = b ? blank + 1 : 0; if (blank <= 2) out.push(l); }
    lines = out;
  }
  let st = { fg: null, bg: null, b: false, i: false };
  return lines.map((line) => {
    let html = "", buf = "";
    const flush = () => {
      if (!buf) return;
      const css = [st.fg && `color:${st.fg}`, st.bg && `background:${st.bg}`, st.b && "font-weight:600", st.i && "font-style:italic"].filter(Boolean).join(";");
      html += css ? `<span style="${css}">${esc(buf)}</span>` : esc(buf);
      buf = "";
    };
    const re = /\x1b\[([0-9;]*)m/g; let last = 0, m;
    while ((m = re.exec(line))) {
      buf += line.slice(last, m.index); last = re.lastIndex; flush();
      const p = m[1] === "" ? [0] : m[1].split(";").map(Number);
      for (let k = 0; k < p.length; k++) {
        const c = p[k];
        if (c === 0) st = { fg: null, bg: null, b: false, i: false };
        else if (c === 1) st.b = true; else if (c === 3) st.i = true;
        else if (c === 22) st.b = false; else if (c === 23) st.i = false;
        else if (c === 39) st.fg = null; else if (c === 49) st.bg = null;
        else if ((c === 38 || c === 48) && p[k + 1] === 2) { const hex = "#" + p.slice(k + 2, k + 5).map((n) => n.toString(16).padStart(2, "0")).join(""); c === 38 ? (st.fg = hex) : (st.bg = hex); k += 4; }
      }
    }
    buf += line.slice(last); flush();
    return html;
  });
}
const welcome = convert(readFileSync(process.argv[2], "utf8"), true);
const approval = convert(readFileSync(process.argv[3], "utf8"), false);
console.log(`// Real frames of \`karya -demo\`, captured from tmux (110×34) and converted by
// scripts/ansi2html.mjs. Regenerate them when the TUI changes.
export const WELCOME: string[] = ${JSON.stringify(welcome, null, 0)};
export const APPROVAL: string[] = ${JSON.stringify(approval, null, 0)};`);
