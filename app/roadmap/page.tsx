import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = { title: "Roadmap — Karya" };

const row: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "4px 28px", padding: "14px 0", borderBottom: "1px solid var(--line)" };
const key: React.CSSProperties = { flex: "0 0 240px" };
const desc: React.CSSProperties = { flex: "1 1 300px", fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.5, color: "var(--fg-2)" };
const head: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap", borderBottom: "1px solid var(--fg-3)", paddingBottom: 14 };
const h2: React.CSSProperties = { fontFamily: "var(--serif)", fontWeight: 400, fontSize: 34, margin: 0 };
const tag: React.CSSProperties = { fontFamily: "var(--mono)", fontSize: 13, color: "var(--fg-3)" };
const card: React.CSSProperties = { background: "var(--bg)", padding: 28, display: "flex", flexDirection: "column", gap: 14 };
const badge: React.CSSProperties = { alignSelf: "flex-start", fontFamily: "var(--mono)", fontSize: 12, border: "1px dashed var(--line-2)", color: "var(--fg-2)", padding: "2px 8px" };
const h3: React.CSSProperties = { fontFamily: "var(--serif)", fontWeight: 400, fontSize: 26, lineHeight: 1.2, margin: 0 };
const cp: React.CSSProperties = { fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.55, color: "var(--fg-2)", margin: 0, textWrap: "pretty" as never };

const MVP: [string, string][] = [
  ["terminal UI", "Full-screen interface with a streaming response viewport and a usage and cost summary per task."],
  ["four tools", "read, write, edit and bash, with bounded reads, atomic writes, exact-match edits and tail-preserving shell output."],
  ["approval gate", "write, edit and bash show a diff or the exact command and wait. Denials return to the model as structured results."],
  ["provider interface", "One internal interface. The model is selected with HARNESS_MODEL, the endpoint with HARNESS_BASE_URL."],
  ["OS sandbox", "sandbox-exec on macOS, bubblewrap with seccomp on Linux. Writable scope is the root and a session temp dir; network off by default."],
  ["root-confined paths", "File tools reject absolute, escaping and symlink-escaping paths."],
  ["portable sessions", "Append-only JSONL keyed to the git remote URL. Resume on any machine, with a drift note for HEAD, dirty tree and platform."],
  ["cost and limits", "Per-turn tokens, cost, duration and tool outcomes. HARNESS_MAX_STEPS and HARNESS_MAX_COST stop the loop and leave the session resumable."],
  ["install", "go install from the module path."],
];

const DEFERRED: [string, string][] = [
  ["Container executor", "Run commands inside a container, behind the same executor interface the OS sandbox uses today. The loop and the approval flow stay the same."],
  ["Shadow-git snapshots", "Snapshot the worktree into a shadow git repository before each bash command, so the side effects of a shell command can be undone."],
  ["Encrypted session sync", "Sync session logs between machines with encryption on the client. The server stores ciphertext and can never read session content."],
  ["Distribution", "A Homebrew tap and prebuilt release binaries, so installing does not require a Go toolchain."],
];

export default function Roadmap() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      <SiteNav active="roadmap" />
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(56px,8vw,96px) 24px 24px" }}>
        <div className="mono" style={{ fontSize: 13, color: "var(--fg-3)" }}>roadmap</div>
        <h1 className="serif" style={{ fontWeight: 400, fontSize: "clamp(44px,6.6vw,80px)", lineHeight: 1.02, letterSpacing: "-0.025em", margin: "18px 0 24px", maxWidth: "14ch", textWrap: "balance" as never }}>What exists, and what comes next.</h1>
        <p className="serif" style={{ fontSize: 20, lineHeight: 1.6, color: "var(--fg-2)", maxWidth: "60ch", margin: "0 0 24px", textWrap: "pretty" as never }}>Karya is pre-1.0. The MVP below is what the binary does today. Deferred items are planned and not built; each one is labelled roadmap wherever it appears on this site.</p>
        <div className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid var(--line-2)", padding: "6px 12px", fontSize: 13 }}>
          <span style={{ display: "inline-block", width: 8, height: 15, background: "var(--accent)" }} />
          status: pre-1.0 · interfaces may change
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
        <div style={head}>
          <h2 style={h2}>In the MVP</h2>
          <span style={tag}>built</span>
        </div>
        <div className="mono" style={{ fontSize: 13.5 }}>
          {MVP.map(([k, d]) => (
            <div key={k} style={row}>
              <span style={key}>{k}</span>
              <span style={desc}>{d}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px clamp(80px,10vw,128px)" }}>
        <div style={{ ...head, marginBottom: 32 }}>
          <h2 style={h2}>Deferred</h2>
          <span style={tag}>not built</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
          {DEFERRED.map(([t, d]) => (
            <div key={t} style={card}>
              <span style={badge}>roadmap</span>
              <h3 style={h3}>{t}</h3>
              <p style={cp}>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
