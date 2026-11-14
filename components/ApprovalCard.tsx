"use client";

export type ApprovalStatus = "pending" | "approved" | "denied";

export interface ApprovalCardProps {
  tool?: "edit" | "write" | "bash" | "proposal";
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
  const borderColor = pending ? "border-accent" : "border-line-2";
  const statusColor = pending ? "text-accent" : st === "approved" ? "text-ok" : "text-no";
  const statusLabel = pending ? "awaiting you" : st === "approved" ? "✓ accepted" : "✕ declined";
  const showKeys = pending && !p.pressed;
  const showPressed = pending && !!p.pressed;
  const line = "whitespace-pre px-[10px] py-0";
  const keyRow = "flex gap-[18px] border-t border-line px-[10px] py-[6px] text-fg-2";
  const key = "-mx-[3px] my-0 cursor-pointer px-[3px] py-0";

  return (
    <div className={`mt-[6px] mr-0 mb-[10px] ml-0 border bg-bg-2 text-left font-mono text-[0.96em] leading-[1.55] text-fg ${borderColor}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-[10px] py-[6px]">
        <div className="flex min-w-0 items-baseline gap-[10px]">
          <span className="font-semibold">{p.tool ?? "edit"}</span>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-fg-2">{p.target ?? ""}</span>
        </div>
        <span className={statusColor}>{statusLabel}</span>
      </div>
      {isDiff && (
        <div className="overflow-x-auto px-0 py-[6px]">
          {lines.map((l, i) =>
            l.isHunk ? (
              <div key={i} className={`${line} text-fg-3`}>{l.text}</div>
            ) : l.isCtx ? (
              <div key={i} className={`${line} text-fg-2`}>{l.text}</div>
            ) : l.isAdd ? (
              <div key={i} className={`${line} min-w-max bg-ok-bg text-ok`}>{l.text}</div>
            ) : (
              <div key={i} className={`${line} min-w-max bg-no-bg text-no`}>{l.text}</div>
            ),
          )}
        </div>
      )}
      {isCommand && (
        <div className="flex flex-col gap-[2px] px-[10px] pt-[9px] pb-2">
          <div className="whitespace-pre-wrap [word-break:break-word]">
            <span className="text-fg-3">$ </span>
            {p.command}
          </div>
          <div className="text-fg-3">timeout {p.timeout ?? "120s"} · sandboxed · network off</div>
        </div>
      )}
      {showKeys && (
        <div className={keyRow}>
          <span onClick={() => p.onApprove && p.onApprove()} className={`${key} hover:bg-ok hover:text-term`}>
            <span className="text-inherit">[a]</span>ccept
          </span>
          <span onClick={() => p.onDeny && p.onDeny()} className={`${key} hover:bg-no hover:text-term`}>
            <span className="text-inherit">[d]</span>ecline
          </span>
        </div>
      )}
      {showPressed && (
        <div className={keyRow}>
          <span className="bg-ok px-[3px] py-0 text-term">[a]ccept</span>
          <span>
            <span className="text-no">[d]</span>ecline
          </span>
        </div>
      )}
    </div>
  );
}
