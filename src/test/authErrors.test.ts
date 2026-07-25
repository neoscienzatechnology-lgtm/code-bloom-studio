import { describe, it, expect } from "vitest";
import { describeAuthError } from "@/utils/authErrors";
import { formatCourseDuration, formatMinutes } from "@/utils/courseDuration";
import { courses } from "@/data/mockData";

describe("mensagens de erro de autenticação", () => {
  it("traduz os erros comuns do Supabase para pt-BR acionável", () => {
    expect(describeAuthError(new Error("Invalid login credentials"))).toContain("E-mail ou senha incorretos");
    expect(describeAuthError(new Error("Email not confirmed"))).toContain("Confirme seu e-mail");
    expect(describeAuthError(new Error("User already registered"))).toContain("já tem conta");
    expect(describeAuthError(new Error("Password should be at least 6 characters"))).toContain("6 caracteres");
    expect(describeAuthError(new Error("Email rate limit exceeded"))).toContain("Muitas tentativas");
    expect(describeAuthError(new Error("Unable to validate email address: invalid format"))).toContain(
      "E-mail inválido",
    );
    expect(describeAuthError(new Error("Token has expired or is invalid"))).toContain("expirou");
    expect(describeAuthError(new Error("Failed to fetch"))).toContain("Sem conexão");
  });

  it("nunca vaza o texto original em inglês no fallback", () => {
    const message = describeAuthError(new Error("Some brand new GoTrue failure"));
    expect(message).toBe("Não conseguimos completar agora. Tente de novo em instantes.");
    expect(message).not.toContain("GoTrue");
  });

  it("aceita erro nulo/desconhecido sem quebrar", () => {
    expect(describeAuthError(null)).toBeTruthy();
    expect(describeAuthError(undefined)).toBeTruthy();
  });
});

describe("duração de curso derivada do conteúdo", () => {
  it("formata minutos de forma legível", () => {
    expect(formatMinutes(45)).toBe("45min");
    expect(formatMinutes(120)).toBe("2h");
    expect(formatMinutes(210)).toBe("3h30");
  });

  it("descreve todo curso com o número real de aulas", () => {
    courses.forEach((course) => {
      expect(formatCourseDuration(course)).toContain(`${course.lessons.length} aulas`);
    });
  });
});
