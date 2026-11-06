import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// The illustrated cast (transparent PNGs in public/characters/).
// `faces` is the direction the drawing naturally looks.
export const CAST = {
  yusuf: { src: "characters/yusuf.png", w: 272, h: 1052, faces: "right", nameAr: "يُوسُفُ", nameEn: "Yusuf" },
  maryam: { src: "characters/maryam.png", w: 411, h: 1003, faces: "left", nameAr: "مَرْيَمُ", nameEn: "Maryam" },
  waiter: { src: "characters/waiter.png", w: 325, h: 1060, faces: "left", nameAr: "النَّادِلُ", nameEn: "Waiter" },
  aisha: { src: "characters/aisha.png", w: 316, h: 1039, faces: "right", nameAr: "عَائِشَةُ", nameEn: "Aisha" },
  noor: { src: "characters/noor.png", w: 317, h: 1013, faces: "right", nameAr: "نُورُ", nameEn: "Noor" },
} as const;

export type CastName = keyof typeof CAST;

export type CharacterProps = {
  who: CastName;
  x: number; // centre x in px
  floor: number; // y of the feet in px
  height: number; // px
  face: "left" | "right";
  enterAt?: number; // frame the walk-in starts
  enterFrom?: "left" | "right";
  talking?: [number, number][]; // frame ranges when speaking
  hops?: number[]; // frames when the character does a happy hop
  run?: boolean; // dash in quickly instead of walking
  exitAt?: number; // frame the character runs off screen
  exitTo?: "left" | "right";
  faintAt?: number; // frame the character faints (comedy fall)
  emotes?: { at: number; type: Emote }[]; // reaction marks above the head
};

export type Emote = "!" | "?" | "?!" | "zz" | "sweat";

/** A reaction mark that pops above a character's head. */
const EmoteMark: React.FC<{ type: Emote; at: number; size: number }> = ({ type, at, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tt = frame - at;
  if (tt < 0 || tt > 55) return null;
  const p = spring({ frame: tt, fps, config: { damping: 9, mass: 0.5 } });
  const fade = interpolate(tt, [42, 55], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const common: React.CSSProperties = {
    fontFamily: "Poppins",
    fontWeight: 700,
    fontSize: size,
    color: "#ffd23f",
    lineHeight: 1,
    textShadow: "0 0 0 #000, 3px 3px 0 #1d2b3a, -3px -3px 0 #1d2b3a, 3px -3px 0 #1d2b3a, -3px 3px 0 #1d2b3a",
  };
  if (type === "zz") {
    return (
      <div style={{ position: "relative", opacity: fade }}>
        {[0, 1, 2].map((i) => {
          const q = Math.max(0, Math.min(1, (tt - i * 8) / 30));
          return (
            <span key={i} style={{ ...common, color: "#cfe3ff", fontSize: size * (0.5 + i * 0.2), position: "absolute",
              left: i * size * 0.35, top: -q * size * 1.1 - i * size * 0.3, opacity: q > 0 ? 1 : 0 }}>Z</span>
          );
        })}
      </div>
    );
  }
  if (type === "sweat") {
    return (
      <svg width={size * 0.6} height={size * 0.9} viewBox="0 0 40 60"
        style={{ opacity: fade, transform: `translateY(${tt * 0.6}px) scale(${p})` }}>
        <path d="M20 2 C28 20 36 30 36 42 A16 16 0 0 1 4 42 C4 30 12 20 20 2 Z" fill="#7cc4ff" stroke="#1d2b3a" strokeWidth={3} />
        <ellipse cx={14} cy={40} rx={4} ry={7} fill="#fff" opacity={0.7} />
      </svg>
    );
  }
  return (
    <div style={{ ...common, opacity: fade, transform: `scale(${p}) rotate(${(1 - p) * -20}deg)`, transformOrigin: "50% 100%" }}>
      {type}
    </div>
  );
};

/**
 * Brings a flat character drawing to life, puppet-style:
 * walk-in with steps, idle breathing, a bounce while talking, happy hops.
 */
export const Character: React.FC<CharacterProps> = ({
  who,
  x,
  floor,
  height,
  face,
  enterAt = 0,
  enterFrom = "left",
  talking = [],
  hops = [],
  run = false,
  exitAt,
  exitTo = "right",
  faintAt,
  emotes = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const c = CAST[who];
  const w = (c.w / c.h) * height;
  const phase = who.length * 1.7; // each character breathes at a different time

  // Walk in from off-screen
  const walk = spring({
    frame: frame - enterAt,
    fps,
    config: { damping: 20, mass: run ? 0.6 : 1.2 },
    durationInFrames: run ? 22 : 45,
  });
  const offX = enterFrom === "left" ? -w - x : width - x + w;
  const walking = walk < 0.98 && frame >= enterAt;
  const dx = (1 - walk) * offX;
  const stepBob = walking ? -Math.abs(Math.sin((frame - enterAt) * 0.45)) * height * 0.025 : 0;
  const stepTilt = walking ? Math.sin((frame - enterAt) * 0.45) * 2 : 0;

  // Talking: lively bounce + small rocking
  const isTalking = talking.some(([a, b]) => frame >= a && frame < b);
  const talkBob = isTalking ? -Math.abs(Math.sin(frame * 0.38)) * height * 0.012 : 0;
  const talkTilt = isTalking ? Math.sin(frame * 0.19) * 1.6 : 0;

  // Happy hops
  let hopY = 0;
  let squash = 1;
  for (const h of hops) {
    const tt = frame - h;
    if (tt >= 0 && tt < 18) {
      hopY = -Math.sin((tt / 18) * Math.PI) * height * 0.07;
      squash = tt < 3 ? 0.96 : 1;
    }
  }

  // Idle breathing
  const breathe = 1 + Math.sin(frame / 22 + phase) * 0.006;
  const sway = Math.sin(frame / 37 + phase) * 0.6;

  // Running off screen
  const exiting = exitAt !== undefined && frame >= exitAt;
  const ex = exiting ? Math.pow(Math.min(1, (frame - exitAt!) / 20), 2) : 0;
  const exitDx = ex * (exitTo === "right" ? width - x + w * 1.5 : -x - w * 1.5);
  const exitBob = exiting ? -Math.abs(Math.sin((frame - exitAt!) * 0.7)) * height * 0.03 : 0;
  const exitTilt = exiting ? (exitTo === "right" ? 8 : -8) * Math.min(1, (frame - exitAt!) / 5) : 0;

  // Fainting: tips over backwards from the feet, with a little bounce
  let faintRot = 0;
  let faintY = 0;
  if (faintAt !== undefined && frame >= faintAt) {
    const ft = frame - faintAt;
    const fall = Math.min(1, Math.pow(ft / 14, 2));
    const back = face === "right" ? 1 : -1; // falls forwards, towards the middle of the stage
    faintRot = back * 90 * fall;
    faintY = ft > 14 && ft < 22 ? -Math.sin(((ft - 14) / 8) * Math.PI) * 18 : 0;
  }

  const effFace = exiting ? exitTo : face;
  const flip = effFace !== c.faces ? -1 : 1;
  const visible = frame >= enterAt;
  const shadowScale = interpolate(hopY, [-height * 0.07, 0], [0.7, 1]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2 + dx + exitDx,
        top: floor - height,
        width: w,
        height,
        transformOrigin: "50% 100%",
        transform: `translateY(${faintY}px) rotate(${faintRot}deg)`,
      }}
    >
      {/* speed lines while running off */}
      {exiting && ex < 0.9
        ? [0.35, 0.5, 0.65].map((k) => (
            <div key={k} style={{ position: "absolute", top: height * k, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.7)",
              width: w * 0.9, [exitTo === "right" ? "right" : "left"]: w * 0.9 }} />
          ))
        : null}
      {/* contact shadow */}
      <div
        style={{
          position: "absolute",
          left: w * 0.1,
          width: w * 0.8,
          top: height - 14,
          height: 28,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.45), rgba(0,0,0,0) 70%)",
          transform: `scaleX(${shadowScale})`,
        }}
      />
      <Img
        src={staticFile(c.src)}
        style={{
          width: w,
          height,
          transformOrigin: "50% 100%",
          transform: `translateY(${stepBob + talkBob + hopY + exitBob}px) rotate(${sway + stepTilt + talkTilt + exitTilt}deg) scaleX(${flip}) scaleY(${breathe * squash})`,
          // the waiter's tray is cut off at the image edge: fade it out softly
          ...(who === "waiter"
            ? { maskImage: "linear-gradient(to right, transparent 0%, black 14%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 14%)" }
            : {}),
        }}
      />
      {emotes.map((e, i) => (
        <div key={i} style={{ position: "absolute", left: w * (effFace === "right" ? 0.62 : 0.05), top: -height * 0.06 }}>
          <EmoteMark type={e.type} at={e.at} size={height * 0.11} />
        </div>
      ))}
    </div>
  );
};
