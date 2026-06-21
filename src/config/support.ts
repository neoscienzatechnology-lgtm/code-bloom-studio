export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL?.trim() ?? "";

export const hasSupportEmail = SUPPORT_EMAIL.length > 0;

export const accountDeletionSubject = "Solicitação de exclusão de conta CodeTier";

export const accountDeletionBody = [
  "Olá, equipe CodeTier.",
  "",
  "Quero solicitar a exclusão da minha conta e dos dados vinculados ao meu progresso.",
  "",
  "E-mail da conta:",
  "Nome usado no app, se houver:",
  "",
  "Confirmo que entendo que a exclusão pode remover progresso, XP, conquistas, respostas e dados de aprendizagem.",
].join("\n");

export const accountDeletionMailto = hasSupportEmail
  ? `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(accountDeletionSubject)}&body=${encodeURIComponent(
      accountDeletionBody
    )}`
  : "";
