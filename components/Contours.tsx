// Hero background: soft topographic contour lines, fading out toward the text.
const PATHS = Array.from({ length: 14 }, (_, k) => {
  let d = "";
  for (let a = 0; a <= 360; a += 6) {
    const rad = (a * Math.PI) / 180;
    const r = 40 + k * 26 + 10 * Math.sin(rad * 3 + k * 0.6) + 6 * Math.sin(rad * 5 - k);
    d += `${a ? "L" : "M"}${(500 + r * Math.cos(rad)).toFixed(1)},${(300 + r * Math.sin(rad) * 0.8).toFixed(1)}`;
  }
  return d + "Z";
});

export default function Contours() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1000 600" preserveAspectRatio="xMaxYMid slice" className="pointer-events-none absolute top-0 right-0 h-[760px] w-[75%] text-line-2 [mask-image:linear-gradient(to_left,black_30%,transparent_75%),linear-gradient(to_bottom,black_70%,transparent)] [mask-composite:intersect] mobile:hidden">
      <g transform="translate(260,0)">
        {PATHS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={i % 4 === 0 ? 1.4 : 0.8} />
        ))}
      </g>
    </svg>
  );
}
