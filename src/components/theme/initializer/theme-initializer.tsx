'use client';

import { useEffect } from 'react';
import { useTheme } from '@/store/theme';
import type { SelectedTheme, ThemeVariant } from '@/store/theme';

interface ThemeInitializerProps {
  selectedTheme: SelectedTheme;
  variant: ThemeVariant;
}

export const ThemeInitializer = ({ selectedTheme, variant }: ThemeInitializerProps) => {
  const { setTheme, setVariant, setInitialized } = useTheme();

  useEffect(() => {
    setTheme(selectedTheme);
    setVariant(variant);
    setInitialized(true);
  }, [selectedTheme, variant, setTheme, setVariant, setInitialized]);

  return null;
};
