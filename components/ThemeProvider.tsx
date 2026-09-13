'use client';

import React, { createContext, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

// The storefront uses a single light "atelier" palette. Children render immediately so pages
// are server-rendered (previously this returned null until mount, leaving the HTML empty).
const value: ThemeContextProps = { theme: 'light', toggleTheme: () => {} };

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
