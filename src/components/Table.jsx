'use client';

import React from 'react';

export default function Table() {
  return (
    <group position={[0, 0, 0]}>
      {/* Table Top (Surface at y=0.44) */}
      <mesh receiveShadow position={[0, 0.42, 0]}>
        <boxGeometry args={[4.2, 0.04, 1.8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Frame under top */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[4, 0.04, 1.6]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>

      {/* Legs (Corrected to touch the ground and the frame) */}
      {[[-1.9, 0.75], [1.9, 0.75], [-1.9, -0.75], [1.9, -0.75]].map(([x, z], i) => (
        <mesh key={i} castShadow position={[x, 0.2, z]}>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#3E2723" />
        </mesh>
      ))}

      {/* Lower Shelf (Connected to legs) */}
      <mesh receiveShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[3.8, 0.02, 1.5]} />
        <meshStandardMaterial color="#6D4C41" />
      </mesh>
    </group>
  );
}
