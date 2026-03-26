'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '@/store';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const TABLE_BOUNDS = { x: 1.8, z: 0.8 };
const TABLE_Y = 0.44;

export default function Instrument({ id, children, initialPosition = [0, 0, 0] }) {
  const meshRef = useRef();
  const { activeTool, setActiveTool, lockedInstruments, setMovable, isCameraLocked } = useStore();
  const { raycaster, camera, mouse } = useThree();
  const [hovered, setHovered] = useState(false);

  // isStoreLocked from store (external lock state)
  const isStoreLocked = lockedInstruments[id] !== false;

  // isDragging: true while pointer is held down
  const [isDragging, setIsDragging] = useState(false);

  // isMovable: local state to track if we are in "moving mode"
  // Initialize from store state so newly placed items are movable
  const [isMovable, setIsMovable] = useState(!isStoreLocked);
  
  const [position, setPosition] = useState(new THREE.Vector3(...initialPosition));

  const isActive = activeTool === id;

  // Item can be interacted with only if camera is locked
  const canInteract = isCameraLocked;

  // Item is currently movable (can be dragged) only if canInteract AND store says unlocked AND local isMovable
  const canMove = canInteract && !isStoreLocked && isMovable;

  // ── Sync store lock state → local movable state ──────────────────────────
  useEffect(() => {
    // When store marks instrument as locked, also clear local movable
    // When store marks as unlocked (e.g. initial placement), allow local move
    setIsMovable(!isStoreLocked);
    if (isStoreLocked) {
      setIsDragging(false);
    }
  }, [isStoreLocked]);

  // ── Lock / stop movement helper ───────────────────────────────────────────
  const lockInPlace = useCallback(() => {
    setMovable(id, false);   // update store
    setIsMovable(false);     // update local
    setIsDragging(false);
    setActiveTool(null);
  }, [id, setMovable, setActiveTool]);

  // ── Unlock / start movement helper ────────────────────────────────────────
  const unlockAndMove = useCallback(() => {
    setMovable(id, true);
    setIsMovable(true);
    setActiveTool(id);
  }, [id, setMovable, setActiveTool]);

  // ── Pointer down: start drag only if item is already movable ─────────────
  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (!canInteract) return;

    if (isMovable) {
      // Already unlocked — start dragging immediately
      setIsDragging(true);
    }
    // If locked (isMovable===false), a single pointerDown does nothing.
    // User must double-click to unlock first (see handleDoubleClick).
  };

  // ── Pointer up: stop drag, but keep item movable (pick-and-place) ─────────
  const handlePointerUp = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    // Item stays movable until right-click or Escape
  };

  // ── Double-click: unlock a locked item so it can be moved again ───────────
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (!canInteract) return;
    unlockAndMove();
    setIsDragging(true); // start dragging immediately
  };

  // ── Right-click: LOCK the item in place ───────────────────────────────────
  const handleContextMenu = (e) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    if (!isCameraLocked) return;
    lockInPlace();
  };

  // ── Click: select/deselect for experiment interaction (only when locked) ──
  const handleClick = (e) => {
    e.stopPropagation();
    if (!isCameraLocked) return;
    // Only allow selection when item is locked in place (not mid-move)
    if (!isMovable) {
      setActiveTool(isActive ? null : id);
    }
  };

  // ── Escape key: lock item in place ────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (isDragging || isMovable)) {
        lockInPlace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDragging, isMovable, lockInPlace]);

  // ── Frame loop: move when dragging OR when active (if movable) ────────────
  useFrame(() => {
    if (!canMove || (!isDragging && !isActive)) return;

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -TABLE_Y);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);

    if (intersection) {
      const x = Math.max(-TABLE_BOUNDS.x, Math.min(TABLE_BOUNDS.x, intersection.x));
      const z = Math.max(-TABLE_BOUNDS.z, Math.min(TABLE_BOUNDS.z, intersection.z));
      setPosition(new THREE.Vector3(x, 0.44, z));
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onContextMenu={handleContextMenu}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Invisible Hit Area for easier interaction with small tools like forceps/needles */}
      <mesh visible={false}>
        <boxGeometry args={[0.3, 0.4, 0.3]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {children}

      {/* Ring indicator: subtle guide for interaction */}
      {(hovered || isDragging) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <ringGeometry args={[0.08, 0.09, 32]} />
          <meshBasicMaterial
            color={isDragging ? '#6366f1' : isMovable ? '#ffffff' : '#475569'}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}
