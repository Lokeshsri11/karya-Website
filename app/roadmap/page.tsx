import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Roadmap — Karya",
  description: "What works in Karya today, what is being built now, and what comes after launch.",
};

type Status = "done" | "now" | "next";

const DONE = [
  "Terminal UI on Bubble Tea: streaming, markdown, syntax highlighting, diffs",
  "Modes in the TUI: normal, accept edits, plan (shift+tab)",
  "Threads grouped by project, prompt history, queued messages",
  "@ file mentions, ! shell commands, $EDITOR prompts, notifications, themes",
  "Live streaming from Gemini behind the provider interface",
  "Protocol v0 types, in-memory transport, request/response peer with tests",
];

const MILESTONES: [string, Status, string, string[]][] = [
  ["M0", "now", "Contract", ["Protocol v0 package and in-memory transport", "Fake core with scenario files", "TUI rewired onto the protocol", "Dependency-rule test: the TUI never imports the core"]],
  ["M1", "next", "Core loop", ["Gemini tool-call assembly and the session loop", "read, list and search tools", "JSONL session log and resume", "karya run for headless tasks"]],
  ["M2", "next", "Edits and the sandbox", ["write and edit with diff approvals", "plan, default and accept-edits modes", "bash through sandbox-exec and bubblewrap, network off", "Record-before-run crash safety and interrupt"]],
  ["M3", "next", "Budgets and undo", ["Step, token, cost and time limits", "Loop detection and verify commands", "Shadow-git /undo, /rewind and /redo", "Visible compaction and the end-of-task report"]],
  ["M4", "next", "Breadth", ["Anthropic and OpenAI-compatible providers, switching mid-session", "Network proxy, profiles and fetch", "MCP tools and AGENTS.md", "Config files and karya doctor"]],
  ["M5", "next", "Launch", ["Project identity and drift notes", "Export, import and end-to-end encrypted sync", "The full acceptance suite and a fixture benchmark"]],
];

const LATER = ["Interactive commands (PTY)", "Parallel tool calls", "Branching sessions", "Hooks and skills", "Sub-agents", "Editor clients", "GitHub Action", "Container and remote executors", "Native Windows sandbox"];

const chip = (s: Status): React.CSSProperties => ({
  border: `1px solid ${s === "done" ? "var(--ok)" : s === "now" ? "var(--accent)" : "var(--line-2)"}`,
  color: s === "done" ? "var(--ok)" : s === "now" ? "var(--accent)" : "var(--fg-3)",
  padding: "2px 8px",
  fontSize: 12,
});
const label = { done: "works today", now: "in progress", next: "planned" };
const h2: React.CSSProperties = { fontFamily: "var(--serif)", fontWeight: 400, fontSize: 32, lineHeight: 1.15, margin: "64px 0 20px", paddingTop: 24, borderTop: "1px solid var(--line)" };
const li: React.CSSProperties = { fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.55, color: "var(--fg-2)" };

export default function Roadmap() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      <SiteNav active="roadmap" />
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "44px 24px 112px" }}>
        <div className="mono" style={{ fontSize: 13, color: "var(--fg-3)" }}>roadmap</div>
        <h1 className="serif page-h1" style={{ fontWeight: 400, fontSize: "clamp(40px,5.6vw,60px)", lineHeight: 1.04, letterSpacing: "-0.022em", margin: "16px 0 20px" }}>
          What works, and <em style={{ color: "var(--accent)" }}>what&apos;s next.</em>
        </h1>
        <p className="serif" style={{ fontSize: 20, lineHeight: 1.6, color: "var(--fg-2)", maxWidth: "62ch", margin: 0 }}>
          Karya is built in milestones, and each one ends in something that runs. The landing page describes the product at launch. This page is the honest version of where it is today.
        </p>

        <h2 style={h2}>Works today</h2>
        <ul className="mono" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
          {DONE.map((d) => (
            <li key={d} style={{ display: "flex", gap: 12 }}>
              <span style={{ color: "var(--ok)" }}>✓</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>

        <h2 style={h2}>To launch</h2>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {MILESTONES.map(([id, s, title, items]) => (
            <section key={id} style={{ display: "flex", flexWrap: "wrap", gap: "12px 28px", padding: "24px 0", borderBottom: "1px solid var(--line)", borderLeft: s === "now" ? "2px solid var(--accent)" : "2px solid transparent", paddingLeft: 16 }}>
              <div className="mono" style={{ flex: "0 0 160px", display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                <span style={{ fontSize: 13, color: "var(--fg-3)" }}>{id}</span>
                <span className="serif" style={{ fontSize: 22, lineHeight: 1.2, color: "var(--fg)" }}>{title}</span>
                <span style={chip(s)}>{label[s]}</span>
              </div>
              <ul style={{ flex: "1 1 280px", minWidth: 0, margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
                {items.map((i) => (
                  <li key={i} style={li}>{i}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <h2 style={h2}>After launch</h2>
        <div className="mono" style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 13 }}>
          {LATER.map((l) => (
            <span key={l} style={{ border: "1px solid var(--line-2)", padding: "5px 10px", color: "var(--fg-2)" }}>{l}</span>
          ))}
        </div>

        <div className="mono" style={{ marginTop: 72, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 13 }}>
          <Link href="/" className="hl" style={{ color: "var(--fg-2)", textDecoration: "none" }}>← Overview</Link>
          <a href="https://github.com/prateek041/karya" className="hl" style={{ color: "var(--fg-2)", textDecoration: "none" }}>Follow along on GitHub ↗</a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
