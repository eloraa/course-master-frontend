import { Settings } from '@/components/settings/settings';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Coursemaster',
};
export default async function SettingsPage() {
  return (
    <main className="h-full">
      <Settings />
    </main>
  );
}
