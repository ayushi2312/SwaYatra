/**
 * Typed client for the SWA-YATRA Express API (`backend/`).
 */

export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return base.replace(/\/$/, '');
}

export function getWsFootfallUrl(): string {
  // Client-side (browser)
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    return `${protocol}://${window.location.host}/ws/footfall`;
  }

  // Fallback (server-side rendering)
  return process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost/ws/footfall';
}

export type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('swa-yatra-auth');
    if (!raw) return null;
    const j = JSON.parse(raw) as { token?: string };
    return j.token || null;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { skipAuth?: boolean } = {}
): Promise<T> {
  const { skipAuth, headers: hdrs, ...rest } = init;
  const headers = new Headers(hdrs);
  if (!headers.has('Content-Type') && rest.body != null) {
    headers.set('Content-Type', 'application/json');
  }
  if (!skipAuth) {
    const token = getStoredToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, { ...rest, headers });
  let json: ApiEnvelope<T> | null = null;
  try {
    json = (await res.json()) as ApiEnvelope<T>;
  } catch {
    /* non-json */
  }

  if (!res.ok || !json || json.success === false) {
    const msg = json?.error || json?.message || res.statusText || 'Request failed';
    throw new ApiError(msg, res.status, json);
  }
  return json.data as T;
}
