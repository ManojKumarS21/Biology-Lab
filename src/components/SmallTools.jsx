'use client';

import React from 'react';

export default function SmallTools({ type = 'needle' }) {
  const isNeedle = type === 'needle';
  const isForceps = type === 'forceps';
  const isBlade = type === 'blade';
  const isDropper = type === 'dropper';

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {isNeedle && (
        <group>
          <mesh castShadow>
            <cylinderGeometry args={[0.002, 0.001, 0.2]} />
            <meshStandardMaterial color="#CCCCCC" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.05]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </group>
      )}

      {isForceps && (
        <group>
          <mesh castShadow position={[-0.01, 0, 0]}>
            <boxGeometry args={[0.01, 0.2, 0.005]} />
            <meshStandardMaterial color="#AAAAAA" metalness={0.8} />
          </mesh>
          <mesh castShadow position={[0.01, 0, 0]}>
            <boxGeometry args={[0.01, 0.2, 0.005]} />
            <meshStandardMaterial color="#AAAAAA" metalness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 0.1, 0]}>
            <boxGeometry args={[0.03, 0.01, 0.005]} />
            <meshStandardMaterial color="#AAAAAA" metalness={0.8} />
          </mesh>
        </group>
      )}

      {isBlade && (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.05, 0.15, 0.002]} />
            <meshStandardMaterial color="#EEEEEE" metalness={1} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.06, 0.05, 0.01]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
        </group>
      )}

      {isDropper && (
        <group>
          <mesh castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.15]} />
            <meshPhysicalMaterial transparent opacity={0.3} transmission={0.9} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#FF0000" roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
}
