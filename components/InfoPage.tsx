import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

export const h2: React.CSSProperties = { fontFamily: "var(--serif)", fontWeight: 400, fontSize: 30, lineHeight: 1.15, margin: "56px 0 16px", paddingTop: 24, borderTop: "1px solid var(--line)" };
export const p: React.CSSProperties = { fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.65, color: "var(--fg-2)", maxWidth: "65ch", margin: "0 0 16px", textWrap: "pretty" as never };
export const ul: React.CSSProperties = { ...p, paddingLeft: 22 };

export default function InfoPage({
  crumb,
  title,
  lead,
  active,
  children,
}: {
  crumb: string;
  title: React.ReactNode;
  lead: React.ReactNode;
  active?: "about";
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      <SiteNav active={active} />
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "44px 24px 112px" }}>
        <div className="mono" style={{ fontSize: 13, color: "var(--fg-3)" }}>{crumb}</div>
        <h1 className="serif page-h1" style={{ fontWeight: 400, fontSize: "clamp(40px,5.6vw,60px)", lineHeight: 1.04, letterSpacing: "-0.022em", margin: "16px 0 20px" }}>
          {title}
        </h1>
        <p className="serif" style={{ fontSize: 20, lineHeight: 1.6, color: "var(--fg-2)", maxWidth: "62ch", margin: 0 }}>
          {lead}
        </p>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
