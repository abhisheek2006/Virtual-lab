// Paint.jsx
// A reusable glossy paint blob. It is NOT its own <svg>; it returns an SVG <g>
// so it can be placed inside the dish, the tin, or any other drawing.

export default function Paint({ cx = 0, cy = 0, rx = 20, ry = 8, color = '#1d4ed8', matte = false, opacity = 1 }) {
  return (
    <g opacity={opacity}>
      {/* main body of the blob */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} />
      {/* subtle darker underside for depth */}
      <ellipse cx={cx} cy={cy + ry * 0.35} rx={rx * 0.85} ry={ry * 0.5} fill="#000" opacity="0.12" />
      {/* wet gloss highlight disappears once the paint dries (matte) */}
      {!matte && (
        <ellipse cx={cx - rx * 0.32} cy={cy - ry * 0.38} rx={rx * 0.3} ry={ry * 0.34} fill="#ffffff" opacity="0.6" />
      )}
    </g>
  )
}
