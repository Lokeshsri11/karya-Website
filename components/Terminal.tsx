"use client";

import React from "react";
import ApprovalCard, { type ApprovalStatus } from "./ApprovalCard";

interface Block {
  id: string;
  kind: "user" | "text" | "trace" | "output" | "approval";
  text?: string;
  tool?: "edit" | "write" | "bash";
  target?: string;
  diff?: string[];
  command?: string;
  timeout?: string;
  status?: ApprovalStatus;
  pressed?: boolean;
}

type Status = "idle" | "thinking" | "read" | "approval" | "running" | "done";

export interface TerminalProps {
  mode?: "animated" | "final" | "static";
  model?: string;
  height?: string;
  root?: string;
  interactive?: boolean;
  onChapter?: (i: number) => void;
}

interface State {
  blocks: Block[];
  input: string;
  cursor: boolean;
  narrow: boolean;
  reduced: boolean;
  status: Status;
  usageAlt: string | null;
}

const TASK = "add a --json flag to the list command and make the tests pass";
const PLAN = "I'll read the list command, add a --json flag that encodes the tasks with encoding/json, then run the test suite.";
const STEP = "RunE builds the table. Adding the flag and a JSON branch there.";
const DIFF = [
  "@@ -14,7 +14,12 @@ func newListCmd() *cobra.Command",
  '   cmd := &cobra.Command{Use: "list"}',
  "+  var asJSON bool",
  '+  cmd.Flags().BoolVar(&asJSON, "json", false, "print as JSON")',
  "   cmd.RunE = func(c *cobra.Command, _ []string) error {",
  "     tasks := store.List()",
  "+    if asJSON {",
  "+      return json.NewEncoder(c.OutOrStdout()).Encode(tasks)",
  "+    }",
  "     return printTable(c.OutOrStdout(), tasks)",
];
const OUT = [
  "ok   github.com/acme/tasks/cmd              0.412s",
  "ok   github.com/acme/tasks/internal/store   0.108s",
  "?    github.com/acme/tasks/internal/ui      [no test files]",
];
const SUMMARY = "Added a --json flag to list. It writes tasks as JSON and keeps the table as the default.\ngo test ./... passes.";

export default class Terminal extends React.Component<TerminalProps, State> {
  state: State = { blocks: [], input: "", cursor: true, narrow: false, reduced: false, status: "idle", usageAlt: null };
  rootRef = React.createRef<HTMLDivElement>();
  vpRef = React.createRef<HTMLDivElement>();
  uid = 0;
  alive = false;
  blinkT: ReturnType<typeof setInterval> | undefined;
  ro: ResizeObserver | undefined;
  pending: ((k: string) => void) | null = null;

  componentDidMount() {
    this.alive = true;
    this.blinkT = setInterval(() => this.alive && this.setState((s) => ({ cursor: !s.cursor })), 530);
    const reduced = !!(typeof window.matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = this.rootRef.current;
    if (el && window.ResizeObserver) {
      this.ro = new ResizeObserver(([e]) => {
        const n = e.contentRect.width < 600;
        if (n !== this.state.narrow) this.setState({ narrow: n });
      });
      this.ro.observe(el);
    }
    this.setState({ reduced });
    if ((this.props.mode ?? "animated") === "animated" && !reduced) this.loop();
  }
  componentWillUnmount() {
    this.alive = false;
    clearInterval(this.blinkT);
    this.ro && this.ro.disconnect();
  }
  componentDidUpdate() {
    const v = this.vpRef.current;
    if (v) v.scrollTop = v.scrollHeight;
  }

  wait(ms: number) {
    return new Promise<void>((res, rej) => setTimeout(() => (this.alive ? res() : rej("stop")), ms));
  }
  push(b: Omit<Block, "id">) {
    const id = "b" + ++this.uid;
    this.setState((s) => ({ blocks: [...s.blocks, { id, ...b }] }));
    return id;
  }
  patch(id: string, p: Partial<Block>) {
    this.setState((s) => ({ blocks: s.blocks.map((b) => (b.id === id ? { ...b, ...p } : b)) }));
  }
  async stream(id: string, text: string) {
    for (let i = 0; i < text.length; ) {
      i = Math.min(text.length, i + 3);
      this.patch(id, { text: text.slice(0, i) });
      await this.wait(28);
    }
  }
  async type(text: string) {
    for (let i = 1; i <= text.length; i++) {
      this.setState({ input: text.slice(0, i) });
      await this.wait(34 + Math.random() * 46);
    }
  }
  async loop() {
    try {
      while (this.alive) {
        await this.play();
        await this.wait(5000);
        this.setState({ blocks: [], status: "idle", input: "", usageAlt: null });
        this.ch(-1);
        await this.wait(700);
      }
    } catch {}
  }
  decide(ms: number): Promise<string> {
    if (!this.props.interactive) return this.wait(ms).then(() => "a");
    return new Promise((res, rej) => {
      let done = false;
      const fin = (k: string) => {
        if (done) return;
        done = true;
        window.removeEventListener("keydown", kh);
        clearTimeout(to);
        this.pending = null;
        this.alive ? res(k) : rej("stop");
      };
      const kh = (e: KeyboardEvent) => {
        const tg = e.target && (e.target as HTMLElement).tagName;
        if (tg === "INPUT" || tg === "TEXTAREA" || e.metaKey || e.ctrlKey) return;
        const k = (e.key || "").toLowerCase();
        if ((k === "a" || k === "d") && this.inView()) fin(k);
      };
      window.addEventListener("keydown", kh);
      const to = setTimeout(() => fin("a"), 9000);
      this.pending = fin;
    });
  }
  inView() {
    const el = this.rootRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }
  approveFn = () => this.pending && this.pending("a");
  denyFn = () => this.pending && this.pending("d");
  async denied(id: string, tool: string, msg: string, usage: string) {
    this.patch(id, { status: "denied" });
    this.push({ kind: "trace", text: "· " + tool + " denied → returned to the model as a structured result" });
    this.setState({ status: "thinking" });
    await this.wait(700);
    this.ch(6);
    await this.stream(this.push({ kind: "text", text: "" }), msg);
    this.setState({ status: "done", usageAlt: usage });
  }
  ch(i: number) {
    this.props.onChapter && this.props.onChapter(i);
  }
  async play() {
    this.ch(0);
    await this.wait(1000);
    await this.type(TASK);
    await this.wait(450);
    this.setState({ input: "", status: "thinking" });
    this.push({ kind: "user", text: TASK });
    this.ch(1);
    await this.wait(700);
    await this.stream(this.push({ kind: "text", text: "" }), PLAN);
    await this.wait(350);
    this.ch(2);
    this.setState({ status: "read" });
    this.push({ kind: "trace", text: "· read  cmd/list.go  lines 1–86" });
    await this.wait(900);
    this.setState({ status: "thinking" });
    await this.stream(this.push({ kind: "text", text: "" }), STEP);
    this.ch(3);
    const a = this.push({ kind: "approval", tool: "edit", target: "cmd/list.go", diff: DIFF, status: "pending" });
    this.setState({ status: "approval" });
    const ka = await this.decide(2800);
    if (ka === "d") return this.denied(a, "edit", "The edit was denied, so no files changed. I can propose a smaller change, or stop here.", "in 2,104 · out 402 · $0.01 · 14s");
    this.patch(a, { pressed: true });
    await this.wait(260);
    this.patch(a, { status: "approved" });
    this.push({ kind: "trace", text: "· edit  cmd/list.go  1 replacement  ok" });
    this.setState({ status: "thinking" });
    await this.wait(900);
    this.ch(4);
    const b = this.push({ kind: "approval", tool: "bash", target: "project root", command: "go test ./...", timeout: "120s", status: "pending" });
    this.setState({ status: "approval" });
    const kb = await this.decide(2200);
    if (kb === "d") return this.denied(b, "bash", "The edit is in place but the tests have not run. Approve go test ./... when you are ready.", "in 3,197 · out 681 · $0.01 · 22s");
    this.patch(b, { pressed: true });
    await this.wait(260);
    this.patch(b, { status: "approved" });
    this.setState({ status: "running" });
    await this.wait(900);
    this.ch(5);
    for (const t of OUT) {
      this.push({ kind: "output", text: t });
      await this.wait(420);
    }
    this.push({ kind: "trace", text: "· bash  exit 0  3.8s" });
    this.setState({ status: "thinking" });
    await this.wait(700);
    this.ch(6);
    await this.stream(this.push({ kind: "text", text: "" }), SUMMARY);
    this.setState({ status: "done" });
  }
  script(which: "docs" | "final"): Block[] {
    const b: Omit<Block, "id">[] = [
      { kind: "user", text: TASK },
      { kind: "text", text: PLAN },
      { kind: "trace", text: "· read  cmd/list.go  lines 1–86" },
      { kind: "text", text: STEP },
      { kind: "approval", tool: "edit", target: "cmd/list.go", diff: DIFF, status: which === "docs" ? "pending" : "approved" },
    ];
    if (which !== "docs") {
      b.push(
        { kind: "trace", text: "· edit  cmd/list.go  1 replacement  ok" },
        { kind: "approval", tool: "bash", target: "project root", command: "go test ./...", timeout: "120s", status: "approved" },
        ...OUT.map((t) => ({ kind: "output" as const, text: t })),
        { kind: "trace", text: "· bash  exit 0  3.8s" },
        { kind: "text", text: SUMMARY },
      );
    }
    return b.map((x, i) => ({ id: "s" + i, ...x }));
  }

  render() {
    const mode = this.props.mode ?? "animated";
    const isStatic = mode === "static";
    const frozen = isStatic || mode === "final" || this.state.reduced;
    const src = isStatic ? this.script("docs") : frozen ? this.script("final") : this.state.blocks;
    const status: Status = isStatic ? "approval" : frozen ? "done" : this.state.status;
    const labels: Partial<Record<Status, string>> = { thinking: "streaming", read: "read · runs without asking", running: "bash · running in sandbox" };
    const input = frozen ? "" : this.state.input;
    const isWaiting = status === "approval";
    const isBusy = !!labels[status];
    const usage = status === "done" ? `model ${this.props.model ?? "claude-sonnet-5"} · ${(!frozen && this.state.usageAlt) || "in 4,812 · out 1,093 · $0.02 · 41s"}` : "";
    const waitText = this.props.interactive && !frozen ? (this.state.narrow ? "your turn · tap a key" : "your turn · press a or d, or click") : "waiting on you · [a]pprove [d]eny";

    return (
      <div
        ref={this.rootRef}
        className="mono"
        style={{
          position: "relative",
          boxSizing: "border-box",
          width: "100%",
          height: frozen ? "auto" : this.state.narrow ? "460px" : (this.props.height ?? "580px"),
          display: "flex",
          flexDirection: "column",
          background: "var(--term-bg)",
          border: "1px solid var(--line-2)",
          padding: this.state.narrow ? "20px 12px 12px" : "22px 18px 14px",
          fontSize: this.state.narrow ? "12px" : "13px",
          lineHeight: 1.6,
          color: "var(--fg)",
          textAlign: "left",
        }}
      >
        <div style={{ position: "absolute", top: "-0.85em", left: 12, right: 12, display: "flex", justifyContent: "space-between", gap: 12, pointerEvents: "none" }}>
          <span style={{ background: "var(--term-bg)", padding: "0 8px", fontWeight: 600 }}>Karya</span>
          <span style={{ background: "var(--term-bg)", padding: "0 8px", color: "var(--fg-3)" }}>{this.props.root ?? "~/src/tasks"}</span>
        </div>
        <div ref={this.vpRef} className="noscroll" style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {src.map((b) => {
            if (b.kind === "user")
              return (
                <div key={b.id} style={{ display: "flex", gap: 10, margin: "0 0 10px", fontWeight: 500 }}>
                  <span style={{ color: "var(--accent)" }}>›</span>
                  <span style={{ whiteSpace: "pre-wrap" }}>{b.text}</span>
                </div>
              );
            if (b.kind === "text") return <div key={b.id} style={{ whiteSpace: "pre-wrap", margin: "0 0 8px" }}>{b.text}</div>;
            if (b.kind === "trace") return <div key={b.id} style={{ color: "var(--fg-3)", margin: "0 0 8px", whiteSpace: "pre-wrap" }}>{b.text}</div>;
            if (b.kind === "output") return <div key={b.id} style={{ color: "var(--fg-2)", whiteSpace: "pre-wrap" }}>{b.text}</div>;
            return (
              <ApprovalCard key={b.id} tool={b.tool} target={b.target} diff={b.diff} command={b.command} timeout={b.timeout} status={b.status} pressed={b.pressed} onApprove={this.approveFn} onDeny={this.denyFn} />
            );
          })}
        </div>
        <div style={{ display: "flex", gap: "4px 16px", flexWrap: "wrap", marginTop: 10, paddingTop: 8, borderTop: "1px solid var(--line)", fontSize: "0.92em", color: "var(--fg-3)", minHeight: "1.6em" }}>
          {isWaiting && <span style={{ color: "var(--accent)" }}>{waitText}</span>}
          {isBusy && <span>{labels[status]}</span>}
          <span style={{ marginLeft: "auto" }}>{usage}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 8, padding: "7px 10px", border: "1px solid var(--line-2)" }}>
          <span style={{ color: "var(--accent)" }}>›</span>
          <div style={{ minWidth: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {input ? <span>{input}</span> : null}
            <span style={{ display: "inline-block", width: "0.62em", height: "1.2em", verticalAlign: "-0.22em", background: "var(--accent)", opacity: this.state.cursor ? 1 : 0 }} />
            {!input ? <span style={{ color: "var(--fg-3)" }}>arise, resolved to fight</span> : null}
          </div>
        </div>
      </div>
    );
  }
}
