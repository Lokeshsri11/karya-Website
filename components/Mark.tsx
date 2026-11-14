// kārya brand mark: an amber ring under a green bar, the macron of the ā.
// The pixel elephant is the TUI avatar and lives in TuiFrame, not here.
// `mono` draws both shapes in currentColor, for use on the amber background.
export default function Mark({ size = 28, className = "", mono = false }: { size?: number; className?: string; mono?: boolean }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 32 32" className={`block flex-none ${className}`}>
      <rect x="9.5" y="2" width="13" height="3.5" rx="1" fill={mono ? "currentColor" : "#7fb46a"} />
      <circle cx="16" cy="19.5" r="8" fill="none" stroke={mono ? "currentColor" : "#d39a3f"} strokeWidth="4" />
    </svg>
  );
}
