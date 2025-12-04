import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cookies } from 'next/headers';
import { getTheme } from '@/lib/server/theme';
import { themeColor } from '@/constants';
import { ThemeInitializer } from '@/components/theme/initializer/theme-initializer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Course Master',
};
export async function generateViewport(): Promise<Viewport> {
  const cookieStore = await cookies();
  const { theme, variant } = getTheme({ cookies: cookieStore });
  const color = themeColor[variant]?.[theme] || (theme === 'dark' ? '#000000' : '#fefafb');
  return {
    themeColor: color,
    colorScheme: theme,
    interactiveWidget: 'resizes-content',
  };
}

export default async function RootLayout({
  children,
  settingsModal,
}: Readonly<{
  children: React.ReactNode;
  settingsModal: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const { selectedTheme, theme, variant } = getTheme({ cookies: cookieStore });
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${theme} ${variant} antialiased`}
      style={{
        colorScheme: theme === 'dark' ? 'dark' : 'light',
      }}
    >
      <body>
        <div style={{ display: 'contents', height: '100%' }}>
          <ThemeInitializer selectedTheme={selectedTheme} variant={variant} />
          {children}
          {settingsModal}
        </div>
      </body>
    </html>
  );
}
