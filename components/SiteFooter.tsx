import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)" }}>
      <div className="mono" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 56px", display: "flex", flexWrap: "wrap", gap: "14px 28px", alignItems: "baseline", fontSize: 13, color: "var(--fg-3)" }}>
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
        <Link href="/roadmap" className="hl" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
          Roadmap
        </Link>
        <a href="https://github.com/prateek041/karya" className="hl" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
          GitHub
        </a>
        <a href="https://github.com/prateek041/karya/blob/main/LICENSE" className="hl" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
          License
        </a>
        <span style={{ marginLeft: "auto" }}>pre-1.0 · kārya, work done as duty</span>
      </div>
    </footer>
  );
}
