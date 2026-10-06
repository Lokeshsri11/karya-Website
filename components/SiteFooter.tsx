import Link from "next/link";
import Mark from "./Mark";

const EMAILS = ["prateek@usekarya.dev", "lokesh@usekarya.dev"];

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)" }}>
      <div className="footer-contact" style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 0", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px 32px" }}>
        <span className="serif footer-ask" style={{ fontSize: 19, lineHeight: 1.3, color: "var(--fg-2)" }}>
          Questions or ideas? <em style={{ color: "var(--accent)" }}>Write to us.</em>
        </span>
        <span className="mono footer-mails" style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 13 }}>
          {EMAILS.map((e) => (
            <a key={e} href={`mailto:${e}`} className="mail-card" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid var(--line-2)", padding: "6px 12px", color: "var(--fg)", textDecoration: "none", transition: "background .2s,color .2s,border-color .2s" }}>
              {e}
              <span style={{ color: "var(--accent)" }}>↗</span>
            </a>
          ))}
        </span>
      </div>
      <div className="mono footer-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 56px", display: "flex", flexWrap: "wrap", gap: "14px 28px", alignItems: "baseline", fontSize: 13, color: "var(--fg-3)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--fg)" }}>
          <Mark size={26} />
          <span className="serif" style={{ fontSize: 21, fontWeight: 500, letterSpacing: "-0.02em" }}>
            kārya
          </span>
        </span>
        <Link href="/docs" className="hl" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
          Docs
        </Link>
        <a href="https://github.com/prateek041/karya" className="hl" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
          GitHub
        </a>
        <a href="https://github.com/prateek041/karya/blob/main/LICENSE" className="hl" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
          License
        </a>
        <span className="footer-note" style={{ marginLeft: "auto" }}>pre-1.0 · kārya, work done as duty</span>
      </div>
    </footer>
  );
}
