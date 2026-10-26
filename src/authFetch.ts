import { getAuthInstance } from "./firebase";

/**
 * fetch() wrapper that attaches the signed-in user's Firebase ID token.
 * Use it for every admin call (and for "my orders" style calls).
 */
export async function authFetch(url: string, options: RequestInit = {}) {
  const auth = await getAuthInstance();
  const token = await auth.currentUser?.getIdToken();

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}