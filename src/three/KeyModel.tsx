import React, { useMemo } from "react";
import * as THREE from "three";

// A stylised key built only from three.js primitives (no model file needed).
// Swap this for your own models later — see README "Using your own 3D models".
export const KeyModel: React.FC<{ color: string }> = ({ color }) => {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        metalness: 0.85,
        roughness: 0.25,
      }),
    [color],
  );

  return (
    <group>
      {/* Bow (the ring you hold) */}
      <mesh material={material} position={[-1.6, 0, 0]}>
        <torusGeometry args={[0.7, 0.18, 32, 96]} />
      </mesh>
      {/* Decorative inner ring */}
      <mesh material={material} position={[-1.6, 0, 0]}>
        <torusGeometry args={[0.32, 0.07, 24, 64]} />
      </mesh>
      {/* Collar */}
      <mesh material={material} position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.25, 32]} />
      </mesh>
      {/* Shaft */}
      <mesh material={material} position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.11, 2.6, 32]} />
      </mesh>
      {/* Teeth (the "bit") */}
      <mesh material={material} position={[1.55, -0.3, 0]}>
        <boxGeometry args={[0.18, 0.5, 0.12]} />
      </mesh>
      <mesh material={material} position={[1.2, -0.22, 0]}>
        <boxGeometry args={[0.16, 0.34, 0.12]} />
      </mesh>
      <mesh material={material} position={[1.85, -0.18, 0]}>
        <boxGeometry args={[0.12, 0.26, 0.12]} />
      </mesh>
    </group>
  );
};
