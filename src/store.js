import { create } from 'zustand';

export const STEPS = {
  ARRANGE: 'ARRANGE',
  GROWTH_TILE: 'GROWTH_TILE',
  CUT_INITIAL: 'CUT_INITIAL',
  GROWTH_BEAKER: 'GROWTH_BEAKER',
  CUT_FRESH: 'CUT_FRESH',
  TRANSFER_Vial: 'TRANSFER_Vial', // From user's code
  CUT_ROOT_TIP: 'CUT_ROOT_TIP',
  PLACE_IN_WATCH_GLASS: 'PLACE_IN_WATCH_GLASS',
  ADD_HCL: 'ADD_HCL',
  HEAT_TIP: 'HEAT_TIP',
  TRANSFER_TO_SLIDE: 'TRANSFER_TO_SLIDE',
  ADD_STAIN: 'ADD_STAIN',
  SQUASH_PREPARATION: 'SQUASH_PREPARATION',
  OBSERVE: 'OBSERVE',
};

export const useStore = create((set) => ({
  currentStep: STEPS.ARRANGE,
  activeTool: null,
  heldTool: null, // For compatibility
  placedInstruments: [],
  isMicroscopeViewOpen: false,
  isCameraLocked: false,
  lockedInstruments: {}, // { instrumentName: boolean }
  // New States from Onion.jsx
  initialRootsGrown: false,
  beakerRootsGrown: false,
  onionInBeaker: false,
  onionPlacedOnTile: false,
  isCutting: false,
  rootTipsInWatchGlass: false,

  experimentState: {
    rootTipCut: false,
    tipInWatchGlass: false,
    hclAdded: false,
    tipHeated: false,
    tipOnSlide: false,
    stainAdded: false,
    tipSquashed: false,
  },

  // Added setupPositions for relative placement if needed
  setupPositions: {
    tile: [-0.9, 0.44, 0],
    beaker: [-0.6, 0.44, -0.2],
  },

  setCurrentStep: (step) => set({ currentStep: step }),
  setStep: (step) => set({ currentStep: step }), // For compatibility
  setActiveTool: (tool) => set({ activeTool: tool, heldTool: tool }),
  setHeldTool: (tool) => set({ heldTool: tool, activeTool: tool }), // For compatibility
  toggleCameraLock: () => set((state) => ({ isCameraLocked: !state.isCameraLocked })),
  toggleLock: (id) => set((state) => ({
    lockedInstruments: { ...state.lockedInstruments, [id]: !state.lockedInstruments[id] }
  })),
  setMovable: (id, movable) => set((state) => ({
    lockedInstruments: { ...state.lockedInstruments, [id]: !movable }
  })),
  setStates: (newStates) => set((state) => ({ ...state, ...newStates })), // For compatibility

  placeInstrument: (instrument) => set((state) => ({
    placedInstruments: state.placedInstruments.includes(instrument) 
      ? state.placedInstruments 
      : [...state.placedInstruments, instrument],
    lockedInstruments: { ...state.lockedInstruments, [instrument]: false }, // Start as movable
    // Trigger placement states
    onionPlacedOnTile: instrument === 'tile' ? true : state.onionPlacedOnTile,
    onionInBeaker: instrument === 'beaker' ? true : state.onionInBeaker,
  })),

  updateExperimentState: (key, value) => set((state) => ({
    experimentState: { ...state.experimentState, [key]: value }
  })),

  resetExperiment: () => set({
    currentStep: STEPS.ARRANGE,
    activeTool: null,
    heldTool: null,
    placedInstruments: [],
    isMicroscopeViewOpen: false,
    initialRootsGrown: false,
    beakerRootsGrown: false,
    onionInBeaker: false,
    onionPlacedOnTile: false,
    isCutting: false,
    rootTipsInWatchGlass: false,
    experimentState: {
      rootTipCut: false,
      tipInWatchGlass: false,
      hclAdded: false,
      tipHeated: false,
      tipOnSlide: false,
      stainAdded: false,
      tipSquashed: false,
    },
  }),
}));

export default useStore;
