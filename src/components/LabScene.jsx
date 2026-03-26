'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import Table from './Table';
import Onion from './Onion';
import Microscope from './Microscope';
import Burner from './Burner';
import GlassEquipment from './GlassEquipment';
import SmallTools from './SmallTools';
import Instrument from './Instrument';
import { useStore } from '@/store';

const INSTRUMENT_COMPONENTS = {
  onion: { Component: Onion, position: [-0.8, 0.44, 0] },
  microscope: { Component: Microscope, position: [0.8, 0.44, 0] },
  burner: { Component: Burner, position: [0, 0.44, -0.4] },
  beaker_water: { Component: (props) => <GlassEquipment type="beaker" label="Water" {...props} />, position: [-0.4, 0.44, 0.2] },
  beaker_hcl: { Component: (props) => <GlassEquipment type="beaker" label="N/10 HCL" {...props} />, position: [0.4, 0.44, 0.2] },
  beaker_alcohol: { Component: (props) => <GlassEquipment type="beaker" label="Aceto Alcohol" {...props} />, position: [0.8, 0.44, 0.2] },
  stain: { Component: (props) => <GlassEquipment type="beaker" label="Acetocarmine Stain" {...props} />, position: [1.2, 0.44, 0.2] },
  watch_glass: { Component: (props) => <GlassEquipment type="watchGlass" {...props} />, position: [0, 0.44, 0.3] },
  slide: { Component: (props) => <GlassEquipment type="slide" {...props} />, position: [0.4, 0.44, -0.2] },
  needle: { Component: () => <SmallTools type="needle" />, position: [-0.6, 0.44, 0.5] },
  forceps: { Component: () => <SmallTools type="forceps" />, position: [-0.4, 0.44, 0.5] },
  scalpel: { Component: () => <SmallTools type="blade" />, position: [-0.2, 0.44, 0.5] },
  dropper: { Component: () => <SmallTools type="dropper" />, position: [0.2, 0.44, 0.5] },
  test_tube: { Component: (props) => <GlassEquipment type="testTube" {...props} />, position: [0.6, 0.44, 0.4] },
  filter_paper: { Component: (props) => <GlassEquipment type="filterPaper" {...props} />, position: [-1.0, 0.44, -0.4] },
  coverslip: { Component: (props) => <GlassEquipment type="coverslip" {...props} />, position: [0.6, 0.44, -0.4] },
};

export default function LabScene() {
  const { placedInstruments, placeInstrument, isCameraLocked } = useStore();

  const handleDrop = (e) => {
    e.preventDefault();
    const instrumentId = e.dataTransfer.getData('instrumentId');
    if (instrumentId) {
      placeInstrument(instrumentId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  return (
    <div 
      className="w-full h-full bg-slate-950"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 2.5, 4]} fov={40} />
        <OrbitControls 
          enabled={!isCameraLocked}
          makeDefault 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.1} 
          enablePan={false}
          minDistance={2}
          maxDistance={6}
          target={[0, 0.44, 0]}
        />

        <Suspense fallback={null}>
          <Environment preset="city" />
          
          <ambientLight intensity={0.4} />
          <spotLight 
            position={[5, 8, 5]} 
            angle={0.25} 
            penumbra={1} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
          />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          <pointLight position={[0, 1.5, 2]} intensity={1} color="#ffffff" />

          <Table />
          
          {/* Dynamic Instruments on Table */}
          {placedInstruments.map((id) => {
            const config = INSTRUMENT_COMPONENTS[id];
            if (!config) return null;
            const { Component, position } = config;
            
            // Onion has its own complex multi-step movement logic
            if (id === 'onion') return <Onion key={id} position={position} />;

            return (
              <Instrument key={id} id={id} initialPosition={position}>
                <Component position={[0, 0, 0]} />
              </Instrument>
            );
          })}

          {/* Environmental Floor & Shadows */}
          <ContactShadows 
            position={[0, 0, 0]} 
            opacity={0.4} 
            scale={15} 
            blur={2} 
            far={1} 
            color="#000000" 
          />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#050505" />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}
