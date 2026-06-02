import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useMemoryFragmentStore = create(
  persist(
    (set, get) => ({
      discoveredIds: [],
      discoverFragment: (fragmentId) => {
        if (get().discoveredIds.includes(fragmentId)) {
          return false
        }

        set((state) => ({
          discoveredIds: [...state.discoveredIds, fragmentId],
        }))

        return true
      },
      resetFragments: () => set({ discoveredIds: [] }),
    }),
    {
      name: 'nexus-memory-fragments',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)