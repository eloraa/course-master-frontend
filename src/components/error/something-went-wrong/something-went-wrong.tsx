'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

export const SomethingWentWrong = ({ title = 'Something went wrong' }: { title?: string }) => {
  const [isPending, setPending] = React.useState(false);
  const [isTransitionStarted, startTransition] = React.useTransition();
  const router = useRouter();

  const isMutating = isPending || isTransitionStarted;

  const handleRefresh = () => {
    setPending(true);
    startTransition(router.refresh);
    setPending(false);
  };
  return (
    <div className="pt-6">
      <figure>
        <Image src="/images/crash.png" alt="Crash" width={40} height={40} />
      </figure>
      <p className="mt-4 text-sm">{title}</p>
      <Button onClick={handleRefresh} variant="link" size="sm" className="mt-2 border-b border-brand-saffron-primary h-auto py-0 rounded-none !px-0 cursor-pointer">
        {isMutating ? <Spinner className="size-5" /> : 'Refresh'}
      </Button>
    </div>
  );
};
