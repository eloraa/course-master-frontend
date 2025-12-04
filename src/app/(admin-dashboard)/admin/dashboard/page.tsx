import { Metadata } from 'next';
import { Stats } from './stats';
import { TooltipProvider } from '@/components/ui/tooltip';
export const metadata: Metadata = {
  title: 'Dashboard | Coursemaster',
};

export default function Dashboard() {
  return (
    <main className="px-2 md:px-4 pb-8">
      <TooltipProvider>
        <Stats />
      </TooltipProvider>
    </main>
  );
}
