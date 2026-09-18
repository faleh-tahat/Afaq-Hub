'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { translation, type Translation } from '@/lib/i18n';

const LanguageContext = createContext<Translation | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <LanguageContext.Provider value={translation}>{children}</LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within a LanguageProvider');
  return context;
}
