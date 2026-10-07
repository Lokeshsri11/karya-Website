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
const tdBase: React.CSSProperties = { padding: "12px 16px" };
const KEYS: [string, string][] = [
  ["enter", "send; during a run, queue it (ctrl+x stops the run and sends now)"],
  ["shift+enter", "new line (alt+enter and ctrl+j also work)"],
  ["shift+tab", "cycle the mode: normal → accept edits → plan"],
  ["ctrl+g", "write the prompt in $VISUAL / $EDITOR"],
  ["↑ / ↓", "prompt history, kept in $XDG_STATE_HOME/karya/history"],
  ["@ / !", "mention a file (attached for the model) / run a shell command"],
  ["ctrl+r", "threads, grouped by project"],
  ["/", "commands: /undo, /mode, /notify, /threads, /editor, /theme, /exit, …"],
  ["?", "every key"],
];
const drift: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "4px 24px", padding: "10px 0", borderBottom: "1px solid var(--line)" };

export default function Docs() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      <SiteNav active="docs" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", flexWrap: "wrap", gap: "0 64px", alignItems: "flex-start" }}>
        <aside className="mono docs-aside" style={{ flex: "1 0 200px", maxWidth: 220, top: 62, padding: "44px 0 24px", fontSize: 13, lineHeight: 1.5 }}>
          <div className="aside-label" style={{ ...dim, marginBottom: 10 }}>start</div>
          <div className="aside-start" style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 28 }}>
            <a href="#top" className="active" style={{ color: "var(--fg)", textDecoration: "none", padding: "4px 0 4px 12px", borderLeft: "1px solid var(--accent)" }}>Getting started</a>
            <a href="#install" className="hl" style={sub}>Install</a>
            <a href="#configure" className="hl" style={sub}>Configure</a>
            <a href="#run" className="hl" style={sub}>Run</a>
            <a href="#keys" className="hl" style={sub}>Keys</a>
          </div>
          <div className="aside-label aside-secondary" style={{ ...dim, marginBottom: 10 }}>coming next</div>
          <div className="aside-secondary" style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 28 }}>
            <a href="#modes" className="hl" style={sub}>Modes and approvals</a>
            <a href="#undo" className="hl" style={sub}>Undo</a>
            <a href="#resume" className="hl" style={sub}>Resume</a>
            <a href="#reference" className="hl" style={sub}>Reference</a>
          </div>
        </aside>

        <main id="top" className="docs-main" style={{ flex: "999 1 480px", minWidth: 0, maxWidth: 740, padding: "44px 0 112px" }}>
          <div className="mono" style={{ fontSize: 13, color: "var(--fg-3)" }}>docs / start</div>
          <h1 className="serif page-h1" style={{ fontWeight: 400, fontSize: "clamp(40px,5.6vw,60px)", lineHeight: 1.04, letterSpacing: "-0.022em", margin: "16px 0 20px" }}>Getting started</h1>
          <p style={{ ...p, fontSize: 20, lineHeight: 1.6, maxWidth: "62ch" }}>Install Karya, add a Gemini key, and try the terminal UI. Karya is in active development: the TUI works today, and the agent loop, sandbox and undo arrive over the next milestones.</p>
          <div className="mono" style={{ border: "1px solid var(--accent)", padding: "14px 16px", fontSize: 13, lineHeight: 1.7, marginTop: 28 }}>
            <div style={{ color: "var(--accent)" }}>status</div>
            <div>Working today: the TUI, the scripted demo, live Gemini streaming, threads and prompt history. Not yet: tools, sandbox, undo, sessions. <Link href="/roadmap" className="ha" style={{ color: "var(--fg)" }}>See the roadmap →</Link></div>
          </div>

          <h2 id="install" style={h2}>Install</h2>
          <p style={{ ...p, margin: "0 0 20px" }}>Karya is a single Go binary and needs Go 1.25.4 or newer:</p>
          <pre style={pre}><span style={dim}>$</span> go install github.com/prateek041/karya/cmd/karya@latest</pre>
          <p style={{ ...p, margin: "20px 0 0" }}>Prebuilt release binaries for macOS and Linux are planned for launch.</p>

          <h2 id="configure" style={h2}>Configure</h2>
          <p style={{ ...p, margin: "0 0 20px" }}>Get a key from <a href="https://aistudio.google.com/apikey" className="ha">Google AI Studio</a> and export it, or put it in a <code style={code}>.env</code> file in the directory you run Karya from. An exported variable wins over the file.</p>
          <pre style={pre}>{`export GEMINI_API_KEY=…`}</pre>

          <h2 id="run" style={h2}>Run</h2>
          <p style={{ ...p, margin: "0 0 20px" }}>There are three ways to start Karya today:</p>
          <pre style={{ ...pre, margin: "0 0 20px" }}>
            <span style={dim}>$</span> karya -demo   <span style={dim}># scripted demo, no key needed</span>{"\n"}
            <span style={dim}>$</span> karya -live   <span style={dim}># stream answers from Gemini</span>{"\n"}
            <span style={dim}>$</span> karya         <span style={dim}># the TUI on the protocol, with the demo core</span>
          </pre>
          <p style={{ ...p, margin: "0 0 32px" }}>The demo below shows where the default mode is heading: the read and the sandboxed test run go ahead on their own, and the edit waits for you.</p>
          <div style={{ margin: "0 0 20px" }}>
            <Terminal mode="static" />
          </div>

          <h2 id="keys" style={h2}>Keys</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="mono" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
              <tbody>
                {KEYS.map(([k, d]) => (
                  <tr key={k} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ ...tdBase, padding: "12px 16px 12px 0", fontWeight: 500, whiteSpace: "nowrap", verticalAlign: "top" }}>{k}</td>
                    <td style={{ ...tdBase, padding: "12px 0 12px 16px", color: "var(--fg-2)" }}>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="modes" style={h2}>Modes and approvals <span className="mono" style={{ fontSize: 13, ...dim }}>planned · M2</span></h2>
          <p style={{ ...p, margin: "0 0 28px" }}>Karya does not ask before every command. Shell commands run inside the OS sandbox, so they can run freely; edits show a diff. shift+tab cycles the mode.</p>
          <div style={{ overflowX: "auto" }}>
            <table className="mono" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left", whiteSpace: "nowrap" }}>
              <thead>
                <tr style={{ color: "var(--fg-3)", borderBottom: "1px solid var(--fg-3)" }}>
                  <th style={{ fontWeight: 400, padding: "10px 16px 10px 0" }}>mode</th>
                  <th style={{ fontWeight: 400, padding: "10px 16px" }}>read · list · search</th>
                  <th style={{ fontWeight: 400, padding: "10px 16px" }}>write · edit</th>
                  <th style={{ fontWeight: 400, padding: "10px 0 10px 16px" }}>bash</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["plan", "run", "refused", "run · read-only sandbox"],
                  ["default", "run", "ask, with diff", "run · sandboxed"],
                  ["accept-edits", "run", "run", "run · sandboxed"],
                  ["--no-sandbox", "run", "ask", "ask every time"],
                ].map(([m, r, w, b]) => (
                  <tr key={m} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ ...tdBase, padding: "12px 16px 12px 0", fontWeight: 500 }}>{m}</td>
                    <td style={{ ...tdBase, color: "var(--fg-2)" }}>{r}</td>
                    <td style={{ ...tdBase, color: w.startsWith("ask") ? "var(--accent)" : "var(--fg-2)" }}>{w}</td>
                    <td style={{ ...tdBase, padding: "12px 0 12px 16px", color: b.startsWith("ask") ? "var(--accent)" : "var(--fg-2)" }}>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 style={h3}>Leaving the sandbox always asks</h3>
          <p style={{ ...p, margin: "0 0 16px" }}>An unsandboxed run or a domain that is not on the network allowlist always asks, in every mode. You can answer once, for this session, or always (saved as a rule).</p>
          <h3 style={h3}>Denying a call</h3>
          <p style={{ ...p, margin: "0 0 20px" }}>Deny with a reason and the call does not run. The reason goes back to the model as a structured result, so it can propose something else or stop. A denied edit leaves the file byte-identical.</p>
          <div style={{ fontSize: 13, maxWidth: 560 }}>
            <ApprovalCard tool="edit" target="cmd/list.go" diff={["@@ -14,3 +14,3 @@", "-    return printTable(c.OutOrStdout(), tasks)", "+    return printJSON(c.OutOrStdout(), tasks)"]} status="denied" />
          </div>

          <h2 id="undo" style={h2}>Undo <span className="mono" style={{ fontSize: 13, ...dim }}>planned · M3</span></h2>
          <p style={{ ...p, margin: "0 0 20px" }}>Before a turn's first side effect, Karya snapshots the working tree to a shadow git directory outside the project. This covers changes from every tool, bash included. Files the project ignores, and effects outside the root, are reported as not covered.</p>
          <pre style={pre}>{`/undo          restore the tree from before the last turn
/rewind <n>    go back n turns
/redo          re-apply what was undone`}</pre>

          <h2 id="resume" style={h2}>Resume a session <span className="mono" style={{ fontSize: 13, ...dim }}>planned · M1, M5</span></h2>
          <p style={{ ...p, margin: "0 0 20px" }}>Every session is an append-only JSONL log stored outside the project. Logs are keyed to the repository's git remote rather than its local path, and contain no absolute paths or hostnames, so you can resume on any machine with a clone of the same repository. karya sync moves them end-to-end encrypted through a folder, bucket or git ref you own.</p>
          <pre style={{ ...pre, margin: "0 0 20px" }}><span style={dim}>$</span> karya resume &lt;session-id&gt;</pre>
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
          <p style={{ ...p, margin: "24px 0 0" }}>A session that stopped at a cost or step limit is resumable the same way.</p>

          <h2 id="reference" style={h2}>Reference</h2>
          <EnvTable />

          <div className="mono" style={{ marginTop: 72, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 13 }}>
            <Link href="/" className="hl" style={{ color: "var(--fg-2)", textDecoration: "none" }}>← Overview</Link>
            <a href="https://github.com/prateek041/karya" className="hl" style={{ color: "var(--fg-2)", textDecoration: "none" }}>GitHub ↗</a>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
