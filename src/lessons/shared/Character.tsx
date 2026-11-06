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
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const c = CAST[who];
  const w = (c.w / c.h) * height;
  const phase = who.length * 1.7; // each character breathes at a different time

  // Walk in from off-screen
  const walk = spring({ frame: frame - enterAt, fps, config: { damping: 20, mass: 1.2 }, durationInFrames: 45 });
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

  const flip = face !== c.faces ? -1 : 1;
  const visible = frame >= enterAt;
  const shadowScale = interpolate(hopY, [-height * 0.07, 0], [0.7, 1]);

  if (!visible) return null;

  return (
    <div style={{ position: "absolute", left: x - w / 2 + dx, top: floor - height, width: w, height }}>
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
          transform: `translateY(${stepBob + talkBob + hopY}px) rotate(${sway + stepTilt + talkTilt}deg) scaleX(${flip}) scaleY(${breathe * squash})`,
          // the waiter's tray is cut off at the image edge: fade it out softly
          ...(who === "waiter"
            ? { maskImage: "linear-gradient(to right, transparent 0%, black 14%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 14%)" }
            : {}),
        }}
      />
    </div>
  );
};
