const oauthRedirectKey = "capycode:oauth-redirect";

const publicAuthRoutes = new Set(["/login", "/cadastro", "/esqueci-senha", "/reset-password"]);

export function normalizeInternalRedirect(path: string | null | undefined, fallback = "/dashboard") {
  const candidate = path?.trim() || fallback;

  if (!candidate.startsWith("/") || candidate.startsWith("//")) return fallback;

  const pathOnly = candidate.split(/[?#]/)[0];
  if (publicAuthRoutes.has(pathOnly)) return fallback;

  return candidate;
}

export function storeOAuthRedirect(path: string) {
  window.localStorage.setItem(oauthRedirectKey, normalizeInternalRedirect(path));
}

export function consumeOAuthRedirect(fallback = "/dashboard") {
  const stored = window.localStorage.getItem(oauthRedirectKey);
  window.localStorage.removeItem(oauthRedirectKey);
  return stored ? normalizeInternalRedirect(stored, fallback) : null;
}

export function clearOAuthRedirect() {
  window.localStorage.removeItem(oauthRedirectKey);
}
