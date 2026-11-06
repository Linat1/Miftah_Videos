import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Clock3D, type WedgeMode } from "../../three/Clock3D";
import { KeyModel } from "../../three/KeyModel";
import { Particles } from "../../three/KeyScene";
import { C } from "./theme";

/** Everything the 3D stage needs to know for one frame. Numbers blend smoothly between scenes. */
export type StageState = {
  minutes: number;
  x: number;
  y: number;
  scale: number;
  spin: number; // extra Y rotation
  wedgeMode: WedgeMode;
  wedgeFrom: number;
  wedgeOpacity: number;
  sun: number; // 0–1 size of the sun
  moon: number; // 0–1 size of the moon
  key: number; // 0 = clock, 1 = golden key
};

export const STAGE_DEFAULT: StageState = {
  minutes: 8 * 60,
  x: -3.75,
  y: 0.35,
  scale: 1,
  spin: 0,
  wedgeMode: "none",
  wedgeFrom: 0,
  wedgeOpacity: 0,
  sun: 0,
  moon: 0,
  key: 0,
};

export const blendStage = (a: StageState, b: StageState, p: number): StageState => {
  const mix = (x: number, y: number) => x + (y - x) * p;
  return {
    minutes: mix(a.minutes, b.minutes),
    x: mix(a.x, b.x),
    y: mix(a.y, b.y),
    scale: mix(a.scale, b.scale),
    spin: mix(a.spin, b.spin),
    wedgeMode: p < 0.5 ? a.wedgeMode : b.wedgeMode,
    wedgeFrom: p < 0.5 ? a.wedgeFrom : b.wedgeFrom,
    // dip the wedge out and back in if the mode changes
    wedgeOpacity:
      a.wedgeMode === b.wedgeMode
        ? mix(a.wedgeOpacity, b.wedgeOpacity)
        : p < 0.5
          ? a.wedgeOpacity * (1 - p * 2)
          : b.wedgeOpacity * (p * 2 - 1),
    sun: mix(a.sun, b.sun),
    moon: mix(a.moon, b.moon),
    key: mix(a.key, b.key),
  };
};

export const Stage3D: React.FC<{ state: StageState }> = ({ state }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = state;
  const clockScale = s.scale * (1 - s.key);

  return (
    <ThreeCanvas width={width} height={height} camera={{ fov: 40, position: [0, 0, 10] }}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} />
      <pointLight position={[-6, -2, 4]} intensity={25} color="#6fb3ff" />
      <pointLight position={[2, 4, 3]} intensity={18} color="#ffd38a" />

      <Particles color={C.gold} />

      {/* The clock */}
      <group
        position={[s.x, s.y, 0]}
        scale={Math.max(0.0001, clockScale)}
        visible={clockScale > 0.001}
        rotation={[-0.06 + Math.sin(frame / 70) * 0.03, 0.32 + Math.sin(frame / 95) * 0.05 + s.spin, 0]}
      >
        <Clock3D
          minutes={s.minutes}
          wedgeMode={s.wedgeMode}
          wedgeFrom={s.wedgeFrom}
          wedgeOpacity={s.wedgeOpacity}
          pastColor={C.past}
          toColor={C.to}
          elapsedColor={C.goldSoft}
          rimColor={C.gold}
        />
      </group>

      {/* Sun (a.m. / daytime) */}
      <mesh position={[s.x + 2.2, s.y + 2.25, 0.5]} scale={Math.max(0.0001, s.sun)} visible={s.sun > 0.001}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshBasicMaterial color="#ffc845" toneMapped={false} />
      </mesh>
      {/* Moon (evening) */}
      <mesh position={[s.x + 2.2, s.y + 2.25, 0.5]} scale={Math.max(0.0001, s.moon)} visible={s.moon > 0.001}>
        <sphereGeometry args={[0.36, 32, 32]} />
        <meshStandardMaterial color="#dfe7f2" emissive="#8aa4c8" emissiveIntensity={0.5} roughness={0.9} />
      </mesh>

      {/* Golden key (used in the closing scene) */}
      <group
        position={[s.x, s.y, 0]}
        scale={Math.max(0.0001, s.key * 1.05)}
        visible={s.key > 0.001}
        rotation={[0.25, frame * 0.02, -0.15]}
      >
        <KeyModel color={C.gold} />
      </group>
    </ThreeCanvas>
  );
};
