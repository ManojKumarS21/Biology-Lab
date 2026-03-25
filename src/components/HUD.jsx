'use client';

import React from 'react';
import { useStore, STEPS } from '@/store';
import { CheckCircle, Circle, Lock, Unlock } from 'lucide-react';

const STEP_LABELS = {
  [STEPS.ARRANGE]: 'Arrange Instruments',
  [STEPS.GROWTH_TILE]: 'Place Onion on Tile',
  [STEPS.CUT_INITIAL]: 'Initial Root Cut',
  [STEPS.GROWTH_BEAKER]: 'Grow Roots in Beaker',
  [STEPS.CUT_FRESH]: 'Cut Fresh Root Tips',
  [STEPS.TRANSFER_Vial]: 'Transfer to Vial',
  [STEPS.CUT_ROOT_TIP]: 'Prepare Sample',
  [STEPS.PLACE_IN_WATCH_GLASS]: 'Transfer to Watch Glass',
  [STEPS.ADD_HCL]: 'Add N/10 HCL',
  [STEPS.HEAT_TIP]: 'Heat on Burner',
  [STEPS.TRANSFER_TO_SLIDE]: 'Transfer to Glass Slide',
  [STEPS.ADD_STAIN]: 'Add Acetocarmine Stain',
  [STEPS.SQUASH_PREPARATION]: 'Squash with Needle',
  [STEPS.OBSERVE]: 'Observe under Microscope',
};

export default function HUD() {
  const { currentStep, isCameraLocked, toggleCameraLock } = useStore();

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-3 w-fit h-auto">
      {/* Camera Lock Button (Compact & Attractive) */}
      <button 
        onClick={toggleCameraLock}
        title={isCameraLocked ? "Unlock Camera" : "Lock Camera to Interact"}
        className={`
          group pointer-events-auto flex items-center justify-center p-3 rounded-full transition-all duration-300 border
          ${isCameraLocked ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-slate-900/60 border-white/10 hover:bg-slate-800'}
        `}
      >
        {isCameraLocked ? <Lock className="w-5 h-5 text-white" /> : <Unlock className="w-5 h-5 text-slate-400 group-hover:text-white" />}
      </button>

      {/* Step Indicator (Slim Sidebar Style) */}
      <div className="bg-slate-900/60 backdrop-blur-md shadow-2xl rounded-2xl p-4 border border-white/5 flex flex-col gap-3 pointer-events-auto w-48">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest pl-1">Current Step</p>
        <div className="flex flex-col gap-2">
          {Object.entries(STEP_LABELS).map(([step, label], index) => {
            const isCompleted = Object.keys(STEP_LABELS).indexOf(currentStep) > index;
            const isActive = currentStep === step;

            if (!isActive && !isCompleted) return null;

            return (
              <div key={step} className={`
                flex items-center gap-3 p-2 rounded-xl transition-all
                ${isActive ? 'bg-indigo-600/20 ring-1 ring-indigo-500/50' : 'opacity-40'}
              `}>
                <div className={`
                  w-5 h-5 rounded-full flex items-center justify-center
                  ${isActive ? 'bg-indigo-600 ring-2 ring-indigo-200' : 'bg-emerald-500'}
                `}>
                  {isCompleted ? <CheckCircle className="w-3 h-3 text-white" /> : <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {label}
                </span>
              </div>
            );
          }).filter(Boolean).slice(-2)}
        </div>
      </div>
    </div>
  );
}
