'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Density = 'comfortable' | 'compact';
export type SidebarPosition = 'left' | 'right';

interface PreferencesState {
  language: string;
  density: Density;
  sidebarPosition: SidebarPosition;
  dateFormat: string;
  currency: string;
  timezone: string;
  compactMode: boolean;
  setLanguage: (language: string) => void;
  setDensity: (density: Density) => void;
  setSidebarPosition: (position: SidebarPosition) => void;
  setCompactMode: (compact: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      language: 'en',
      density: 'comfortable',
      sidebarPosition: 'left',
      dateFormat: 'DD/MM/YYYY',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      compactMode: false,
      setLanguage: (language) => set({ language }),
      setDensity: (density) => set({ density }),
      setSidebarPosition: (sidebarPosition) => set({ sidebarPosition }),
      setCompactMode: (compactMode) => set({ compactMode }),
    }),
    { name: 'tungaos-preferences' },
  ),
);
