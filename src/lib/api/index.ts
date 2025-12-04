import { getSession } from '../server/actions';

export const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const authHeaders = async () => {
  const session = await getSession();
  if (!session?.accessToken && !session) return defaultHeaders;

  return { ...defaultHeaders, authorization: `Bearer ${session.accessToken}` };
};

export interface ApiRequestInit extends RequestInit {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  intercept?: boolean;
}

type ApiMethod = (input: string | URL | Request, init?: ApiRequestInit) => Promise<Response>;

function buildUrl(input: string | URL | Request, init?: ApiRequestInit) {
  const url = input instanceof Request ? input.url : input.toString();
  const isAbsolute = /^https?:\/\//i.test(url);
  const base = isAbsolute ? undefined : process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const urlObj = new URL(url, base);

  if (init?.params) {
    Object.entries(init.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value));
      }
    });
  }
  return urlObj.toString();
}

function buildHeaders(init?: ApiRequestInit) {
  let headers: Record<string, string> = { ...defaultHeaders, ...(init?.headers || {}) };
  if (init?.body instanceof FormData) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ['Content-Type']: _, ...rest } = headers;
    headers = rest;
  }
  return headers;
}

async function makeRequest(method: string, input: string | URL | Request, init?: ApiRequestInit): Promise<Response> {
  const response = await fetch(buildUrl(input, init), {
    ...init,
    method: method.toUpperCase(),
    headers: buildHeaders(init),
  });

  if (init?.intercept === false) {
    return response;
  }

  return response;
}

const createApiMethod =
  (method: string): ApiMethod =>
  (input, init) =>
    makeRequest(method, input, init);

export const api: Record<string, ApiMethod> = {
  get: createApiMethod('GET'),
  post: createApiMethod('POST'),
  put: createApiMethod('PUT'),
  patch: createApiMethod('PATCH'),
  delete: createApiMethod('DELETE'),
};
