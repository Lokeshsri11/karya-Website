const desc = "flex-[1_1_260px] font-sans text-[17px] leading-[1.5] text-fg-2";
const row = "flex flex-wrap gap-x-7 gap-y-[6px] border-b border-line py-[14px] px-0";
const key = "flex flex-[0_0_220px] flex-col gap-1";

const tag = (note: string) => <span className="text-fg-3">{note}</span>;

const ENV: [string, string, string][] = [
  ["OPENAI_API_KEY", "required", "Your OpenAI key, or an Amazon Bedrock API key. Karya also reads it from a .env file in the working directory; a real exported variable wins over the file."],
  ["OPENAI_BASE_URL", "optional", "Another OpenAI-compatible endpoint, such as Amazon Bedrock's."],
  ["KARYA_MODEL", "optional", "The model sessions run on, written <provider>/<model>. Default: openai/openai.gpt-oss-120b."],
];


function Rows({ items }: { items: [string, string, string][] }) {
  return (
    <div className="border-t border-line">
      {items.map(([k, note, d]) => (
        <div key={k} className={row}>
          <div className={key}>
            <span className="font-medium [word-break:break-word]">{k}</span>
            {tag(note)}
          </div>
          <div className={desc}>{d}</div>
        </div>
      ))}
    </div>
  );
}

export default function EnvTable() {
  return (
    <div className="text-left font-mono text-[13px] text-fg">
      <div className="px-0 pt-0 pb-[10px] text-fg-3">environment</div>
      <Rows items={ENV} />
    </div>
  );
}
