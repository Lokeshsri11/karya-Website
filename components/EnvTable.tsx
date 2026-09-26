const desc: React.CSSProperties = { flex: "1 1 260px", fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.5, color: "var(--fg-2)" };
const row: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "6px 28px", padding: "14px 0", borderBottom: "1px solid var(--line)" };
const key: React.CSSProperties = { flex: "0 0 220px", display: "flex", flexDirection: "column", gap: 4 };

export default function EnvTable({ showFlags = true }: { showFlags?: boolean }) {
  return (
    <div className="mono" style={{ fontSize: 13, color: "var(--fg)", textAlign: "left" }}>
      <div style={{ color: "var(--fg-3)", padding: "0 0 10px" }}>environment</div>
      <div style={{ borderTop: "1px solid var(--line)" }}>
        <div style={row}>
          <div style={key}>
            <span style={{ fontWeight: 500 }}>HARNESS_MODEL</span>
            <span style={{ color: "var(--accent)" }}>required</span>
          </div>
          <div style={desc}>The model to run. The loop talks to it through one internal provider interface, so changing this value changes the model and nothing else.</div>
        </div>
        <div style={row}>
          <div style={key}>
            <span style={{ fontWeight: 500 }}>HARNESS_BASE_URL</span>
            <span style={{ color: "var(--fg-3)" }}>optional</span>
          </div>
          <div style={desc}>Overrides the provider API endpoint.</div>
        </div>
        <div style={row}>
          <div style={key}>
            <span style={{ fontWeight: 500 }}>HARNESS_MAX_STEPS</span>
            <span style={{ color: "var(--fg-3)" }}>safety limit · conservative default</span>
          </div>
          <div style={desc}>Maximum loop steps per session. When reached, the loop stops, reports the limit, and the session stays resumable.</div>
        </div>
        <div style={row}>
          <div style={key}>
            <span style={{ fontWeight: 500 }}>HARNESS_MAX_COST</span>
            <span style={{ color: "var(--fg-3)" }}>session cost ceiling</span>
          </div>
          <div style={desc}>Estimated cost ceiling for the session. When reached, the loop stops, reports the limit, and the session stays resumable.</div>
        </div>
      </div>
      {showFlags && (
        <>
          <div style={{ color: "var(--fg-3)", padding: "32px 0 10px" }}>flags</div>
          <div style={{ borderTop: "1px solid var(--line)" }}>
            <div style={row}>
              <div style={{ flex: "0 0 220px", fontWeight: 500 }}>karya</div>
              <div style={desc}>Start a session. The current directory becomes the project root and cannot change for the session.</div>
            </div>
            <div style={row}>
              <div style={{ flex: "0 0 220px", fontWeight: 500 }}>karya --root &lt;path&gt;</div>
              <div style={desc}>Use a different directory as the project root.</div>
            </div>
            <div style={row}>
              <div style={{ flex: "0 0 220px", fontWeight: 500 }}>karya --resume &lt;session-id&gt;</div>
              <div style={desc}>Resume a recorded session, on this machine or another clone of the same repository.</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
