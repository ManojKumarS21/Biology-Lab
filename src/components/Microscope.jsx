'use client';

import React from 'react';
import { useStore, STEPS } from '@/store';

export default function Microscope() {
  const { toggleMicroscopeView, currentStep } = useStore();

  const handleClick = (e) => {
    e.stopPropagation();
    if (currentStep === STEPS.OBSERVE) {
      toggleMicroscopeView(true);
    }
  };

  return (
    <group scale={1.8} onClick={handleClick}>
      {/* Base */}
      <mesh castShadow position={[0, 0.025, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.4]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Arm */}
      <mesh castShadow position={[0, 0.275, -0.15]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Stage */}
      <mesh castShadow position={[0, 0.175, 0]}>
        <boxGeometry args={[0.2, 0.02, 0.2]} />
        <meshStandardMaterial color="#0A0A0A" />
      </mesh>

      {/* Objective Lens Tube */}
      <group position={[0, 0.4, 0]} rotation={[0.4, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.2]} />
          <meshStandardMaterial color="#222222" metalness={1} roughness={0.1} />
        </mesh>
        
        {/* Eyepiece / Lens */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.05]} />
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
      </group>

      {/* Mirror/Light Source */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.01]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}
