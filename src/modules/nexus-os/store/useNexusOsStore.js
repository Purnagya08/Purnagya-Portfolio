import { create } from 'zustand'

const initialPositions = {
  'captains-log': { x: 72, y: 72 },
  'mission-archive': { x: 210, y: 116 },
  'research-labs': { x: 340, y: 86 },
  'museum-archive': { x: 150, y: 176 },
  terminal: { x: 300, y: 150 },
  'nexus-ai': { x: 410, y: 124 },
}

export const useNexusOsStore = create((set) => ({
  activeWindowId: null,
  minimizedWindowIds: [],
  openWindowIds: [],
  positions: initialPositions,
  closeWindow: (windowId) =>
    set((state) => {
      const openWindowIds = state.openWindowIds.filter((id) => id !== windowId)

      return {
        activeWindowId:
          state.activeWindowId === windowId
            ? (openWindowIds.findLast(
                (id) => !state.minimizedWindowIds.includes(id),
              ) ?? null)
            : state.activeWindowId,
        minimizedWindowIds: state.minimizedWindowIds.filter(
          (id) => id !== windowId,
        ),
        openWindowIds,
      }
    }),
  focusWindow: (windowId) =>
    set((state) => ({
      activeWindowId: windowId,
      minimizedWindowIds: state.minimizedWindowIds.filter(
        (id) => id !== windowId,
      ),
      openWindowIds: [
        ...state.openWindowIds.filter((id) => id !== windowId),
        windowId,
      ],
    })),
  minimizeWindow: (windowId) =>
    set((state) => ({
      activeWindowId:
        state.activeWindowId === windowId
          ? (state.openWindowIds.findLast(
              (id) => id !== windowId && !state.minimizedWindowIds.includes(id),
            ) ?? null)
          : state.activeWindowId,
      minimizedWindowIds: state.minimizedWindowIds.includes(windowId)
        ? state.minimizedWindowIds
        : [...state.minimizedWindowIds, windowId],
    })),
  openWindow: (windowId) =>
    set((state) => ({
      activeWindowId: windowId,
      minimizedWindowIds: state.minimizedWindowIds.filter(
        (id) => id !== windowId,
      ),
      openWindowIds: [
        ...state.openWindowIds.filter((id) => id !== windowId),
        windowId,
      ],
    })),
  setWindowPosition: (windowId, position) =>
    set((state) => ({
      positions: {
        ...state.positions,
        [windowId]: position,
      },
    })),
}))
