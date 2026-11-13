import type { Metadata } from "next";
import Link from "next/link";
import InfoPage, { h2, p } from "@/components/InfoPage";
import { COMPANY, FOUNDERS } from "@/components/company";

export const metadata: Metadata = {
  title: "About — Karya",
  description: "Karya is an open-source terminal coding agent built by Prateek Singh and Lokesh Srivastava in Prayagraj, India, founded in September 2026.",
};

const facts: [string, React.ReactNode][] = [
  ["founded", COMPANY.founded],
  ["based in", COMPANY.location],
  ["team", "2 co-founders"],
  ["funding", "Bootstrapped, no outside funding yet"],
  ["entity", "Not yet incorporated; operated by the founders"],
  ["source", <a key="r" href={COMPANY.repo} className="text-fg hover:text-accent">github.com/prateek041/karya</a>],
];

const link = "text-fg-2 no-underline hover:text-fg";

export default function About() {
  return (
    <InfoPage
      crumb="about"
      active="about"
      title={<>The people behind <em className="text-accent">kārya.</em></>}
      lead="Karya is an open-source coding agent for the terminal. It lets an AI model work on your code with real autonomy, inside an OS sandbox, with every turn undoable and every budget enforced. We started building it in September 2026 in Prayagraj, India."
    >
      <dl className="mt-10 mr-0 mb-0 ml-0 grid grid-cols-[max-content_1fr] gap-x-7 gap-y-[10px] border-t border-line px-0 pt-5 pb-0 font-mono text-[13.5px]">
        {facts.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-fg-3">{k}</dt>
            <dd className="m-0 text-fg">{v}</dd>
          </div>
        ))}
      </dl>

      <h2 className={h2}>What we are building</h2>
      <p className={p}>
        Coding agents today either ask permission for every command or run with none. Karya takes a third path: commands run freely inside a sandbox with the network off, edits show a diff before they land, and any turn can be rolled back. Sessions are stored as plain logs on your machine and can follow you to another one, end-to-end encrypted.
      </p>
      <p className={p}>
        Karya is bring-your-own-key: you use your own API key with the model provider you choose and pay that provider directly. Gemini works today, and Claude through the Anthropic API is the next provider we are adding. There is no Karya account and no markup on tokens. Karya is pre-1.0; the <Link href="/roadmap" className="text-fg hover:text-accent">roadmap</Link> shows what works today.
      </p>

      <h2 className={h2}>Founders</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
        {FOUNDERS.map((f) => (
          <div key={f.name} className="border border-line-2 bg-bg-2 px-[22px] py-5">
            <div className="font-serif text-[24px] font-medium tracking-[-0.01em]">{f.name}</div>
            <div className="mt-1 mr-0 mb-4 ml-0 font-mono text-[13px] text-accent">{f.role}</div>
            <div className="flex flex-wrap gap-x-4 gap-y-[6px] font-mono text-[13px]">
              <a href={f.linkedin} className={link}>LinkedIn ↗</a>
              <a href={f.github} className={link}>GitHub ↗</a>
              <a href={f.x} className={link}>X ↗</a>
              {f.site && <a href={f.site} className={link}>Website ↗</a>}
            </div>
            <a href={`mailto:${f.email}`} className="mt-[14px] inline-block font-mono text-[13px] text-fg hover:text-accent">{f.email}</a>
          </div>
        ))}
      </div>

      <h2 className={h2}>Contact</h2>
      <p className={p}>
        Write to <a href={`mailto:${FOUNDERS[0].email}`} className="text-fg hover:text-accent">{FOUNDERS[0].email}</a> or <a href={`mailto:${FOUNDERS[1].email}`} className="text-fg hover:text-accent">{FOUNDERS[1].email}</a>. Bugs and feature requests are welcome as <a href={`${COMPANY.repo}/issues`} className="text-fg hover:text-accent">GitHub issues</a>.
      </p>
      <p className="m-0 font-mono text-[13px] text-fg-3">Karya · {COMPANY.location}</p>
    </InfoPage>
  );
}
