import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Terminal from "@/components/Terminal";
import ApprovalCard from "@/components/ApprovalCard";
import EnvTable from "@/components/EnvTable";

export const metadata: Metadata = { title: "Getting started — Karya docs" };

const h2 = "mt-16 mr-0 mb-4 ml-0 border-t border-line pt-6 font-serif text-[32px] leading-[1.15] font-normal";
const h3 = "mt-10 mr-0 mb-3 ml-0 font-serif text-[22px] font-medium";
const p = "max-w-[65ch] font-serif text-[18px] leading-[1.65] text-pretty text-fg-2";
const pre = "overflow-x-auto border border-line bg-bg-2 px-4 py-[14px] font-mono text-[13.5px] leading-[1.7]";
const code = "bg-bg-2 px-[5px] py-[1px] font-mono text-[0.84em] text-fg";
const dim = "text-fg-3";
const tag = "font-mono text-[13px] text-fg-3";
const sub = "border-l border-line pt-[3px] pr-0 pb-[3px] pl-6 text-fg-2 no-underline hover:text-fg mobile:border mobile:border-line-2 mobile:px-[10px] mobile:py-[6px]";
const td = "px-4 py-3";
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
const drift = "flex flex-wrap gap-x-6 gap-y-1 border-b border-line px-0 py-[10px]";

export default function Docs() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteNav active="docs" />
      <div className="mx-auto my-0 flex max-w-[1100px] flex-wrap items-start gap-x-16 gap-y-0 px-6 py-0">
        <aside className="sticky top-[62px] max-w-[220px] flex-[1_0_200px] px-0 pt-11 pb-6 font-mono text-[13px] leading-[1.5] narrow:static mobile:max-w-none mobile:flex-[1_0_100%] mobile:px-0 mobile:pt-5 mobile:pb-0">
          <div className={`${dim} mb-[10px] mobile:hidden`}>start</div>
          <div className="mb-7 flex flex-col gap-[2px] mobile:mb-2 mobile:flex-row mobile:flex-wrap mobile:gap-2">
            <a href="#top" className="border-l border-accent py-1 pr-0 pl-3 text-fg no-underline mobile:border mobile:border-accent mobile:px-[10px] mobile:py-[6px] mobile:text-accent">
              Getting started
            </a>
            <a href="#install" className={sub}>Install</a>
            <a href="#configure" className={sub}>Configure</a>
            <a href="#run" className={sub}>Run</a>
            <a href="#keys" className={sub}>Keys</a>
          </div>
          <div className={`${dim} mb-[10px] mobile:hidden`}>coming next</div>
          <div className="mb-7 flex flex-col gap-[2px] mobile:hidden">
            <a href="#modes" className={sub}>Modes and approvals</a>
            <a href="#undo" className={sub}>Undo</a>
            <a href="#resume" className={sub}>Resume</a>
            <a href="#reference" className={sub}>Reference</a>
          </div>
        </aside>

        <main id="top" className="max-w-[740px] min-w-0 flex-[999_1_480px] px-0 pt-11 pb-28 mobile:pt-2">
          <div className="font-mono text-[13px] text-fg-3">docs / start</div>
          <h1 className="mt-4 mr-0 mb-5 ml-0 font-serif text-[clamp(40px,5.6vw,60px)] leading-[1.04] font-normal tracking-[-0.022em] mobile:text-[38px]">Getting started</h1>
          <p className="m-0 max-w-[62ch] font-serif text-[20px] leading-[1.6] text-pretty text-fg-2">Install Karya, add a Gemini key, and try the terminal UI. Karya is in active development: the TUI works today, and the agent loop, sandbox and undo arrive over the next milestones.</p>
          <div className="mt-7 border border-accent px-4 py-[14px] font-mono text-[13px] leading-[1.7]">
            <div className="text-accent">status</div>
            <div>Working today: the TUI, the scripted demo, live Gemini streaming, threads and prompt history. Not yet: tools, sandbox, undo, sessions. <Link href="/roadmap" className="text-fg hover:text-accent">See the roadmap →</Link></div>
          </div>

          <h2 id="install" className={h2}>Install</h2>
          <p className={`${p} mt-0 mr-0 mb-5 ml-0`}>Karya is a single Go binary and needs Go 1.25.4 or newer:</p>
          <pre className={`${pre} m-0`}><span className={dim}>$</span> go install github.com/prateek041/karya/cmd/karya@latest</pre>
          <p className={`${p} mt-5 mr-0 mb-0 ml-0`}>Prebuilt release binaries for macOS and Linux are planned for launch.</p>

          <h2 id="configure" className={h2}>Configure</h2>
          <p className={`${p} mt-0 mr-0 mb-5 ml-0`}>Get a key from <a href="https://aistudio.google.com/apikey" className="hover:text-accent">Google AI Studio</a> and export it, or put it in a <code className={code}>.env</code> file in the directory you run Karya from. An exported variable wins over the file.</p>
          <pre className={`${pre} m-0`}>{`export GEMINI_API_KEY=…`}</pre>

          <h2 id="run" className={h2}>Run</h2>
          <p className={`${p} mt-0 mr-0 mb-5 ml-0`}>There are three ways to start Karya today:</p>
          <pre className={`${pre} mt-0 mr-0 mb-5 ml-0`}>
            <span className={dim}>$</span> karya -demo   <span className={dim}># scripted demo, no key needed</span>{"\n"}
            <span className={dim}>$</span> karya -live   <span className={dim}># stream answers from Gemini</span>{"\n"}
            <span className={dim}>$</span> karya         <span className={dim}># the TUI on the protocol, with the demo core</span>
          </pre>
          <p className={`${p} mt-0 mr-0 mb-8 ml-0`}>The demo below shows where the default mode is heading: the read and the sandboxed test run go ahead on their own, and the edit waits for you.</p>
          <div className="mt-0 mr-0 mb-5 ml-0">
            <Terminal mode="static" />
          </div>

          <h2 id="keys" className={h2}>Keys</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-mono text-[13px]">
              <tbody>
                {KEYS.map(([k, d]) => (
                  <tr key={k} className="border-b border-line">
                    <td className="pt-3 pr-4 pb-3 pl-0 align-top font-medium whitespace-nowrap">{k}</td>
                    <td className="pt-3 pr-0 pb-3 pl-4 text-fg-2">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="modes" className={h2}>Modes and approvals <span className={tag}>planned · M2</span></h2>
          <p className={`${p} mt-0 mr-0 mb-7 ml-0`}>Karya does not ask before every command. Shell commands run inside the OS sandbox, so they can run freely; edits show a diff. shift+tab cycles the mode.</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-mono text-[13px] whitespace-nowrap">
              <thead>
                <tr className="border-b border-fg-3 text-fg-3">
                  <th className="pt-[10px] pr-4 pb-[10px] pl-0 font-normal">mode</th>
                  <th className="px-4 py-[10px] font-normal">read · list · search</th>
                  <th className="px-4 py-[10px] font-normal">write · edit</th>
                  <th className="pt-[10px] pr-0 pb-[10px] pl-4 font-normal">bash</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["plan", "run", "refused", "run · read-only sandbox"],
                  ["default", "run", "ask, with diff", "run · sandboxed"],
                  ["accept-edits", "run", "run", "run · sandboxed"],
                  ["--no-sandbox", "run", "ask", "ask every time"],
                ].map(([m, r, w, b]) => (
                  <tr key={m} className="border-b border-line">
                    <td className="pt-3 pr-4 pb-3 pl-0 font-medium">{m}</td>
                    <td className={`${td} text-fg-2`}>{r}</td>
                    <td className={`${td} ${w.startsWith("ask") ? "text-accent" : "text-fg-2"}`}>{w}</td>
                    <td className={`pt-3 pr-0 pb-3 pl-4 ${b.startsWith("ask") ? "text-accent" : "text-fg-2"}`}>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className={h3}>Leaving the sandbox always asks</h3>
          <p className={`${p} mt-0 mr-0 mb-4 ml-0`}>An unsandboxed run or a domain that is not on the network allowlist always asks, in every mode. You can answer once, for this session, or always (saved as a rule).</p>
          <h3 className={h3}>Denying a call</h3>
          <p className={`${p} mt-0 mr-0 mb-5 ml-0`}>Deny with a reason and the call does not run. The reason goes back to the model as a structured result, so it can propose something else or stop. A denied edit leaves the file byte-identical.</p>
          <div className="max-w-[560px] text-[13px]">
            <ApprovalCard tool="edit" target="cmd/list.go" diff={["@@ -14,3 +14,3 @@", "-    return printTable(c.OutOrStdout(), tasks)", "+    return printJSON(c.OutOrStdout(), tasks)"]} status="denied" />
          </div>

          <h2 id="undo" className={h2}>Undo <span className={tag}>planned · M3</span></h2>
          <p className={`${p} mt-0 mr-0 mb-5 ml-0`}>Before a turn's first side effect, Karya snapshots the working tree to a shadow git directory outside the project. This covers changes from every tool, bash included. Files the project ignores, and effects outside the root, are reported as not covered.</p>
          <pre className={`${pre} m-0`}>{`/undo          restore the tree from before the last turn
/rewind <n>    go back n turns
/redo          re-apply what was undone`}</pre>

          <h2 id="resume" className={h2}>Resume a session <span className={tag}>planned · M1, M5</span></h2>
          <p className={`${p} mt-0 mr-0 mb-5 ml-0`}>Every session is an append-only JSONL log stored outside the project. Logs are keyed to the repository's git remote rather than its local path, and contain no absolute paths or hostnames, so you can resume on any machine with a clone of the same repository. karya sync moves them end-to-end encrypted through a folder, bucket or git ref you own.</p>
          <pre className={`${pre} mt-0 mr-0 mb-5 ml-0`}><span className={dim}>$</span> karya resume &lt;session-id&gt;</pre>
          <p className={`${p} mt-0 mr-0 mb-4 ml-0`}>On resume, Karya compares what it recorded with the live repository and gives the model a drift note. The note covers:</p>
          <div className="mt-0 mr-0 mb-6 ml-0 flex flex-col border-t border-line font-mono text-[13px]">
            <div className={drift}><span className="flex-[0_0_160px]">HEAD</span><span className="flex-[1_1_240px] text-fg-2">recorded SHA against the current SHA</span></div>
            <div className={drift}><span className="flex-[0_0_160px]">working tree</span><span className="flex-[1_1_240px] text-fg-2">recorded dirty flag against the current state</span></div>
            <div className={drift}><span className="flex-[0_0_160px]">platform</span><span className="flex-[1_1_240px] text-fg-2">operating system, if it changed</span></div>
          </div>
          <div className="border border-accent px-4 py-[14px] font-mono text-[13px] leading-[1.7]">
            <div className={dim}>drift note</div>
            <div>HEAD moved from a1b2c3 to d4e5f6, working tree dirty, platform changed from darwin to linux.</div>
          </div>
          <p className={`${p} mt-6 mr-0 mb-0 ml-0`}>A session that stopped at a cost or step limit is resumable the same way.</p>

          <h2 id="reference" className={h2}>Reference</h2>
          <EnvTable />

          <div className="mt-[72px] flex flex-wrap justify-between gap-3 border-t border-line pt-5 font-mono text-[13px]">
            <Link href="/" className="text-fg-2 no-underline hover:text-fg">← Overview</Link>
            <a href="https://github.com/prateek041/karya" className="text-fg-2 no-underline hover:text-fg">GitHub ↗</a>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
