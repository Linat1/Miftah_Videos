import React from "react";
import { ARABIC_FONT } from "../../fonts";
import { C } from "./theme";

const AR = ["١٢", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠", "١١"];
const TAU = Math.PI * 2;

/** Arc path for the coloured past/to wedge (angles clockwise from 12, radians). */
const arc = (r: number, a0: number, a1: number) => {
  const p = (a: number) => [Math.sin(a) * r, -Math.cos(a) * r];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M0 0 L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
};

/**
 * Flat, illustrated wall clock with Arabic-Indic numerals.
 * `minutes` = minutes since midnight. `wedge` shows minutes past (green) / to (orange).
 */
export const Clock2D: React.FC<{
  minutes: number;
  r: number;
  wedge?: boolean;
  shake?: number; // 0–1 alarm wobble
  frame?: number;
}> = ({ minutes, r, wedge = false, shake = 0, frame = 0 }) => {
  const m = ((minutes % 60) + 60) % 60;
  const mA = (m / 60) * TAU;
  const hA = ((((minutes / 60) % 12) + 12) % 12) / 12 * TAU;
  const rot = shake ? Math.sin(frame * 2.2) * 7 * shake : 0;
  return (
    <svg width={r * 2.3} height={r * 2.3} viewBox="-115 -115 230 230" style={{ overflow: "visible", transform: `rotate(${rot}deg)` }}>
      <circle r={108} fill="rgba(0,0,0,0.18)" cx={4} cy={7} />
      <circle r={106} fill="#c8963e" />
      <circle r={100} fill="#a9772b" />
      <circle r={93} fill="#fffaf0" />
      {wedge && m > 0.4 ? (
        m <= 30.01 ? (
          <path d={arc(90, 0, mA)} fill={C.past} opacity={0.45} />
        ) : (
          <path d={arc(90, mA, TAU)} fill={C.to} opacity={0.45} />
        )
      ) : null}
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * TAU;
        const big = i % 5 === 0;
        const r1 = 90;
        const r2 = big ? 80 : 85;
        return (
          <line key={i} x1={Math.sin(a) * r1} y1={-Math.cos(a) * r1} x2={Math.sin(a) * r2} y2={-Math.cos(a) * r2}
            stroke={big ? "#1d2b3a" : "#8a96a3"} strokeWidth={big ? 3.2 : 1.2} strokeLinecap="round" />
        );
      })}
      {AR.map((n, i) => {
        const a = (i / 12) * TAU;
        return (
          <text key={n} x={Math.sin(a) * 66} y={-Math.cos(a) * 66 + 7} textAnchor="middle"
            fontFamily={ARABIC_FONT} fontWeight={700} fontSize={22} fill="#1d2b3a">{n}</text>
        );
      })}
      {/* hands */}
      <line x1={0} y1={8} x2={Math.sin(hA) * 48} y2={-Math.cos(hA) * 48} stroke="#1d2b3a" strokeWidth={7} strokeLinecap="round" />
      <line x1={0} y1={10} x2={Math.sin(mA) * 76} y2={-Math.cos(mA) * 76} stroke="#1d2b3a" strokeWidth={4.5} strokeLinecap="round" />
      <circle r={6} fill="#c8963e" />
      <circle r={2.5} fill="#1d2b3a" />
    </svg>
  );
};
