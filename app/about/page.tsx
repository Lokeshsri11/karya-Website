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
  ["source", <a key="r" href={COMPANY.repo} className="ha" style={{ color: "var(--fg)" }}>github.com/prateek041/karya</a>],
];

const link: React.CSSProperties = { color: "var(--fg-2)", textDecoration: "none" };

export default function About() {
  return (
    <InfoPage
      crumb="about"
      active="about"
      title={<>The people behind <em style={{ color: "var(--accent)" }}>kārya.</em></>}
      lead="Karya is an open-source coding agent for the terminal. It lets an AI model work on your code with real autonomy, inside an OS sandbox, with every turn undoable and every budget enforced. We started building it in September 2026 in Prayagraj, India."
    >
      <dl className="mono" style={{ display: "grid", gridTemplateColumns: "max-content 1fr", gap: "10px 28px", fontSize: 13.5, margin: "40px 0 0", padding: "20px 0 0", borderTop: "1px solid var(--line)" }}>
        {facts.map(([k, v]) => (
          <div key={k} style={{ display: "contents" }}>
            <dt style={{ color: "var(--fg-3)" }}>{k}</dt>
            <dd style={{ margin: 0, color: "var(--fg)" }}>{v}</dd>
          </div>
        ))}
      </dl>

      <h2 style={h2}>What we are building</h2>
      <p style={p}>
        Coding agents today either ask permission for every command or run with none. Karya takes a third path: commands run freely inside a sandbox with the network off, edits show a diff before they land, and any turn can be rolled back. Sessions are stored as plain logs on your machine and can follow you to another one, end-to-end encrypted.
      </p>
      <p style={p}>
        Karya is bring-your-own-key: you use your own API key with the model provider you choose and pay that provider directly. Gemini works today, and Claude through the Anthropic API is the next provider we are adding. There is no Karya account and no markup on tokens. Karya is pre-1.0; the <Link href="/roadmap" className="ha" style={{ color: "var(--fg)" }}>roadmap</Link> shows what works today.
      </p>

      <h2 style={h2}>Founders</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 16 }}>
        {FOUNDERS.map((f) => (
          <div key={f.name} style={{ border: "1px solid var(--line-2)", background: "var(--bg-2)", padding: "20px 22px" }}>
            <div className="serif" style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.01em" }}>{f.name}</div>
            <div className="mono" style={{ fontSize: 13, color: "var(--accent)", margin: "4px 0 16px" }}>{f.role}</div>
            <div className="mono" style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", fontSize: 13 }}>
              <a href={f.linkedin} className="hl" style={link}>LinkedIn ↗</a>
              <a href={f.github} className="hl" style={link}>GitHub ↗</a>
              <a href={f.x} className="hl" style={link}>X ↗</a>
              {f.site && <a href={f.site} className="hl" style={link}>Website ↗</a>}
            </div>
            <a href={`mailto:${f.email}`} className="mono ha" style={{ display: "inline-block", marginTop: 14, fontSize: 13, color: "var(--fg)" }}>{f.email}</a>
          </div>
        ))}
      </div>

      <h2 style={h2}>Contact</h2>
      <p style={p}>
        Write to <a href={`mailto:${FOUNDERS[0].email}`} className="ha" style={{ color: "var(--fg)" }}>{FOUNDERS[0].email}</a> or <a href={`mailto:${FOUNDERS[1].email}`} className="ha" style={{ color: "var(--fg)" }}>{FOUNDERS[1].email}</a>. Bugs and feature requests are welcome as <a href={`${COMPANY.repo}/issues`} className="ha" style={{ color: "var(--fg)" }}>GitHub issues</a>.
      </p>
      <p className="mono" style={{ fontSize: 13, color: "var(--fg-3)", margin: 0 }}>Karya · {COMPANY.location}</p>
    </InfoPage>
  );
}
