"use client";

import React from "react";
import Link from "next/link";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import Terminal from "./Terminal";
import ApprovalCard from "./ApprovalCard";
import EnvTable from "./EnvTable";

const INSTALL = "go install github.com/prateek041/karya/cmd/karya@latest";

const SPLITS: Record<string, [string, string]> = {
  "A coding agent that asks first.": ["A coding agent that ", "asks first."],
  "The engineer drives. Karya assists.": ["The engineer drives. ", "Karya assists."],
  "The harness around the model.": ["The harness around ", "the model."],
};
const BIG = ["asks first", "runs contained", "costs visible", "follows you", "no lock-in"];
const CHAPTERS = ["task", "plan", "read", "edit", "bash", "tests", "answer"];
const TICKER = ["4 tools", "read runs on its own", "write asks", "edit asks", "bash asks", "one sequential loop", "one provider interface", "HARNESS_MODEL", "sandbox-exec on macOS", "bubblewrap + seccomp on Linux", "network off by default", "append-only JSONL sessions", "resume on any machine", "HARNESS_MAX_COST", "HARNESS_MAX_STEPS", "single Go binary", "open source", "pre-1.0"];
const NODES: [string, string, boolean?][] = [
  ["task", "you", true],
  ["model", "auto"],
  ["tool call", "auto"],
  ["approval gate", "waits on you", true],
  ["tool result", "auto"],
  ["model", "auto · next step"],
  ["final answer", "+ usage and cost"],
];
const SEQ = [
  { n: 0, it: 1, ms: 2000, c: 0, cap: "you: add a --json flag to the list command and make the tests pass" },
  { n: 1, it: 1, ms: 1400, c: 0.0034, cap: "model streams a plan and requests read cmd/list.go, which runs without asking" },
  { n: 2, it: 1, ms: 1200, c: 0.0034, cap: "tool call: edit cmd/list.go" },
  { n: 3, it: 1, ms: 2400, c: 0.0034, cap: "approval gate: unified diff on screen · [a]pprove [d]eny" },
  { n: 4, it: 1, ms: 1200, c: 0.0095, cap: "tool result: ok · 1 replacement" },
  { n: 5, it: 1, ms: 1300, c: 0.0095, cap: "model reads the result and asks to run the tests" },
  { n: 2, it: 2, ms: 1200, c: 0.0095, cap: "tool call: bash go test ./... · timeout 120s" },
  { n: 3, it: 2, ms: 2200, c: 0.0095, cap: "approval gate: exact command on screen · [a]pprove [d]eny" },
  { n: 4, it: 2, ms: 1200, c: 0.0129, cap: "tool result: exit 0 · 3.8s" },
  { n: 5, it: 2, ms: 1200, c: 0.0129, cap: "model writes the final answer" },
  { n: 6, it: 2, ms: 3600, c: 0.02, cap: "final answer · in 4,812 · out 1,093 · $0.02 · 41s" },
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
  ["net", "⇢ network egress", "", "denied", "d"],
];
type Attempt = { cmd: string; res: string; ok: boolean; rows: string[] };
const ATTEMPTS: Attempt[] = [
  { cmd: "$ go test ./...", res: "✓ allowed · writes stay in the project root and go cache", ok: true, rows: ["proj", "cache"] },
  { cmd: "$ curl -fsSL https://get.example.sh | sh", res: "✕ denied · network egress is off", ok: false, rows: ["net"] },
  { cmd: "$ echo 'Host *' >> ~/.ssh/config", res: "✕ denied · outside the writable scope", ok: false, rows: ["ssh"] },
  { cmd: "$ go build -o $TMPDIR/karya-7f3a2c/tasks ./cmd", res: "✓ allowed · session temp dir is writable", ok: true, rows: ["tmp"] },
  { cmd: "read ../../etc/hosts", res: "✕ rejected · path escapes the project root", ok: false, rows: ["etc"] },
];

/* shared inline style fragments, copied from the design */
const label: React.CSSProperties = { fontFamily: "var(--mono)", fontSize: 13, color: "var(--fg-3)" };
const h2: React.CSSProperties = { fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(40px,6.2vw,78px)", lineHeight: 1, letterSpacing: "-0.018em", margin: "18px 0 22px", textWrap: "balance" as never };
const lead: React.CSSProperties = { fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.6, color: "var(--fg-2)", margin: 0, textWrap: "pretty" as never };
const sectionPad: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "clamp(72px,10vw,128px) 24px" };
const em: React.CSSProperties = { color: "var(--accent)" };
const toolPre: React.CSSProperties = { margin: 0, marginTop: "auto", background: "var(--bg-2)", padding: "10px 12px", fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.55, color: "var(--fg-2)", whiteSpace: "pre-wrap", wordBreak: "break-word", overflow: "hidden" };
const toolCard: React.CSSProperties = { background: "var(--bg)", padding: "clamp(24px,3vw,40px)", display: "flex", flexDirection: "column", gap: 14, transition: "background .2s" };
const toolHead: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--mono)" };
const toolDesc: React.CSSProperties = { fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.5, color: "var(--fg-2)" };
const pill: React.CSSProperties = { border: "1px solid var(--line-2)", padding: "3px 9px", color: "var(--fg-2)" };
const th: React.CSSProperties = { fontWeight: 400, padding: "12px 16px" };
const thR: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "12px 16px" };
const tdR: React.CSSProperties = { ...td, textAlign: "right" };
const gridBg: React.CSSProperties = { backgroundImage: "linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px)", backgroundSize: "72px 72px", backgroundPosition: "center -1px" };

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
  sbLines: { text: string; color: string }[];
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
    return this.props.headline ?? "A coding agent that asks first.";
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
      this.setState((s) => ({ sbActive: null, sbLines: [...s.sbLines, { text: at.cmd, color: "var(--fg)" }].slice(-7) }));
      this.t(() => {
        this.setState((s) => ({ sbActive: at, sbLines: [...s.sbLines, { text: "  " + at.res, color: at.ok ? "var(--ok)" : "var(--no)" }].slice(-7) }));
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
    const model = this.props.model ?? "claude-sonnet-5";
    const termMode = (this.props.animate ?? true) ? "animated" : "final";
    const copyLabel = this.state.copied ? "copied" : "copy";
    const headA = A.slice(0, n);
    const headB = B.slice(0, Math.max(0, n - A.length));
    const chapterLabel = ch >= 0 ? "chapter " + (ch + 1) + "/7 · " + CHAPTERS[ch] : "one loop · four tools · two approvals";
    const ticker = [...TICKER, ...TICKER];
    const bigTicker = [...BIG, ...BIG].map((text, i) => ({ text, color: i % 2 ? "transparent" : "var(--fg)", stroke: i % 2 ? "1.5px var(--fg-2)" : "0", fstyle: i % 2 ? "normal" : "italic" }));
    const gp = this.state.gatePress;
    const gateMsg = this.state.gateKey === "a" ? "✓ approved · edit applied · result sent to the model" : this.state.gateKey === "d" ? "✕ denied · nothing ran · structured result sent to the model" : "› waiting on you · [a]pprove [d]eny";
    const rowOp = (k: number) => (lg >= k ? 1 : 0.1);

    return (
      <div ref={this.rootRef} style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh", overflowX: "hidden" }}>
        <SiteNav active="home" />

        {/* hero */}
        <section style={{ ...gridBg, borderBottom: "1px solid var(--line)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(56px,8vw,104px) 24px clamp(56px,7vw,96px)" }}>
            <div className="mono" style={{ display: "flex", flexWrap: "wrap", gap: "10px 14px", alignItems: "center", fontSize: 12.5 }}>
              <span style={{ border: "1px solid var(--accent)", color: "var(--accent)", padding: "3px 10px" }}>pre-1.0</span>
              <span style={{ color: "var(--fg-2)" }}>open-source agent harness · single Go binary</span>
              <Link href="/roadmap" className="ha" style={{ color: "var(--fg-2)", textUnderlineOffset: 3 }}>
                roadmap →
              </Link>
            </div>
            <h1 className="serif" style={{ position: "relative", fontWeight: 400, fontSize: "clamp(48px,8.4vw,120px)", lineHeight: 0.95, letterSpacing: "-0.04em", margin: "28px 0 36px", maxWidth: "12ch" }}>
              <span aria-hidden="true" style={{ visibility: "hidden" }}>
                {A}
                <em>{B}</em>&nbsp;
              </span>
              <span style={{ position: "absolute", left: 0, top: 0, right: 0 }}>
                {headA}
                <em style={em}>{headB}</em>
                <span style={{ display: "inline-block", width: "0.07em", height: "0.76em", marginLeft: "0.05em", background: "var(--accent)", verticalAlign: "-0.04em", opacity: this.state.cur ? 1 : 0 }} />
              </span>
            </h1>
            <p data-reveal className="serif" style={{ fontSize: "clamp(19px,2.1vw,24px)", lineHeight: 1.5, color: "var(--fg-2)", maxWidth: "56ch", margin: 0, textWrap: "pretty" as never }}>
              An agent harness is the runtime around a language model: it calls the model and its tools, keeps the conversation state, applies policy, and carries a task through to the end. Karya is a small one that runs in your terminal, built so the engineer stays in the control seat.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 28px", marginTop: 40 }}>
              <div className="mono" style={{ display: "flex", alignItems: "center", gap: 14, maxWidth: "100%", border: "1px solid var(--accent)", background: "var(--bg-2)", padding: "12px 12px 12px 18px", fontSize: 14 }}>
                <span style={{ color: "var(--accent)" }}>$</span>
                <code style={{ overflowX: "auto", whiteSpace: "nowrap", minWidth: 0 }}>{INSTALL}</code>
                <button onClick={this.copy} className="btn-fill" style={{ font: "inherit", fontSize: 12.5, background: "var(--accent)", border: "1px solid var(--accent)", color: "var(--accent-ink)", padding: "5px 12px", cursor: "pointer", flex: "none" }}>
                  {copyLabel}
                </button>
              </div>
              <Link href="/docs" className="mono ha" style={{ fontSize: 14, color: "var(--fg)", textUnderlineOffset: 4 }}>
                Read the docs →
              </Link>
            </div>
            <div data-reveal style={{ marginTop: 72, border: "1px solid var(--line-2)", background: "var(--bg-2)", padding: "clamp(12px,2.4vw,32px)" }}>
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px 16px", fontSize: 12, color: "var(--fg-3)", marginBottom: 22 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, background: "var(--accent)" }} />
                  live demo · when it asks, press <span style={{ border: "1px solid var(--accent)", color: "var(--accent)", padding: "0 6px" }}>a</span> or <span style={{ border: "1px solid var(--fg-3)", color: "var(--fg-2)", padding: "0 6px" }}>d</span>
                </span>
                <span>{chapterLabel}</span>
              </div>
              <Terminal mode={termMode} model={model} interactive onChapter={this.onChapter} />
              <div className="mono" style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: 6, marginTop: 18, fontSize: 11.5 }}>
                {CHAPTERS.map((c, i) => (
                  <div key={c} style={{ display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }}>
                    <div style={{ height: 2, background: i < ch ? "var(--fg-2)" : i === ch ? "var(--accent)" : "var(--line-2)", transition: "background .3s" }} />
                    <span style={{ color: i === ch ? "var(--accent)" : i < ch ? "var(--fg-2)" : "var(--fg-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color .3s" }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ticker */}
        <div style={{ background: "var(--fg)", color: "var(--bg)", overflow: "hidden" }}>
          <div ref={this.marqueeRef} style={{ display: "flex", width: "max-content", willChange: "transform" }}>
            {ticker.map((t, i) => (
              <span key={i} className="mono" style={{ display: "flex", alignItems: "center", gap: 22, padding: "18px 22px 18px 0", fontSize: 15, whiteSpace: "nowrap" }}>
                <span style={{ display: "inline-block", width: 8, height: 8, background: "var(--accent)" }} />
                {t}
              </span>
            ))}
          </div>
        </div>
        <div style={{ overflow: "hidden", borderBottom: "1px solid var(--line)", padding: "clamp(20px,3vw,40px) 0" }}>
          <div ref={this.marquee2Ref} style={{ display: "flex", width: "max-content", willChange: "transform" }}>
            {bigTicker.map((t, i) => (
              <span key={i} className="serif" style={{ display: "flex", alignItems: "center", gap: "0.35em", paddingRight: "0.35em", fontSize: "clamp(64px,10vw,150px)", lineHeight: 1.05, letterSpacing: "-0.04em", whiteSpace: "nowrap", color: t.color, WebkitTextStroke: t.stroke, fontStyle: t.fstyle }}>
                {t.text}
                <span style={{ display: "inline-block", width: "0.16em", height: "0.16em", background: "var(--accent)" }} />
              </span>
            ))}
          </div>
        </div>

        {/* numbers */}
        <section style={{ borderBottom: "1px solid var(--line)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(56px,8vw,104px) 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "48px 28px" }}>
            {[
              ["4", "tools · read, write, edit, bash", false],
              ["1", "sequential loop · one request in flight", false],
              ["1", "provider interface · swap with HARNESS_MODEL", false],
              ["1", "Go binary · go install and run", true],
            ].map(([num, cap, accent], i) => (
              <div key={i} data-reveal style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="serif" style={{ fontSize: "clamp(88px,11vw,148px)", lineHeight: 0.85, letterSpacing: "-0.05em", color: accent ? "var(--accent)" : undefined }}>{num as string}</div>
                <div className="mono" style={{ fontSize: 13, color: "var(--fg-2)", borderTop: "1px solid var(--line-2)", paddingTop: 12 }}>{cap as string}</div>
              </div>
            ))}
          </div>
        </section>

        {/* pillars index */}
        <section style={{ borderTop: "1px solid var(--line)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "32px 28px" }}>
            {[
              ["#tools", "01", "You are in control", "read runs on its own. write, edit and bash wait for you."],
              ["#lockin", "02", "No lock-in", "One provider interface. Change the model with one variable."],
              ["#sandbox", "03", "Contained by default", "Shell commands run under the OS sandbox, network off."],
              ["#sessions", "04", "Sessions that follow you", "Append-only logs keyed to the git remote."],
              ["#cost", "05", "Cost is visible", "Every turn records tokens, cost and duration."],
            ].map(([href, num, title, sub]) => (
              <a key={href} href={href} style={{ textDecoration: "none", color: "var(--fg)", display: "flex", flexDirection: "column", gap: 8 }}>
                <span className="mono" style={{ fontSize: 12.5, color: "var(--fg-3)" }}>{num}</span>
                <span className="serif" style={{ fontSize: 21, lineHeight: 1.2 }}>{title}</span>
                <span className="serif" style={{ fontSize: 16, lineHeight: 1.45, color: "var(--fg-2)" }}>{sub}</span>
              </a>
            ))}
          </div>
        </section>

        {/* the loop */}
        <section id="loop" style={{ borderTop: "1px solid var(--line)" }}>
          <div style={sectionPad}>
            <div data-reveal style={label}>the loop</div>
            <h2 data-reveal style={{ ...h2, maxWidth: "20ch" }}>One sequential loop, one step at a time.</h2>
            <p data-reveal style={{ ...lead, maxWidth: "62ch" }}>Karya keeps one model request in flight per session. Reads proceed on their own. Anything that writes a file or runs a command stops at the approval gate. A denial goes back to the model as a structured result, so it can try another approach or stop.</p>
            <div data-reveal style={{ marginTop: 56, border: "1px solid var(--line-2)", padding: "clamp(18px,3vw,36px)" }}>
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px 16px", fontSize: 12.5, color: "var(--fg-3)", marginBottom: 28 }}>
                <span>iteration {step.it} · step {this.state.loopI + 1} of 11</span>
                <span>est. ${step.c.toFixed(4)}</span>
              </div>
              <div className="mono" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "20px 0", fontSize: 13.5 }}>
                {NODES.map(([lbl, sub, human], i) => {
                  const on = i === step.n,
                    past = i < step.n;
                  const borderStyle = human && !on ? "dashed" : "solid";
                  const borderColor = on ? (human ? "var(--accent)" : "var(--fg)") : human ? "var(--accent)" : past ? "var(--fg-3)" : "var(--line-2)";
                  const bg = on ? (human ? "var(--accent)" : "var(--fg)") : "transparent";
                  const color = on ? (human ? "var(--accent-ink)" : "var(--bg)") : past ? "var(--fg)" : "var(--fg-2)";
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ border: `1px ${borderStyle} ${borderColor}`, background: bg, color, padding: "10px 14px", whiteSpace: "nowrap", transition: "background .25s,color .25s,border-color .25s" }}>{lbl}</div>
                        <div style={{ fontSize: 12, color: human ? "var(--accent)" : "var(--fg-3)", whiteSpace: "nowrap" }}>{sub}</div>
                      </div>
                      {i < NODES.length - 1 && <div style={{ padding: 10, color: i < step.n ? "var(--accent)" : "var(--fg-3)", transition: "color .25s" }}>→</div>}
                    </div>
                  );
                })}
              </div>
              <div className="mono" style={{ marginTop: 28, paddingTop: 16, borderTop: "1px solid var(--line)", fontSize: 14, display: "flex", gap: 12, alignItems: "baseline", minHeight: "1.6em" }}>
                <span style={{ color: "var(--accent)" }}>›</span>
                <span>{step.cap}</span>
              </div>
            </div>
            <div className="mono" style={{ marginTop: 16, fontSize: 12.5, color: "var(--fg-3)" }}>↺ model → tool call → gate → result repeats until the model answers or a limit is hit</div>
            <div className="mono" style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 10px", fontSize: 12.5 }}>
              <span style={{ color: "var(--fg-3)", marginRight: 8 }}>exits on</span>
              <span style={pill}>final answer</span>
              <span style={pill}>max steps</span>
              <span style={pill}>max cost</span>
              <span style={pill}>context rejected</span>
              <span style={pill}>cancelled</span>
              <span style={{ marginLeft: "auto", display: "flex", gap: 18, color: "var(--fg-3)" }}>
                <span>
                  <span style={{ display: "inline-block", width: 10, height: 10, border: "1px solid var(--line-2)", verticalAlign: -1, marginRight: 6 }} />
                  automatic
                </span>
                <span>
                  <span style={{ display: "inline-block", width: 10, height: 10, border: "1px dashed var(--accent)", verticalAlign: -1, marginRight: 6 }} />
                  waits on the human
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* approval gate */}
        <section id="gate" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
          <div ref={this.gateRef} style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(80px,11vw,152px) 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "56px 64px", alignItems: "center" }}>
            <div>
              <div className="mono" style={{ fontSize: 13 }}>the approval gate</div>
              <h2 className="serif" style={{ fontWeight: 400, fontSize: "clamp(48px,7.4vw,108px)", lineHeight: 0.95, letterSpacing: "-0.04em", margin: "20px 0 28px", maxWidth: "11ch" }}>
                Nothing changes until you press <em>a</em>.
              </h2>
              <p className="serif" style={{ fontSize: 21, lineHeight: 1.5, margin: 0, maxWidth: "42ch", textWrap: "pretty" as never }}>write, edit and bash show a unified diff or the exact command, then stop and wait. Try it: press a or d on your keyboard, or click a key.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 36, alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                {(["a", "d"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => this.pressGate(k)}
                    aria-label={k === "a" ? "approve" : "deny"}
                    className="gate-btn"
                    style={{ font: "inherit", cursor: "pointer", width: "clamp(128px,14vw,176px)", height: "clamp(128px,14vw,176px)", background: "transparent", color: "var(--accent-ink)", border: "2px solid var(--accent-ink)", boxShadow: `0 ${gp === k ? "0px" : "10px"} 0 var(--accent-ink)`, transform: `translateY(${gp === k ? "10px" : "0px"})`, transition: "transform .09s,box-shadow .09s", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 18px", textAlign: "left" }}
                  >
                    <span className="mono" style={{ fontSize: "clamp(56px,6vw,80px)", lineHeight: 1, fontWeight: 500 }}>{k}</span>
                    <span className="mono" style={{ fontSize: 13 }}>{k === "a" ? "approve" : "deny"}</span>
                  </button>
                ))}
              </div>
              <div className="mono" style={{ width: "100%", boxSizing: "border-box", border: "2px solid var(--accent-ink)", padding: "14px 16px", fontSize: 14, lineHeight: 1.6, display: "flex", flexDirection: "column", gap: 4 }}>
                <span>edit cmd/list.go · +5 −0</span>
                <span style={{ fontWeight: 600 }}>{gateMsg}</span>
              </div>
            </div>
          </div>
        </section>

        {/* anatomy */}
        <section id="anatomy" style={{ borderTop: "1px solid var(--line)" }}>
          <div style={sectionPad}>
            <div data-reveal style={label}>anatomy of a harness</div>
            <h2 data-reveal style={{ ...h2, margin: "18px 0 48px", maxWidth: "22ch" }}>The model is the brain. The harness is everything around it.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "36px 32px" }}>
              {[
                ["drives model and tool calls", "Streams text and assembles tool-call deltas as they arrive. One in-flight request per session."],
                ["manages state and context", "Canonical messages. Tool output is truncated with the original byte count recorded. Every turn goes to a JSONL session log."],
                ["applies policy", "An approval table per tool, the OS sandbox around shell commands, and file paths confined to the project root."],
                ["keeps the task moving", "A sequential loop that runs until the task completes or a limit is reached."],
              ].map(([t, d]) => (
                <div key={t} data-reveal style={{ borderTop: "1px solid var(--fg-3)", paddingTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div className="mono" style={{ fontSize: 13 }}>{t}</div>
                  <div className="serif" style={{ fontSize: 17, lineHeight: 1.5, color: "var(--fg-2)" }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 01 tools */}
        <section id="tools" style={{ borderTop: "1px solid var(--line)" }}>
          <div style={sectionPad}>
            <div data-reveal style={label}>01 · you are in control</div>
            <h2 data-reveal style={{ ...h2, maxWidth: "20ch" }}>
              Four tools. Three of them <em style={em}>ask.</em>
            </h2>
            <p data-reveal style={{ ...lead, maxWidth: "62ch", margin: "0 0 48px" }}>read runs automatically. write and edit show a unified diff, bash shows the exact command and its timeout, and each waits for you to press a key.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
              <div data-reveal className="card-hover" style={toolCard}>
                <div style={toolHead}>
                  <span style={{ fontSize: 30, fontWeight: 500 }}>read</span>
                  <span style={{ fontSize: 12, border: "1px solid var(--line-2)", color: "var(--fg-2)", padding: "2px 8px" }}>auto</span>
                </div>
                <div style={toolDesc}>Returns bounded, line-numbered text. offset and limit page through large files.</div>
                <pre style={toolPre}>{`read cmd/list.go offset=14 limit=3
  14 │ cmd := &cobra.Command{Use: "list"}
  15 │ cmd.RunE = func(c *cobra.Command, …
  16 │   tasks := store.List()`}</pre>
              </div>
              <div data-reveal className="card-hover" style={toolCard}>
                <div style={toolHead}>
                  <span style={{ fontSize: 30, fontWeight: 500 }}>write</span>
                  <span style={{ fontSize: 12, border: "1px solid var(--accent)", color: "var(--accent)", padding: "2px 8px" }}>asks</span>
                </div>
                <div style={toolDesc}>Writes to a temp file in the destination directory, then atomically replaces the target. File permissions are preserved.</div>
                <pre style={toolPre}>{`cmd/.list_test.go.tmp → cmd/list_test.go
mode 0644 kept · atomic replace`}</pre>
              </div>
              <div data-reveal className="card-hover" style={toolCard}>
                <div style={toolHead}>
                  <span style={{ fontSize: 30, fontWeight: 500 }}>edit</span>
                  <span style={{ fontSize: 12, border: "1px solid var(--accent)", color: "var(--accent)", padding: "2px 8px" }}>asks</span>
                </div>
                <div style={toolDesc}>old_text must match exactly once. Otherwise the tool returns not_found or ambiguous_match and the file is left untouched.</div>
                <pre style={toolPre}>{`edit cmd/list.go
error ambiguous_match  old_text found 2 times`}</pre>
              </div>
              <div data-reveal className="card-hover" style={toolCard}>
                <div style={toolHead}>
                  <span style={{ fontSize: 30, fontWeight: 500 }}>bash</span>
                  <span style={{ fontSize: 12, border: "1px solid var(--accent)", color: "var(--accent)", padding: "2px 8px" }}>asks</span>
                </div>
                <div style={toolDesc}>Captures stdout, stderr, exit code, duration and timeout status. Long output is truncated, keeping the tail where compiler and test errors live.</div>
                <pre style={toolPre}>{`exit 1 · 6.2s · timed_out false
output truncated, 48,213 bytes original
--- FAIL: TestListJSON (0.00s)`}</pre>
              </div>
            </div>
            <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: "32px 48px", alignItems: "start" }}>
              <div>
                <h3 className="serif" style={{ fontWeight: 400, fontSize: 28, lineHeight: 1.2, margin: "0 0 14px" }}>A denial is information.</h3>
                <p data-reveal className="serif" style={{ fontSize: 18, lineHeight: 1.6, color: "var(--fg-2)", maxWidth: "52ch", margin: 0, textWrap: "pretty" as never }}>Press d and the call does not run. The model receives a structured result saying so, and can propose something else or stop. Nothing runs that you did not see first.</p>
              </div>
              <div style={{ fontSize: 13 }}>
                <ApprovalCard tool="bash" target="project root" command="rm -rf ./dist && go generate ./..." timeout="120s" status="denied" />
                <pre style={{ margin: 0, border: "1px solid var(--line)", padding: "10px 12px", fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.55, color: "var(--fg-2)", whiteSpace: "pre-wrap", wordBreak: "break-word", overflow: "hidden" }}>{`tool_result → model
{ "tool": "bash", "status": "denied", "by": "user" }`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* 02 lock-in */}
        <section id="lockin" style={{ borderTop: "1px solid var(--line)" }}>
          <div style={{ ...sectionPad, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "48px 64px", alignItems: "start" }}>
            <div>
              <div data-reveal style={label}>02 · no lock-in</div>
              <h2 data-reveal style={{ ...h2, maxWidth: "16ch" }}>
                Change the model with <em style={em}>one variable.</em>
              </h2>
              <p data-reveal style={{ ...lead, maxWidth: "52ch", margin: "0 0 16px" }}>The agent loop depends on a single internal provider interface. Set HARNESS_MODEL and the loop, tools and approvals stay the same.</p>
              <p data-reveal style={{ ...lead, maxWidth: "52ch", margin: "0 0 28px" }}>Sessions are stored in a canonical message format, never in a provider's wire types, so a log does not depend on the provider that wrote it.</p>
              <pre style={{ margin: 0, background: "var(--bg-2)", border: "1px solid var(--line)", padding: "14px 16px", fontFamily: "var(--mono)", fontSize: 13, lineHeight: 1.7, overflowX: "auto" }}>
                <span style={{ color: "var(--fg-3)" }}>$</span> export HARNESS_MODEL={model}{"\n"}
                <span style={{ color: "var(--fg-3)" }}>$</span> export HARNESS_MAX_COST=1.00{"\n"}
                <span style={{ color: "var(--fg-3)" }}>$</span> karya
              </pre>
            </div>
            <EnvTable />
          </div>
        </section>

        {/* 03 sandbox */}
        <section id="sandbox" style={{ borderTop: "1px solid var(--line)" }}>
          <div style={{ ...sectionPad, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "48px 64px", alignItems: "start" }}>
            <div>
              <div data-reveal style={label}>03 · contained by default</div>
              <h2 data-reveal style={{ ...h2, maxWidth: "16ch" }}>
                A smaller <em style={em}>blast radius.</em>
              </h2>
              <p data-reveal style={{ ...lead, maxWidth: "52ch", margin: "0 0 16px" }}>Every bash command, and every process it starts, runs under the operating system's sandbox: sandbox-exec on macOS, bubblewrap with seccomp on Linux. Writes are limited to the project root and a per-session temp directory. Network egress is denied unless you enable it.</p>
              <p data-reveal style={{ ...lead, maxWidth: "52ch", margin: "0 0 28px" }}>The file tools are confined to the root. They reject absolute paths, paths that escape with .., and symlinks that resolve outside it.</p>
              <div style={{ border: "1px solid var(--line-2)", padding: "14px 16px", maxWidth: "52ch" }}>
                <div className="mono" style={{ fontSize: 12.5, color: "var(--fg-3)", marginBottom: 6 }}>note</div>
                <div className="serif" style={{ fontSize: 17, lineHeight: 1.5, color: "var(--fg)" }}>The sandbox limits how much damage a mistaken command can do. It is a blast-radius limiter, not a security boundary, and it should not be relied on to contain hostile code.</div>
              </div>
            </div>
            <div data-reveal className="mono" style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12.5, lineHeight: 1.7, minWidth: 0 }}>
              <div style={{ border: "1px solid var(--line-2)", background: "var(--term-bg)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px 16px", padding: "8px 14px", borderBottom: "1px solid var(--line)", color: "var(--fg-3)" }}>
                  <span>sandbox bubblewrap+seccomp · profile go</span>
                  <span>live</span>
                </div>
                <div style={{ padding: "12px 14px", overflowX: "auto", overflowY: "hidden" }}>
                  {ROWS.map(([id, path, note, status, kind]) => {
                    const hit = !!(act && act.rows.includes(id));
                    const bg = hit ? (act!.ok ? "var(--ok-bg)" : "var(--no-bg)") : "transparent";
                    const color = hit ? (act!.ok ? "var(--ok)" : "var(--no)") : kind === "w" ? "var(--fg)" : kind === "p" ? "var(--fg-2)" : "var(--fg-3)";
                    return (
                      <div key={id} style={{ display: "flex", justifyContent: "space-between", gap: 12, whiteSpace: "pre", padding: "0 6px", margin: "0 -6px", background: bg, color, transition: "background .3s,color .3s" }}>
                        <span>
                          {path}
                          <span style={{ opacity: 0.7 }}>{note}</span>
                        </span>
                        <span style={{ fontWeight: kind === "w" || hit ? 600 : 400 }}>{hit ? (act!.ok ? "✓ " : "✕ ") + status : status}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ borderTop: "1px solid var(--line)", padding: "12px 14px", height: "11.9em", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  {this.state.sbLines.map((l, i) => (
                    <div key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: l.color }}>{l.text}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 sessions */}
        <section id="sessions" style={{ borderTop: "1px solid var(--line)" }}>
          <div style={sectionPad}>
            <div data-reveal style={label}>04 · sessions that follow you</div>
            <h2 data-reveal style={{ ...h2, maxWidth: "20ch" }}>
              Start on one machine. <em style={em}>Resume on another.</em>
            </h2>
            <p data-reveal style={{ ...lead, maxWidth: "62ch", margin: "0 0 48px" }}>Sessions are append-only JSONL logs stored outside the project. They are keyed to the git remote URL rather than the local path, and the log contains no absolute paths or hostnames. On resume, Karya compares the recorded HEAD and dirty-tree flag with the live repository and tells the model what changed.</p>
            <div className="mono" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 16, fontSize: 13, lineHeight: 1.7 }}>
              <div data-reveal style={{ border: "1px solid var(--line-2)" }}>
                <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--line)", color: "var(--fg-3)" }}>machine a · darwin</div>
                <div style={{ padding: "12px 14px", whiteSpace: "pre", overflowX: "auto" }}>
                  <span style={{ color: "var(--fg-3)" }}>$</span> cd ~/src/tasks{"\n"}
                  <span style={{ color: "var(--fg-3)" }}>$</span> karya{"\n"}
                  <span style={{ color: "var(--fg-3)" }}>{"session 7f3a2c\nHEAD a1b2c3 · clean"}</span>
                </div>
              </div>
              <div style={{ border: "1px dashed var(--line-2)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, padding: "16px 14px" }}>
                <div style={{ color: "var(--fg-3)" }}>session key</div>
                <div style={{ fontSize: 14, fontWeight: 500, wordBreak: "break-all" }}>github.com/acme/tasks</div>
                <div style={{ color: "var(--fg-3)" }}>
                  7f3a2c.jsonl · append-only
                  <br />
                  stored outside the project
                </div>
              </div>
              <div data-reveal style={{ border: "1px solid var(--line-2)" }}>
                <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--line)", color: "var(--fg-3)" }}>machine b · linux</div>
                <div style={{ padding: "12px 14px", whiteSpace: "pre", overflowX: "auto" }}>
                  <span style={{ color: "var(--fg-3)" }}>$</span> cd ~/work/tasks{"\n"}
                  <span style={{ color: "var(--fg-3)" }}>$</span> karya --resume 7f3a2c{"\n"}
                  <span style={{ color: "var(--fg-3)" }}>HEAD d4e5f6 · dirty</span>
                </div>
              </div>
            </div>
            <div className="mono" style={{ marginTop: 16, border: "1px solid var(--accent)", padding: "14px 16px", fontSize: 13, lineHeight: 1.7 }}>
              <div style={{ color: "var(--fg-3)" }}>drift note, sent to the model on resume</div>
              <div style={{ marginTop: 4 }}>HEAD moved from a1b2c3 to d4e5f6, working tree dirty, platform changed from darwin to linux.</div>
            </div>
          </div>
        </section>

        {/* 05 cost */}
        <section id="cost" style={{ borderTop: "1px solid var(--line)" }}>
          <div style={sectionPad}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "32px 64px", alignItems: "end" }}>
              <div>
                <div data-reveal style={label}>05 · observability and cost</div>
                <h2 data-reveal style={{ ...h2, maxWidth: "16ch" }}>
                  Every turn has a <em style={em}>receipt.</em>
                </h2>
                <p data-reveal style={{ ...lead, maxWidth: "52ch" }}>Each turn records the model name, input and output tokens, estimated cost, duration and tool outcomes, in the session and in structured local logs. HARNESS_MAX_COST and HARNESS_MAX_STEPS stop the loop safely, say which limit was hit, and leave the session resumable.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="serif" style={{ fontWeight: 400, fontSize: "clamp(64px,9.5vw,150px)", lineHeight: 0.9, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{this.state.costT >= 1 ? "$0.02" : "$" + (0.02 * e).toFixed(4)}</div>
                <div className="mono" style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", alignItems: "center", fontSize: 13, color: "var(--fg-3)" }}>
                  <span>estimated cost of the task above · 4 turns · 41s</span>
                  <button onClick={this.playLedger} className="replay" style={{ font: "inherit", background: "none", border: "1px solid var(--line-2)", color: "var(--fg-2)", padding: "3px 10px", cursor: "pointer" }}>
                    replay
                  </button>
                </div>
              </div>
            </div>
            <div data-reveal style={{ marginTop: 56, overflowX: "auto", overflowY: "hidden", borderTop: "1px solid var(--fg-3)" }}>
              <table className="mono" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, whiteSpace: "nowrap" }}>
                <thead>
                  <tr style={{ color: "var(--fg-3)", textAlign: "left" }}>
                    <th style={{ ...th, padding: "12px 16px 12px 0" }}>turn</th>
                    <th style={th}>model</th>
                    <th style={thR}>in</th>
                    <th style={thR}>out</th>
                    <th style={thR}>cost</th>
                    <th style={thR}>duration</th>
                    <th style={th}>tool</th>
                    <th style={{ ...th, padding: "12px 0 12px 16px" }}>outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [1, "812", "188", "$0.0034", "4.2s", "read", "ok · auto", "var(--fg-2)", false],
                    [2, "1,046", "421", "$0.0061", "9.8s", "edit", "approved", "var(--ok)", false],
                    [3, "1,297", "96", "$0.0034", "18.3s", "bash", "approved · exit 0", "var(--ok)", false],
                    [4, "1,657", "388", "$0.0071", "8.7s", "none", "final answer", "var(--fg-2)", true],
                  ].map(([k, i, o, c, d, tool, out, outColor, toolDim]) => (
                    <tr key={k as number} style={{ borderTop: "1px solid var(--line)", opacity: rowOp(k as number), transition: "opacity .5s" }}>
                      <td style={{ ...td, padding: "12px 16px 12px 0" }}>{k as number}</td>
                      <td style={{ ...td, color: "var(--fg-2)" }}>{model}</td>
                      <td style={tdR}>{i as string}</td>
                      <td style={tdR}>{o as string}</td>
                      <td style={tdR}>{c as string}</td>
                      <td style={tdR}>{d as string}</td>
                      <td style={{ ...td, color: toolDim ? "var(--fg-3)" : undefined }}>{tool as string}</td>
                      <td style={{ ...td, padding: "12px 0 12px 16px", color: outColor as string }}>{out as string}</td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: "1px solid var(--fg-3)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                    <td style={{ ...td, padding: "12px 16px 12px 0" }}>total</td>
                    <td style={td}></td>
                    <td style={tdR}>{Math.round(4812 * e).toLocaleString("en-US")}</td>
                    <td style={tdR}>{Math.round(1093 * e).toLocaleString("en-US")}</td>
                    <td style={tdR}>{"$" + (0.02 * e).toFixed(4)}</td>
                    <td style={tdR}>{(41 * e).toFixed(1) + "s"}</td>
                    <td style={td}></td>
                    <td style={{ ...td, padding: "12px 0 12px 16px" }}></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pre style={{ margin: "32px 0 0", border: "1px solid var(--line-2)", padding: "12px 16px", fontFamily: "var(--mono)", fontSize: 13, lineHeight: 1.7, color: "var(--fg-2)", overflowX: "auto" }}>{`stopped  HARNESS_MAX_COST reached (1.00)
session 7f3a2c is resumable: karya --resume 7f3a2c`}</pre>
          </div>
        </section>

        {/* open source */}
        <section id="source" style={{ borderTop: "1px solid var(--line)" }}>
          <div style={sectionPad}>
            <div data-reveal style={label}>open source</div>
            <h2 data-reveal style={{ ...h2, maxWidth: "20ch" }}>Small enough to read.</h2>
            <p data-reveal style={{ ...lead, maxWidth: "62ch", margin: "0 0 16px" }}>Four tools, one loop, one provider interface, one binary. The source is on GitHub under the license in the repository. Karya is pre-1.0, and interfaces may change between releases.</p>
            <p data-reveal style={{ ...lead, maxWidth: "62ch", margin: "0 0 36px" }}>
              Issues and pull requests are welcome. For anything larger than a bug fix, open an issue first so the change can be weighed against the{" "}
              <Link href="/roadmap" className="ha" style={{ color: "var(--fg)", textUnderlineOffset: 3 }}>
                roadmap
              </Link>
              .
            </p>
            <div className="mono" style={{ display: "flex", flexWrap: "wrap", gap: "12px 28px", fontSize: 13.5 }}>
              <a href="https://github.com/prateek041/karya" className="ha" style={{ color: "var(--fg)", textUnderlineOffset: 4 }}>github.com/prateek041/karya ↗</a>
              <a href="https://github.com/prateek041/karya/blob/main/LICENSE" className="ha" style={{ color: "var(--fg-2)", textUnderlineOffset: 4 }}>License</a>
              <a href="https://github.com/prateek041/karya/issues" className="ha" style={{ color: "var(--fg-2)", textUnderlineOffset: 4 }}>Issues</a>
            </div>
          </div>
        </section>

        {/* closing CTA */}
        <section style={{ ...gridBg, borderTop: "1px solid var(--line)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(88px,12vw,168px) 24px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 40 }}>
            <h2 data-reveal className="serif" style={{ fontWeight: 400, fontSize: "clamp(56px,10vw,152px)", lineHeight: 0.92, letterSpacing: "-0.045em", margin: 0, maxWidth: "11ch" }}>
              Stay in the <em style={em}>control seat.</em>
            </h2>
            <div data-reveal className="mono" style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: "100%", border: "1px solid var(--accent)", background: "var(--bg-2)", padding: "16px 16px 16px 22px", fontSize: "clamp(13px,1.6vw,17px)" }}>
              <span style={{ color: "var(--accent)" }}>$</span>
              <code style={{ overflowX: "auto", whiteSpace: "nowrap", minWidth: 0 }}>{INSTALL}</code>
              <button onClick={this.copy} className="btn-fill" style={{ font: "inherit", fontSize: 13, background: "var(--accent)", border: "1px solid var(--accent)", color: "var(--accent-ink)", padding: "6px 14px", cursor: "pointer", flex: "none" }}>
                {copyLabel}
              </button>
            </div>
            <div data-reveal className="mono" style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px", fontSize: 14 }}>
              <Link href="/docs" className="ha" style={{ color: "var(--fg)", textUnderlineOffset: 4 }}>Read the docs →</Link>
              <a href="https://github.com/prateek041/karya" className="ha" style={{ color: "var(--fg)", textUnderlineOffset: 4 }}>GitHub ↗</a>
              <Link href="/roadmap" className="ha" style={{ color: "var(--fg)", textUnderlineOffset: 4 }}>Roadmap →</Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    );
  }
}
