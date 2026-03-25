import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

import useStore, { STEPS } from '../store';

const OnionPeel = ({ rotation, phiStart, phiLength, scale = 1, rootLength = 0 }) => {
  const points = React.useMemo(() => {
    const pts = [];
    const s = 0.5 * scale; // Reduced size for better realism
    pts.push(new THREE.Vector2(0, -0.15 * s));
    pts.push(new THREE.Vector2(0.08 * s, -0.15 * s));
    pts.push(new THREE.Vector2(0.18 * s, -0.12 * s));
    pts.push(new THREE.Vector2(0.24 * s, -0.05 * s));
    pts.push(new THREE.Vector2(0.26 * s, 0.05 * s));
    pts.push(new THREE.Vector2(0.22 * s, 0.15 * s));
    pts.push(new THREE.Vector2(0.12 * s, 0.25 * s));
    pts.push(new THREE.Vector2(0.04 * s, 0.35 * s));
    pts.push(new THREE.Vector2(0.02 * s, 0.45 * s));
    pts.push(new THREE.Vector2(0.015 * s, 0.5 * s));
    return pts;
  }, [scale]);

  return (
    <group rotation={[0, rotation, 0]} position={[0, 0.1, 0]}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[points, 16, phiStart, phiLength]} />
        <meshStandardMaterial color="#d81b60" roughness={0.3} metalness={0.1} emissive="#880e4f" emissiveIntensity={0.1} />
      </mesh>

      {/* Texture Lines (Veins) - Darker and more prominent per user request */}
      {[0.05, 0.15, 0.25, 0.35].map((phiOffset, i) => (
        <mesh key={i} rotation={[0, phiOffset, 0]}>
          <latheGeometry args={[points, 16, 0, 0.006]} />
          <meshBasicMaterial color="#000000" opacity={0.6} transparent />
        </mesh>
      ))}

      <mesh scale={1.01}>
        <latheGeometry args={[points, 16, phiStart, phiLength]} />
        <meshBasicMaterial color="#000000" side={THREE.BackSide} />
      </mesh>

      {/* Root Disk - Anatomical point where roots emerge */}
      <mesh position={[0, -0.15 * 0.5 * scale, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08 * 0.5 * scale, 16]} />
        <meshStandardMaterial color="#d7ccc8" roughness={1} />
      </mesh>
    </group>
  );
};

const RootTendril = ({ index }) => {
  const curve = React.useMemo(() => {
    const points = [];
    // 0.12 to 0.22 base length
    const length = 0.16 + (Math.sin(index * 7) * 0.06);

    // Top attached to bulb center base with realistic spread
    const angle = (index / 140) * Math.PI * 2;
    const radius = 0.01 + Math.random() * 0.06;
    points.push(new THREE.Vector3(Math.cos(angle) * (radius * 0.5), 0, Math.sin(angle) * (radius * 0.5)));

    // 6 points for extreme "hairy" tangle
    for (let j = 1; j <= 6; j++) {
      const p = j / 6;
      points.push(new THREE.Vector3(
        (Math.cos(angle + Math.sin(index * j) * 3) * radius * (0.8 + p * 1.5)) + (Math.random() - 0.5) * 0.06,
        -length * p,
        (Math.sin(angle + Math.cos(index * j) * 3) * radius * (0.8 + p * 1.5)) + (Math.random() - 0.5) * 0.06
      ));
    }

    return new THREE.CatmullRomCurve3(points);
  }, [index]);

  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 10, 0.001, 4, false]} />
      <meshStandardMaterial
        color={index % 2 === 0 ? "#fdf5ed" : "#f5f5dc"}
        roughness={1.0}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

const Onion = ({ position = [-0.35, 0.44, -0.2] }) => {
  const { currentStep, setStep, setStates, initialRootsGrown, beakerRootsGrown, heldTool, setHeldTool, onionInBeaker, onionPlacedOnTile, isCameraLocked, lockedInstruments, setMovable } = useStore();
  const isHeld = heldTool === 'onion';
  const isLocked = lockedInstruments['onion'] !== false; // Default to locked
  const [manualRotation, setManualRotation] = useState(0); // 0: vertical, 1: horizontal, 2: inverted
  const [rootScale, setRootScale] = useState(0.4);

  const targetPos = useRef(new THREE.Vector3(...position));
  const targetRot = useRef(new THREE.Euler(0, 0, 0));

  const { raycaster } = useThree();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.44); // Aligned with table height
  const meshRef = useRef();

  // Keyboard Listener for Rotation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isHeld && e.key.toLowerCase() === 'r') {
        setManualRotation((prev) => (prev + 1) % 4);
      }
      if (isHeld && e.key === 'Escape' && isCameraLocked && !isLocked) {
        setMovable('onion', false);
        setHeldTool(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHeld]);

  // Movement Animation Loop
  useFrame((state) => {
    if (isHeld && meshRef.current && !isLocked) {
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      if (intersection) {
        // Apply boundaries to onion too
        const x = Math.max(-1.8, Math.min(1.8, intersection.x));
        const z = Math.max(-0.8, Math.min(0.8, intersection.z));
        targetPos.current.set(x, 0.46, z);
        
        // Manual override rotation (0=V, 1=H, 2=VInv, 3=HInv)
        const rotX = (manualRotation % 2 === 1) ? Math.PI / 2 : 0;
        const rotZ = (manualRotation >= 2) ? Math.PI : 0;
        targetRot.current.set(rotX, 0, rotZ);
      }
    }

    // Smooth Interpolation
    if (meshRef.current) {
      meshRef.current.position.lerp(targetPos.current, 0.1);
      const targetQuat = new THREE.Quaternion().setFromEuler(targetRot.current);
      meshRef.current.quaternion.slerp(targetQuat, 0.15);
    }
  });

  // Step-based positioning targets
  useEffect(() => {
    if (!meshRef.current) return;
    const { setupPositions } = useStore.getState();
    const tilePos = setupPositions['tile'] || [-0.9, 0.44, 0];
    const beakerPos = setupPositions['beaker'] || [-0.6, 0.44, -0.2];

    if (currentStep === STEPS.ARRANGE) {
      targetPos.current.set(...position);
      targetRot.current.set(0, 0, 0);
    } else if (currentStep === STEPS.GROWTH_TILE && onionPlacedOnTile) {
      targetPos.current.set(tilePos[0], tilePos[1] + 0.15, tilePos[2]);
      targetRot.current.set(0, 0, Math.PI / 2); // Horizontal
    } else if (currentStep === STEPS.CUT_INITIAL) {
      targetPos.current.set(tilePos[0], tilePos[1] + 0.15, tilePos[2]);
      targetRot.current.set(0, 0, Math.PI / 2); // Horizontal for cutting
    } else if (currentStep === STEPS.GROWTH_BEAKER && onionInBeaker) {
      targetPos.current.set(beakerPos[0], beakerPos[1] + 0.12, beakerPos[2]);
      targetRot.current.set(0, 0, 0); // Upright in beaker
    } else if (currentStep === STEPS.CUT_FRESH) {
      targetPos.current.set(tilePos[0], tilePos[1] + 0.15, tilePos[2]);
      targetRot.current.set(0, 0, Math.PI / 2); // Horizontal
    }
  }, [currentStep, onionPlacedOnTile, onionInBeaker, position]);

  // Phase 1: Proceed to Cutting (Dry Roots)
  useEffect(() => {
    if (currentStep === STEPS.GROWTH_TILE && onionPlacedOnTile && !initialRootsGrown) {
      const timeout = setTimeout(() => {
        setStates({ initialRootsGrown: true });
        setStep(STEPS.CUT_INITIAL);
      }, 1000); // 1s wait for drop to tile
      return () => clearTimeout(timeout);
    }
  }, [currentStep, onionPlacedOnTile, initialRootsGrown]);


  // GROWTH PHASE 2: Slower Growth in Beaker (Step 4)
  useEffect(() => {
    if (currentStep === STEPS.GROWTH_BEAKER && onionInBeaker && !beakerRootsGrown) {
      let progress = 0.5; // Starts from cut state
      const interval = setInterval(() => {
        progress += 0.01;
        setRootScale(progress);
        if (progress >= 1.5) { // Grows longer than initial
          clearInterval(interval);
          setStates({ beakerRootsGrown: true });
          setStep(STEPS.CUT_FRESH);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentStep, onionInBeaker, beakerRootsGrown]);

  const handlePointerDown = (e) => {
    if (!isCameraLocked || isLocked) return; 
    e.stopPropagation();
    setHeldTool(isHeld ? null : 'onion');
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (!isCameraLocked) return;
    setMovable('onion', true);
    setHeldTool('onion');
    // For onion, heldTool is enough to trigger movement in useFrame
  };

  const handleContextMenu = (e) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    if (!isCameraLocked) return;
    setMovable('onion', false);
    setHeldTool(null);
  };

  const handleCut = (e) => {
    e.stopPropagation();
    if (heldTool === 'scalpel') {
      setStates({ isCutting: true });
      setTimeout(() => {
        setStates({ isCutting: false });
        if (currentStep === STEPS.CUT_INITIAL) {
          setStates({ rootTipsInWatchGlass: true });
          setStep(STEPS.GROWTH_BEAKER);
          setRootScale(0.1); // Roots removed
        } else if (currentStep === STEPS.CUT_FRESH) {
          // fresh tips cut, proceed to Step 6
          setStep(STEPS.TRANSFER_Vial);
          setRootScale(0.1);
        }
        setHeldTool(null);
      }, 600);
    }
  };

  return (
    <group
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Labels Removed per user request */}
      <group>
        {[...Array(8)].map((_, i) => (
          <OnionPeel
            key={i}
            rotation={(i * Math.PI) / 4}
            phiStart={0}
            phiLength={Math.PI / 4 + 0.05}
            scale={1 - (i % 2) * 0.005}
          />
        ))}

        {/* Green Stalks - Shorter and curved like photo */}
        <group position={[0, 0.35, 0]}>
          {[...Array(6)].map((_, i) => (
            <group key={`stalk-grp-${i}`} rotation={[0, (i * Math.PI * 2) / 6, 0]}>
              <group position={[Math.random() * 0.01, 0, 0]} rotation={[0.4 + Math.random() * 0.3, 0, (Math.random() - 0.5) * 0.2]}>
                <mesh position={[0, 0.1, 0]} castShadow>
                  <cylinderGeometry args={[0.003, 0.008, 0.25, 8]} />
                  <meshStandardMaterial color="#2e7d32" roughness={0.7} />
                </mesh>
                <mesh position={[0, 0.22, 0.03]} rotation={[0.5, 0, 0.1]} castShadow>
                  <cylinderGeometry args={[0.0001, 0.003, 0.15, 8]} />
                  <meshStandardMaterial color="#66bb6a" roughness={0.7} />
                </mesh>
              </group>
            </group>
          ))}
        </group>

        {/* Roots - Hyper-dense tangled fibrous mass */}
        <group position={[0, -0.06, 0]} scale={[1, rootScale, 1]}>
          {[...Array(140)].map((_, i) => (
            <RootTendril key={`root-${i}`} index={i} />
          ))}
        </group>
      </group>

      {/* Highlights for Growth Steps */}
      {((currentStep === STEPS.GROWTH_TILE && !onionPlacedOnTile) ||
        (currentStep === STEPS.GROWTH_BEAKER && !onionInBeaker)) && !isHeld && (
          <group position={[0, 0.05, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.18, 0.006, 16, 32]} />
              <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} />
            </mesh>
          </group>
        )}

      {/* Cutting Target */}
      {(currentStep === STEPS.CUT_INITIAL || currentStep === STEPS.CUT_FRESH) && (
        <group position={[0, -0.11, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.08, 0.005, 16, 32]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} />
          </mesh>
          <mesh
            onClick={handleCut}
            onPointerOver={() => (document.body.style.cursor = heldTool === 'scalpel' ? 'copy' : 'auto')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          >
            <cylinderGeometry args={[0.08, 0.08, 0.1, 8]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default Onion;

