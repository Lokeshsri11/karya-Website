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

type Status = "idle" | "thinking" | "read" | "approval" | "running" | "verifying" | "done";

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
const VERIFY = "· verify  go test ./... · go vet ./...  passed";
const REPORT = "· report  1 file changed · 1 command · verify passed · /undo restores the tree";

export default class Terminal extends React.Component<TerminalProps, State> {
  state: State = { blocks: [], input: "", cursor: true, narrow: false, reduced: false, status: "idle", usageAlt: null };
  rootRef = React.createRef<HTMLDivElement>();
  vpRef = React.createRef<HTMLDivElement>();
  uid = 0;
  alive = false;
  gen = 0; // bumped on unmount so a loop from an earlier mount stops
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
    this.gen++;
    clearInterval(this.blinkT);
    this.ro && this.ro.disconnect();
  }
  componentDidUpdate() {
    const v = this.vpRef.current;
    if (v) v.scrollTop = v.scrollHeight;
  }

  wait(ms: number) {
    const g = this.gen;
    return new Promise<void>((res, rej) => setTimeout(() => (this.alive && this.gen === g ? res() : rej("stop")), ms));
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
    const g = this.gen;
    return new Promise((res, rej) => {
      let done = false;
      const fin = (k: string) => {
        if (done) return;
        done = true;
        window.removeEventListener("keydown", kh);
        clearTimeout(to);
        this.pending = null;
        this.alive && this.gen === g ? res(k) : rej("stop");
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
    this.push({ kind: "trace", text: "· bash  go test ./...  sandboxed · network off · runs without asking" });
    this.setState({ status: "running" });
    await this.wait(900);
    this.ch(5);
    for (const t of OUT) {
      this.push({ kind: "output", text: t });
      await this.wait(420);
    }
    this.push({ kind: "trace", text: "· bash  exit 0  3.8s" });
    this.setState({ status: "verifying" });
    await this.wait(900);
    this.push({ kind: "trace", text: VERIFY });
    this.setState({ status: "thinking" });
    await this.wait(700);
    this.ch(6);
    await this.stream(this.push({ kind: "text", text: "" }), SUMMARY);
    this.push({ kind: "trace", text: REPORT });
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
        { kind: "trace", text: "· bash  go test ./...  sandboxed · network off · runs without asking" },
        ...OUT.map((t) => ({ kind: "output" as const, text: t })),
        { kind: "trace", text: "· bash  exit 0  3.8s" },
        { kind: "trace", text: VERIFY },
        { kind: "text", text: SUMMARY },
        { kind: "trace", text: REPORT },
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
    const labels: Partial<Record<Status, string>> = { thinking: "streaming", read: "read · runs without asking", running: "bash · running in sandbox", verifying: "verifying · repo checks" };
    const input = frozen ? "" : this.state.input;
    const isWaiting = status === "approval";
    const isBusy = !!labels[status];
    const usage = status === "done" ? `model ${this.props.model ?? "gemini-3.5-flash-lite"} · ${(!frozen && this.state.usageAlt) || "in 4,812 · out 1,093 · $0.02 · 41s"}` : "";
    const waitText = this.props.interactive && !frozen ? (this.state.narrow ? "your turn · tap a key" : "your turn · press a or d, or click") : "waiting on you · [a]pprove [d]eny";

    const narrow = this.state.narrow;
    // A custom height prop wins; otherwise the frame is fixed while animating.
    const height = frozen ? "h-auto" : narrow ? "h-[460px]" : this.props.height ? "" : "h-[580px]";

    return (
      <div
        ref={this.rootRef}
        style={!frozen && !narrow && this.props.height ? { height: this.props.height } : undefined}
        className={`relative box-border flex w-full flex-col border border-line-2 bg-term text-left font-mono leading-[1.6] text-fg ${height} ${
          narrow ? "px-3 pt-5 pb-3 text-[12px]" : "px-[18px] pt-[22px] pb-[14px] text-[13px]"
        }`}
      >
        <div className="pointer-events-none absolute top-[-0.85em] right-3 left-3 flex justify-between gap-3">
          <span className="bg-term px-2 py-0 font-semibold">Karya</span>
          <span className="bg-term px-2 py-0 text-fg-3">{this.props.root ?? "~/src/tasks"}</span>
        </div>
        <div ref={this.vpRef} className="no-scrollbar flex min-h-0 flex-[1_1_auto] flex-col overflow-y-auto">
          {src.map((b) => {
            if (b.kind === "user")
              return (
                <div key={b.id} className="mt-0 mr-0 mb-[10px] ml-0 flex gap-[10px] font-medium">
                  <span className="text-accent">›</span>
                  <span className="whitespace-pre-wrap">{b.text}</span>
                </div>
              );
            if (b.kind === "text") return <div key={b.id} className="mt-0 mr-0 mb-2 ml-0 whitespace-pre-wrap">{b.text}</div>;
            if (b.kind === "trace") return <div key={b.id} className="mt-0 mr-0 mb-2 ml-0 whitespace-pre-wrap text-fg-3">{b.text}</div>;
            if (b.kind === "output") return <div key={b.id} className="whitespace-pre-wrap text-fg-2">{b.text}</div>;
            return (
              <ApprovalCard key={b.id} tool={b.tool} target={b.target} diff={b.diff} command={b.command} timeout={b.timeout} status={b.status} pressed={b.pressed} onApprove={this.approveFn} onDeny={this.denyFn} />
            );
          })}
        </div>
        <div className="mt-[10px] flex min-h-[1.6em] flex-wrap gap-x-4 gap-y-1 border-t border-line pt-2 text-[0.92em] text-fg-3">
          {isWaiting && <span className="text-accent">{waitText}</span>}
          {isBusy && <span>{labels[status]}</span>}
          <span className="ml-auto">{usage}</span>
        </div>
        <div className="mt-2 flex items-start gap-[10px] border border-line-2 px-[10px] py-[7px]">
          <span className="text-accent">›</span>
          <div className="min-w-0 whitespace-pre-wrap [word-break:break-word]">
            {input ? <span>{input}</span> : null}
            <span className={`inline-block h-[1.2em] w-[0.62em] bg-accent align-[-0.22em] ${this.state.cursor ? "opacity-100" : "opacity-0"}`} />
            {!input ? <span className="text-fg-3">arise, resolved to fight</span> : null}
          </div>
        </div>
      </div>
    );
  }
}
