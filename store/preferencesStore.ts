import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Currency, currencies } from '@/constants/Currencies';

interface PreferencesState {
  currency: Currency;
  darkMode: boolean;
  notifications: boolean;
  language: string;
  setCurrency: (currency: Currency) => void;
  setDarkMode: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
  setLanguage: (language: string) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      currency: currencies[0],
      darkMode: false,
      notifications: true,
      language: 'en',
      setCurrency: (currency) => set({ currency }),
      setDarkMode: (enabled) => set({ darkMode: enabled }),
      setNotifications: (enabled) => set({ notifications: enabled }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);