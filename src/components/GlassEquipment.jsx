'use client';

import React from 'react';
import { useStore, STEPS } from '@/store';
import { Html } from '@react-three/drei';

export default function GlassEquipment({ type = 'beaker', label }) {
  const { currentStep, activeTool, experimentState, updateExperimentState } = useStore();
  const isBeaker = type === 'beaker';
  const isWatchGlass = type === 'watchGlass';
  const isSlide = type === 'slide';

  return (
    <group>
      {isBeaker && (
        <group>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 32, 1, true]} />
            <meshPhysicalMaterial 
              transparent 
              opacity={0.6} 
              transmission={1} 
              thickness={0.25} 
              roughness={0}
              clearcoat={1}
              clearcoatRoughness={0}
              color="#d1f2ff"
              ior={1.5}
              envMapIntensity={2}
            />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <circleGeometry args={[0.08, 32]} rotation={[-Math.PI / 2, 0, 0]} />
            <meshPhysicalMaterial transparent opacity={0.4} transmission={1} thickness={0.2} color="#b2ebf2" />
          </mesh>
          
          {/* Liquid */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.076, 0.076, 0.1, 32]} />
            <meshStandardMaterial 
              color={
                label?.includes('HCL') ? '#ef5350' : 
                label?.includes('Alcohol') ? '#00bcd4' :
                label?.includes('Stain') ? '#c2185b' :
                '#03a9f4'
              } 
              transparent 
              opacity={0.7} 
              roughness={0.1}
              metalness={0.1}
            />
          </mesh>

          {/* Identification Label Removed */}
        </group>
      )}

      {isWatchGlass && (
        <group>
          <mesh 
            castShadow rotation={[-Math.PI / 2, 0, 0]}
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
            <sphereGeometry args={[0.1, 32, 32, 0, Math.PI * 2, 0.1, 0.3]} />
            <meshPhysicalMaterial 
              transparent 
              opacity={0.4} 
              transmission={1} 
              thickness={0.1} 
              roughness={0.02}
              clearcoat={1}
              color="#b2ebf2"
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
            castShadow
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
              opacity={0.3} 
              transmission={1} 
              thickness={0.05} 
              roughness={0.02}
              clearcoat={1}
              color="#ffffff"
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
    </group>
  );
}
