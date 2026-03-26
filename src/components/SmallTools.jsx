'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

const ForcepArm = ({ isLeft }) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0); // Top inner
    s.lineTo(0.005, 0); // Top outer 
    s.lineTo(0.012, -0.08); // Grip curve outer
    s.lineTo(0.002, -0.16); // Tip outer
    s.lineTo(0, -0.16); // Tip inner
    s.lineTo(0.008, -0.08); // Grip curve inner
    s.lineTo(0, 0); // Back to top
    return s;
  }, []);

  const scaleX = isLeft ? -1 : 1;
  const extrudeSettings = useMemo(() => ({
    depth: 0.008,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.0005,
    bevelThickness: 0.0005,
  }), []);

  return (
    <group scale={[scaleX, 1, 1]} position={[0, 0.08, -0.004]}>
      <mesh castShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color="#c0c4c8" metalness={0.9} roughness={0.3} />
      </mesh>
      
      {/* Grip Serrations - Grooved texture block on outer face */}
      <mesh position={[0.0105, -0.08, 0.004]} rotation={[0, 0, -0.08]}>
         <boxGeometry args={[0.001, 0.04, 0.008]} />
         <meshStandardMaterial color="#a0a4a8" metalness={0.8} roughness={0.6} />
      </mesh>
    </group>
  );
};

export default function SmallTools({ type = 'needle' }) {
  const isNeedle = type === 'needle';
  const isForceps = type === 'forceps';
  const isBlade = type === 'blade';
  const isDropper = type === 'dropper';

  // Adjust scale dynamically: dropper slightly smaller, blade smaller
  const baseScale = isDropper ? 1.8 : (isBlade ? 1.5 : 2.5);

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
