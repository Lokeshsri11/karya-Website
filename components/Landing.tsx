"use client";

import React from "react";
import Link from "next/link";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import Terminal from "./Terminal";
import ApprovalCard from "./ApprovalCard";
import EnvTable from "./EnvTable";
import Mark from "./Mark";
import TuiFrame from "./TuiFrame";

const INSTALL = "go install github.com/prateek041/karya/cmd/karya@latest";

const SPLITS: Record<string, [string, string]> = {
  "Autonomy without the risk.": ["Autonomy without ", "the risk."],
  "A coding agent that asks first.": ["A coding agent that ", "asks first."],
  "The engineer drives. Karya assists.": ["The engineer drives. ", "Karya assists."],
  "The harness around the model.": ["The harness around ", "the model."],
};
const BIG = ["runs contained", "undo anything", "budgets enforced", "follows you", "no lock-in"];
const CHAPTERS = ["task", "plan", "read", "edit", "bash", "verify", "report"];
const TICKER = ["reads run on their own", "edits show a diff and ask", "bash runs in the sandbox", "plan · default · accept-edits", "/undo · /rewind · /redo", "sandbox-exec on macOS", "bubblewrap + seccomp on Linux", "network off by default", "Gemini · Anthropic · OpenAI-compatible", "append-only JSONL sessions", "end-to-end encrypted sync", "--max-cost · --max-steps", "loop detection", "verify before done", "single Go binary", "open source", "pre-1.0"];
const NODES: [string, string, boolean?][] = [
  ["task", "you", true],
  ["model", "auto"],
  ["tool call", "auto"],
  ["policy", "mode + sandbox"],
  ["tool result", "auto"],
  ["model", "auto · next step"],
  ["verify + report", "files · cost · checks"],
];
const SEQ = [
  { n: 0, it: 1, ms: 2000, c: 0, cap: "you: add a --json flag to the list command and make the tests pass" },
  { n: 1, it: 1, ms: 1400, c: 0.0034, cap: "model streams a plan and requests read cmd/list.go" },
  { n: 2, it: 1, ms: 1200, c: 0.0034, cap: "tool call: edit cmd/list.go" },
  { n: 3, it: 1, ms: 2400, c: 0.0034, cap: "policy: an edit in default mode · diff on screen · [a]pprove [d]eny" },
  { n: 4, it: 1, ms: 1200, c: 0.0095, cap: "tool result: ok · 1 replacement" },
  { n: 5, it: 1, ms: 1300, c: 0.0095, cap: "model reads the result and runs the tests" },
  { n: 2, it: 2, ms: 1200, c: 0.0095, cap: "tool call: bash go test ./... · timeout 120s" },
  { n: 3, it: 2, ms: 1600, c: 0.0095, cap: "policy: sandboxed bash, network off · runs without asking" },
  { n: 4, it: 2, ms: 1200, c: 0.0129, cap: "tool result: exit 0 · 3.8s" },
  { n: 5, it: 2, ms: 1200, c: 0.0129, cap: "model answers · no tool requested" },
  { n: 6, it: 2, ms: 3600, c: 0.02, cap: "verify passed · 1 file changed · in 4,812 · out 1,093 · $0.02 · 41s" },
];
const ROWS: [string, string, string, string, "d" | "p" | "w"][] = [
  ["root", "/", "", "denied", "d"],
  ["etc", "├─ etc/  usr/  var/", "", "denied", "d"],
  ["home", "├─ home/you/", "", "denied", "d"],
  ["ssh", "│  ├─ .ssh/", "", "denied", "d"],
  ["cache", "│  ├─ .cache/go-build/", "", "profile go", "p"],
  ["mod", "│  ├─ go/pkg/mod/", "", "profile go", "p"],
  ["proj", "│  └─ src/tasks/", "  project root", "writable", "w"],
  ["tmp", "└─ tmp/karya-7f3a2c/", "  session temp", "writable", "w"],
  ["net", "⇢ network egress", "  via local proxy", "allowlist only", "d"],
];
const TOOLS: [string, string, boolean, string, string][] = [
  ["read", "auto", false, "Returns bounded, line-numbered text. offset and limit page through large files.", `read cmd/list.go offset=14 limit=3
  14 │ cmd := &cobra.Command{Use: "list"}
  15 │ cmd.RunE = func(c *cobra.Command, …
  16 │   tasks := store.List()`],
  ["list · search", "auto", false, "A directory tree and a regex search, both bounded and both respecting .gitignore.", `search "printTable" --context 1
cmd/list.go:53   return printTable(c.OutOrStdout(), tasks)
internal/ui/table.go:12  func printTable(w io.Writer, …`],
  ["write · edit", "asks", true, "A diff before anything changes. old_text must match exactly once, and writes are atomic with permissions kept.", `edit cmd/list.go
error ambiguous_match  old_text found 2 times
file left untouched`],
  ["bash · fetch", "sandboxed", false, "bash runs in the OS sandbox and captures exit code, duration and the tail where errors live. fetch reaches allowlisted domains only.", `exit 1 · 6.2s · timed_out false
output capped, 48,213 bytes kept at @output/c7
--- FAIL: TestListJSON (0.00s)`],
];
const MODES: [string, string, string, string, string][] = [
  ["plan", "run", "refused", "run · read-only sandbox", "allowlist"],
  ["default", "run", "ask, with diff", "run · sandboxed", "allowlist"],
  ["accept-edits", "run", "run", "run · sandboxed", "allowlist"],
  ["--no-sandbox", "run", "ask", "ask every time", "ask"],
];
const PATHS: { name: string; tag: string; us?: boolean; rows: string[] }[] = [
  { name: "asks for everything", tag: "the cautious agent", rows: ["dozens of prompts", "your machine, once you press y", "git, by hand", "noticed on the bill", "when the model says so"] },
  { name: "runs on your host", tag: "the yolo agent", rows: ["none", "your whole machine", "git, by hand", "noticed on the bill", "when the model says so"] },
  { name: "kārya", tag: "contained and undoable", us: true, rows: ["edits only", "the project root and a temp dir", "/undo, bash included", "stopped at your budget", "when your checks pass"] },
];
const PATH_ROWS = ["prompts on a typical task", "what a bad command can reach", "undo a bad turn", "a runaway loop's cost", "\"done\" means"];
const PROVIDERS: [string, boolean][] = [["Gemini", true], ["Anthropic (Claude)", false], ["OpenAI", false], ["OpenRouter", false], ["DeepSeek", false], ["Qwen", false], ["Kimi", false], ["GLM", false], ["Ollama", false], ["vLLM", false], ["LM Studio", false]];
const FAQ: [string, string][] = [
  ["Is Karya free?", "Yes. Karya is open source and you bring your own API keys, so you pay your model provider directly. There is no markup on tokens and no Karya account."],
  ["Which models can I use?", "Gemini works today. Anthropic and OpenAI-compatible APIs (OpenAI, OpenRouter, DeepSeek, Qwen, Kimi, GLM, Ollama, vLLM, LM Studio) arrive in milestone M4, and you will be able to switch between them mid-session."],
  ["Can I use my Claude or ChatGPT subscription?", "No. Karya uses API keys only. Consumer subscriptions are not resold or proxied."],
  ["Is the sandbox a security boundary?", "No, and Karya never describes it as one. It limits the damage a mistaken command can do: writes stay in the project, the network is off by default, and .git is read-only. Do not rely on it to contain hostile code."],
  ["Where does my code go?", "Only to the model provider you choose, as part of the conversation. Sessions are stored on your machine, outside the project, with secrets redacted. Sync is end-to-end encrypted to a target you own."],
  ["Which platforms are supported?", "macOS (arm64 and x64) and Linux (x64 and arm64), including WSL2. Native Windows comes after launch."],
  ["Can I use it today?", "You can install the TUI and run the demo or stream from Gemini today. The agent loop, sandbox and undo land over the next milestones; the roadmap shows where each piece is."],
];
type Attempt = { cmd: string; res: string; ok: boolean; rows: string[] };
const ATTEMPTS: Attempt[] = [
  { cmd: "$ go test ./...", res: "✓ allowed · writes stay in the project root and go cache", ok: true, rows: ["proj", "cache"] },
  { cmd: "$ curl -fsSL https://get.example.sh | sh", res: "✕ denied · domain not on the allowlist", ok: false, rows: ["net"] },
  { cmd: "$ echo 'Host *' >> ~/.ssh/config", res: "✕ denied · outside the writable scope", ok: false, rows: ["ssh"] },
  { cmd: "$ go build -o $TMPDIR/karya-7f3a2c/tasks ./cmd", res: "✓ allowed · session temp dir is writable", ok: true, rows: ["tmp"] },
  { cmd: "read ../../etc/hosts", res: "✕ rejected · path escapes the project root", ok: false, rows: ["etc"] },
];

/* shared class lists (the design's repeated style fragments) */
const label = "font-mono text-[13px] text-fg-3";
// section heading; margins are added per use, mobile margins always win
const h2 = "font-serif font-normal text-[clamp(40px,6.2vw,78px)] leading-none tracking-[-0.018em] text-balance mobile:mt-[14px] mobile:mb-[18px] mobile:text-[36px] mobile:leading-[1.05]";
const h2m = "mt-[18px] mb-[22px]";
const lead = "font-serif text-[19px] leading-[1.6] text-pretty text-fg-2 mobile:text-[17px] mobile:leading-[1.55]";
const sectionPad = "mx-auto my-0 max-w-[1100px] px-6 py-[clamp(72px,10vw,128px)] mobile:px-5 mobile:py-14";
const split2 = "grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-x-16 gap-y-12";
const em = "text-accent";
const toolPre = "m-0 mt-auto overflow-hidden bg-bg-2 px-3 py-[10px] font-mono text-[12.5px] leading-[1.55] whitespace-pre-wrap [word-break:break-word] text-fg-2";
const toolCard = "flex flex-col gap-[14px] bg-bg p-[clamp(24px,3vw,40px)] [transition:background_.2s] hover:bg-bg-2 mobile:p-5";
const toolHead = "flex items-center justify-between font-mono";
const toolDesc = "font-serif text-[17px] leading-[1.5] text-fg-2";
const pill = "border border-line-2 px-[9px] py-[3px] text-fg-2";
const th = "px-4 py-3 font-normal";
const thFirst = "pt-3 pr-4 pb-3 pl-0 font-normal";
const thLast = "pt-3 pr-0 pb-3 pl-4 font-normal";
const thR = `${th} text-right`;
const td = "px-4 py-3";
const tdFirst = "pt-3 pr-4 pb-3 pl-0";
const tdLast = "pt-3 pr-0 pb-3 pl-4";
const tdR = `${td} text-right`;
const cmdBox = "flex max-w-full items-center border border-accent bg-bg-2 font-mono mobile:w-full mobile:gap-[10px] mobile:py-[10px] mobile:pr-[10px] mobile:pl-[14px] mobile:text-[12.5px]";
const cmdCode = "min-w-0 overflow-x-auto whitespace-nowrap mobile:flex-[1_1_auto] mobile:whitespace-normal mobile:[overflow-wrap:anywhere]";
const copyBtn = "flex-none cursor-pointer border border-accent bg-accent text-accent-ink hover:bg-transparent hover:text-accent";
const textLink = "font-mono underline-offset-4 hover:text-accent";

export interface LandingProps {
  headline?: string;
  model?: string;
  animate?: boolean;
}

interface State {
  gateKey: string | null;
  gatePress: string | null;
  copied: boolean;
  typed: number;
  cur: boolean;
  chapter: number;
  loopI: number;
  sbLines: { text: string; color: string }[]; // color is a Tailwind text class
  sbActive: Attempt | null;
  ledger: number;
  costT: number;
}

export default class Landing extends React.Component<LandingProps, State> {
  state: State = { gateKey: null, gatePress: null, copied: false, typed: 0, cur: true, chapter: -1, loopI: 0, sbLines: [], sbActive: null, ledger: 0, costT: 0 };
  rootRef = React.createRef<HTMLDivElement>();
  marqueeRef = React.createRef<HTMLDivElement>();
  marquee2Ref = React.createRef<HTMLDivElement>();
  gateRef = React.createRef<HTMLDivElement>();
  timers: ReturnType<typeof setTimeout>[] = [];
  alive = false;
  reduced = false;
  blink: ReturnType<typeof setInterval> | undefined;
  raf = 0;
  raf2 = 0;
  io: IntersectionObserver | undefined;
  io2: IntersectionObserver | undefined;
  ct: ReturnType<typeof setTimeout> | undefined;
  kh: ((e: KeyboardEvent) => void) | undefined;

  t(fn: () => void, ms: number) {
    this.timers.push(setTimeout(() => this.alive && fn(), ms));
  }
  headline() {
    return this.props.headline ?? "Autonomy without the risk.";
  }
  split(): [string, string] {
    const h = this.headline();
    return SPLITS[h] || [h, ""];
  }
  componentDidMount() {
    this.alive = true;
    this.kh = (e) => {
      const tg = e.target && (e.target as HTMLElement).tagName;
      if (tg === "INPUT" || tg === "TEXTAREA" || e.metaKey || e.ctrlKey) return;
      const k = (e.key || "").toLowerCase();
      const g = this.gateRef.current;
      if ((k === "a" || k === "d") && g) {
        const r = g.getBoundingClientRect();
        if (r.bottom > 80 && r.top < window.innerHeight - 80) this.pressGate(k);
      }
    };
    window.addEventListener("keydown", this.kh);
    this.reduced = !!(typeof window.matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);
    this.blink = setInterval(() => this.alive && this.setState((s) => ({ cur: !s.cur })), 530);
    if (this.reduced) {
      this.setState({ typed: 999, loopI: SEQ.length - 1, ledger: 5, costT: 1 });
      return;
    }
    const len = this.headline().length;
    let i = 0;
    const step = () => {
      i++;
      this.setState({ typed: i });
      if (i < len) this.t(step, 45 + Math.random() * 55);
    };
    this.t(step, 350);
    this.runLoop();
    this.runSandbox();
    this.runMarquee();
    this.runMarquee2();
    this.reveal();
  }
  componentWillUnmount() {
    this.alive = false;
    this.timers.forEach(clearTimeout);
    clearInterval(this.blink);
    cancelAnimationFrame(this.raf);
    cancelAnimationFrame(this.raf2);
    if (this.kh) window.removeEventListener("keydown", this.kh);
    this.io && this.io.disconnect();
    this.io2 && this.io2.disconnect();
    clearTimeout(this.ct);
  }
  runLoop() {
    let i = 0;
    const tick = () => {
      this.setState({ loopI: i });
      const ms = SEQ[i].ms;
      i = (i + 1) % SEQ.length;
      this.t(tick, ms);
    };
    tick();
  }
  runSandbox() {
    let a = 0;
    const next = () => {
      const at = ATTEMPTS[a];
      this.setState((s) => ({ sbActive: null, sbLines: [...s.sbLines, { text: at.cmd, color: "text-fg" }].slice(-7) }));
      this.t(() => {
        this.setState((s) => ({ sbActive: at, sbLines: [...s.sbLines, { text: "  " + at.res, color: at.ok ? "text-ok" : "text-no" }].slice(-7) }));
        this.t(() => {
          a = (a + 1) % ATTEMPTS.length;
          next();
        }, 2300);
      }, 900);
    };
    this.t(next, 600);
  }
  runMarquee() {
    let x = 0,
      last = performance.now();
    const f = (now: number) => {
      if (!this.alive) return;
      const el = this.marqueeRef.current;
      if (el) {
        x -= (now - last) * 0.05;
        const half = el.scrollWidth / 2;
        if (half && -x >= half) x += half;
        el.style.transform = "translate3d(" + x + "px,0,0)";
      }
      last = now;
      this.raf = requestAnimationFrame(f);
    };
    this.raf = requestAnimationFrame(f);
  }
  runMarquee2() {
    let x: number | null = null,
      last = performance.now();
    const f = (now: number) => {
      if (!this.alive) return;
      const el = this.marquee2Ref.current;
      if (el) {
        const half = el.scrollWidth / 2;
        if (x === null) x = -half;
        x += (now - last) * 0.06;
        if (half && x >= 0) x -= half;
        el.style.transform = "translate3d(" + x + "px,0,0)";
      }
      last = now;
      this.raf2 = requestAnimationFrame(f);
    };
    this.raf2 = requestAnimationFrame(f);
  }
  pressGate = (k: string) => {
    this.setState({ gateKey: k, gatePress: k });
    this.t(() => this.setState({ gatePress: null }), 150);
  };
  reveal() {
    const root = this.rootRef.current;
    if (!root || !window.IntersectionObserver) {
      this.playLedger();
      return;
    }
    this.io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "none";
            this.io!.unobserve(el);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      const sibs = [...el.parentElement!.children].filter((c) => c.hasAttribute("data-reveal"));
      const d = Math.min(Math.max(sibs.indexOf(el), 0), 5) * 90;
      const ease = "cubic-bezier(.2,.7,.2,1)";
      el.style.opacity = "0";
      el.style.transform = "translateY(32px)";
      el.style.transition = "opacity .9s " + ease + " " + d + "ms, transform .9s " + ease + " " + d + "ms";
      this.io!.observe(el);
    });
    const cost = root.querySelector("#cost");
    if (cost) {
      this.io2 = new IntersectionObserver(
        (es) => {
          if (es[0].isIntersecting) {
            this.io2!.disconnect();
            this.playLedger();
          }
        },
        { threshold: 0.3 },
      );
      this.io2.observe(cost);
    }
  }
  playLedger = () => {
    this.setState({ ledger: 0, costT: 0 });
    [1, 2, 3, 4, 5].forEach((n, i) => this.t(() => this.setState({ ledger: n }), 250 + i * 420));
    const t0 = performance.now() + 250,
      D = 2000;
    const f = (now: number) => {
      if (!this.alive) return;
      const p = Math.max(0, Math.min(1, (now - t0) / D));
      this.setState({ costT: p });
      if (p < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  };
  copy = () => {
    try {
      navigator.clipboard && navigator.clipboard.writeText(INSTALL).catch(() => {});
    } catch {}
    this.setState({ copied: true });
    clearTimeout(this.ct);
    this.ct = setTimeout(() => this.setState({ copied: false }), 1600);
  };
  onChapter = (i: number) => {
    if (this.alive && i !== this.state.chapter) this.setState({ chapter: i });
  };

  render() {
    const [A, B] = this.split();
    const n = this.state.typed;
    const ch = this.state.chapter;
    const step = SEQ[this.state.loopI];
    const act = this.state.sbActive;
    const e = 1 - Math.pow(1 - this.state.costT, 3);
    const lg = this.state.ledger;
    const model = this.props.model ?? "gemini-3.5-flash-lite";
    const termMode = (this.props.animate ?? true) ? "animated" : "final";
    const copyLabel = this.state.copied ? "copied" : "copy";
    const headA = A.slice(0, n);
    const headB = B.slice(0, Math.max(0, n - A.length));
    const chapterLabel = ch >= 0 ? "chapter " + (ch + 1) + "/7 · " + CHAPTERS[ch] : "one loop · sandboxed commands · one approval";
    const ticker = [...TICKER, ...TICKER];
    // alternate filled italic words with outlined upright ones
    const bigTicker = [...BIG, ...BIG].map((text, i) => ({ text, cls: i % 2 ? "text-transparent [-webkit-text-stroke:1.5px_var(--fg-2)] not-italic" : "text-fg [-webkit-text-stroke:0] italic" }));
    const gp = this.state.gatePress;
    const gateMsg = this.state.gateKey === "a" ? "✓ approved · edit applied · /undo can still take it back" : this.state.gateKey === "d" ? "✕ denied · file untouched · your reason goes to the model" : "› waiting on you · [a]pprove [d]eny";
    const rowOp = (k: number) => (lg >= k ? "opacity-100" : "opacity-10");

    return (
      <div ref={this.rootRef} className="min-h-screen overflow-x-hidden bg-bg text-fg">
        <SiteNav active="home" />

        {/* hero */}
        <section className="bg-grid border-b border-line">
          <div className="mx-auto my-0 max-w-[1200px] px-6 pt-[clamp(56px,8vw,104px)] pb-[clamp(56px,7vw,96px)] mobile:px-5 mobile:pt-10 mobile:pb-12">
            <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[10px] font-mono text-[12.5px]">
              <Link href="/roadmap" className="border border-accent px-[10px] py-[3px] text-accent no-underline hover:text-accent">
                in development · see the roadmap →
              </Link>
            </div>
            <h1 className="relative mt-7 mb-9 max-w-[12ch] font-serif text-[clamp(48px,8.4vw,120px)] leading-[0.95] font-normal tracking-[-0.04em] mobile:mt-[22px] mobile:mb-[26px] mobile:text-[44px] mobile:tracking-[-0.035em]">
              <span aria-hidden="true" className="invisible">
                {A}
                <em>{B}</em>&nbsp;
              </span>
              <span className="absolute top-0 right-0 left-0">
                {headA}
                <em className={em}>{headB}</em>
                <span className={`ml-[0.05em] inline-block h-[0.76em] w-[0.07em] bg-accent align-[-0.04em] ${this.state.cur ? "opacity-100" : "opacity-0"}`} />
              </span>
            </h1>
            <p data-reveal className="m-0 max-w-[56ch] font-serif text-[clamp(19px,2.1vw,24px)] leading-[1.5] text-pretty text-fg-2 mobile:text-[17px] mobile:leading-[1.55]">
              Karya is an opinionated engineering harness for AI agents that work on problems with you. Actions run freely inside a protected sandbox by default, so agents can get real work done without asking at every step. Budgets, thinking limits and built-in observability keep you in control.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <div className={`${cmdBox} gap-[14px] py-3 pr-3 pl-[18px] text-[14px]`}>
                <span className="text-accent">$</span>
                <code className={cmdCode}>{INSTALL}</code>
                <button onClick={this.copy} className={`${copyBtn} px-3 py-[5px] text-[12.5px]`}>
                  {copyLabel}
                </button>
              </div>
              <Link href="/docs" className={`${textLink} text-[14px] text-fg`}>
                Read the docs →
              </Link>
            </div>
            <div data-reveal className="mt-[72px] border border-line-2 bg-bg-2 p-[clamp(12px,2.4vw,32px)] mobile:mt-11 mobile:p-[10px]">
              <div className="mb-[22px] flex flex-wrap justify-between gap-x-4 gap-y-[6px] font-mono text-[12px] text-fg-3 mobile:mb-4 mobile:text-[11px]">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 bg-accent" />
                  demo · when it asks, press <span className="border border-accent px-[6px] py-0 text-accent">a</span> or <span className="border border-fg-3 px-[6px] py-0 text-fg-2">d</span>
                </span>
                <span>{chapterLabel}</span>
              </div>
              <Terminal mode={termMode} model={model} interactive onChapter={this.onChapter} />
              <div className="mt-[18px] grid grid-cols-[repeat(7,minmax(0,1fr))] gap-[6px] font-mono text-[11.5px] mobile:mt-3 mobile:gap-1 mobile:text-[10px]">
                {CHAPTERS.map((c, i) => (
                  <div key={c} className="flex min-w-0 flex-col gap-[7px]">
                    <div className={`h-[2px] [transition:background_.3s] ${i < ch ? "bg-fg-2" : i === ch ? "bg-accent" : "bg-line-2"}`} />
                    <span className={`overflow-hidden text-ellipsis whitespace-nowrap [transition:color_.3s] ${i === ch ? "text-accent" : i < ch ? "text-fg-2" : "text-fg-3"}`}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ticker */}
        <div className="overflow-hidden bg-fg text-bg">
          <div ref={this.marqueeRef} className="flex w-max will-change-transform">
            {ticker.map((t, i) => (
              <span key={i} className="flex items-center gap-[22px] py-[18px] pr-[22px] pl-0 font-mono text-[15px] whitespace-nowrap">
                <span className="inline-block h-2 w-2 bg-accent" />
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden border-b border-line px-0 py-[clamp(20px,3vw,40px)]">
          <div ref={this.marquee2Ref} className="flex w-max will-change-transform">
            {bigTicker.map((t, i) => (
              <span key={i} className={`flex items-center gap-[0.35em] pr-[0.35em] font-serif text-[clamp(64px,10vw,150px)] leading-[1.05] tracking-[-0.04em] whitespace-nowrap ${t.cls}`}>
                {t.text}
                <span className="inline-block h-[0.16em] w-[0.16em] bg-accent" />
              </span>
            ))}
          </div>
        </div>

        {/* the problem */}
        <section id="problem" className="border-b border-line">
          <div className={sectionPad}>
            <div data-reveal className={label}>the problem</div>
            <h2 data-reveal className={`${h2} ${h2m} max-w-[18ch]`}>
              Babysit it, or <em className={em}>hope for the best.</em>
            </h2>
            <p data-reveal className={`${lead} mt-0 mb-12 max-w-[62ch]`}>Most coding agents make you pick one. Approve every command and you spend the afternoon pressing y. Skip the prompts and a stray command runs on your real machine. Karya takes a third path: let it run, inside walls, with a way back.</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
              {PATHS.map((pth) => (
                <div key={pth.name} data-reveal className={`flex flex-col border ${pth.us ? "border-accent bg-bg-2" : "border-line-2 bg-transparent"}`}>
                  <div className="border-b border-line px-[18px] py-4">
                    <div className={`font-mono text-[12px] ${pth.us ? "text-accent" : "text-fg-3"}`}>{pth.tag}</div>
                    <div className={`mt-1 font-serif text-[26px] leading-[1.2] ${pth.us ? "text-accent italic" : "text-fg not-italic"}`}>{pth.name}</div>
                  </div>
                  {pth.rows.map((v, k) => (
                    <div key={k} className={`flex flex-col gap-[3px] px-[18px] py-3 ${k < pth.rows.length - 1 ? "border-b border-line" : ""}`}>
                      <span className="font-mono text-[11.5px] text-fg-3">{PATH_ROWS[k]}</span>
                      <span className={`font-mono text-[14px] ${pth.us ? "text-ok" : "text-fg-2"}`}>
                        {pth.us ? "✓ " : ""}
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* numbers */}
        <section className="border-b border-line">
          <div className="mx-auto my-0 grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-7 gap-y-12 px-6 py-[clamp(56px,8vw,104px)] mobile:grid-cols-[repeat(2,minmax(0,1fr))] mobile:gap-x-5 mobile:gap-y-8 mobile:px-5 mobile:py-12">
            {[
              ["7", "tools · read, list, search, write, edit, bash, fetch", false],
              ["3", "modes · plan, default, accept-edits", false],
              ["1", "provider interface · Gemini, Anthropic, OpenAI-compatible", false],
              ["1", "Go binary · go install and run", true],
            ].map(([num, cap, accent], i) => (
              <div key={i} data-reveal className="flex flex-col gap-[14px]">
                <div className={`font-serif text-[clamp(88px,11vw,148px)] leading-[0.85] tracking-[-0.05em] mobile:text-[64px] ${accent ? "text-accent" : ""}`}>{num as string}</div>
                <div className="border-t border-line-2 pt-3 font-mono text-[13px] text-fg-2">{cap as string}</div>
              </div>
            ))}
          </div>
        </section>

        {/* pillars index */}
        <section className="border-t border-line">
          <div className="mx-auto my-0 grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-7 gap-y-8 px-6 py-12 mobile:gap-x-5 mobile:gap-y-[22px] mobile:px-5 mobile:py-9">
            {[
              ["#sandbox", "01", "Contained, not interrogated", "Shell commands run in the OS sandbox without asking. Edits show a diff."],
              ["#undo", "02", "Every turn can be undone", "/undo restores the tree, including what bash changed."],
              ["#cost", "03", "Cost you can predict", "Hard budgets, loop detection and a report for every task."],
              ["#sessions", "04", "Sessions that follow you", "Resume on any machine. Sync is end-to-end encrypted."],
              ["#lockin", "05", "No lock-in", "One provider interface. Switch models mid-session."],
            ].map(([href, num, title, sub]) => (
              <a key={href} href={href} className="flex flex-col gap-2 text-fg no-underline">
                <span className="font-mono text-[12.5px] text-fg-3">{num}</span>
                <span className="font-serif text-[21px] leading-[1.2]">{title}</span>
                <span className="font-serif text-[16px] leading-[1.45] text-fg-2">{sub}</span>
              </a>
            ))}
          </div>
        </section>

        {/* the loop */}
        <section id="loop" className="border-t border-line">
          <div className={sectionPad}>
            <div data-reveal className={label}>the loop</div>
            <h2 data-reveal className={`${h2} ${h2m} max-w-[20ch]`}>One sequential loop, one step at a time.</h2>
            <p data-reveal className={`${lead} m-0 max-w-[62ch]`}>Karya keeps one model request in flight per session, and tool calls run one at a time in the order the model asked. Each call passes through the mode and the sandbox: reads and sandboxed commands run, edits in default mode wait for you. When the model stops asking for tools, your repo's checks run, and only then is the task reported done.</p>
            <div data-reveal className="mt-14 border border-line-2 p-[clamp(18px,3vw,36px)] mobile:mt-9 mobile:px-[14px] mobile:py-4">
              <div className="mb-7 flex flex-wrap justify-between gap-x-4 gap-y-[6px] font-mono text-[12.5px] text-fg-3">
                <span>
                  iteration {step.it} · step {this.state.loopI + 1} of 11
                </span>
                <span>est. ${step.c.toFixed(4)}</span>
              </div>
              <div className="flex flex-wrap items-start gap-x-0 gap-y-5 font-mono text-[13.5px] mobile:flex-col mobile:gap-0">
                {NODES.map(([lbl, sub, human], i) => {
                  const on = i === step.n,
                    past = i < step.n;
                  const borderStyle = human && !on ? "border-dashed" : "border-solid";
                  const borderColor = on ? (human ? "border-accent" : "border-fg") : human ? "border-accent" : past ? "border-fg-3" : "border-line-2";
                  const bg = on ? (human ? "bg-accent" : "bg-fg") : "bg-transparent";
                  const color = on ? (human ? "text-accent-ink" : "text-bg") : past ? "text-fg" : "text-fg-2";
                  return (
                    <div key={i} className="flex items-start mobile:w-full mobile:flex-col mobile:items-start">
                      <div className="flex flex-col gap-2">
                        <div className={`border px-[14px] py-[10px] whitespace-nowrap [transition:background_.25s,color_.25s,border-color_.25s] ${borderStyle} ${borderColor} ${bg} ${color}`}>{lbl}</div>
                        <div className={`text-[12px] whitespace-nowrap ${human ? "text-accent" : "text-fg-3"}`}>{sub}</div>
                      </div>
                      {i < NODES.length - 1 && (
                        <div className={`p-[10px] [transition:color_.25s] mobile:pt-1 mobile:pr-0 mobile:pb-[6px] mobile:pl-[14px] ${i < step.n ? "text-accent" : "text-fg-3"}`}>
                          <span className="mobile:hidden">→</span>
                          <span className="hidden mobile:inline">↓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-7 flex min-h-[1.6em] items-baseline gap-3 border-t border-line pt-4 font-mono text-[14px]">
                <span className="text-accent">›</span>
                <span>{step.cap}</span>
              </div>
            </div>
            <div className="mt-4 font-mono text-[12.5px] text-fg-3">↺ model → tool call → policy → result repeats until the model answers or a limit is hit · failed checks go back to the model</div>
            <div className="mt-9 flex flex-wrap items-center gap-[10px] border-t border-line pt-5 font-mono text-[12.5px]">
              <span className="mr-2 text-fg-3">exits on</span>
              <span className={pill}>verified answer</span>
              <span className={pill}>max steps</span>
              <span className={pill}>max cost</span>
              <span className={pill}>loop detected</span>
              <span className={pill}>interrupted</span>
              <span className="ml-auto flex gap-[18px] text-fg-3">
                <span>
                  <span className="mr-[6px] inline-block h-[10px] w-[10px] border border-line-2 align-[-1px]" />
                  automatic
                </span>
                <span>
                  <span className="mr-[6px] inline-block h-[10px] w-[10px] border border-dashed border-accent align-[-1px]" />
                  waits on you (edits in default mode)
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* approval gate */}
        <section id="gate" className="bg-accent text-accent-ink">
          <div ref={this.gateRef} className="mx-auto my-0 grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-x-16 gap-y-14 px-6 py-[clamp(80px,11vw,152px)] mobile:gap-10 mobile:px-5 mobile:py-16">
            <div>
              <div className="font-mono text-[13px]">the one prompt that matters</div>
              <h2 className="mt-5 mb-7 max-w-[11ch] font-serif text-[clamp(48px,7.4vw,108px)] leading-[0.95] font-normal tracking-[-0.04em] mobile:text-[44px]">
                Your files change when you press <em>a</em>.
              </h2>
              <p className="m-0 max-w-[42ch] font-serif text-[21px] leading-[1.5] text-pretty mobile:text-[18px]">In default mode, write and edit show a unified diff and wait. Commands don't ask: they run in the sandbox, and anything that tries to leave it always asks. Try it: press a or d on your keyboard, or click a key.</p>
            </div>
            <div className="flex flex-col items-start gap-9">
              <div className="flex flex-wrap gap-7">
                {(["a", "d"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => this.pressGate(k)}
                    aria-label={k === "a" ? "approve" : "deny"}
                    className={`flex h-[clamp(128px,14vw,176px)] w-[clamp(128px,14vw,176px)] cursor-pointer flex-col items-start justify-between border-2 border-accent-ink bg-transparent px-[18px] py-4 text-left text-accent-ink [transition:transform_.09s,box-shadow_.09s] hover:bg-accent-ink hover:text-accent ${
                      gp === k ? "[box-shadow:0_0px_0_var(--accent-ink)] [transform:translateY(10px)]" : "[box-shadow:0_10px_0_var(--accent-ink)] [transform:translateY(0px)]"
                    }`}
                  >
                    <span className="font-mono text-[clamp(56px,6vw,80px)] leading-none font-medium">{k}</span>
                    <span className="font-mono text-[13px]">{k === "a" ? "approve" : "deny"}</span>
                  </button>
                ))}
              </div>
              <div className="box-border flex w-full flex-col gap-1 border-2 border-accent-ink px-4 py-[14px] font-mono text-[14px] leading-[1.6]">
                <span>edit cmd/list.go · +5 −0</span>
                <span className="font-semibold">{gateMsg}</span>
              </div>
            </div>
          </div>
        </section>

        {/* real tui */}
        <section id="today" className="border-t border-line">
          <div className={sectionPad}>
            <div data-reveal className={label}>try it today</div>
            <h2 data-reveal className={`${h2} ${h2m} max-w-[18ch]`}>
              The terminal UI is real. <em className={em}>Take it for a spin.</em>
            </h2>
            <p data-reveal className={`${lead} mt-0 mb-7 max-w-[62ch]`}>The agent is still being built, but the TUI already runs: side-by-side diffs, threads, @ file mentions, ! shell commands, $EDITOR prompts and queued messages. The demo needs no API key.</p>
            <pre data-reveal className="mt-0 mb-10 inline-block max-w-full overflow-x-auto border border-accent bg-bg-2 px-[18px] py-3 font-mono text-[14px] leading-[1.8] mobile:text-[12.5px] mobile:whitespace-pre-wrap mobile:[overflow-wrap:break-word]">
              <span className="text-accent">$</span> {INSTALL.split("/").map((part, k) => (k ? <React.Fragment key={k}>/<wbr />{part}</React.Fragment> : part))}{"\n"}
              <span className="text-accent">$</span> karya -demo
            </pre>
            <div data-reveal>
              <TuiFrame />
            </div>
          </div>
        </section>

        {/* anatomy */}
        <section id="anatomy" className="border-t border-line">
          <div className={sectionPad}>
            <div data-reveal className={label}>anatomy of a harness</div>
            <h2 data-reveal className={`${h2} mt-[18px] mb-12 max-w-[22ch]`}>The model is the brain. The harness is everything around it.</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-8 gap-y-9">
              {[
                ["drives model and tool calls", "Streams text and assembles tool-call deltas as they arrive. One in-flight request per session."],
                ["manages state and context", "Canonical messages. Tool output is capped with the full copy kept readable. Compaction near the context limit is visible, and every turn goes to a JSONL log."],
                ["applies policy", "Three modes, the OS sandbox around shell commands, a network allowlist, and file paths confined to the project root."],
                ["keeps the task moving", "A sequential loop that runs until your checks pass or a limit is reached. Steer it mid-turn without interrupting."],
              ].map(([t, d]) => (
                <div key={t} data-reveal className="flex flex-col gap-3 border-t border-fg-3 pt-[18px]">
                  <div className="font-mono text-[13px]">{t}</div>
                  <div className="font-serif text-[17px] leading-[1.5] text-fg-2">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* modes and tools */}
        <section id="tools" className="border-t border-line">
          <div className={sectionPad}>
            <div data-reveal className={label}>modes and tools</div>
            <h2 data-reveal className={`${h2} ${h2m} max-w-[20ch]`}>
              Seven tools. Only edits <em className={em}>ask.</em>
            </h2>
            <p data-reveal className={`${lead} mt-0 mb-12 max-w-[62ch]`}>Reads, searches and sandboxed commands run on their own. write and edit show a unified diff and wait. Anything that tries to leave the sandbox, like an unsandboxed run or a domain off the allowlist, always asks. shift+tab cycles the mode.</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-px border border-line bg-line">
              {TOOLS.map(([name, badge, asks, d, ex]) => (
                <div key={name} data-reveal className={toolCard}>
                  <div className={toolHead}>
                    <span className="text-[30px] font-medium mobile:text-[24px]">{name}</span>
                    <span className={`border px-2 py-[2px] text-[12px] ${asks ? "border-accent text-accent" : "border-line-2 text-fg-2"}`}>{badge}</span>
                  </div>
                  <div className={toolDesc}>{d}</div>
                  <pre className={toolPre}>{ex}</pre>
                </div>
              ))}
            </div>
            <div data-reveal className="mt-14 overflow-x-auto border-t border-fg-3">
              <table className="w-full border-collapse text-left font-mono text-[13px] whitespace-nowrap">
                <thead>
                  <tr className="text-fg-3">
                    <th className={thFirst}>mode</th>
                    <th className={th}>read · list · search</th>
                    <th className={th}>write · edit</th>
                    <th className={th}>bash</th>
                    <th className={thLast}>fetch</th>
                  </tr>
                </thead>
                <tbody>
                  {MODES.map(([m, r, w, b, f]) => (
                    <tr key={m} className="border-t border-line">
                      <td className={`${tdFirst} font-medium`}>{m}</td>
                      <td className={`${td} text-fg-2`}>{r}</td>
                      <td className={`${td} ${w.startsWith("ask") ? "text-accent" : "text-fg-2"}`}>{w}</td>
                      <td className={`${td} ${b.startsWith("ask") ? "text-accent" : "text-fg-2"}`}>{b}</td>
                      <td className={`${tdLast} ${f === "ask" ? "text-accent" : "text-fg-2"}`}>{f}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-x-12 gap-y-8">
              <div>
                <h3 className="mt-0 mb-[14px] font-serif text-[28px] leading-[1.2] font-normal">A denial is information.</h3>
                <p data-reveal className="m-0 max-w-[52ch] font-serif text-[18px] leading-[1.6] text-pretty text-fg-2">Approve once, for this session, or always (saved as a rule). Or deny with a reason: the call does not run, and your reason goes back to the model so it can propose something else or stop.</p>
              </div>
              <div className="text-[13px]">
                <ApprovalCard tool="edit" target="cmd/list.go" diff={["@@ -14,3 +14,3 @@", "-    return printTable(c.OutOrStdout(), tasks)", "+    return printJSON(c.OutOrStdout(), tasks)"]} status="denied" />
                <pre className="m-0 overflow-hidden border border-line px-3 py-[10px] font-mono text-[12.5px] leading-[1.55] whitespace-pre-wrap [word-break:break-word] text-fg-2">{`tool_result → model
{ "tool": "edit", "status": "denied", "reason": "keep the table as the default" }`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* 01 sandbox */}
        <section id="sandbox" className="border-t border-line">
          <div className={`${sectionPad} ${split2}`}>
            <div>
              <div data-reveal className={label}>01 · contained by default</div>
              <h2 data-reveal className={`${h2} ${h2m} max-w-[16ch]`}>
                Contained, <em className={em}>not interrogated.</em>
              </h2>
              <p data-reveal className={`${lead} mt-0 mb-4 max-w-[52ch]`}>Most agents either ask before every command or run them on your host. Karya does neither: every bash command, and every process it starts, runs under the operating system's sandbox, so it can run without asking. sandbox-exec on macOS, bubblewrap with seccomp on Linux and WSL2. Writes are limited to the project root and a per-session temp directory, and .git stays read-only. Network is off except for allowlisted domains, with profiles for go, npm, pypi and cargo. A missing sandbox fails closed.</p>
              <p data-reveal className={`${lead} mt-0 mb-7 max-w-[52ch]`}>The file tools are confined to the root. They reject absolute paths, paths that escape with .., and symlinks that resolve outside it.</p>
              <div className="max-w-[52ch] border border-line-2 px-4 py-[14px]">
                <div className="mb-[6px] font-mono text-[12.5px] text-fg-3">note</div>
                <div className="font-serif text-[17px] leading-[1.5] text-fg">The sandbox limits how much damage a mistaken command can do. It is a blast-radius limiter, not a security boundary, and it should not be relied on to contain hostile code.</div>
              </div>
            </div>
            <div data-reveal className="flex min-w-0 flex-col gap-3 font-mono text-[12.5px] leading-[1.7]">
              <div className="border border-line-2 bg-term">
                <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-line px-[14px] py-2 text-fg-3">
                  <span>sandbox bubblewrap+seccomp · profile go</span>
                  <span>live</span>
                </div>
                <div className="overflow-x-auto overflow-y-hidden px-[14px] py-3">
                  {ROWS.map(([id, path, note, status, kind]) => {
                    const hit = !!(act && act.rows.includes(id));
                    const bg = hit ? (act!.ok ? "bg-ok-bg" : "bg-no-bg") : "bg-transparent";
                    const color = hit ? (act!.ok ? "text-ok" : "text-no") : kind === "w" ? "text-fg" : kind === "p" ? "text-fg-2" : "text-fg-3";
                    return (
                      <div key={id} className={`-mx-[6px] my-0 flex justify-between gap-3 px-[6px] py-0 whitespace-pre [transition:background_.3s,color_.3s] ${bg} ${color}`}>
                        <span>
                          {path}
                          <span className="opacity-70">{note}</span>
                        </span>
                        <span className={kind === "w" || hit ? "font-semibold" : "font-normal"}>{hit ? (act!.ok ? "✓ " : "✕ ") + status : status}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex h-[11.9em] flex-col justify-end overflow-hidden border-t border-line px-[14px] py-3">
                  {this.state.sbLines.map((l, i) => (
                    <div key={i} className={`whitespace-pre-wrap [word-break:break-word] ${l.color}`}>
                      {l.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 undo */}
        <section id="undo" className="border-t border-line">
          <div className={`${sectionPad} ${split2}`}>
            <div>
              <div data-reveal className={label}>02 · every turn can be undone</div>
              <h2 data-reveal className={`${h2} ${h2m} max-w-[16ch]`}>
                Let it run. <em className={em}>Take it back.</em>
              </h2>
              <p data-reveal className={`${lead} mt-0 mb-4 max-w-[52ch]`}>Before a turn's first side effect, Karya snapshots the working tree to a shadow git directory outside your project. /undo restores it, /rewind goes back several turns, /redo puts it all back. It covers every tool, bash included.</p>
              <p data-reveal className={`${lead} m-0 max-w-[52ch]`}>Every tool call is written to the log before it runs. If Karya crashes mid-call, resume marks the call as outcome unknown and never repeats it on its own.</p>
            </div>
            <pre data-reveal className="m-0 min-w-0 overflow-x-auto border border-line-2 bg-term px-4 py-[14px] font-mono text-[13px] leading-[1.75] text-fg-2">
              <span className="text-fg-3">turn 3 · snapshot 9c1e04 · before first side effect{"\n"}</span>
              {"· edit  cmd/list.go  ok\n· bash  go generate ./...  sandboxed  exit 0\n· write internal/gen/list_gen.go  ok\n\n"}
              <span className="text-accent">›</span>
              <span className="text-fg"> /undo{"\n"}</span>
              <span className="text-ok">✓ restored the tree to 9c1e04 · 3 files{"\n"}</span>
              <span className="text-fg-3">  not covered: .gitignored build/ (reported, untouched)</span>
            </pre>
          </div>
        </section>

        {/* 03 cost */}
        <section id="cost" className="border-t border-line">
          <div className={sectionPad}>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-end gap-x-16 gap-y-8">
              <div>
                <div data-reveal className={label}>03 · cost you can predict</div>
                <h2 data-reveal className={`${h2} ${h2m} max-w-[16ch]`}>
                  Budgets, <em className={em}>enforced.</em>
                </h2>
                <p data-reveal className={`${lead} m-0 max-w-[52ch]`}>Limits on steps, tokens, cost and time are enforced while the task runs, not reported after. Hitting one stops the turn, says which limit fired, and leaves the session resumable. Loop detection pauses a turn after three identical calls or the same failure three times. Every task ends with a report: files changed, commands run, checks, tokens, cost and duration.</p>
              </div>
              <div className="flex flex-col gap-[6px]">
                <div className="font-serif text-[clamp(64px,9.5vw,150px)] leading-[0.9] font-normal tracking-[-0.04em] whitespace-nowrap tabular-nums mobile:text-[56px]">{this.state.costT >= 1 ? "$0.02" : "$" + (0.02 * e).toFixed(4)}</div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[13px] text-fg-3">
                  <span>estimated cost of the task above · 4 turns · 41s</span>
                  <button onClick={this.playLedger} className="cursor-pointer border border-line-2 bg-transparent px-[10px] py-[3px] text-fg-2 hover:border-accent hover:text-accent">
                    replay
                  </button>
                </div>
              </div>
            </div>
            <div data-reveal className="mt-14 overflow-x-auto overflow-y-hidden border-t border-fg-3">
              <table className="w-full border-collapse font-mono text-[13px] whitespace-nowrap">
                <thead>
                  <tr className="text-left text-fg-3">
                    <th className={thFirst}>turn</th>
                    <th className={th}>model</th>
                    <th className={thR}>in</th>
                    <th className={thR}>out</th>
                    <th className={thR}>cost</th>
                    <th className={thR}>duration</th>
                    <th className={th}>tool</th>
                    <th className={thLast}>outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      [1, "812", "188", "$0.0034", "4.2s", "read", "ok · auto", "text-fg-2"],
                      [2, "1,046", "421", "$0.0061", "9.8s", "edit", "approved", "text-ok"],
                      [3, "1,297", "96", "$0.0034", "18.3s", "bash", "sandboxed · exit 0", "text-ok"],
                      [4, "1,657", "388", "$0.0071", "8.7s", "verify", "passed · done", "text-ok"],
                    ] as const
                  ).map(([k, i, o, c, d, tool, out, outColor]) => (
                    <tr key={k} className={`border-t border-line [transition:opacity_.5s] ${rowOp(k)}`}>
                      <td className={tdFirst}>{k}</td>
                      <td className={`${td} text-fg-2`}>{model}</td>
                      <td className={tdR}>{i}</td>
                      <td className={tdR}>{o}</td>
                      <td className={tdR}>{c}</td>
                      <td className={tdR}>{d}</td>
                      <td className={td}>{tool}</td>
                      <td className={`${tdLast} ${outColor}`}>{out}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-fg-3 font-medium tabular-nums">
                    <td className={tdFirst}>total</td>
                    <td className={td}></td>
                    <td className={tdR}>{Math.round(4812 * e).toLocaleString("en-US")}</td>
                    <td className={tdR}>{Math.round(1093 * e).toLocaleString("en-US")}</td>
                    <td className={tdR}>{"$" + (0.02 * e).toFixed(4)}</td>
                    <td className={tdR}>{(41 * e).toFixed(1) + "s"}</td>
                    <td className={td}></td>
                    <td className={tdLast}></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pre className="mt-8 mb-0 overflow-x-auto border border-line-2 px-4 py-3 font-mono text-[13px] leading-[1.7] text-fg-2">{`stopped  --max-cost reached ($1.00)
session 7f3a2c is resumable: karya resume 7f3a2c`}</pre>
          </div>
        </section>

        {/* 04 sessions */}
        <section id="sessions" className="border-t border-line">
          <div className={sectionPad}>
            <div data-reveal className={label}>04 · sessions that follow you</div>
            <h2 data-reveal className={`${h2} ${h2m} max-w-[20ch]`}>
              Start on one machine. <em className={em}>Resume on another.</em>
            </h2>
            <p data-reveal className={`${lead} mt-0 mb-12 max-w-[62ch]`}>Sessions are append-only JSONL logs stored outside the project. They are keyed to the git remote rather than the local path, and contain no absolute paths, hostnames or secrets. karya sync moves them through a folder, bucket or git ref you own, end-to-end encrypted, so the target never sees plaintext. On resume, Karya compares the recorded HEAD and dirty-tree flag with the live repository and tells the model what changed.</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4 font-mono text-[13px] leading-[1.7]">
              <div data-reveal className="border border-line-2">
                <div className="border-b border-line px-[14px] py-2 text-fg-3">machine a · darwin</div>
                <div className="overflow-x-auto px-[14px] py-3 whitespace-pre">
                  <span className="text-fg-3">$</span> cd ~/src/tasks{"\n"}
                  <span className="text-fg-3">$</span> karya{"\n"}
                  <span className="text-fg-3">{"session 7f3a2c\nHEAD a1b2c3 · clean"}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-[6px] border border-dashed border-line-2 px-[14px] py-4">
                <div className="text-fg-3">session key</div>
                <div className="text-[14px] font-medium break-all">github.com/acme/tasks</div>
                <div className="text-fg-3">
                  7f3a2c.jsonl · append-only
                  <br />
                  stored outside the project
                </div>
              </div>
              <div data-reveal className="border border-line-2">
                <div className="border-b border-line px-[14px] py-2 text-fg-3">machine b · linux</div>
                <div className="overflow-x-auto px-[14px] py-3 whitespace-pre">
                  <span className="text-fg-3">$</span> cd ~/work/tasks{"\n"}
                  <span className="text-fg-3">$</span> karya resume 7f3a2c{"\n"}
                  <span className="text-fg-3">HEAD d4e5f6 · dirty</span>
                </div>
              </div>
            </div>
            <div className="mt-4 border border-accent px-4 py-[14px] font-mono text-[13px] leading-[1.7]">
              <div className="text-fg-3">drift note, sent to the model on resume</div>
              <div className="mt-1">HEAD moved from a1b2c3 to d4e5f6, working tree dirty, platform changed from darwin to linux.</div>
            </div>
          </div>
        </section>

        {/* 05 lock-in */}
        <section id="lockin" className="border-t border-line">
          <div className={`${sectionPad} ${split2}`}>
            <div>
              <div data-reveal className={label}>05 · no lock-in</div>
              <h2 data-reveal className={`${h2} ${h2m} max-w-[16ch]`}>
                Switch models <em className={em}>mid-session.</em>
              </h2>
              <p data-reveal className={`${lead} mt-0 mb-4 max-w-[52ch]`}>The agent loop depends on a single internal provider interface: Gemini first, then Anthropic and OpenAI-compatible APIs (OpenRouter, DeepSeek, Qwen, Ollama, vLLM, LM Studio). Switch at any turn boundary with /model. Your own API keys, never logged.</p>
              <div data-reveal className="mt-0 mb-5 flex flex-wrap gap-2 font-mono text-[12.5px]">
                {PROVIDERS.map(([n, live]) => (
                  <span key={n} className={`border px-[10px] py-1 ${live ? "border-ok text-ok" : "border-line-2 text-fg-2"}`}>
                    {live ? "● " : ""}
                    {n}
                  </span>
                ))}
                <span className="px-0 py-1 text-fg-3">● works today · others in M4</span>
              </div>
              <p data-reveal className={`${lead} mt-0 mb-7 max-w-[52ch]`}>Sessions are stored in a canonical message format, never in a provider's wire types, so a log does not depend on the provider that wrote it.</p>
              <pre className="m-0 overflow-x-auto border border-line bg-bg-2 px-4 py-[14px] font-mono text-[13px] leading-[1.7]">
                <span className="text-fg-3">$</span> export GEMINI_API_KEY=…{"\n"}
                <span className="text-fg-3">$</span> karya --model {model} --max-cost 1.00
              </pre>
            </div>
            <EnvTable />
          </div>
        </section>

        {/* faq */}
        <section id="faq" className="border-t border-line">
          <div className={`${sectionPad} flex flex-wrap items-start gap-x-16 gap-y-8`}>
            <div className="flex-[1_1_280px]">
              <div data-reveal className={label}>questions</div>
              <h2 data-reveal className={`${h2} ${h2m} max-w-[12ch]`}>
                Before you <em className={em}>install.</em>
              </h2>
            </div>
            <div className="min-w-0 flex-[2_1_480px] border-t border-line-2">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group border-b border-line-2">
                  <summary className="flex cursor-pointer list-none justify-between gap-4 px-0 py-5 font-serif text-[21px] leading-[1.3] hover:text-accent [&::-webkit-details-marker]:hidden">
                    {q}
                    <span className="flex-none font-mono text-accent [transition:transform_.2s] group-open:[transform:rotate(45deg)]">+</span>
                  </summary>
                  <p className="mt-0 mb-[22px] max-w-[62ch] font-serif text-[17.5px] leading-[1.6] text-fg-2">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* open source */}
        <section id="source" className="border-t border-line">
          <div className={sectionPad}>
            <div data-reveal className={label}>open source</div>
            <h2 data-reveal className={`${h2} ${h2m} max-w-[20ch]`}>Small enough to read.</h2>
            <p data-reveal className={`${lead} mt-0 mb-4 max-w-[62ch]`}>One loop, one provider interface, one binary, and every dependency has to earn its place. Karya is pre-1.0 and in active development; the roadmap shows what works today and what is next. Interfaces may change between releases.</p>
            <p data-reveal className={`${lead} mt-0 mb-9 max-w-[62ch]`}>
              Issues and pull requests are welcome. For anything larger than a bug fix, open an issue first so the change can be discussed before the work is done.
            </p>
            <div className="flex flex-wrap gap-x-7 gap-y-3 font-mono text-[13.5px]">
              <a href="https://github.com/prateek041/karya" className={`${textLink} text-fg`}>
                github.com/prateek041/karya ↗
              </a>
              <Link href="/roadmap" className={`${textLink} text-fg-2`}>
                Roadmap
              </Link>
              <a href="https://github.com/prateek041/karya/issues" className={`${textLink} text-fg-2`}>
                Issues
              </a>
            </div>
          </div>
        </section>

        {/* closing CTA */}
        <section className="bg-grid border-t border-line">
          <div className="mx-auto my-0 flex max-w-[1200px] flex-col items-start gap-10 px-6 py-[clamp(88px,12vw,168px)] mobile:gap-7 mobile:px-5 mobile:py-16">
            <div data-reveal className="flex items-center gap-[18px]">
              <Mark size={88} />
              <span className="font-mono text-[13px] leading-[1.6] text-fg-3">
                kārya · कार्य
                <br />
                every task, carried through
              </span>
            </div>
            <h2 data-reveal className="m-0 max-w-[11ch] font-serif text-[clamp(56px,10vw,152px)] leading-[0.92] font-normal tracking-[-0.045em] mobile:text-[48px]">
              Let it run. <em className={em}>Stay in control.</em>
            </h2>
            <div data-reveal className={`${cmdBox} gap-4 py-4 pr-4 pl-[22px] text-[clamp(13px,1.6vw,17px)]`}>
              <span className="text-accent">$</span>
              <code className={cmdCode}>{INSTALL}</code>
              <button onClick={this.copy} className={`${copyBtn} px-[14px] py-[6px] text-[13px]`}>
                {copyLabel}
              </button>
            </div>
            <div data-reveal className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[14px]">
              <Link href="/docs" className={`${textLink} text-fg`}>
                Read the docs →
              </Link>
              <a href="https://github.com/prateek041/karya" className={`${textLink} text-fg`}>
                GitHub ↗
              </a>
              <a href="mailto:lokesh@usekarya.dev?subject=Tell%20me%20when%20Karya%20launches" className={`${textLink} text-fg`}>
                Tell me at launch →
              </a>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    );
  }
}
