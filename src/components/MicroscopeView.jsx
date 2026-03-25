'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { X, Search, ZoomIn, ZoomOut, Save } from 'lucide-react';

const MITOSIS_STAGES = [
  {
    id: 'prophase',
    name: 'Prophase',
    description: 'Chromosomes condense and become visible. The nuclear envelope breaks down.',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-900">
        <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="currentColor" strokeWidth="2" />
        {/* Condensed chromosomes */}
        <path d="M40,30 Q45,40 40,50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M60,30 Q55,40 60,50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M30,60 Q40,65 50,60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M70,60 Q60,65 50,60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'metaphase',
    name: 'Metaphase',
    description: 'Chromosomes align along the metaphase plate (cell equator).',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-900">
        <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="currentColor" strokeWidth="2" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />
        {/* Aligned chromosomes */}
        <path d="M48,35 L52,35 L52,65 L48,65 Z" fill="currentColor" />
        <path d="M38,40 L42,40 L42,60 L38,60 Z" fill="currentColor" opacity="0.7" />
        <path d="M58,40 L62,40 L62,60 L58,60 Z" fill="currentColor" opacity="0.7" />
      </svg>
    )
  },
  {
    id: 'anaphase',
    name: 'Anaphase',
    description: 'Sister chromatids separate and move toward opposite poles.',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-900">
        <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="currentColor" strokeWidth="2" />
        {/* Pulling chromatids */}
        <path d="M45,20 L55,20 L50,35 Z" fill="currentColor" />
        <path d="M45,80 L55,80 L50,65 Z" fill="currentColor" />
        <path d="M25,30 L35,30 L30,40 Z" fill="currentColor" opacity="0.6" />
        <path d="M65,30 L75,30 L70,40 Z" fill="currentColor" opacity="0.6" />
        <path d="M25,70 L35,70 L30,60 Z" fill="currentColor" opacity="0.6" />
        <path d="M65,70 L75,70 L70,60 Z" fill="currentColor" opacity="0.6" />
      </svg>
    )
  },
  {
    id: 'telophase',
    name: 'Telophase',
    description: 'Chromosomes arrive at poles and new nuclear envelopes form.',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-900">
        <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
        <circle cx="50" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2" />
        <circle cx="50" cy="75" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2" />
      </svg>
    )
  }
];

export default function MicroscopeView() {
  const { toggleMicroscopeView } = useStore();
  const [zoom, setZoom] = useState(1);
  const [focus, setFocus] = useState(0.5);
  const [activeStage, setActiveStage] = useState(MITOSIS_STAGES[0]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center border-b border-white/10 bg-slate-900/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-xl">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Microscope Observation</h2>
            <p className="text-slate-400 text-xs">Viewing: Onion Root Tip Cells</p>
          </div>
        </div>
        <button 
          onClick={() => toggleMicroscopeView(false)}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
        >
          <X className="w-6 h-6 text-slate-400 group-hover:text-white" />
        </button>
      </div>

      <div className="w-full max-w-6xl flex gap-12 items-stretch">
        {/* Lens View */}
        <div className="flex-1 aspect-square bg-slate-900 rounded-full border-[12px] border-slate-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.8),0_0_50px_rgba(99,102,241,0.2)] relative overflow-hidden flex items-center justify-center group">
          <div 
            className="w-full h-full transition-all duration-300 transform"
            style={{ 
              transform: `scale(${zoom})`,
              filter: `blur(${(1 - focus) * 10}px)`,
              opacity: focus > 0.2 ? 1 : 0.3
            }}
          >
            {/* Grid of cells */}
            <div className="grid grid-cols-4 grid-rows-4 w-full h-full p-8 gap-4 opacity-80">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="bg-emerald-100/10 border border-emerald-500/20 rounded-md p-2 hover:bg-emerald-500/10 transition-colors">
                  {i % 4 === 1 ? activeStage.svg : (
                    <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-900/40">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="50" cy="50" r="10" fill="currentColor" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Lens HUD */}
          <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20 rounded-full shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />
        </div>

        {/* Controls Panel */}
        <div className="w-96 flex flex-col gap-8">
          <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 flex flex-col gap-6">
            <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Adjustments</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400 px-1">
                  <span>FOCUS (COARSE)</span>
                  <span>{Math.round(focus * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={focus} onChange={(e) => setFocus(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400 px-1">
                  <span>ZOOM (OBJECTIVE)</span>
                  <span>{zoom.toFixed(1)}x</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setZoom(Math.max(1, zoom - 0.2))} className="flex-1 bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition-colors flex justify-center"><ZoomOut className="w-4 h-4 text-white" /></button>
                  <button onClick={() => setZoom(Math.min(3, zoom + 0.2))} className="flex-1 bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition-colors flex justify-center"><ZoomIn className="w-4 h-4 text-white" /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-slate-900/50 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest">Mitosis Stages</h3>
            <div className="grid grid-cols-2 gap-3">
              {MITOSIS_STAGES.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage)}
                  className={`
                    p-3 rounded-2xl border transition-all text-left group
                    ${activeStage.id === stage.id ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-slate-800/50 border-white/5 hover:border-white/20'}
                  `}
                >
                  <div className={`text-[10px] font-black uppercase mb-1 ${activeStage.id === stage.id ? 'text-indigo-200' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    Stage
                  </div>
                  <div className={`font-bold text-sm ${activeStage.id === stage.id ? 'text-white' : 'text-slate-300'}`}>
                    {stage.name}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <p className="text-xs text-indigo-300 leading-relaxed italic">
                "{activeStage.description}"
              </p>
            </div>
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-tighter">
            <Save className="w-5 h-5" />
            Capture Observation
          </button>
        </div>
      </div>
    </div>
  );
}
