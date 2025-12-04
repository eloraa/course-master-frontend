'use server';

import { getServerAuthSession } from './auth';

export async function getSession() {
  return await getServerAuthSession();
}
