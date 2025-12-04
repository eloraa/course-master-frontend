import { create } from 'zustand';
import { themeColor } from '@/constants';

export type SelectedTheme = 'light' | 'dark' | 'system';
export type Theme = 'light' | 'dark';
export type ThemeVariant = 'default' | 'default-muted' | 'claude' | 'vitesse' | 'solarized' | 'mono';
interface ThemeState {
  selectedTheme: SelectedTheme;
  theme: Theme;
  variant: ThemeVariant;
  initialized: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setVariant: (variant: ThemeVariant) => void;
  setInitialized: (initialized: boolean) => void;
}

const applyTheme = (theme: 'light' | 'dark', variant: string) => {
  if (typeof window === 'undefined') return;
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;

  Object.keys(themeColor).forEach(v => document.documentElement.classList.remove(v));
  document.documentElement.classList.add(variant);

  const color = themeColor[variant]?.[theme] || (theme === 'dark' ? '#000000' : '#fefafb');
  const colorScheme = theme;

  let themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) {
    themeColorMeta = document.createElement('meta');
    themeColorMeta.setAttribute('name', 'theme-color');
    document.head.appendChild(themeColorMeta);
  }
  themeColorMeta.setAttribute('content', color);

  let colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
  if (!colorSchemeMeta) {
    colorSchemeMeta = document.createElement('meta');
    colorSchemeMeta.setAttribute('name', 'color-scheme');
    document.head.appendChild(colorSchemeMeta);
  }
  colorSchemeMeta.setAttribute('content', colorScheme);
};

const setCookie = (name: string, value: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=${value};path=/;max-age=31536000`;
};

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useTheme = create<ThemeState>(set => {
  return {
    selectedTheme: 'light',
    theme: 'light',
    variant: 'default',
    initialized: false,
    setTheme: theme => {
      const newSelectedTheme = theme;
      const newTheme = theme === 'system' ? getSystemTheme() : theme;
      set(() => ({
        selectedTheme: newSelectedTheme,
        theme: newTheme,
      }));
      set(state => {
        applyTheme(newTheme, state.variant);
        return {};
      });
      setCookie('selectedTheme', newSelectedTheme);
      setCookie('theme', newTheme);
    },
    setVariant: (variant: ThemeVariant) => {
      set(state => {
        applyTheme(state.theme, variant);
        return { variant };
      });
      setCookie('themeVariant', variant);
    },
    setInitialized: (initialized: boolean) => {
      set({ initialized });
    },
  };
});

export const getTheme = useTheme;
