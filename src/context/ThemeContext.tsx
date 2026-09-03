// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colors: typeof lightColors;
}

// Definición de colores centralizada
export const lightColors = {
  background: '#F7FAFC',
  card: '#FFFFFF',
  text: '#2D3748',
  textSecondary: '#718096',
  border: '#E2E8F0',
  primary: '#3182CE',
  primaryLight: '#EBF8FF',
  primaryDark: '#2B6CB0',
  danger: '#E53E3E',
  dangerLight: '#FFF5F5',
  modalOverlay: 'rgba(0, 0, 0, 0.6)',
  modalCard: '#FFFFFF',
};

export const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#A0AEC0',
  border: '#2D3748',
  primary: '#3182CE',
  primaryLight: '#1A365D',
  primaryDark: '#63B3ED',
  danger: '#FC8181',
  dangerLight: '#2D1F1F',
  modalOverlay: 'rgba(0, 0, 0, 0.8)',
  modalCard: '#1E1E1E',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useDeviceColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  const activeTheme =
    themeMode === 'system'
      ? deviceColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode;

  const colors = activeTheme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, themeMode, setThemeMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};