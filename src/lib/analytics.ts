// Telemetria de produto (PostHog) + captura de erros, no padrão do ads.ts:
// sem VITE_POSTHOG_KEY configurada, TUDO aqui é no-op — nenhum SDK é
// carregado, nenhum dado sai do aparelho. O SDK é importado dinamicamente
// só quando a chave existe, então o bundle principal não cresce.
//
// Privacidade: autocapture e session recording DESLIGADOS; só eventos
// explícitos (telas e marcos de aprendizado) e exceções. Identificamos o
// usuário apenas pelo id da conta (sem e-mail/nome).

import { readJson, writeJson, STORAGE_KEYS } from "@/lib/storage";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY?.trim();
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";

type PostHogClient = typeof import("posthog-js").default;

let client: PostHogClient | null = null;
let initStarted = false;

// O SDK entra por import() dinâmico: entre o primeiro render e o `client`
// pronto passam alguns milissegundos — justo onde caem os eventos de entrada
// (`$pageview`, `signup_started`). Sem fila, o começo do funil sumia.
type QueuedEvent = { event: string; properties?: Record<string, unknown> };
const queue: QueuedEvent[] = [];
const QUEUE_LIMIT = 50;
let pendingUserId: string | null = null;

function flushQueue(): void {
  if (!client) return;
  const buffered = queue.splice(0, queue.length);
  if (pendingUserId) {
    identifyUser(pendingUserId);
    pendingUserId = null;
  }
  buffered.forEach(({ event, properties }) => {
    try {
      client?.capture(event, properties);
    } catch {
      /* ignore */
    }
  });
}

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
    flushQueue();

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
  if (!POSTHOG_KEY) return; // telemetria desligada: nem enfileira
  if (!client) {
    if (queue.length < QUEUE_LIMIT) queue.push({ event, properties });
    return;
  }
  try {
    client.capture(event, properties);
  } catch {
    /* ignore */
  }
}

/**
 * Marco que só pode ser contado uma vez (ex.: confirmação de e-mail, que
 * acontece uma vez por conta mas dispara em todo login seguinte). O marcador
 * fica no aparelho; com telemetria desligada nada é gravado nem marcado.
 */
export function trackOnce(marker: string, event: string, properties?: Record<string, unknown>): void {
  if (!POSTHOG_KEY) return;
  const seen = readJson<Record<string, true>>(STORAGE_KEYS.analyticsMilestones, {});
  if (seen[marker]) return;
  writeJson(STORAGE_KEYS.analyticsMilestones, { ...seen, [marker]: true });
  track(event, properties);
}

// Origem da visita. Sem isto não dá para saber qual Short (ou qual busca)
// trouxe a pessoa: o `$pageview` ia só com o caminho, e a query — onde mora a
// marcação de campanha — ficava para trás. #aquisicao-shorts
const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref"] as const;

/**
 * O caminho do certificado carrega o NOME de uma pessoa
 * (/c/:courseId/:nome) — a telemetria recebe o formato da rota, não o nome.
 */
export function anonymizePath(path: string): string {
  return path.replace(/^\/c\/([^/]+)\/.+$/, "/c/$1/:nome");
}

export function trackPageview(path: string): void {
  const properties: Record<string, unknown> = { $current_url: anonymizePath(path) };
  try {
    const params = new URLSearchParams(window.location.search);
    CAMPAIGN_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) properties[key] = value.slice(0, 64);
    });
  } catch {
    /* sem window.location utilizável: o pageview vai sem campanha */
  }
  track("$pageview", properties);
}

export function identifyUser(userId: string): void {
  if (!POSTHOG_KEY) return;
  if (!client) {
    pendingUserId = userId;
    return;
  }
  try {
    client.identify(userId);
  } catch {
    /* ignore */
  }
}

export function resetAnalyticsUser(): void {
  pendingUserId = null;
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
