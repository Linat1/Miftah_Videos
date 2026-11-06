import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Character, CAST, type CastName, type CharacterProps } from "./Character";
import { Ar, En } from "./ui";
import { C } from "./theme";
import { pop } from "./anim";
import { Sfx } from "./Sfx";

export type Line = { who: CastName; at: number; dur: number; ar: string; en: string };

/** A speech bubble above a speaker, with Arabic and its English meaning. */
const Bubble: React.FC<{ line: Line; speakerX: number; top: number; side: "left" | "right" }> = ({
  line,
  speakerX,
  top,
  side,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const p = pop(frame, fps, line.at, 13);
  const out = interpolate(frame, [line.at + line.dur - 8, line.at + line.dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < line.at || frame >= line.at + line.dur) return null;
  const W = 640;
  // keep the bubble on screen and nudged towards the middle
  const left = Math.max(40, Math.min(width - W - 40, side === "left" ? speakerX - 260 : speakerX - W + 260));
  const tailX = Math.max(60, Math.min(W - 60, speakerX - left));
  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom: `calc(100% - ${top}px)`,
        width: W,
        opacity: Math.min(1, p * 1.5) * out,
        transform: `scale(${0.75 + 0.25 * p})`,
        transformOrigin: `${tailX}px 100%`,
      }}
    >
      <div
        style={{
          background: "#fffaf0",
          borderRadius: 30,
          padding: "10px 30px 16px",
          boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
          border: `4px solid ${C.gold}`,
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <En size={22} color="#8a6a2a">{CAST[line.who].nameEn}</En>
          <Ar size={26} color="#8a6a2a" style={{ lineHeight: 1.4 }}>{CAST[line.who].nameAr}</Ar>
        </div>
        <div>
          <Ar size={46} color="#13283d" style={{ lineHeight: 1.7 }}>{line.ar}</Ar>
        </div>
        <En size={26} color="#4a5a6a">{line.en}</En>
      </div>
      {/* tail */}
      <div
        style={{
          position: "absolute",
          left: tailX - 18,
          bottom: -26,
          width: 0,
          height: 0,
          borderLeft: "18px solid transparent",
          borderRight: "18px solid transparent",
          borderTop: `30px solid ${C.gold}`,
        }}
      />
    </div>
  );
};

export type DialogueCast = Omit<CharacterProps, "talking" | "floor" | "height"> & {
  floor?: number;
  height?: number;
};

/** Characters + speech bubbles. Talking animation follows each line's timing. */
export const Dialogue: React.FC<{
  cast: DialogueCast[];
  lines: Line[];
  bubbleTop?: number; // y where bubbles end (just above the heads)
  floor?: number;
  height?: number;
  sfx?: boolean;
}> = ({ cast, lines, bubbleTop = 400, floor = 1010, height = 600, sfx = true }) => (
  <AbsoluteFill>
    {cast.map((c) => (
      <Character
        key={c.who}
        floor={c.floor ?? floor}
        height={c.height ?? height}
        {...c}
        talking={lines.filter((l) => l.who === c.who).map((l) => [l.at, l.at + Math.min(l.dur, 75)] as [number, number])}
      />
    ))}
    {lines.map((l, i) => {
      const speaker = cast.find((c) => c.who === l.who)!;
      const side = speaker.x < 960 ? "left" : "right";
      return <Bubble key={i} line={l} speakerX={speaker.x} top={bubbleTop} side={side} />;
    })}
    {sfx ? lines.map((l, i) => <Sfx key={`s${i}`} at={l.at} name="tick" volume={0.3} />) : null}
  </AbsoluteFill>
);

/** A soft floor band so characters feel grounded. */
export const Floor: React.FC<{ y?: number; color?: string }> = ({ y = 960, color = "#0a1724" }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: y,
      bottom: 0,
      background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${color} 35%)`,
    }}
  />
);
