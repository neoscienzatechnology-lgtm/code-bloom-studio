// Telemetria de produto (PostHog) + captura de erros, no padrão do ads.ts:
// sem VITE_POSTHOG_KEY configurada, TUDO aqui é no-op — nenhum SDK é
// carregado, nenhum dado sai do aparelho. O SDK é importado dinamicamente
// só quando a chave existe, então o bundle principal não cresce.
//
// Privacidade: autocapture e session recording DESLIGADOS; só eventos
// explícitos (telas e marcos de aprendizado) e exceções. Identificamos o
// usuário apenas pelo id da conta (sem e-mail/nome).

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY?.trim();
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";

type PostHogClient = typeof import("posthog-js").default;

let client: PostHogClient | null = null;
let initStarted = false;

export function isAnalyticsEnabled(): boolean {
  return Boolean(POSTHOG_KEY);
}

export async function initAnalytics(): Promise<void> {
  if (!POSTHOG_KEY || initStarted) return;
  initStarted = true;
  try {
    const { default: posthog } = await import("posthog-js");
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      persistence: "localStorage",
    });
    client = posthog;

    window.addEventListener("error", (event) => {
      captureError(event.error ?? event.message);
    });
    window.addEventListener("unhandledrejection", (event) => {
      captureError(event.reason);
    });
  } catch {
    /* telemetria nunca pode quebrar o app */
  }
}

export function track(event: string, properties?: Record<string, unknown>): void {
  try {
    client?.capture(event, properties);
  } catch {
    /* ignore */
  }
}

export function trackPageview(path: string): void {
  track("$pageview", { $current_url: path });
}

export function identifyUser(userId: string): void {
  try {
    client?.identify(userId);
  } catch {
    /* ignore */
  }
}

export function resetAnalyticsUser(): void {
  try {
    client?.reset();
  } catch {
    /* ignore */
  }
}

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  try {
    const err = error instanceof Error ? error : new Error(String(error));
    client?.captureException(err, context);
  } catch {
    /* ignore */
  }
}
