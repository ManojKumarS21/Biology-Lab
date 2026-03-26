'use client';

import React from 'react';
import { useStore, STEPS } from '@/store';

export default function Burner() {
  const { currentStep, activeTool, experimentState, updateExperimentState } = useStore();

  const handleHeat = (e) => {
    e.stopPropagation();
    if (activeTool === 'burner' && currentStep === STEPS.HEAT_TIP && experimentState.hclAdded) {
      updateExperimentState('tipHeated', true);
    }
  };

  return (
    <group onClick={handleHeat} scale={[1.5, 1.5, 1.5]}>
      {/* Base */}
      <mesh castShadow position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.02]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      
      {/* Tube */}
      <mesh castShadow position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.28]} />
        <meshStandardMaterial color="#AAAAAA" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Gas Valve */}
      <mesh position={[0, 0.06, 0.03]} rotation={[1.57, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.05]} />
        <meshStandardMaterial color="#FFD700" metalness={1} />
      </mesh>

      {/* Flame (Simplified) */}
      <mesh position={[0, 0.31, 0]}>
        <sphereGeometry args={[0.02, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial 
          color="#4169E1" 
          emissive="#4169E1" 
          emissiveIntensity={2} 
          transparent 
          opacity={0.6} 
        />
      </mesh>
    </group>
  );
}
