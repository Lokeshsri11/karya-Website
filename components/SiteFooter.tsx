import Link from "next/link";

const CONTACTS = [
  { name: "Prateek", role: "author", email: "prateek@usekarya.dev" },
  { name: "Lokesh", role: "co-maintainer", email: "lokesh@usekarya.dev" },
];

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)" }}>
      <div className="footer-contact" style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 8px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: "24px 64px", alignItems: "center" }}>
        <div>
          <div className="mono" style={{ fontSize: 13, color: "var(--fg-3)" }}>ask us</div>
          <div className="serif footer-ask" style={{ fontSize: 26, lineHeight: 1.25, letterSpacing: "-0.01em", margin: "10px 0 0", maxWidth: "22ch", textWrap: "balance" as never }}>
            Questions, ideas, or a bug? <em style={{ color: "var(--accent)" }}>Write to us.</em>
          </div>
        </div>
        <div className="mono footer-mails" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 1, background: "var(--line)", border: "1px solid var(--line)", fontSize: 13 }}>
          {CONTACTS.map((c) => (
            <a key={c.email} href={`mailto:${c.email}`} className="mail-card" style={{ background: "var(--bg)", color: "var(--fg)", textDecoration: "none", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6, transition: "background .2s" }}>
              <span style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--fg-3)", fontSize: 12.5 }}>
                <span>{c.name}</span>
                <span>{c.role}</span>
              </span>
              <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, minWidth: 0 }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</span>
                <span className="mail-arrow" style={{ color: "var(--accent)", flex: "none" }}>↗</span>
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className="mono footer-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 56px", display: "flex", flexWrap: "wrap", gap: "14px 28px", alignItems: "baseline", fontSize: 13, color: "var(--fg-3)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--fg)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, boxSizing: "border-box", border: "1.5px solid var(--fg)", boxShadow: "0 3px 0 var(--accent)", fontSize: 13, fontWeight: 600, lineHeight: 1 }}>
            k
          </span>
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
