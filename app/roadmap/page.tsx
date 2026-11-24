import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Roadmap | Karya",
  description: "What works in Karya today, what is being built now, and what comes after launch.",
};

type Status = "done" | "now" | "next";

const DONE = [
  "A terminal app with a streaming chat, and the tokens and cost of every turn",
  "Every session runs in its own virtual machine on your laptop",
  "Your project is copied into that machine, with secret files such as .env and keys left out",
  "Inside it the agent runs commands, keeps long-running ones going and types into them, reads files, and uses a Python session that remembers its state",
  "Bring your own key: OpenAI, or Amazon Bedrock",
  "Agents can hand a task to each other within one request, each seeing only its own conversation",
];

const MILESTONES: [string, Status, string, string, string[]][] = [
  [
    "M1",
    "now",
    "Reviewed changes",
    "Ask for a fix, and get back a change that a second agent has already reviewed, applied to your files only when you say so.",
    [
      "The agent edits and writes files inside its machine",
      "A safety test suite that proves the agent can't reach your files or your secrets from inside its machine",
      "A reviewer agent checks every change before you see it, and sends it back when something is wrong",
      "Agents share their work through versioned items that Karya keeps outside the machine: diffs, plans, documents, any kind of file",
      "You see the change as a diff, and accept all of it, part of it, or none",
      "A checkpoint is taken before anything touches your files, and changes to hooks or build scripts are flagged",
      "Edits you make on your side while the agent works are brought in, not overwritten",
      "The agent can stop and ask you a question",
      "Sessions are saved to disk and survive a restart, and an interrupted request is closed cleanly",
      "A desktop app with the same chat as the terminal app",
    ],
  ],
  [
    "M2",
    "next",
    "Safe edges",
    "The agent stays free inside its machine, and everything that crosses to your side is checked.",
    [
      "Approvals only at the edges: more files, new network writes, real secrets, applying changes. A YOLO mode that asks nothing, with the machine still in place",
      "A network gate: every request out of the machine is checked and logged, and leaks of your code are blocked",
      "A secret broker: real API keys never enter the machine, and are added only for the service they belong to",
      "A version control agent that commits on your machine only when you asked for commits, and always asks before pushing",
      "The process running the machine is locked down from outside",
      "Limits on steps, tokens, cost and time, and a pause when the agent repeats itself",
      "An audit log of every command, request, block and approval",
    ],
  ],
  [
    "M3",
    "next",
    "Beyond code",
    "Research, data and demos, not only code, with rich results shown to you safely.",
    [
      "The agent sees its own charts and images, and fixes them",
      "Rich results shown to you in an isolated view: pages, charts, rendered documents, audio and video",
      "Live demos served from the machine, opened in an isolated view that can reach only that demo",
      "Web search",
      "More providers: Anthropic and Google Gemini",
    ],
  ],
  [
    "M4",
    "next",
    "Projects and kept sessions",
    "Come back tomorrow and pick up exactly where you left off.",
    [
      "Projects that hold several repos, quick one-off sessions, and karya . from any repo",
      "Machines park when you close Karya and resume where they stopped, or start fresh from a clean snapshot",
      "A shared cache per project, so dependencies download once",
      "A session's machine, Python state included, kept for a week after you last used it",
      "A view to list, open and delete kept sessions",
      "Several sessions on one laptop at once, each landing its changes on its own branch",
    ],
  ],
];

const LATER = [
  "A reviewer that remembers past reviews",
  "Agents working at the same time",
  "Agents and tools that models add to Karya themselves",
  "Agents and tools defined by your team",
  "Review rules per repo, team and person",
  "Karya cloud",
  "Bring your own compute",
  "Reproducible sessions",
  "Editor clients",
  "Native Windows",
];

const chip = (s: Status) =>
  `px-2 py-0.5 text-[12px] border ${s === "done" ? "border-ok text-ok" : s === "now" ? "border-accent text-accent" : "border-line-2 text-fg-3"}`;
const label = { done: "works today", now: "in progress", next: "planned" };
const h2 = "mt-16 mr-0 mb-5 ml-0 border-t border-line pt-6 font-display text-[32px] leading-[1.15] font-medium";
const li = "font-sans text-[17px] leading-[1.55] text-fg-2";

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteNav active="roadmap" />
      <main className="mx-auto my-0 max-w-215 px-6 pt-11 pb-28">
        <div className="font-mono text-[13px] text-fg-3">roadmap</div>
        <h1 className="mt-4 mr-0 mb-5 ml-0 font-display text-[clamp(40px,5.6vw,60px)] leading-[1.04] font-medium tracking-[-0.022em] mobile:text-[38px]">
          What works, and <em className="text-accent">what&apos;s next.</em>
        </h1>
        <p className="m-0 max-w-[62ch] font-sans text-[20px] leading-[1.6] text-fg-2">
          Karya is built in milestones, and each one ends in something that runs. The landing page describes the product at launch. This page is the honest version of where it is today.
        </p>

        <h2 className={h2}>Works today</h2>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0 font-mono text-[13.5px]">
          {DONE.map((d) => (
            <li key={d} className="flex gap-3">
              <span className="text-ok">✓</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>

        <h2 className={h2}>To launch</h2>
        <div className="flex flex-col">
          {MILESTONES.map(([id, s, title, goal, items]) => (
            <section key={id} className={`flex flex-wrap gap-x-7 gap-y-3 border-b border-l-2 border-b-line py-6 pr-0 pl-4 ${s === "now" ? "border-l-accent" : "border-l-transparent"}`}>
              <div className="flex flex-[0_0_160px] flex-col items-start gap-2 font-mono">
                <span className="text-[13px] text-fg-3">{id}</span>
                <span className="font-display font-medium text-[22px] leading-[1.2] text-fg">{title}</span>
                <span className={chip(s)}>{label[s]}</span>
              </div>
              <div className="min-w-0 flex-[1_1_280px]">
                <p className="mt-0 mr-0 mb-3 ml-0 font-sans text-[17px] leading-[1.55] text-fg">{goal}</p>
                <ul className="m-0 flex flex-col gap-1 pl-4.5">
                  {items.map((i) => (
                    <li key={i} className={li}>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <h2 className={h2}>After launch</h2>
        <div className="flex flex-wrap gap-2.5 font-mono text-[13px]">
          {LATER.map((l) => (
            <span key={l} className="border border-line-2 px-2.5 py-1.25 text-fg-2">
              {l}
            </span>
          ))}
        </div>

        <div className="mt-18 flex flex-wrap justify-between gap-3 border-t border-line pt-5 font-mono text-[13px]">
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
