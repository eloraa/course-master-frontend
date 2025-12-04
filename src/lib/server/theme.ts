import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import type { SelectedTheme, Theme, ThemeVariant } from '@/store/theme';

export function getTheme({ cookies }: { cookies: ReadonlyRequestCookies }): {
  selectedTheme: SelectedTheme;
  theme: Theme;
  variant: ThemeVariant;
} {
  const themeCookie = cookies.get('theme');
  const selectedThemeCookie = cookies.get('selectedTheme');
  const themeVariantCookie = cookies.get('themeVariant');

  const selectedTheme = (selectedThemeCookie?.value as SelectedTheme) || 'light';
  const theme = (themeCookie?.value as Theme) || 'light';
  const variant = (themeVariantCookie?.value as ThemeVariant) || 'default';

  return {
    selectedTheme,
    theme,
    variant,
  };
}
