import { describe, it, expect } from "vitest";
import {
  moduleGroups,
  proLessonIds,
  isLessonLocked,
  countLessonCompletionsOn,
  isDailyLimitReached,
} from "@/utils/entitlement";

const withModules = [
  { id: "a1", module: "M1" },
  { id: "a2", module: "M1" },
  { id: "b1", module: "M2" },
  { id: "b2" }, // herda M2
  { id: "c1", module: "M3" },
  { id: "c2", module: "M3" },
];

const noModules = Array.from({ length: 9 }, (_, i) => ({ id: `l${i + 1}` }));

describe("moduleGroups", () => {
  it("agrupa por módulo e faz lições sem módulo herdarem o anterior", () => {
    const groups = moduleGroups(withModules);
    expect(groups.map((g) => g.title)).toEqual(["M1", "M2", "M3"]);
    expect(groups[1].lessons.map((l) => l.id)).toEqual(["b1", "b2"]);
  });

  it("sem campo module, cai no fallback de três blocos", () => {
    const groups = moduleGroups(noModules);
    expect(groups).toHaveLength(3);
    expect(groups[0].lessons).toHaveLength(3);
    expect(groups[0].title).toMatch(/Fundamentos/);
  });
});

describe("proLessonIds", () => {
  it("libera os primeiros N módulos e tranca o resto", () => {
    const locked = proLessonIds(withModules, 2);
    expect([...locked].sort()).toEqual(["c1", "c2"]);
    expect(locked.has("a1")).toBe(false);
    expect(locked.has("b2")).toBe(false);
  });

  it("no fallback de blocos, tranca a partir do (N+1)º bloco", () => {
    const locked = proLessonIds(noModules, 2);
    expect([...locked].sort()).toEqual(["l7", "l8", "l9"]);
  });
});

describe("isLessonLocked", () => {
  const base = { lessons: withModules, freeModuleCount: 2 };

  it("não tranca nada quando o gating está desligado", () => {
    expect(isLessonLocked({ ...base, enabled: false, isPro: false, lessonId: "c1" })).toBe(false);
  });

  it("não tranca para usuário Pro", () => {
    expect(isLessonLocked({ ...base, enabled: true, isPro: true, lessonId: "c1" })).toBe(false);
  });

  it("tranca lição Pro para usuário grátis com gating ligado", () => {
    expect(isLessonLocked({ ...base, enabled: true, isPro: false, lessonId: "c1" })).toBe(true);
    expect(isLessonLocked({ ...base, enabled: true, isPro: false, lessonId: "a1" })).toBe(false);
  });
});

describe("countLessonCompletionsOn", () => {
  it("conta só lições reais do dia (ignora quiz e atividades avulsas)", () => {
    const map = {
      "1-1": "2026-06-21",
      "1-2": "2026-06-21",
      "1-1-quiz": "2026-06-21",
      "daily-review-2026-06-21": "2026-06-21",
      "1-3": "2026-06-20",
    };
    expect(countLessonCompletionsOn(map, "2026-06-21")).toBe(2);
  });
});

describe("isDailyLimitReached", () => {
  const today = "2026-06-21";
  const map = { "1-1": today, "1-2": today, "1-3": today, "1-4": today, "1-5": today };
  const base = { lessonCompletedAt: map, todayKey: today, limit: 5 };

  it("não bloqueia com gating off ou usuário Pro", () => {
    expect(isDailyLimitReached({ ...base, enabled: false, isPro: false, lessonId: "1-6" })).toBe(false);
    expect(isDailyLimitReached({ ...base, enabled: true, isPro: true, lessonId: "1-6" })).toBe(false);
  });

  it("bloqueia uma lição NOVA depois de atingir o limite", () => {
    expect(isDailyLimitReached({ ...base, enabled: true, isPro: false, lessonId: "1-6" })).toBe(true);
  });

  it("nunca bloqueia reabrir uma lição já concluída", () => {
    expect(isDailyLimitReached({ ...base, enabled: true, isPro: false, lessonId: "1-1" })).toBe(false);
  });

  it("não bloqueia abaixo do limite", () => {
    const under = { "1-1": today, "1-2": today };
    expect(isDailyLimitReached({ ...base, lessonCompletedAt: under, enabled: true, isPro: false, lessonId: "1-6" })).toBe(false);
  });
});
