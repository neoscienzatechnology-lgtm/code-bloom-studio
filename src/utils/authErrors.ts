// Traduz os erros do Supabase Auth (GoTrue) para frases em pt-BR que dizem ao
// aluno O QUE FAZER. O texto cru do erro vem em inglês e nunca deve chegar à
// tela — ele vai para a telemetria, onde é útil para nós. #revisao-1.2
import { captureError } from "@/lib/analytics";

const FALLBACK = "Não conseguimos completar agora. Tente de novo em instantes.";

// Ordem importa: a primeira regra que casar vence. O `reason` é o rótulo que
// vai para a telemetria — estável e sem dado pessoal, ao contrário do texto cru.
const RULES: Array<[RegExp, string, string]> = [
  [/invalid login credentials|invalid credentials/, "invalid_credentials", "E-mail ou senha incorretos. Confira e tente de novo."],
  [
    /email not confirmed|not confirmed/,
    "email_not_confirmed",
    "Confirme seu e-mail antes de entrar. O link está na sua caixa de entrada (veja também o spam).",
  ],
  [
    /already registered|already exists|user already/,
    "email_taken",
    "Este e-mail já tem conta no CodeTier. Tente entrar ou recuperar a senha.",
  ],
  [/password should be at least|password is too short/, "weak_password", "A senha precisa ter pelo menos 6 caracteres."],
  [
    /new password should be different/,
    "same_password",
    "A nova senha precisa ser diferente da anterior.",
  ],
  [
    /rate limit|you can only request this after|too many requests/,
    "rate_limited",
    "Muitas tentativas em pouco tempo. Espere cerca de um minuto e tente de novo.",
  ],
  [/unable to validate email|invalid format|invalid email/, "invalid_email", "E-mail inválido. Confira se digitou corretamente."],
  [
    /token has expired|invalid token|otp_expired|session missing|invalid_grant/,
    "expired_link",
    "Este link expirou ou já foi usado. Peça um novo e-mail e tente de novo.",
  ],
  [/signups not allowed|signup is disabled/, "signup_disabled", "Cadastros estão temporariamente indisponíveis. Tente mais tarde."],
  [
    /failed to fetch|network|networkerror|timeout/,
    "network",
    "Sem conexão com o servidor. Verifique sua internet e tente de novo.",
  ],
  [/popup closed|cancel/, "cancelled", "Login cancelado. Você pode tentar de novo quando quiser."],
];

function matchRule(error: unknown): [RegExp, string, string] | undefined {
  const raw = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const normalized = raw.toLowerCase();
  return RULES.find(([pattern]) => pattern.test(normalized));
}

/** Mensagem pt-BR acionável para um erro de autenticação (função pura). */
export function describeAuthError(error: unknown): string {
  return matchRule(error)?.[2] ?? FALLBACK;
}

/**
 * Rótulo curto do motivo, para o funil. Nunca devolve o texto do erro: um
 * "unknown" a mais é melhor do que arriscar mandar e-mail do aluno para fora.
 */
export function authErrorReason(error: unknown): string {
  return matchRule(error)?.[1] ?? "unknown";
}

/** Igual ao anterior, mas manda o erro cru para a telemetria antes de traduzir. */
export function reportAuthError(error: unknown, scope: string): string {
  captureError(error, { scope });
  return describeAuthError(error);
}
