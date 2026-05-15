import type { Location } from "react-router-dom";

const fallbackRedirect = "/dashboard";

const publicAuthRoutes = new Set(["/login", "/cadastro", "/esqueci-senha", "/reset-password"]);

export function getAuthRedirect(location: Location, fallback = fallbackRedirect) {
  const state = location.state as { from?: Location } | null;
  const fromState = state?.from ? `${state.from.pathname}${state.from.search}${state.from.hash}` : "";
  const params = new URLSearchParams(location.search);
  const fromQuery = params.get("redirect") ?? "";
  const candidate = fromState || fromQuery || fallback;

  if (!candidate.startsWith("/") || candidate.startsWith("//")) return fallback;

  const pathOnly = candidate.split(/[?#]/)[0];
  if (publicAuthRoutes.has(pathOnly)) return fallback;

  return candidate;
}
