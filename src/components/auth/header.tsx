import { ThemeSelector } from '@/components/theme/selector/theme-selector';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

export const Header = () => {
  return (
    <div className="fixed top-0 inset-x-0 pointer-events-none flex items-center justify-between container py-4">
      <Link href="/" className="pointer-events-auto flex items-center gap-1">
        <Logo className="size-6" />
        Coursemaster
      </Link>
      <div className="pointer-events-auto">
        <ThemeSelector />
      </div>
    </div>
  );
};
