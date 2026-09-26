"use client";

export type ApprovalStatus = "pending" | "approved" | "denied";

export interface ApprovalCardProps {
  tool?: "edit" | "write" | "bash";
  target?: string;
  diff?: string[];
  command?: string;
  timeout?: string;
  status?: ApprovalStatus;
  pressed?: boolean;
  onApprove?: () => void;
  onDeny?: () => void;
}

export default function ApprovalCard(p: ApprovalCardProps) {
  const st = p.status ?? "pending";
  const lines = (p.diff ?? []).map((t) => {
    const c = t[0];
    return { text: t, isAdd: c === "+", isDel: c === "-", isHunk: c === "@", isCtx: c !== "+" && c !== "-" && c !== "@" };
  });
  const pending = st === "pending";
  const isDiff = lines.length > 0;
  const isCommand = !lines.length && !!p.command;
  const borderColor = pending ? "var(--accent)" : "var(--line-2)";
  const statusColor = pending ? "var(--accent)" : st === "approved" ? "var(--ok)" : "var(--no)";
  const statusLabel = pending ? "awaiting approval" : st === "approved" ? "✓ approved" : "✕ denied";
  const showKeys = pending && !p.pressed;
  const showPressed = pending && !!p.pressed;

  return (
    <div className="mono" style={{ border: `1px solid ${borderColor}`, margin: "6px 0 10px", background: "var(--bg-2)", fontSize: "0.96em", lineHeight: 1.55, color: "var(--fg)", textAlign: "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "4px 12px", flexWrap: "wrap", padding: "6px 10px", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "baseline", minWidth: 0 }}>
          <span style={{ fontWeight: 600 }}>{p.tool ?? "edit"}</span>
          <span style={{ color: "var(--fg-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.target ?? ""}</span>
        </div>
        <span style={{ color: statusColor }}>{statusLabel}</span>
      </div>
      {isDiff && (
        <div style={{ padding: "6px 0", overflowX: "auto" }}>
          {lines.map((l, i) =>
            l.isHunk ? (
              <div key={i} style={{ whiteSpace: "pre", padding: "0 10px", color: "var(--fg-3)" }}>{l.text}</div>
            ) : l.isCtx ? (
              <div key={i} style={{ whiteSpace: "pre", padding: "0 10px", color: "var(--fg-2)" }}>{l.text}</div>
            ) : l.isAdd ? (
              <div key={i} style={{ whiteSpace: "pre", padding: "0 10px", color: "var(--ok)", background: "var(--ok-bg)", minWidth: "max-content" }}>{l.text}</div>
            ) : (
              <div key={i} style={{ whiteSpace: "pre", padding: "0 10px", color: "var(--no)", background: "var(--no-bg)", minWidth: "max-content" }}>{l.text}</div>
            ),
          )}
        </div>
      )}
      {isCommand && (
        <div style={{ padding: "9px 10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            <span style={{ color: "var(--fg-3)" }}>$ </span>
            {p.command}
          </div>
          <div style={{ color: "var(--fg-3)" }}>timeout {p.timeout ?? "120s"} · sandboxed · network off</div>
        </div>
      )}
      {showKeys && (
        <div style={{ display: "flex", gap: 18, padding: "6px 10px", borderTop: "1px solid var(--line)", color: "var(--fg-2)" }}>
          <span onClick={() => p.onApprove && p.onApprove()} className="key-a" style={{ cursor: "pointer", padding: "0 3px", margin: "0 -3px" }}>
            <span style={{ color: "inherit" }}>[a]</span>pprove
          </span>
          <span onClick={() => p.onDeny && p.onDeny()} className="key-d" style={{ cursor: "pointer", padding: "0 3px", margin: "0 -3px" }}>
            <span style={{ color: "inherit" }}>[d]</span>eny
          </span>
        </div>
      )}
      {showPressed && (
        <div style={{ display: "flex", gap: 18, padding: "6px 10px", borderTop: "1px solid var(--line)", color: "var(--fg-2)" }}>
          <span style={{ background: "var(--ok)", color: "var(--term-bg)", padding: "0 3px" }}>[a]pprove</span>
          <span>
            <span style={{ color: "var(--no)" }}>[d]</span>eny
          </span>
        </div>
      )}
    </div>
  );
}
