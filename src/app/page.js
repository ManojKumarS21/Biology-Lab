'use client';

import React from 'react';
import HUD from '@/components/HUD';
import Inventory from '@/components/Inventory';
import LabScene from '@/components/LabScene';
import MicroscopeView from '@/components/MicroscopeView';
import GameManager from '@/components/GameManager';
import { useStore } from '@/store';

export default function Home() {
  const { isMicroscopeViewOpen } = useStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 flex">
      <GameManager />
      {/* 3D Lab Scene */}
      <div className="flex-1 relative">
        <LabScene />
        <HUD />
      </div>

      {/* Sidebar Inventory */}
      <Inventory />

      {/* Microscope View Overlay */}
      {isMicroscopeViewOpen && <MicroscopeView />}

      {/* Custom Styles / Overlays */}
      <div className="fixed bottom-6 left-6 z-10">
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
          <p className="text-[10px] text-indigo-400 font-black uppercase mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-300 font-medium">Virtual Environment Active</span>
          </div>
        </div>
      </div>
    </main>
  );
}
