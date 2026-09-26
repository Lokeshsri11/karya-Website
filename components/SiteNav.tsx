"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function SiteNav({ active = "home" }: { active?: "home" | "docs" | "roadmap" }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    let t: Theme = "dark";
    try {
      t = (localStorage.getItem("karya-theme") as Theme) || (document.documentElement.dataset.theme as Theme) || "dark";
    } catch {}
    document.documentElement.dataset.theme = t;
    setTheme(t);
  }, []);

  const toggle = () => {
    const t: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("karya-theme", t);
    } catch {}
    setTheme(t);
  };

  const isLight = theme === "light";

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--bg)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: "12px 24px", flexWrap: "wrap" }}>
        <Link href="/" aria-label="Karya home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, color: "var(--fg)" }}>
          <span
            className="mono"
            style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, boxSizing: "border-box", border: "1.5px solid var(--fg)", boxShadow: "0 3px 0 var(--accent)", fontSize: 15, fontWeight: 600, lineHeight: 1 }}
          >
            k
          </span>
          <span className="serif" style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>
            kārya
          </span>
        </Link>
        <nav className="mono" style={{ flex: "none", display: "flex", gap: "8px 22px", marginLeft: "auto", alignItems: "center", flexWrap: "wrap", fontSize: 13.5 }}>
          <Link href="/docs" className="hl" style={{ color: active === "docs" ? "var(--fg)" : "var(--fg-2)", textDecoration: "none" }}>
            Docs
          </Link>
          <Link href="/roadmap" className="hl" style={{ color: active === "roadmap" ? "var(--fg)" : "var(--fg-2)", textDecoration: "none" }}>
            Roadmap
          </Link>
          <a href="https://github.com/prateek041/karya" className="hl" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
            GitHub
          </a>
          <button
            onClick={toggle}
            role="switch"
            aria-checked={isLight}
            aria-label="Toggle light and dark theme"
            className="hl"
            style={{ font: "inherit", fontSize: 12, background: "none", border: "none", color: "var(--fg-2)", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ color: theme === "dark" ? "var(--fg)" : "var(--fg-3)", transition: "color .2s" }}>dark</span>
            <span style={{ position: "relative", display: "inline-block", width: 40, height: 22, border: "1px solid var(--line-2)", background: "var(--bg-2)", boxSizing: "border-box" }}>
              <span
                style={{ position: "absolute", top: 3, left: 3, width: 14, height: 14, background: "var(--accent)", transform: `translateX(${isLight ? "18px" : "0px"})`, transition: "transform .22s cubic-bezier(.2,.7,.2,1)" }}
              />
            </span>
            <span style={{ color: isLight ? "var(--fg)" : "var(--fg-3)", transition: "color .2s" }}>light</span>
          </button>
          <Link
            href="/docs#install"
            className="btn-fill"
            style={{ background: "var(--accent)", color: "var(--accent-ink)", padding: "6px 14px", textDecoration: "none", fontWeight: 500, border: "1px solid var(--accent)" }}
          >
            Install
          </Link>
        </nav>
      </div>
    </header>
  );
}
