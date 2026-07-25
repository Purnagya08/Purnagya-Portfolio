import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useNexusStore = create(
  persist(
    (set, get) => ({
      // ─── Boot & Entry ─────────────────────────────────
      phase: 'entry',
      bootComplete: false,
      entryGranted: false,

      setPhase:        (phase) => set({ phase }),
      setBootComplete: (v)     => set({ bootComplete: v }),
      setEntryGranted: (v)     => set({ entryGranted: v }),

      // ─── Navigation ───────────────────────────────────
      currentModule:   null,
      prevModule:      null,
      isTransitioning: false,

      navigateTo: (moduleId) => {
        const prev = get().currentModule
        set({ isTransitioning: true, prevModule: prev })

        // Push URL
        const path = moduleId ? `/${moduleId}` : '/'
        window.history.pushState({}, '', path)

        setTimeout(() => {
          set({ currentModule: moduleId, isTransitioning: false })
        }, 800)
      },

      // ─── Terminal ─────────────────────────────────────
      terminalOpen: false,
      setTerminalOpen: (v) => set({ terminalOpen: v }),

      // ─── Audio ────────────────────────────────────────
      audioEnabled:   false,
      audioVolume:    0.4,
      ambientPlaying: false,
      sfxEnabled:     true,

      setAudioEnabled:   (v) => set({ audioEnabled: v }),
      setAudioVolume:    (v) => set({ audioVolume: v }),
      setAmbientPlaying: (v) => set({ ambientPlaying: v }),
      setSfxEnabled:     (v) => set({ sfxEnabled: v }),

      // ─── Cursor ───────────────────────────────────────
      cursorPos:     { x: 0, y: 0 },
      cursorVariant: 'default',
      cursorTrail:   [],

      setCursorPos:     (pos)     => set({ cursorPos: pos }),
      setCursorVariant: (variant) => set({ cursorVariant: variant }),
      addCursorTrail:   (point)   => set((s) => ({
        cursorTrail: [...s.cursorTrail.slice(-12), point],
      })),

      // ─── 3D Scene ─────────────────────────────────────
      sceneReady:        false,
      spacecraftVisible: true,
      warpActive:        false,

      setSceneReady:        (v) => set({ sceneReady: v }),
      setSpacecraftVisible: (v) => set({ spacecraftVisible: v }),
      triggerWarp: () => {
        set({ warpActive: true })
        setTimeout(() => set({ warpActive: false }), 1200)
      },

      // ─── Memory Fragments ─────────────────────────────
      collectedFragments: [],
      totalFragments:     15,
      fragmentsCompleted: false,

      collectFragment: (id) => set((s) => ({
        collectedFragments: [...new Set([...s.collectedFragments, id])],
      })),

      resetLogbook: () => set({
        collectedFragments:   [],
        unlockedAchievements: [],
        fragmentsCompleted:   false,
      }),

      setFragmentsCompleted: (v) => set({ fragmentsCompleted: v }),

      // ─── Achievements ─────────────────────────────────
      unlockedAchievements: [],
      pendingAchievement:   null,

      unlockAchievement: (id, label) => set((s) => {
        if (s.unlockedAchievements.includes(id)) return {}
        return {
          unlockedAchievements: [...s.unlockedAchievements, id],
          pendingAchievement:   { id, label },
        }
      }),
      clearPendingAchievement: () => set({ pendingAchievement: null }),

      // ─── HUD ──────────────────────────────────────────
      systemTime: new Date().toISOString(),
      sessionId:  Math.random().toString(36).slice(2, 8).toUpperCase(),

      tickClock: () => set({ systemTime: new Date().toISOString() }),
    }),
    {
      name: 'nexus-session',
      partialize: (state) => ({
        collectedFragments:   state.collectedFragments,
        unlockedAchievements: state.unlockedAchievements,
        fragmentsCompleted:   state.fragmentsCompleted,
        audioEnabled:         state.audioEnabled,
        audioVolume:          state.audioVolume,
        sessionId:            state.sessionId,
      }),
    }
  )
)
