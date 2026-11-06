import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { continueRender, delayRender } from "remotion";
import { ARABIC_FONT, TITLE_FONT } from "../fonts";

export type WedgeMode = "auto" | "elapsed" | "none";

const R = 2.2; // clock radius (world units)
const TAU = Math.PI * 2;
const AR_NUMS = ["١٢", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠", "١١"];

/** Draws the clock face (Arabic-Indic numerals) onto a canvas, once fonts are ready. */
const useClockFace = () => {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const [handle] = useState(() => delayRender("Drawing clock face"));

  useEffect(() => {
    Promise.all([
      document.fonts.load(`700 100px "${ARABIC_FONT}"`, "١٢٣"),
      document.fonts.load(`700 60px "${TITLE_FONT}"`, "مِفْتَاح"),
    ]).finally(() => {
      const S = 1024;
      const c = document.createElement("canvas");
      c.width = S;
      c.height = S;
      const g = c.getContext("2d")!;
      const mid = S / 2;
      const grad = g.createRadialGradient(mid, mid * 0.8, 50, mid, mid, mid);
      grad.addColorStop(0, "#fffaf0");
      grad.addColorStop(1, "#eadcbc");
      g.fillStyle = grad;
      g.fillRect(0, 0, S, S);

      // minute and hour ticks
      for (let i = 0; i < 60; i++) {
        const a = (i / 60) * TAU - Math.PI / 2;
        const hour = i % 5 === 0;
        const r1 = mid * 0.95;
        const r2 = mid * (hour ? 0.85 : 0.9);
        g.strokeStyle = hour ? "#1d2b3a" : "#7a8796";
        g.lineWidth = hour ? 12 : 4;
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(mid + Math.cos(a) * r1, mid + Math.sin(a) * r1);
        g.lineTo(mid + Math.cos(a) * r2, mid + Math.sin(a) * r2);
        g.stroke();
      }
      // numerals
      g.fillStyle = "#1d2b3a";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = `700 104px "${ARABIC_FONT}"`;
      AR_NUMS.forEach((num, i) => {
        const a = (i / 12) * TAU - Math.PI / 2;
        g.fillText(num, mid + Math.cos(a) * mid * 0.69, mid + Math.sin(a) * mid * 0.69 + 10);
      });
      // brand
      g.fillStyle = "#b8862d";
      g.font = `700 54px "${TITLE_FONT}"`;
      g.fillText("مِفْتَاح", mid, mid + mid * 0.38);

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      setTexture(tex);
    });
  }, []);

  // While rendering, three.js only redraws when the frame changes. Draw once
  // more now that the face exists, then let Remotion take the screenshot.
  const { advance } = useThree();
  useEffect(() => {
    if (!texture) return;
    advance(performance.now());
    continueRender(handle);
  }, [texture, advance, handle]);

  return texture;
};

/** Angle (radians, clockwise from 12) of the minute hand. */
const minuteAngle = (minutes: number) => (((minutes % 60) + 60) % 60) / 60 * TAU;

export const Clock3D: React.FC<{
  minutes: number; // minutes since midnight (can be fractional)
  wedgeMode: WedgeMode;
  wedgeFrom: number; // start time for "elapsed" mode
  wedgeOpacity: number;
  pastColor: string;
  toColor: string;
  elapsedColor: string;
  rimColor: string;
}> = ({ minutes, wedgeMode, wedgeFrom, wedgeOpacity, pastColor, toColor, elapsedColor, rimColor }) => {
  const face = useClockFace();
  const mA = minuteAngle(minutes);
  const hA = ((((minutes / 60) % 12) + 12) % 12) / 12 * TAU;

  // The coloured wedge. three.js measures angles counter-clockwise from 3 o'clock,
  // so 12 o'clock is π/2 and "clockwise by a" is π/2 − a.
  let wedge: { start: number; length: number; color: string } | null = null;
  const m = ((minutes % 60) + 60) % 60;
  if (wedgeMode === "auto" && m > 0.4) {
    wedge =
      m <= 30.01
        ? { start: Math.PI / 2 - mA, length: mA, color: pastColor } // from 12 to the hand
        : { start: Math.PI / 2, length: TAU - mA, color: toColor }; // from the hand on to 12
  } else if (wedgeMode === "elapsed" && minutes - wedgeFrom > 0.2) {
    const len = (Math.min(60, minutes - wedgeFrom) / 60) * TAU;
    wedge = { start: Math.PI / 2 - mA, length: len, color: elapsedColor };
  }

  return (
    <group>
      {/* Back body */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
        <cylinderGeometry args={[R + 0.05, R + 0.15, 0.35, 96]} />
        <meshStandardMaterial color="#13283d" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Golden rim */}
      <mesh position={[0, 0, 0.1]}>
        <torusGeometry args={[R + 0.05, 0.13, 32, 128]} />
        <meshStandardMaterial color={rimColor} metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Face */}
      <mesh position={[0, 0, 0.08]}>
        <circleGeometry args={[R, 96]} />
        {/* `key` forces a fresh material once the texture exists (three.js won't re-compile otherwise) */}
        {face ? (
          <meshBasicMaterial key="face" map={face} toneMapped={false} />
        ) : (
          <meshBasicMaterial key="plain" color="#f5ecd6" />
        )}
      </mesh>
      {/* Past / to wedge */}
      {wedge && wedgeOpacity > 0.01 ? (
        <mesh position={[0, 0, 0.09]}>
          <circleGeometry args={[R * 0.97, 96, wedge.start, wedge.length]} />
          <meshBasicMaterial color={wedge.color} transparent opacity={0.42 * wedgeOpacity} depthWrite={false} toneMapped={false} />
        </mesh>
      ) : null}
      {/* Hour hand */}
      <group rotation={[0, 0, -hA]} position={[0, 0, 0.14]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.17, 1.35, 0.06]} />
          <meshStandardMaterial color="#1d2b3a" metalness={0.4} roughness={0.4} />
        </mesh>
      </group>
      {/* Minute hand */}
      <group rotation={[0, 0, -mA]} position={[0, 0, 0.19]}>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.1, 1.95, 0.05]} />
          <meshStandardMaterial color="#1d2b3a" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.72, 0.01]}>
          <boxGeometry args={[0.1, 0.25, 0.05]} />
          <meshStandardMaterial color={rimColor} metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      {/* Centre cap */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.24]}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 32]} />
        <meshStandardMaterial color={rimColor} metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
};
