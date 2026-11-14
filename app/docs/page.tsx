import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import EnvTable from "@/components/EnvTable";

export const metadata: Metadata = { title: "Getting started | Karya docs" };

const INSTALL = "curl -fsSL https://usekarya.dev/install | sh";

const h2 = "mt-16 mr-0 mb-4 ml-0 border-t border-line pt-6 font-display text-[32px] leading-[1.15] font-medium";
const p = "max-w-[65ch] font-sans text-[18px] leading-[1.65] text-pretty text-fg-2";
const pre = "overflow-x-auto border border-line bg-bg-2 px-4 py-[14px] font-mono text-[13.5px] leading-[1.7]";
const code = "bg-bg-2 px-[5px] py-[1px] font-mono text-[0.84em] text-fg";
const dim = "text-fg-3";
const sub = "border-l border-line pt-[3px] pr-0 pb-[3px] pl-6 text-fg-2 no-underline hover:text-fg mobile:border mobile:border-line-2 mobile:px-[10px] mobile:py-[6px]";

const KEYS: [string, string][] = [
  ["enter", "send the prompt"],
  ["shift+enter", "new line (ctrl+j also works)"],
  ["ctrl+o", "expand or collapse tool output"],
  ["esc", "quit"],
  ["/clear", "clear the chat and start a new session"],
  ["/theme", "switch between the dark and light theme"],
  ["/quit", "exit Karya (/exit also works)"],
];

const NAV: [string, string][] = [
  ["install", "Install"],
  ["configure", "Configure"],
  ["run", "Run"],
  ["keys", "Keys and commands"],
  ["reference", "Reference"],
];

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
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={sub}>
                {label}
              </a>
            ))}
          </div>
        </aside>

        <main id="top" className="max-w-[740px] min-w-0 flex-[999_1_480px] px-0 pt-11 pb-28 mobile:pt-2">
          <div className="font-mono text-[13px] text-fg-3">docs / start</div>
          <h1 className="mt-4 mr-0 mb-5 ml-0 font-display text-[clamp(40px,5.6vw,60px)] leading-[1.04] font-medium tracking-[-0.022em] mobile:text-[38px]">Getting started</h1>
          <p className="m-0 max-w-[62ch] font-sans text-[20px] leading-[1.6] text-pretty text-fg-2">
            Install Karya, add an API key, and run it in your project. Every session gets its own microVM, so the agent works freely without touching your machine.
          </p>

          <h2 id="install" className={h2}>Install</h2>
          <pre className={`${pre} m-0`}>
            <span className={dim}>$</span> {INSTALL}
          </pre>
          <p className={`${p} mt-5 mr-0 mb-0 ml-0`}>Karya runs on macOS with Apple silicon, and on Linux with KVM. It sets up the microVM runtime the first time it starts.</p>

          <h2 id="configure" className={h2}>Configure</h2>
          <p className={`${p} mt-0 mr-0 mb-5 ml-0`}>
            Karya works with any OpenAI-compatible provider. Export your key, or put it in a <code className={code}>.env</code> file in the directory you run Karya from. An exported variable wins over the file.
          </p>
          <pre className={`${pre} mt-0 mr-0 mb-5 ml-0`}>{`export OPENAI_API_KEY=sk-...
export KARYA_MODEL=openai/gpt-4.1-nano`}</pre>
          <p className={`${p} mt-0 mr-0 mb-5 ml-0`}>
            For another provider, point <code className={code}>OPENAI_BASE_URL</code> at its endpoint. On Amazon Bedrock, which serves the default model, gpt-oss-120b:
          </p>
          <pre className={`${pre} m-0`}>{`export OPENAI_API_KEY=<Bedrock API key>
export OPENAI_BASE_URL=https://bedrock-mantle.us-east-1.api.aws/v1`}</pre>

          <h2 id="run" className={h2}>Run</h2>
          <pre className={`${pre} mt-0 mr-0 mb-5 ml-0`}>
            <span className={dim}>$</span> cd your-project{"\n"}
            <span className={dim}>$</span> karya
          </pre>
          <p className={`${p} mt-0 mr-0 mb-4 ml-0`}>
            Karya starts a microVM for the session and copies your project into the workspace inside it, leaving out sensitive files. The agent can read code, run shell commands, keep a Python session alive and leave servers running, all inside the VM.
          </p>
          <p className={`${p} mt-0 mr-0 mb-0 ml-0`}>
            Every turn shows its tokens and cost. Pick a different model with <code className={code}>karya -model &lt;provider&gt;/&lt;model&gt;</code>.
          </p>

          <h2 id="keys" className={h2}>Keys and commands</h2>
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

          <h2 id="reference" className={h2}>Reference</h2>
          <EnvTable />

          <div className="mt-[72px] flex flex-wrap justify-between gap-3 border-t border-line pt-5 font-mono text-[13px]">
            <Link href="/" className="text-fg-2 no-underline hover:text-fg">
              ← Overview
            </Link>
            <a href="https://github.com/prateek041/karya" target="_blank" rel="noopener noreferrer" className="text-fg-2 no-underline hover:text-fg">
              GitHub ↗
            </a>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
