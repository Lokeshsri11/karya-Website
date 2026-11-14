import { useId } from "react";

// kārya brand mark: an amber disc crossed by three tiger stripes.
// `mono` draws the disc in currentColor with amber stripes, for the amber footer.
export const STRIPES = [
  "M0.62 11.57Q8.23 12.95 18 11.5Q9.07 7.3 1.38 6.43Z",
  "M30.79 12.81Q22.22 13.21 12 17Q22.68 19.14 31.21 18.19Z",
  "M0.86 25.1Q8.94 25.81 19 23.5Q9.26 20.09 1.14 19.9Z",
];

export default function Mark({ size = 28, className = "", mono = false }: { size?: number; className?: string; mono?: boolean }) {
  const clip = useId();
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 32 32" className={`block flex-none ${className}`}>
      <defs>
        <clipPath id={clip}>
          <circle cx="16" cy="16" r="14" />
        </clipPath>
      </defs>
      <circle cx="16" cy="16" r="14" fill={mono ? "currentColor" : "#d39a3f"} />
      <g clipPath={`url(#${clip})`} fill={mono ? "var(--accent)" : "#1a1714"}>
        {STRIPES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
