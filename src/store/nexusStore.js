import { create } from 'zustand'

export const useNexusStore = create((set, get) => ({
  // ─── Boot & Entry ─────────────────────────────────────────
  phase: 'entry',         // 'entry' | 'boot' | 'login' | 'hub' | 'module'
  bootComplete: false,
  entryGranted: false,

  setPhase: (phase) => set({ phase }),
  setBootComplete: (v) => set({ bootComplete: v }),
  setEntryGranted: (v) => set({ entryGranted: v }),

  // ─── Navigation ───────────────────────────────────────────
  currentModule: null,    // null = hub, string = module id
  prevModule: null,
  isTransitioning: false,

  navigateTo: (moduleId) => {
    const prev = get().currentModule
    set({ isTransitioning: true, prevModule: prev })
    setTimeout(() => {
      set({ currentModule: moduleId, isTransitioning: false })
    }, 800)
  },

  // ─── Audio ────────────────────────────────────────────────
  audioEnabled: false,
  audioVolume: 0.4,
  ambientPlaying: false,
  sfxEnabled: true,

  setAudioEnabled: (v) => set({ audioEnabled: v }),
  setAudioVolume: (v) => set({ audioVolume: v }),
  setAmbientPlaying: (v) => set({ ambientPlaying: v }),
  setSfxEnabled: (v) => set({ sfxEnabled: v }),

  // ─── Cursor ───────────────────────────────────────────────
  cursorPos: { x: 0, y: 0 },
  cursorVariant: 'default', // 'default' | 'hover' | 'click' | 'text' | 'portal'
  cursorTrail: [],

  // ─── Terminal UI ───────────────────────────────────────────────
  terminalOpen: false,
  terminalInput: '',
  terminalOutput: '',
  terminalHistory: [],
  setTerminalOpen: (v) => set({ terminalOpen: v }),
  setTerminalInput: (v) => set({ terminalInput: v }),
  setTerminalOutput: (v) => set({ terminalOutput: v }),
  addTerminalHistory: (cmd) => set(state => ({ terminalHistory: [...state.terminalHistory, cmd] })),

  setCursorPos: (pos) => set({ cursorPos: pos }),
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  addCursorTrail: (point) => set((s) => ({
    cursorTrail: [...s.cursorTrail.slice(-12), point],
  })),

  // ─── 3D Scene ─────────────────────────────────────────────
  sceneReady: false,
  spacecraftVisible: true,
  warpActive: false,

  setSceneReady: (v) => set({ sceneReady: v }),
  setSpacecraftVisible: (v) => set({ spacecraftVisible: v }),
  triggerWarp: () => {
    set({ warpActive: true })
    setTimeout(() => set({ warpActive: false }), 1200)
  },

  // ─── Memory Fragments ─────────────────────────────────────
  collectedFragments: [],
  totalFragments: 12,

  collectFragment: (id) => set((s) => ({
    collectedFragments: [...new Set([...s.collectedFragments, id])],
  })),

  // ─── HUD Data ─────────────────────────────────────────────
  systemTime: new Date().toISOString(),
  sessionId: Math.random().toString(36).slice(2, 8).toUpperCase(),

  tickClock: () => set({ systemTime: new Date().toISOString() }),
}))
