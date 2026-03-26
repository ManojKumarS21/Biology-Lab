'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

const ForcepArm = ({ isLeft }) => {
  const curve = useMemo(() => {
    const scale = isLeft ? -1 : 1;
    const points = [
      new THREE.Vector3(0, 0.1, 0),             // Top hinge
      new THREE.Vector3(0.015 * scale, 0.06, 0), // Bulge out slightly
      new THREE.Vector3(0.018 * scale, -0.02, 0), // Middle span
      new THREE.Vector3(0.008 * scale, -0.07, 0), // Taper inward
      new THREE.Vector3(0.001 * scale, -0.1, 0)   // Touching tips
    ];
    return new THREE.CatmullRomCurve3(points);
  }, [isLeft]);

  return (
    <mesh castShadow scale={[1, 1, 0.25]}>
      {/* 20 tubular segments, radius=0.008, 16 radial segments, closed=false */}
      <tubeGeometry args={[curve, 32, 0.006, 16, false]} />
      <meshStandardMaterial color="#f5f5f5" metalness={1.0} roughness={0.15} />
    </mesh>
  );
};

export default function SmallTools({ type = 'needle' }) {
  const isNeedle = type === 'needle';
  const isForceps = type === 'forceps';
  const isBlade = type === 'blade';
  const isDropper = type === 'dropper';

  // Adjust scale dynamically: dropper slightly smaller
  const baseScale = isDropper ? 1.8 : 2.5;

  return (
    <group scale={[baseScale, baseScale, baseScale]} position={[0, 0, 0]}>
      {isNeedle && (
        <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}> 
          <mesh castShadow position={[0, 0, 0]}>
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
        <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          {/* Top connecting hinge cap */}
          <mesh position={[0, 0.1, 0]} castShadow scale={[1, 1, 0.35]}>
            <sphereGeometry args={[0.008, 16, 16]} />
            <meshStandardMaterial color="#f5f5f5" metalness={1.0} roughness={0.2} />
          </mesh>
          <ForcepArm isLeft={true} />
          <ForcepArm isLeft={false} />
          
          {/* Subtle grip ridges for realism */}
          {[-0.02, 0, 0.02, 0.04].map((yOffset, i) => (
            <group position={[0, yOffset, 0]} key={i}>
              <mesh position={[-0.016, 0, 0.0018]} rotation={[0, 0, 0.1]}>
                <boxGeometry args={[0.002, 0.001, 0.005]} />
                <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.4} />
              </mesh>
              <mesh position={[0.016, 0, 0.0018]} rotation={[0, 0, -0.1]}>
                <boxGeometry args={[0.002, 0.001, 0.005]} />
                <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.4} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {isBlade && (
        <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <mesh castShadow position={[0, 0, 0]}>
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
        <group position={[0, 0.075, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.15]} />
            <meshPhysicalMaterial 
              transparent 
              opacity={0.4} 
              roughness={0.05} 
              metalness={0.1}
              color="#888888" 
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
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
