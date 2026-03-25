'use client';

import React, { useEffect } from 'react';
import { useStore, STEPS } from '@/store';

export default function GameManager() {
  const { 
    currentStep, 
    setCurrentStep, 
    experimentState, 
    placedInstruments,
    toggleMicroscopeView
  } = useStore();

  useEffect(() => {
    // Logic to advance steps automatically based on state changes
    if (currentStep === STEPS.ARRANGE) {
      const required = ['onion', 'scalpel', 'microscope', 'burner', 'beaker_hcl', 'watch_glass', 'slide'];
      const allPlaced = required.every(id => placedInstruments.includes(id));
      if (allPlaced) setCurrentStep(STEPS.GROWTH_TILE);
    }

    // Step transitions handled by components (Onion.jsx) are:
    // GROWTH_TILE -> CUT_INITIAL
    // CUT_INITIAL -> GROWTH_BEAKER
    // GROWTH_BEAKER -> CUT_FRESH
    // CUT_FRESH -> TRANSFER_Vial

    if (currentStep === STEPS.TRANSFER_Vial) {
      // For simplicity, we'll jump to CUT_ROOT_TIP (Scientific Sample Prep)
      setCurrentStep(STEPS.CUT_ROOT_TIP);
    }

    if (currentStep === STEPS.CUT_ROOT_TIP && experimentState.rootTipCut) {
      setCurrentStep(STEPS.PLACE_IN_WATCH_GLASS);
    }

    if (currentStep === STEPS.PLACE_IN_WATCH_GLASS && experimentState.tipInWatchGlass) {
      setCurrentStep(STEPS.ADD_HCL);
    }

    if (currentStep === STEPS.ADD_HCL && experimentState.hclAdded) {
      setCurrentStep(STEPS.HEAT_TIP);
    }

    if (currentStep === STEPS.HEAT_TIP && experimentState.tipHeated) {
      setCurrentStep(STEPS.TRANSFER_TO_SLIDE);
    }

    if (currentStep === STEPS.TRANSFER_TO_SLIDE && experimentState.tipOnSlide) {
      setCurrentStep(STEPS.ADD_STAIN);
    }

    if (currentStep === STEPS.ADD_STAIN && experimentState.stainAdded) {
      setCurrentStep(STEPS.SQUASH_PREPARATION);
    }

    if (currentStep === STEPS.SQUASH_PREPARATION && experimentState.tipSquashed) {
      setCurrentStep(STEPS.OBSERVE);
    }
  }, [currentStep, experimentState, placedInstruments, setCurrentStep]);

  return null;
}
