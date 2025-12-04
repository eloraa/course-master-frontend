import { type Metadata } from 'next';
import SettingsModal from './modal';

export const metadata: Metadata = {
  title: 'Settings | Coursemaster',
};

export default async function SettingsPage() {
  return <SettingsModal />;
}
