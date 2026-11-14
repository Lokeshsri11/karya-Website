"use client";

import React from "react";
import ApprovalCard, { type ApprovalStatus } from "./ApprovalCard";

interface Block {
  id: string;
  kind: "user" | "text" | "trace" | "output" | "approval";
  text?: string;
  tool?: "edit" | "write" | "bash" | "proposal";
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

const TASK = "fix the failing test in internal/meter and make go test pass";
const PLAN = "Working in this session's VM, on a copy of your repo. Running the tests first to see what fails.";
const STEP = "Usage is summed before the billing-period filter runs. Moving the filter first.";
const DIFF = [
  "@@ -21,6 +21,7 @@ func Total(events []Event, p Period) int",
  "   total := 0",
  "-  for _, e := range events {",
  "+  for _, e := range inPeriod(events, p) {",
  "     total += e.Units",
  "   }",
  "   return total",
];
const OUT = [
  "--- FAIL: TestTotalRespectsPeriod (0.00s)",
  "    sum_test.go:34: got 1840, want 1210",
  "FAIL github.com/acme/billing/internal/meter  0.214s",
];
const SUMMARY = "Fixed Total so it filters by billing period before summing.\ngo test ./... passes in the VM. The diff is reviewed and applied to your repo.";
const VERIFY = "· review  oracle passed the diff · 1 file · tests ran in the VM";
const REPORT = "· report  1 file changed · checkpoint 3f9a1c · 4 commands · all in the VM";

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
    this.push({ kind: "trace", text: "· " + tool + " declined → your repo is unchanged" });
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
    this.push({ kind: "trace", text: "· vm  session microVM ready · repo copied to /workspace · .env left out" });
    await this.wait(700);
    await this.stream(this.push({ kind: "text", text: "" }), PLAN);
    await this.wait(350);
    this.ch(2);
    this.push({ kind: "trace", text: "· shell  go test ./internal/meter  in the VM" });
    this.setState({ status: "running" });
    await this.wait(900);
    for (const t of OUT) {
      this.push({ kind: "output", text: t });
      await this.wait(420);
    }
    this.setState({ status: "thinking" });
    this.ch(3);
    await this.stream(this.push({ kind: "text", text: "" }), STEP);
    this.push({ kind: "trace", text: "· shell  go test ./...  in the VM  exit 0" });
    this.setState({ status: "verifying" });
    await this.wait(900);
    this.ch(4);
    this.push({ kind: "trace", text: VERIFY });
    this.ch(5);
    const a = this.push({ kind: "approval", tool: "proposal", target: "internal/meter/sum.go", diff: DIFF, status: "pending" });
    this.setState({ status: "approval" });
    const ka = await this.decide(2800);
    if (ka === "d") return this.denied(a, "proposal", "Declined, so your repo is unchanged. The fix is still in the VM if you want it later.", "in 2,104 · out 402 · $0.01 · 14s");
    this.patch(a, { pressed: true });
    await this.wait(260);
    this.patch(a, { status: "approved" });
    this.push({ kind: "trace", text: "· apply  git checkpoint 3f9a1c · diff applied to your repo" });
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
      { kind: "trace", text: "· vm  session microVM ready · repo copied to /workspace · .env left out" },
      { kind: "text", text: PLAN },
      { kind: "trace", text: "· shell  go test ./internal/meter  in the VM" },
      ...OUT.map((t) => ({ kind: "output" as const, text: t })),
      { kind: "text", text: STEP },
      { kind: "trace", text: "· shell  go test ./...  in the VM  exit 0" },
      { kind: "trace", text: VERIFY },
      { kind: "approval", tool: "proposal", target: "internal/meter/sum.go", diff: DIFF, status: which === "docs" ? "pending" : "approved" },
    ];
    if (which !== "docs") {
      b.push(
        { kind: "trace", text: "· apply  git checkpoint 3f9a1c · diff applied to your repo" },
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
    const labels: Partial<Record<Status, string>> = { thinking: "streaming", read: "read · in the VM", running: "shell · running in the VM", verifying: "oracle · reviewing the diff" };
    const input = frozen ? "" : this.state.input;
    const isWaiting = status === "approval";
    const isBusy = !!labels[status];
    const usage = status === "done" ? `model ${this.props.model ?? "gpt-oss-120b"} · ${(!frozen && this.state.usageAlt) || "in 4,812 · out 1,093 · $0.02 · 41s"}` : "";
    const waitText = "waiting on you";

    const narrow = this.state.narrow;
    // A custom height prop wins; otherwise the frame is fixed while animating.
    const height = frozen ? "h-auto" : narrow ? "h-115" : this.props.height ? "" : "h-145";

    return (
      <div
        ref={this.rootRef}
        style={!frozen && !narrow && this.props.height ? { height: this.props.height } : undefined}
        className={`relative box-border flex w-full flex-col border border-line-2 bg-term text-left font-mono leading-[1.6] text-fg ${height} ${
          narrow ? "px-3 pt-5 pb-3 text-[12px]" : "px-4.5 pt-5.5 pb-3.5 text-[13px]"
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
                <div key={b.id} className="mt-0 mr-0 mb-2.5 ml-0 flex gap-2.5 font-medium">
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
        <div className="mt-2.5 flex min-h-[1.6em] flex-wrap gap-x-4 gap-y-1 border-t border-line pt-2 text-[0.92em] text-fg-3">
          {isWaiting && <span className="text-accent">{waitText}</span>}
          {isBusy && <span>{labels[status]}</span>}
          <span className="ml-auto">{usage}</span>
        </div>
        <div className="mt-2 flex items-start gap-2.5 border border-line-2 px-2.5 py-1.75">
          <span className="text-accent">›</span>
          <div className="min-w-0 whitespace-pre-wrap [word-break:break-word]">
            {input ? <span>{input}</span> : null}
            <span className={`inline-block h-[1.2em] w-[0.62em] bg-accent align-[-0.22em] ${this.state.cursor ? "opacity-100" : "opacity-0"}`} />
            {!input ? <span className="text-fg-3">What are we building today?</span> : null}
          </div>
        </div>
      </div>
    );
  }
}
