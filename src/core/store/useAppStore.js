import { create } from 'zustand'

export const useAppStore = create((set) => ({
  isNavigationOpen: false,
  closeNavigation: () => set({ isNavigationOpen: false }),
  toggleNavigation: () =>
    set((state) => ({ isNavigationOpen: !state.isNavigationOpen })),
}))
