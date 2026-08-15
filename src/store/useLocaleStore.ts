import { create } from 'zustand';
import { Locale } from '../types';
import { translations } from '../i18n';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

export const useLocaleStore = create<LocaleState>((set, get) => ({
  locale: 'rw', // Kinyarwanda as primary default locale
  setLocale: (locale: Locale) => set({ locale }),
  t: (key: string) => {
    const { locale } = get();
    return translations[locale]?.[key] || translations['en']?.[key] || key;
  },
}));
