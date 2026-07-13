/**
 * Returns the Authorization header with the JWT token from localStorage.
 * Use this in all fetch() calls to authenticated endpoints.
 */
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const session = localStorage.getItem('user_session');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.token) {
        headers['Authorization'] = `Bearer ${parsed.token}`;
      }
    }
  } catch {
    // ignore parse errors
  }

  return headers;
}

/**
 * Wrapper around fetch that automatically includes JWT auth headers.
 * Redirects to login on 401/403.
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const authHeaders = getAuthHeaders();
  const mergedHeaders = {
    ...authHeaders,
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  if (res.status === 401) {
    localStorage.removeItem('user_session');
    window.location.href = '/login';
  }

  return res;
}
