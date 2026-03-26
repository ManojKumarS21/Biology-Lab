'use client';

import React, { useState } from 'react';
import { useStore, STEPS } from '@/store';

export default function Burner() {
  const { currentStep, activeTool, experimentState, updateExperimentState } = useStore();
  const [isLit, setIsLit] = useState(false);

  const handleHeat = (e) => {
    e.stopPropagation();
    if (isLit && activeTool === 'burner' && currentStep === STEPS.HEAT_TIP && experimentState.hclAdded) {
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

      {/* Gas Valve (Golden Knob) */}
      <mesh position={[0, 0.06, 0.03]} rotation={[1.57, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.05]} />
        <meshStandardMaterial color="#FFD700" metalness={1} />
      </mesh>

      {/* Tiny Round Toggle Button */}
      <mesh 
        position={[0.05, 0.03, 0.05]} 
        onClick={(e) => { 
          e.stopPropagation(); 
          setIsLit(!isLit); 
        }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color={isLit ? "#4CAF50" : "#F44336"} roughness={0.5} />
      </mesh>

      {/* Flame - Conditionally Rendered */}
      {isLit && (
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
      )}
    </group>
  );
}
