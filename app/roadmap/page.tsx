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

const chip = (s: Status) =>
  `px-2 py-[2px] text-[12px] border ${s === "done" ? "border-ok text-ok" : s === "now" ? "border-accent text-accent" : "border-line-2 text-fg-3"}`;
const label = { done: "works today", now: "in progress", next: "planned" };
const h2 = "mt-16 mr-0 mb-5 ml-0 border-t border-line pt-6 font-serif text-[32px] leading-[1.15] font-normal";
const li = "font-serif text-[17px] leading-[1.55] text-fg-2";

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteNav active="roadmap" />
      <main className="mx-auto my-0 max-w-[860px] px-6 pt-11 pb-28">
        <div className="font-mono text-[13px] text-fg-3">roadmap</div>
        <h1 className="mt-4 mr-0 mb-5 ml-0 font-serif text-[clamp(40px,5.6vw,60px)] leading-[1.04] font-normal tracking-[-0.022em] mobile:text-[38px]">
          What works, and <em className="text-accent">what&apos;s next.</em>
        </h1>
        <p className="m-0 max-w-[62ch] font-serif text-[20px] leading-[1.6] text-fg-2">
          Karya is built in milestones, and each one ends in something that runs. The landing page describes the product at launch. This page is the honest version of where it is today.
        </p>

        <h2 className={h2}>Works today</h2>
        <ul className="m-0 flex list-none flex-col gap-[10px] p-0 font-mono text-[13.5px]">
          {DONE.map((d) => (
            <li key={d} className="flex gap-3">
              <span className="text-ok">✓</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>

        <h2 className={h2}>To launch</h2>
        <div className="flex flex-col">
          {MILESTONES.map(([id, s, title, items]) => (
            <section key={id} className={`flex flex-wrap gap-x-7 gap-y-3 border-b border-l-2 border-b-line py-6 pr-0 pl-4 ${s === "now" ? "border-l-accent" : "border-l-transparent"}`}>
              <div className="flex flex-[0_0_160px] flex-col items-start gap-2 font-mono">
                <span className="text-[13px] text-fg-3">{id}</span>
                <span className="font-serif text-[22px] leading-[1.2] text-fg">{title}</span>
                <span className={chip(s)}>{label[s]}</span>
              </div>
              <ul className="m-0 flex min-w-0 flex-[1_1_280px] flex-col gap-1 pl-[18px]">
                {items.map((i) => (
                  <li key={i} className={li}>
                    {i}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <h2 className={h2}>After launch</h2>
        <div className="flex flex-wrap gap-[10px] font-mono text-[13px]">
          {LATER.map((l) => (
            <span key={l} className="border border-line-2 px-[10px] py-[5px] text-fg-2">
              {l}
            </span>
          ))}
        </div>

        <div className="mt-[72px] flex flex-wrap justify-between gap-3 border-t border-line pt-5 font-mono text-[13px]">
          <Link href="/" className="text-fg-2 no-underline hover:text-fg">
            ← Overview
          </Link>
          <a href="https://github.com/prateek041/karya" className="text-fg-2 no-underline hover:text-fg">
            Follow along on GitHub ↗
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
