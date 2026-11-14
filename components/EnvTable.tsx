const desc = "flex-[1_1_260px] font-serif text-[17px] leading-[1.5] text-fg-2";
const row = "flex flex-wrap gap-x-7 gap-y-[6px] border-b border-line py-[14px] px-0";
const key = "flex flex-[0_0_220px] flex-col gap-1";

type Status = "today" | "planned";
const tag = (s: Status, note?: string) => (
  <span className={s === "today" ? "text-ok" : "text-fg-3"}>
    {s === "today" ? "works today" : "planned"}
    {note ? ` · ${note}` : ""}
  </span>
);

const ENV: [string, Status, string | undefined, string][] = [
  ["OPENAI_API_KEY", "today", "required", "Your OpenAI key, or an Amazon Bedrock API key. Karya also reads it from a .env file in the working directory; a real exported variable wins over the file."],
  ["OPENAI_BASE_URL", "today", "optional", "Another OpenAI-compatible endpoint, such as Amazon Bedrock's."],
  ["KARYA_MODEL", "today", "optional", "The model sessions run on, written <provider>/<model>. Default: openai/openai.gpt-oss-120b."],
  ["Gemini · Anthropic keys", "planned", undefined, "More providers behind the same interface. Keys never reach logs, and never enter the VM."],
];

const FLAGS: [string, Status, string | undefined, string][] = [
  ["karya", "today", undefined, "Start the terminal UI in the current directory. Each session gets its own microVM with the repo copied in."],
  ["karya -model <provider>/<model>", "today", undefined, "Pick the model. Overrides KARYA_MODEL."],
  ["approvals · YOLO", "planned", undefined, "Asks only at the edges: more files, new network writes, real secrets, applying changes. YOLO turns the prompts off; the VM and the gate stay."],
  ["limits · loop detection", "planned", undefined, "Hard limits on steps, tokens, cost and time, and a pause after the same call or failure three times."],
  ["saved sessions", "planned", undefined, "Sessions, turns and the audit log kept on disk, and a session's VM kept for a week after last use."],
];

function Rows({ items }: { items: [string, Status, string | undefined, string][] }) {
  return (
    <div className="border-t border-line">
      {items.map(([k, s, note, d]) => (
        <div key={k} className={row}>
          <div className={key}>
            <span className="font-medium [word-break:break-word]">{k}</span>
            {tag(s, note)}
          </div>
          <div className={desc}>{d}</div>
        </div>
      ))}
    </div>
  );
}

export default function EnvTable({ showFlags = true }: { showFlags?: boolean }) {
  return (
    <div className="text-left font-mono text-[13px] text-fg">
      <div className="px-0 pt-0 pb-[10px] text-fg-3">environment</div>
      <Rows items={ENV} />
      {showFlags && (
        <>
          <div className="px-0 pt-8 pb-[10px] text-fg-3">commands and flags</div>
          <Rows items={FLAGS} />
        </>
      )}
    </div>
  );
}
