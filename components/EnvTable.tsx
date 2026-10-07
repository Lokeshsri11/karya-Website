const desc: React.CSSProperties = { flex: "1 1 260px", fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.5, color: "var(--fg-2)" };
const row: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "6px 28px", padding: "14px 0", borderBottom: "1px solid var(--line)" };
const key: React.CSSProperties = { flex: "0 0 220px", display: "flex", flexDirection: "column", gap: 4 };

type Status = "today" | "planned";
const tag = (s: Status, note?: string) => (
  <span style={{ color: s === "today" ? "var(--ok)" : "var(--fg-3)" }}>
    {s === "today" ? "works today" : "planned"}
    {note ? ` · ${note}` : ""}
  </span>
);

const ENV: [string, Status, string | undefined, string][] = [
  ["GEMINI_API_KEY", "today", "required", "Your Gemini API key. Karya also reads it from a .env file in the working directory; a real exported variable wins over the file."],
  ["GOOGLE_API_KEY", "today", "optional", "Alternative name for the Gemini key. Wins if both are set."],
  ["ANTHROPIC_API_KEY · OpenAI-compatible", "planned", "M4", "Anthropic and OpenAI-compatible providers (OpenRouter, DeepSeek, Qwen, Ollama, vLLM, LM Studio). Keys never reach logs, sessions or sync bundles."],
];

const FLAGS: [string, Status, string | undefined, string][] = [
  ["karya", "today", undefined, "Start the TUI in the current directory, talking to the demo core."],
  ["karya -live", "today", undefined, "Stream answers straight from Gemini, without the core. Threads are saved under $XDG_DATA_HOME/karya/threads."],
  ["karya -demo", "today", undefined, "Play the scripted demo. No API key needed."],
  ["karya -theme light", "today", undefined, "Colour theme: dark or light."],
  ["--model · --mode · --max-cost · --max-steps", "planned", "M1–M3", "Pick the model and mode, and set hard budgets for the session."],
  ["--root <dir> · --no-sandbox", "planned", "M2", "Choose the project root. Run bash without the sandbox, in which case every command asks."],
  ["karya run \"<task>\" [--json]", "planned", "M1", "Run one task headless. Exit codes: 0 done and verified, 1 failed, 2 limit reached, 3 verification failed, 4 interrupted."],
  ["karya resume [<id>] · sessions", "planned", "M1", "List and resume sessions, on this machine or another clone of the same repository."],
  ["karya sync · doctor", "planned", "M4–M5", "End-to-end encrypted session sync, and a health check for the sandbox, keys and config."],
];

function Rows({ items }: { items: [string, Status, string | undefined, string][] }) {
  return (
    <div style={{ borderTop: "1px solid var(--line)" }}>
      {items.map(([k, s, note, d]) => (
        <div key={k} style={row}>
          <div style={key}>
            <span style={{ fontWeight: 500, wordBreak: "break-word" }}>{k}</span>
            {tag(s, note)}
          </div>
          <div style={desc}>{d}</div>
        </div>
      ))}
    </div>
  );
}

export default function EnvTable({ showFlags = true }: { showFlags?: boolean }) {
  return (
    <div className="mono" style={{ fontSize: 13, color: "var(--fg)", textAlign: "left" }}>
      <div style={{ color: "var(--fg-3)", padding: "0 0 10px" }}>environment</div>
      <Rows items={ENV} />
      {showFlags && (
        <>
          <div style={{ color: "var(--fg-3)", padding: "32px 0 10px" }}>commands and flags</div>
          <Rows items={FLAGS} />
        </>
      )}
    </div>
  );
}
