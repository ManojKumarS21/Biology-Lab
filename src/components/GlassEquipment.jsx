'use client';

import React, { useRef, useMemo } from 'react';
import { useStore, STEPS } from '@/store';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const HclFumes = () => {
  const group = useRef();
  
  const particles = useMemo(() => 
    Array.from({ length: 15 }, () => ({
      speed: 0.05 + Math.random() * 0.08,
      baseScale: 0.5 + Math.random() * 0.5,
    }))
  , []);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.children.forEach((mesh, i) => {
      const p = particles[i];
      let y = mesh.position.y + p.speed * delta;
      
      // Reset particle if it goes too high or at start
      if (y > 0.15 || y === 0) { 
        y = 0.01; // start slightly above 0 to avoid glitching
        mesh.position.x = (Math.random() - 0.5) * 0.06;
        mesh.position.z = (Math.random() - 0.5) * 0.06;
      }
      mesh.position.y = y;
      
      // Expand as it rises (vapor dispersing)
      const scaleGrow = 1 + (y * 12);
      mesh.scale.setScalar(p.baseScale * scaleGrow);
      
      // Fade out as it rises
      mesh.material.opacity = Math.max(0, 0.4 - (y * 2.5));
    });
  });

  return (
    <group ref={group} position={[0, 0.1, 0]}>
      {particles.map((_, i) => (
        <mesh key={i} position={[0, Math.random() * 0.15, 0]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};


export default function GlassEquipment({ type = 'beaker', label }) {
  const { currentStep, activeTool, experimentState, updateExperimentState } = useStore();
  const isBeaker = type === 'beaker';
  const isWatchGlass = type === 'watchGlass';
  const isSlide = type === 'slide';
  const isTestTube = type === 'testTube';
  const isFilterPaper = type === 'filterPaper';
  const isCoverSlip = type === 'coverslip';

  return (
    <group scale={[1.5, 1.5, 1.5]}>
      {isBeaker && (
        <group position={[0, 0, 0]}> {/* Bottom of beaker at 0 */}
          <group position={[0, 0, 0]}>
            <mesh castShadow position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.2, 32, 1, true]} />
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
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.08, 32]} />
              <meshStandardMaterial transparent opacity={0.2} color="#ffffff" roughness={0} />
            </mesh>
            {/* Liquid */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.078, 0.078, 0.1, 32]} />
              <meshStandardMaterial 
                color={label?.includes('HCL') ? '#fdf5e6' : label?.includes('Stain') || label?.includes('Acetocarmine') || label?.includes('Aceto') || label?.includes('Alcohol') ? '#8a2b1a' : '#1e90ff'} 
                emissive={label?.includes('Stain') || label?.includes('Acetocarmine') || label?.includes('Aceto') || label?.includes('Alcohol') ? '#4a1105' : label?.includes('HCL') ? '#050505' : '#002255'}
                emissiveIntensity={0.2} 
                transparent 
                opacity={label?.includes('Stain') || label?.includes('Acetocarmine') || label?.includes('Aceto') || label?.includes('Alcohol') ? 0.95 : 0.6} 
                roughness={0}
              />
            </mesh>
            
            {/* HCL Smoke Effect */}
            {label?.includes('HCL') && <HclFumes />}
          </group>
        </group>
      )}


      {isWatchGlass && (
        <group>
          <mesh 
            castShadow position={[0, 0.003, 0]}
            onClick={(e) => {
              e.stopPropagation();
              if (activeTool === 'forceps' && currentStep === STEPS.PLACE_IN_WATCH_GLASS) {
                updateExperimentState('tipInWatchGlass', true);
              }
              if (activeTool === 'dropper' && currentStep === STEPS.ADD_HCL) {
                updateExperimentState('hclAdded', true);
              }
            }}
          >
            {/* Flat glass plate instead of curved watch glass */}
            <cylinderGeometry args={[0.12, 0.12, 0.005, 32]} />
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
          {/* Label Removed */}
          {experimentState.tipInWatchGlass && (
            <mesh position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.04]} />
              <meshStandardMaterial color={experimentState.hclAdded ? '#ffcdd2' : '#ffffff'} />
            </mesh>
          )}
        </group>
      )}

      {isSlide && (
        <group>
          <mesh 
            castShadow position={[0, 0.003, 0]}
            onClick={(e) => {
              e.stopPropagation();
              if (activeTool === 'forceps' && currentStep === STEPS.TRANSFER_TO_SLIDE) {
                updateExperimentState('tipOnSlide', true);
              }
              if (activeTool === 'dropper' && currentStep === STEPS.ADD_STAIN) {
                updateExperimentState('stainAdded', true);
              }
              if (activeTool === 'needle' && currentStep === STEPS.SQUASH_PREPARATION) {
                updateExperimentState('tipSquashed', true);
              }
            }}
          >
            <boxGeometry args={[0.3, 0.005, 0.1]} />
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
          {/* Label Removed */}
          {experimentState.tipOnSlide && (
            <group position={[0, 0.01, 0]}>
              <mesh>
                <cylinderGeometry args={[0.01, 0.01, 0.04]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color={experimentState.stainAdded ? '#d81b60' : '#ffffff'} />
              </mesh>
              {experimentState.stainAdded && (
                <mesh position={[0, -0.005, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.002]} />
                  <meshStandardMaterial color="#d81b60" transparent opacity={0.6} />
                </mesh>
              )}
            </group>
          )}
        </group>
      )}
      {isTestTube && (
        <group scale={[0.6, 1.2, 0.6]}> {/* Thinner and taller */}
          <mesh castShadow position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 32, 1, true]} />
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
          {/* Rounded bottom */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.05, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            <meshPhysicalMaterial transparent opacity={0.4} roughness={0.05} metalness={0.1} color="#888888" clearcoat={1} />
          </mesh>
          {/* Liquid in Test Tube */}
          {/* Liquid removed to make the test tube perfectly empty as requested */}
        </group>
      )}
      {isFilterPaper && (
        <group rotation={[-Math.PI / 2, 0, 0]} scale={[0.6, 0.6, 0.6]} position={[0, 0.002, 0]}>
          <mesh castShadow>
            <circleGeometry args={[0.15, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
        </group>
      )}

      {isCoverSlip && (
        <mesh castShadow position={[0, 0.001, 0]}>
          <boxGeometry args={[0.08, 0.002, 0.08]} />
          <meshStandardMaterial 
            transparent 
            //transparent 
            opacity={0.4} 
            roughness={0.05} 
            metalness={0.1}
            color="#888888" 
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      )}
    </group>
  );
}
