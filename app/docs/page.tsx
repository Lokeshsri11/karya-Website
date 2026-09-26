import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Terminal from "@/components/Terminal";
import ApprovalCard from "@/components/ApprovalCard";
import EnvTable from "@/components/EnvTable";

export const metadata: Metadata = { title: "Getting started — Karya docs" };

const h2: React.CSSProperties = { fontFamily: "var(--serif)", fontWeight: 400, fontSize: 32, lineHeight: 1.15, margin: "64px 0 16px", paddingTop: 24, borderTop: "1px solid var(--line)" };
const h3: React.CSSProperties = { fontFamily: "var(--serif)", fontWeight: 500, fontSize: 22, margin: "40px 0 12px" };
const p: React.CSSProperties = { fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.65, color: "var(--fg-2)", maxWidth: "65ch", margin: 0, textWrap: "pretty" as never };
const pre: React.CSSProperties = { margin: 0, background: "var(--bg-2)", border: "1px solid var(--line)", padding: "14px 16px", fontFamily: "var(--mono)", fontSize: 13.5, lineHeight: 1.7, overflowX: "auto" };
const code: React.CSSProperties = { fontFamily: "var(--mono)", fontSize: "0.84em", background: "var(--bg-2)", padding: "1px 5px", color: "var(--fg)" };
const dim: React.CSSProperties = { color: "var(--fg-3)" };
const sub: React.CSSProperties = { color: "var(--fg-2)", textDecoration: "none", padding: "3px 0 3px 24px", borderLeft: "1px solid var(--line)" };
const item: React.CSSProperties = { padding: "3px 0 3px 12px", borderLeft: "1px solid var(--line)" };
const tdBase: React.CSSProperties = { padding: "12px 16px" };
const drift: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "4px 24px", padding: "10px 0", borderBottom: "1px solid var(--line)" };

export default function Docs() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      <SiteNav active="docs" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", flexWrap: "wrap", gap: "0 64px", alignItems: "flex-start" }}>
        <aside className="mono docs-aside" style={{ flex: "1 0 200px", maxWidth: 220, top: 62, padding: "44px 0 24px", fontSize: 13, lineHeight: 1.5 }}>
          <div style={{ ...dim, marginBottom: 10 }}>start</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 28 }}>
            <a href="#top" style={{ color: "var(--fg)", textDecoration: "none", padding: "4px 0 4px 12px", borderLeft: "1px solid var(--accent)" }}>Getting started</a>
            <a href="#install" className="hl" style={sub}>Install</a>
            <a href="#configure" className="hl" style={sub}>Configure</a>
            <a href="#first-task" className="hl" style={sub}>First task</a>
            <a href="#approvals" className="hl" style={sub}>Approvals</a>
            <a href="#resume" className="hl" style={sub}>Resume</a>
          </div>
          <div style={{ ...dim, marginBottom: 10 }}>concepts</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 28, color: "var(--fg-3)" }}>
            <span style={item}>The loop</span>
            <span style={item}>Tools</span>
            <span style={item}>Sandbox</span>
            <span style={item}>Sessions</span>
            <span style={item}>Cost and limits</span>
          </div>
          <div style={{ ...dim, marginBottom: 10 }}>reference</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, color: "var(--fg-3)" }}>
            <span style={item}>Environment</span>
            <span style={item}>CLI flags</span>
            <Link href="/roadmap" className="hl" style={{ ...item, color: "var(--fg-2)", textDecoration: "none" }}>Roadmap</Link>
          </div>
        </aside>

        <main id="top" style={{ flex: "999 1 480px", minWidth: 0, maxWidth: 740, padding: "44px 0 112px" }}>
          <div className="mono" style={{ fontSize: 13, color: "var(--fg-3)" }}>docs / start</div>
          <h1 className="serif" style={{ fontWeight: 400, fontSize: "clamp(40px,5.6vw,60px)", lineHeight: 1.04, letterSpacing: "-0.022em", margin: "16px 0 20px" }}>Getting started</h1>
          <p style={{ ...p, fontSize: 20, lineHeight: 1.6, maxWidth: "62ch" }}>Install Karya, point it at a model, and run a first task inside a repository. Karya is pre-1.0; commands and variables may change before 1.0.</p>

          <h2 id="install" style={h2}>Install</h2>
          <p style={{ ...p, margin: "0 0 20px" }}>Karya is a single Go binary. Install it with the Go toolchain:</p>
          <pre style={pre}><span style={dim}>$</span> go install github.com/prateek041/karya/cmd/karya@latest</pre>
          <p style={{ ...p, margin: "20px 0 0" }}>
            A Homebrew tap and prebuilt release binaries are on the{" "}
            <Link href="/roadmap" style={{ color: "var(--fg)", textUnderlineOffset: 3 }}>roadmap</Link>.
          </p>

          <h2 id="configure" style={h2}>Configure</h2>
          <p style={{ ...p, margin: "0 0 28px" }}>Karya reads its configuration from environment variables. Only HARNESS_MODEL is required. The two limits are worth setting before your first session.</p>
          <EnvTable showFlags={false} />
          <p style={{ ...p, margin: "28px 0 16px" }}>For example, in your shell profile:</p>
          <pre style={pre}>{`export HARNESS_MODEL=claude-sonnet-5
export HARNESS_MAX_STEPS=40
export HARNESS_MAX_COST=1.00`}</pre>

          <h2 id="first-task" style={h2}>First task</h2>
          <p style={{ ...p, margin: "0 0 20px" }}>
            Run karya inside a repository. That directory becomes the project root for the session and cannot change while the session runs. Use <code style={code}>--root &lt;path&gt;</code> to choose a different directory.
          </p>
          <pre style={{ ...pre, margin: "0 0 20px" }}><span style={dim}>$</span> cd ~/src/tasks{"\n"}<span style={dim}>$</span> karya</pre>
          <p style={{ ...p, margin: "0 0 32px" }}>Type a bounded task in plain language and press enter. Karya streams the model's response, runs tool calls through the loop, and ends with a final answer and a usage and cost summary.</p>
          <div style={{ margin: "0 0 20px" }}>
            <Terminal mode="static" />
          </div>
          <p style={p}>
            Karya read <code style={code}>cmd/list.go</code> without asking. The edit is waiting: press <code style={{ ...code, color: "var(--ok)" }}>a</code> to approve or <code style={{ ...code, color: "var(--no)" }}>d</code> to deny.
          </p>

          <h2 id="approvals" style={h2}>Approvals</h2>
          <p style={{ ...p, margin: "0 0 28px" }}>Each tool has a fixed approval policy. Before anything that changes files or runs a command, Karya shows exactly what will happen and waits.</p>
          <div style={{ overflowX: "auto" }}>
            <table className="mono" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
              <thead>
                <tr style={{ color: "var(--fg-3)", borderBottom: "1px solid var(--fg-3)" }}>
                  <th style={{ fontWeight: 400, padding: "10px 16px 10px 0" }}>tool</th>
                  <th style={{ fontWeight: 400, padding: "10px 16px" }}>policy</th>
                  <th style={{ fontWeight: 400, padding: "10px 0 10px 16px" }}>shown before running</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["read", "auto", "var(--fg-2)", "one-line trace", "var(--fg-3)"],
                  ["write", "ask", "var(--accent)", "unified diff", "var(--fg-2)"],
                  ["edit", "ask", "var(--accent)", "unified diff", "var(--fg-2)"],
                  ["bash", "ask", "var(--accent)", "exact command and timeout", "var(--fg-2)"],
                ].map(([tool, pol, polC, shown, shownC]) => (
                  <tr key={tool} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ ...tdBase, padding: "12px 16px 12px 0", fontWeight: 500 }}>{tool}</td>
                    <td style={{ ...tdBase, color: polC }}>{pol}</td>
                    <td style={{ ...tdBase, padding: "12px 0 12px 16px", color: shownC }}>{shown}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 style={h3}>Why every shell command asks</h3>
          <p style={{ ...p, margin: "0 0 16px" }}>Karya does not try to sort shell commands into safe and unsafe. A command that looks read-only can start subprocesses, run a script, or redirect output into a file, and none of that is reliably visible from the command string. So bash always asks, and it always runs inside the sandbox.</p>
          <h3 style={h3}>Denying a call</h3>
          <p style={{ ...p, margin: "0 0 20px" }}>A denial is sent back to the model as a structured tool result. The model can propose a different approach or stop and explain.</p>
          <div style={{ fontSize: 13, maxWidth: 560 }}>
            <ApprovalCard tool="bash" target="project root" command="go test ./... -run TestList -count=1" timeout="120s" status="denied" />
          </div>

          <h2 id="resume" style={h2}>Resume a session</h2>
          <p style={{ ...p, margin: "0 0 20px" }}>Every session is an append-only JSONL log stored outside the project. Logs are keyed to the repository's git remote URL rather than its local path, and contain no absolute paths or hostnames, so you can resume on any machine with a clone of the same repository.</p>
          <pre style={{ ...pre, margin: "0 0 20px" }}><span style={dim}>$</span> karya --resume &lt;session-id&gt;</pre>
          <p style={{ ...p, margin: "0 0 16px" }}>On resume, Karya compares what it recorded with the live repository and gives the model a drift note. The note covers:</p>
          <div className="mono" style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--line)", margin: "0 0 24px", fontSize: 13 }}>
            <div style={drift}><span style={{ flex: "0 0 160px" }}>HEAD</span><span style={{ flex: "1 1 240px", color: "var(--fg-2)" }}>recorded SHA against the current SHA</span></div>
            <div style={drift}><span style={{ flex: "0 0 160px" }}>working tree</span><span style={{ flex: "1 1 240px", color: "var(--fg-2)" }}>recorded dirty flag against the current state</span></div>
            <div style={drift}><span style={{ flex: "0 0 160px" }}>platform</span><span style={{ flex: "1 1 240px", color: "var(--fg-2)" }}>operating system, if it changed</span></div>
          </div>
          <div className="mono" style={{ border: "1px solid var(--accent)", padding: "14px 16px", fontSize: 13, lineHeight: 1.7 }}>
            <div style={dim}>drift note</div>
            <div>HEAD moved from a1b2c3 to d4e5f6, working tree dirty, platform changed from darwin to linux.</div>
          </div>
          <p style={{ ...p, margin: "24px 0 0" }}>A session that stopped at HARNESS_MAX_STEPS or HARNESS_MAX_COST is resumable the same way.</p>

          <div className="mono" style={{ marginTop: 72, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 13 }}>
            <Link href="/" className="hl" style={{ color: "var(--fg-2)", textDecoration: "none" }}>← Overview</Link>
            <Link href="/roadmap" className="hl" style={{ color: "var(--fg-2)", textDecoration: "none" }}>Roadmap →</Link>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
