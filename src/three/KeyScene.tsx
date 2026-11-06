import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { KeyModel } from "./KeyModel";

// IMPORTANT RULE for three.js inside Remotion:
// Never animate with useFrame() or clocks/timers. Always derive motion from
// useCurrentFrame(), so every frame renders identically every time.

export const Particles: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  // Deterministic "random" positions (same every render).
  const points = useMemo(
    () =>
      new Array(120).fill(0).map((_, i) => {
        const a = i * 2.399963; // golden angle
        const r = 2.5 + ((i * 37) % 50) / 10;
        return [Math.cos(a) * r, ((i * 53) % 80) / 10 - 4, Math.sin(a) * r - 3] as const;
      }),
    [],
  );

  return (
    <group rotation={[0, frame * 0.002, 0]}>
      {points.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y + Math.sin(frame / 30 + i) * 0.15, z]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

export const KeyScene: React.FC<{ keyColor: string; background: string }> = ({
  keyColor,
  background,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // 1) Key flies in with a springy entrance.
  const entrance = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const scale = interpolate(entrance, [0, 1], [0.2, 1]);
  const z = interpolate(entrance, [0, 1], [-8, 0]);

  // 2) Continuous gentle spin + float.
  const spinY = frame * 0.02;
  const floatY = Math.sin(frame / 25) * 0.15;

  // 3) Camera slowly pushes in over the whole clip.
  const cameraZ = interpolate(frame, [0, 300], [7, 5.5], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateRight: "clamp",
  });

  // Fit the key on portrait (9:16) screens too.
  const portrait = height > width;
  const fit = portrait ? 0.6 : 1;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{ backgroundColor: background }}
      camera={{ fov: 45, position: [0, 0, cameraZ] }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={2.2} />
      <pointLight position={[-4, -2, 3]} intensity={30} color="#6fb3ff" />
      <pointLight position={[3, 3, -2]} intensity={20} color="#ffd38a" />

      <group
        position={[0, floatY + (portrait ? -0.3 : -0.55), z]}
        rotation={[0.25, spinY, -0.15]}
        scale={scale * fit}
      >
        <KeyModel color={keyColor} />
      </group>

      <Particles color={keyColor} />
    </ThreeCanvas>
  );
};
