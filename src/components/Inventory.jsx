'use client';

import React from 'react';
import { useStore } from '@/store';
import { 
  Beaker, 
  Droplet, 
  Scissors, 
  Pipette, 
  Thermometer, 
  Microscope, 
  Flame, 
  Box, 
  Grid 
} from 'lucide-react';

const INSTRUMENTS = [
  { id: 'onion', name: 'Onion Root', icon: <img src="/onion.png" alt="Onion" className="w-8 h-8 object-contain" /> },
  { id: 'needle', name: 'Needle', icon: <img src="/needle.png" alt="Needle" className="w-8 h-8 object-contain" /> },
  { id: 'forceps', name: 'Forceps', icon: <img src="/forceps.png" alt="Forceps" className="w-8 h-8 object-contain" /> },
  { id: 'dropper', name: 'Dropper', icon: <img src="/dropper.png" alt="Dropper" className="w-8 h-8 object-contain" /> },
  { id: 'beaker_water', name: 'Beaker (Water)', icon: <img src="/beaker_water.png" alt="Beaker Water" className="w-8 h-8 object-contain" /> },
  { id: 'beaker_hcl', name: 'Beaker (N/10 HCL)', icon: <img src="/beaker_hcl.png" alt="Beaker HCL" className="w-8 h-8 object-contain" /> },
  { id: 'beaker_alcohol', name: 'Aceto Alcohol', icon: <Beaker className="w-6 h-6 text-cyan-400" /> },
  { id: 'coverslip_box', name: 'Cover Slip Box', icon: <Box className="w-6 h-6 text-blue-200" /> },
  { id: 'watch_glass', name: 'Watch Glass', icon: <Grid className="w-6 h-6 text-slate-300" /> },
  { id: 'slide', name: 'Glass Slide', icon: <Grid className="w-6 h-6 text-indigo-200" /> },
  { id: 'coverslip', name: 'Cover Slip', icon: <Grid className="w-6 h-6 scale-50 text-indigo-100" /> },
  { id: 'filter_paper', name: 'Filter Paper', icon: <Grid className="w-6 h-6 text-white bg-slate-100" /> },
  { id: 'scalpel', name: 'Scalpel', icon: <Scissors className="w-6 h-6 text-slate-400" /> },
  { id: 'microscope', name: 'Microscope', icon: <Microscope className="w-6 h-6 text-slate-800" /> },
  { id: 'burner', name: 'Burner', icon: <Flame className="w-6 h-6 text-orange-500" /> },
  { id: 'stain', name: 'Acetocarmine Stain', icon: <Droplet className="w-6 h-6 text-pink-600" /> },
];

export default function Inventory() {
  const { activeTool, setActiveTool, placeInstrument, placedInstruments } = useStore();

  const handleDragStart = (e, instrumentId) => {
    e.dataTransfer.setData('instrumentId', instrumentId);
  };

  return (
    <div className="absolute top-0 left-0 h-full w-72 bg-slate-900/90 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col gap-6 z-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white uppercase tracking-wider">Instruments</h2>
        <p className="text-slate-400 text-xs font-medium">Drag items to the lab table</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          {INSTRUMENTS.map((inst) => {
            const isPlaced = placedInstruments.includes(inst.id);
            const isActive = activeTool === inst.id;

            return (
              <button
                key={inst.id}
                draggable={!isPlaced}
                onDragStart={(e) => handleDragStart(e, inst.id)}
                onClick={() => isPlaced && setActiveTool(inst.id)}
                className={`
                  flex flex-col items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-300
                  group relative overflow-hidden border
                  ${isActive ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 
                    isPlaced ? 'bg-emerald-500/10 border-emerald-500/30' : 
                    'bg-slate-800/50 border-white/5 hover:border-white/20 hover:bg-slate-800'}
                `}
              >
                <div className={`
                  p-3 rounded-xl transition-all duration-300
                  ${isActive ? 'bg-indigo-500 text-white' : 
                    isPlaced ? 'bg-emerald-500 text-white' : 
                    'bg-slate-700/50 text-slate-300 group-hover:text-white'}
                `}>
                  {inst.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tighter text-center leading-tight
                  ${isActive ? 'text-indigo-300' : isPlaced ? 'text-emerald-300' : 'text-slate-400 group-hover:text-slate-200'}
                `}>
                  {inst.name}
                </span>

                {isPlaced && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20">
        <p className="text-[10px] text-indigo-300 font-bold uppercase mb-1">Current Action</p>
        <p className="text-sm text-white font-medium">
          {activeTool ? `Using ${activeTool.replace('_', ' ')}` : 'No tool selected'}
        </p>
      </div>
    </div>
  );
}
