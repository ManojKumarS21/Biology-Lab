'use client';

import React from 'react';
import * as THREE from 'three';
import { useStore, STEPS } from '@/store';

export default function Microscope() {
  const { toggleMicroscopeView, currentStep } = useStore();

  const handleClick = (e) => {
    e.stopPropagation();
    if (currentStep === STEPS.OBSERVE) {
      toggleMicroscopeView(true);
    }
  };

  const bodyColor = "#fdf5e6"; // Cream/off-white base
  const accentBlue = "#0055ff";
  const blackPlastic = "#1a1a1a";
  const metal = "#888888";

  return (
    <group scale={1.8} onClick={handleClick} position={[0, -0.015, 0]}>
      {/* ========================================================= */}
      {/* 1. BASE AND ILLUMINATION */}
      {/* ========================================================= */}
      <group position={[0, 0.03, 0]}>
        {/* Main Base Plate */}
        <mesh castShadow position={[0, -0.01, 0.02]}>
           <boxGeometry args={[0.2, 0.04, 0.28]} />
           <meshStandardMaterial color={bodyColor} roughness={0.3} />
        </mesh>
        {/* Flared Legs (V-shape) */}
        <mesh castShadow position={[-0.08, -0.01, 0.05]} rotation={[0, 0.3, 0]}>
           <boxGeometry args={[0.08, 0.04, 0.25]} />
           <meshStandardMaterial color={bodyColor} roughness={0.3} />
        </mesh>
        <mesh castShadow position={[0.08, -0.01, 0.05]} rotation={[0, -0.3, 0]}>
           <boxGeometry args={[0.08, 0.04, 0.25]} />
           <meshStandardMaterial color={bodyColor} roughness={0.3} />
        </mesh>

        {/* Blue Accents on Base */}
        <mesh position={[-0.11, -0.005, 0.05]} rotation={[0, 0.3, 0.1]}>
          <boxGeometry args={[0.01, 0.03, 0.15]} />
          <meshStandardMaterial color={accentBlue} roughness={0.4} />
        </mesh>
        <mesh position={[0.11, -0.005, 0.05]} rotation={[0, -0.3, -0.1]}>
          <boxGeometry args={[0.01, 0.03, 0.15]} />
          <meshStandardMaterial color={accentBlue} roughness={0.4} />
        </mesh>

        {/* Light Source (Bottom Illuminator) */}
        <mesh position={[0, 0.015, 0.1]}>
          <cylinderGeometry args={[0.04, 0.045, 0.015, 32]} />
          <meshStandardMaterial color={blackPlastic} />
        </mesh>
        <mesh position={[0, 0.025, 0.1]}>
          <cylinderGeometry args={[0.035, 0.035, 0.005, 32]} />
          <meshPhysicalMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} transparent opacity={0.6} roughness={0} clearcoat={1} transmission={0} />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 2. ARM AND FOCUS KNOBS */}
      {/* ========================================================= */}
      <group position={[0, 0.15, -0.08]}>
        {/* Lower Pillar */}
        <mesh castShadow position={[0, -0.02, 0]} rotation={[0.05, 0, 0]}>
          <boxGeometry args={[0.08, 0.18, 0.1]} />
          <meshStandardMaterial color={bodyColor} roughness={0.3} />
        </mesh>
        
        {/* Connecting Curved Corner */}
        <mesh castShadow position={[0, 0.08, 0.01]} rotation={[0.2, 0, 0]}>
           <boxGeometry args={[0.08, 0.06, 0.09]} />
           <meshStandardMaterial color={bodyColor} roughness={0.3} />
        </mesh>

        {/* Upper Arm arching forward */}
        <mesh castShadow position={[0, 0.16, 0.06]} rotation={[0.5, 0, 0]}>
          <boxGeometry args={[0.08, 0.15, 0.08]} />
          <meshStandardMaterial color={bodyColor} roughness={0.3} />
        </mesh>

        {/* Focus Knobs Assembly */}
        <group position={[0, 0, -0.02]}>
          {/* Knob mounts */}
          <mesh position={[0, 0, 0]}>
             <cylinderGeometry args={[0.015, 0.015, 0.14]} rotation={[0, 0, Math.PI/2]} />
             <meshStandardMaterial color={blackPlastic} />
          </mesh>
          {/* Blue Coarse Knobs */}
          <mesh position={[-0.07, 0, 0]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 32]} />
            <meshStandardMaterial color={accentBlue} roughness={0.7} />
          </mesh>
          <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 32]} />
            <meshStandardMaterial color={accentBlue} roughness={0.7} />
          </mesh>
          {/* Black Fine Knobs */}
          <mesh position={[-0.095, 0, 0]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 32]} />
            <meshStandardMaterial color={blackPlastic} roughness={0.6} />
          </mesh>
          <mesh position={[0.095, 0, 0]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 32]} />
            <meshStandardMaterial color={blackPlastic} roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ========================================================= */}
      {/* 3. STAGE AND CONDENSER */}
      {/* ========================================================= */}
      <group position={[0, 0.18, 0.08]}>
        {/* Stage Mount Bracket */}
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[0.07, 0.05, 0.08]} />
          <meshStandardMaterial color={blackPlastic} />
        </mesh>
        
        {/* Main Stage */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.015, 0.18]} />
          <meshStandardMaterial color={blackPlastic} roughness={0.4} />
        </mesh>
        
        {/* Slide Clip (Silver) */}
        <mesh position={[-0.05, 0.012, 0.02]} rotation={[0, 0.3, 0]}>
           <boxGeometry args={[0.1, 0.005, 0.02]} />
           <meshStandardMaterial color={metal} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.012, -0.06]}>
           <boxGeometry args={[0.12, 0.005, 0.02]} />
           <meshStandardMaterial color={metal} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Mechanical Stage Controls (Knobs hanging down right) */}
        <group position={[0.09, -0.05, -0.06]}>
           <mesh>
             <cylinderGeometry args={[0.012, 0.012, 0.08, 16]} />
             <meshStandardMaterial color={blackPlastic} />
           </mesh>
           <mesh position={[0, -0.04, 0]}>
             <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} />
             <meshStandardMaterial color={blackPlastic} />
           </mesh>
        </group>

        {/* Condenser Assembly Under Stage */}
        <group position={[0, -0.03, 0]}>
           <mesh>
             <cylinderGeometry args={[0.03, 0.025, 0.04, 32]} />
             <meshStandardMaterial color={blackPlastic} />
           </mesh>
           <mesh position={[0, 0.02, 0]}>
             <cylinderGeometry args={[0.015, 0.015, 0.005, 32]} />
             <meshPhysicalMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} transparent opacity={0.6} roughness={0} />
           </mesh>
        </group>
      </group>

      {/* ========================================================= */}
      {/* 4. HEAD, NOSEPIECE , AND LENSES */}
      {/* ========================================================= */}
      <group position={[0, 0.38, 0.05]}>
        {/* Turret/Nosepiece Mount */}
        <mesh position={[0, -0.03, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.1]} />
          <meshStandardMaterial color={bodyColor} roughness={0.3} />
        </mesh>

        {/* Rotating Nosepiece */}
        <mesh position={[0, -0.055, 0.02]} rotation={[0.1, 0, 0]}>
           <cylinderGeometry args={[0.06, 0.055, 0.015, 32]} />
           <meshStandardMaterial color={metal} metalness={0.8} roughness={0.4} />
        </mesh>
        
        {/* Objective 1: Main Active (Down) */}
        <group position={[0, -0.11, 0.03]}>
          <mesh>
             <cylinderGeometry args={[0.015, 0.01, 0.05, 16]} />
             <meshStandardMaterial color={blackPlastic} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.01, 0]}>
             <cylinderGeometry args={[0.015, 0.015, 0.005, 16]} />
             <meshStandardMaterial color="#0066cc" /> {/* Blue Ring */}
          </mesh>
          <mesh position={[0, -0.025, 0]}>
             <cylinderGeometry args={[0.011, 0.008, 0.01, 16]} />
             <meshStandardMaterial color={metal} metalness={0.8} roughness={0.4} />
          </mesh>
        </group>

        {/* Objective 2: Angled Back Left */}
        <group position={[-0.04, -0.09, -0.01]} rotation={[-0.4, 0, -0.4]}>
          <mesh>
             <cylinderGeometry args={[0.012, 0.008, 0.04, 16]} />
             <meshStandardMaterial color={blackPlastic} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.005, 0]}>
             <cylinderGeometry args={[0.0125, 0.0125, 0.005, 16]} />
             <meshStandardMaterial color="#ffcc00" /> {/* Yellow Ring */}
          </mesh>
          <mesh position={[0, -0.02, 0]}>
             <cylinderGeometry args={[0.009, 0.006, 0.01, 16]} />
             <meshStandardMaterial color={metal} metalness={0.8} roughness={0.4} />
          </mesh>
        </group>

        {/* Objective 3: Angled Back Right */}
        <group position={[0.04, -0.09, -0.01]} rotation={[-0.4, 0, 0.4]}>
          <mesh>
             <cylinderGeometry args={[0.012, 0.008, 0.035, 16]} />
             <meshStandardMaterial color={blackPlastic} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.002, 0]}>
             <cylinderGeometry args={[0.0125, 0.0125, 0.005, 16]} />
             <meshStandardMaterial color="#cc0000" /> {/* Red Ring */}
          </mesh>
          <mesh position={[0, -0.017, 0]}>
             <cylinderGeometry args={[0.009, 0.006, 0.01, 16]} />
             <meshStandardMaterial color={metal} metalness={0.8} roughness={0.4} />
          </mesh>
        </group>

        {/* Main Head Prism Housing */}
        <mesh position={[0, 0.02, -0.02]} rotation={[-0.3, 0, 0]}>
           <boxGeometry args={[0.13, 0.12, 0.14]} />
           <meshStandardMaterial color={blackPlastic} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.07, 0.01]} rotation={[-0.3, 0, 0]}>
           <boxGeometry args={[0.11, 0.02, 0.08]} />
           <meshStandardMaterial color={blackPlastic} roughness={0.4} />
        </mesh>

        {/* Binocular Eyepieces */}
        {/* Left Eyepiece */}
        <group position={[-0.035, 0.12, 0.03]} rotation={[-0.6, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.018, 0.12, 32]} />
            <meshStandardMaterial color={blackPlastic} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.019, 0.019, 0.02, 32]} />
            <meshStandardMaterial color={blackPlastic} roughness={0.8} /> {/* Textured Grips */}
          </mesh>
          {/* Glass Lens */}
          <mesh position={[0, 0.061, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.002, 16]} />
            <meshPhysicalMaterial transparent opacity={0.6} roughness={0} clearcoat={1} color="#abcdef" />
          </mesh>
        </group>
        
        {/* Right Eyepiece */}
        <group position={[0.035, 0.12, 0.03]} rotation={[-0.6, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.018, 0.12, 32]} />
            <meshStandardMaterial color={blackPlastic} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.019, 0.019, 0.02, 32]} />
            <meshStandardMaterial color={blackPlastic} roughness={0.8} />
          </mesh>
          {/* Glass Lens */}
          <mesh position={[0, 0.061, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.002, 16]} />
            <meshPhysicalMaterial transparent opacity={0.6} roughness={0} clearcoat={1} color="#abcdef" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
