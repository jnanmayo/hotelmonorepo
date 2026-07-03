'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RightDrawerPanel = 'activity' | 'notifications' | 'tasks' | 'calendar' | 'notes' | 'pinned';

interface ShellState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  rightDrawerOpen: boolean;
  rightDrawerPanel: RightDrawerPanel;
  commandPaletteOpen: boolean;
  notificationPanelOpen: boolean;
  quickActionsOpen: boolean;
  recentRoutes: string[];
  favoriteIds: string[];

  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setRightDrawerOpen: (open: boolean) => void;
  setRightDrawerPanel: (panel: RightDrawerPanel) => void;
  openRightDrawer: (panel: RightDrawerPanel) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationPanelOpen: (open: boolean) => void;
  toggleQuickActions: () => void;
  addRecentRoute: (href: string) => void;
  toggleFavorite: (id: string) => void;
}

export const useShellStore = create<ShellState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      rightDrawerOpen: false,
      rightDrawerPanel: 'notifications',
      commandPaletteOpen: false,
      notificationPanelOpen: false,
      quickActionsOpen: false,
      recentRoutes: [],
      favoriteIds: [],

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
      setRightDrawerOpen: (open) => set({ rightDrawerOpen: open }),
      setRightDrawerPanel: (panel) => set({ rightDrawerPanel: panel }),
      openRightDrawer: (panel) => set({ rightDrawerOpen: true, rightDrawerPanel: panel }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setNotificationPanelOpen: (open) => set({ notificationPanelOpen: open }),
      toggleQuickActions: () => set((s) => ({ quickActionsOpen: !s.quickActionsOpen })),
      addRecentRoute: (href) =>
        set((s) => ({
          recentRoutes: [href, ...s.recentRoutes.filter((r) => r !== href)].slice(0, 8),
        })),
      toggleFavorite: (id) => {
        const { favoriteIds } = get();
        set({
          favoriteIds: favoriteIds.includes(id)
            ? favoriteIds.filter((f) => f !== id)
            : [...favoriteIds, id],
        });
      },
    }),
    {
      name: 'tungaos-shell',
      partialize: (s) => ({
        sidebarCollapsed: s.sidebarCollapsed,
        favoriteIds: s.favoriteIds,
        recentRoutes: s.recentRoutes,
      }),
    },
  ),
);
