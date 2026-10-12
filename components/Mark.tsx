// kārya brand mark: an amber ring under a green bar, the macron of the ā.
// The pixel elephant is the TUI avatar and lives in TuiFrame, not here.
export default function Mark({ size = 28, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ display: "block", flex: "none", ...style }}
    >
      <rect x="9.5" y="2" width="13" height="3.5" rx="1" fill="#7fb46a" />
      <circle cx="16" cy="19.5" r="8" fill="none" stroke="#d39a3f" strokeWidth="4" />
    </svg>
  );
}
