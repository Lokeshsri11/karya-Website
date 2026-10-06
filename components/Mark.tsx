// Pixel elephant mark for kārya. Generated from the avatar artwork (16×14 cells).
const PIXELS: [number, number, number, string][] = [
  [6, 0, 4, "L"],
  [4, 1, 1, "L"],
  [5, 1, 2, "G"],
  [7, 1, 2, "E"],
  [9, 1, 2, "G"],
  [11, 1, 1, "L"],
  [1, 2, 3, "B"],
  [4, 2, 3, "G"],
  [7, 2, 2, "E"],
  [9, 2, 3, "G"],
  [12, 2, 3, "B"],
  [0, 3, 4, "B"],
  [4, 3, 8, "G"],
  [12, 3, 4, "B"],
  [0, 4, 4, "B"],
  [4, 4, 1, "G"],
  [5, 4, 2, "K"],
  [7, 4, 2, "G"],
  [9, 4, 2, "K"],
  [11, 4, 1, "G"],
  [12, 4, 4, "B"],
  [0, 5, 4, "B"],
  [4, 5, 8, "G"],
  [12, 5, 4, "B"],
  [1, 6, 4, "B"],
  [5, 6, 6, "G"],
  [11, 6, 4, "B"],
  [2, 7, 3, "B"],
  [5, 7, 6, "G"],
  [11, 7, 3, "B"],
  [3, 8, 1, "B"],
  [5, 8, 1, "W"],
  [6, 8, 4, "G"],
  [10, 8, 1, "W"],
  [12, 8, 1, "B"],
  [5, 9, 1, "W"],
  [7, 9, 2, "G"],
  [10, 9, 1, "W"],
  [7, 10, 2, "G"],
  [7, 11, 2, "G"],
  [7, 12, 2, "G"],
  [12, 12, 1, "G"],
  [8, 13, 5, "G"],
];

const COLORS: Record<string, string> = {
  B: "#a67530", // ears
  G: "#d9a14b", // face, trunk
  L: "#f0c87c", // crown
  E: "#91bc75", // gem
  W: "#ece1cd", // tusks
  K: "#17130d", // eyes
};

export default function Mark({ size = 28, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 -1 16 16"
      shapeRendering="crispEdges"
      style={{ display: "block", flex: "none", ...style }}
    >
      {PIXELS.map(([x, y, w, c]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} fill={COLORS[c]} />
      ))}
    </svg>
  );
}
