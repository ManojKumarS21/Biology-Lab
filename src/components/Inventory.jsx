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
  { 
    id: 'forceps', 
    name: 'Forceps', 
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <path d="M40 10 L42 90 Q42 95 45 95 L55 95 Q58 95 58 90 L60 10 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
        <path d="M48 20 L48 80 M52 20 L52 80" stroke="#475569" strokeWidth="0.5" strokeDasharray="1,2" />
      </svg>
    )
  },
  { id: 'dropper', name: 'Dropper', icon: <img src="/dropper.png" alt="Dropper" className="w-8 h-8 object-contain" /> },
  { id: 'beaker_water', name: 'Beaker (Water)', icon: <img src="/beaker_water.png" alt="Beaker Water" className="w-8 h-8 object-contain" /> },
  { id: 'beaker_hcl', name: 'Beaker (N/10 HCL)', icon: <img src="/beaker_hcl.png" alt="Beaker HCL" className="w-8 h-8 object-contain" /> },
  { 
    id: 'beaker_alcohol', 
    name: 'Aceto Alcohol', 
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <path d="M35 30 L35 15 Q35 10 40 10 L60 10 Q65 10 65 15 L65 30 L75 40 Q80 45 80 55 L80 85 Q80 95 70 95 L30 95 Q20 95 20 85 L20 55 Q20 45 25 40 Z" fill="#451a03" stroke="#78350f" strokeWidth="2" />
        <rect x="35" y="55" width="30" height="20" fill="#f8fafc" rx="2" />
        <text x="50" y="68" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">ALC</text>
        <rect x="32" y="10" width="36" height="6" fill="#1e293b" rx="2" />
      </svg>
    )
  },
  { 
    id: 'coverslip_box', 
    name: 'Cover Slip Box', 
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <rect x="15" y="25" width="70" height="60" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" rx="4" />
        <path d="M15 45 L85 45" stroke="#64748b" strokeWidth="2" />
        <rect x="25" y="30" width="50" height="10" fill="#1e293b" rx="1" />
        <text x="50" y="38" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#f8fafc">COVER GLASS</text>
        <path d="M20 55 L80 55 M20 65 L80 65 M20 75 L80 75" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
      </svg>
    )
  },
  { 
    id: 'watch_glass', 
    name: 'Watch Glass', 
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <circle cx="50" cy="50" r="40" fill="rgba(203, 213, 225, 0.2)" stroke="#94a3b8" strokeWidth="1" />
        <path d="M20 50 Q50 90 80 50" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        <circle cx="45" cy="45" r="2" fill="white" opacity="0.4" />
      </svg>
    )
  },
  { 
    id: 'slide', 
    name: 'Glass Slide', 
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <rect x="10" y="35" width="80" height="30" fill="rgba(203, 213, 225, 0.2)" stroke="#94a3b8" strokeWidth="1" />
        <path d="M15 35 L85 35" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      </svg>
    )
  },
  { 
    id: 'coverslip', 
    name: 'Cover Slip', 
    icon: (
      <svg viewBox="0 0 100 100" className="w-6 h-6">
        <rect x="30" y="30" width="40" height="40" fill="rgba(203, 213, 225, 0.2)" stroke="#94a3b8" strokeWidth="1" />
      </svg>
    )
  },
  { 
    id: 'filter_paper', 
    name: 'Filter Paper', 
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <circle cx="50" cy="50" r="40" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <path d="M50 10 L50 90 M10 50 L90 50" stroke="#f1f5f9" strokeWidth="0.5" />
      </svg>
    )
  },
  { 
    id: 'scalpel', 
    name: 'Scalpel', 
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <path d="M20 80 L80 20 L85 30 L25 90 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
        <path d="M80 20 L95 5 L90 15 Z" fill="#e2e8f0" />
      </svg>
    )
  },
  { 
    id: 'microscope', 
    name: 'Microscope', 
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <path d="M30 85 L70 85 M50 85 L50 50 Q50 30 70 30 L70 20 L40 20 L40 40 Q40 60 20 60" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        <rect x="35" y="15" width="10" height="15" fill="#334155" rx="1" />
        <circle cx="50" cy="60" r="8" fill="#475569" />
      </svg>
    )
  },
  { 
    id: 'burner', 
    name: 'Burner', 
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <path d="M30 90 Q50 80 70 90 L80 95 L20 95 Z" fill="#94a3b8" />
        <rect x="45" y="70" width="10" height="20" fill="#475569" />
        <path d="M50 40 Q60 55 50 70 Q40 55 50 40" fill="#f97316" />
        <path d="M50 50 Q55 60 50 70 Q45 60 50 50" fill="#fbbf24" opacity="0.8" />
      </svg>
    )
  },
  { 
    id: 'test_tube', 
    name: 'Test Tube', 
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <path d="M40 10 L40 85 Q40 95 50 95 Q60 95 60 85 L60 10" fill="none" stroke="#94a3b8" strokeWidth="4" />
        <rect x="42" y="50" width="16" height="35" fill="rgba(64, 196, 255, 0.6)" rx="5" />
      </svg>
    )
  },
  { 
    id: 'stain', 
    name: 'Acetocarmine Stain', 
    icon: (
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <path d="M40 20 L40 10 Q40 5 50 5 Q60 5 60 10 L60 20 L70 30 Q80 40 80 50 L80 85 Q80 95 70 95 L30 95 Q20 95 20 85 L20 50 Q20 40 30 30 Z" fill="#9d174d" stroke="#831843" strokeWidth="2" />
        <rect x="35" y="55" width="30" height="20" fill="#fdf2f8" rx="2" />
        <text x="50" y="68" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#831843">STN</text>
      </svg>
    )
  },
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
