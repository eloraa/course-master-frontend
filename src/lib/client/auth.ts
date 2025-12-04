'use client';

import { useQuery } from '@tanstack/react-query';
import { getSession } from '@/lib/server/actions';
import type { Session } from 'next-auth';

export function useSession() {
  const {
    data: session,
    isLoading: loading,
    error,
  } = useQuery<Session | null, Error>({
    queryKey: ['session'],
    queryFn: getSession,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { session, loading, error };
}
