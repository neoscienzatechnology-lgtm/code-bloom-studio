import type { Course } from "@/data/mockData";

export interface ReferenceEntry {
  id: string;
  courseId: string;
  lessonId: string;
  courseTitle: string;
  courseLanguage: string;
  courseEmoji: string;
  lessonTitle: string;
  module: string;
  level: string;
  estimatedMinutes: number;
  learningObjective: string;
  tryItPrompt: string;
  commonMistake: string;
  summary: string;
  references: string[];
  concepts: string[];
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function buildReferenceIndex(courseList: Course[]): ReferenceEntry[] {
  return courseList.flatMap((course) =>
    course.lessons
      .filter((lesson) => lesson.reference?.length || lesson.tryItPrompt || lesson.commonMistake)
      .map((lesson) => ({
        id: `${course.id}-${lesson.id}`,
        courseId: course.id,
        lessonId: lesson.id,
        courseTitle: course.title,
        courseLanguage: course.language,
        courseEmoji: course.emoji,
        lessonTitle: lesson.title,
        module: lesson.module ?? course.title,
        level: lesson.level ?? course.level,
        estimatedMinutes: lesson.estimatedMinutes ?? 6,
        learningObjective: lesson.learningObjective ?? lesson.description,
        tryItPrompt: lesson.tryItPrompt ?? "",
        commonMistake: lesson.commonMistake ?? "",
        summary: lesson.summary ?? lesson.description,
        references: lesson.reference ?? [],
        concepts: lesson.concepts ?? [],
      })),
  );
}

export function getReferenceLanguages(entries: ReferenceEntry[]): string[] {
  return Array.from(new Set(entries.map((entry) => entry.courseLanguage))).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function filterReferenceEntries(
  entries: ReferenceEntry[],
  query: string,
  selectedLanguage: string,
): ReferenceEntry[] {
  const normalizedQuery = normalizeSearchText(query.trim());

  return entries.filter((entry) => {
    const matchesLanguage = selectedLanguage === "Todos" || entry.courseLanguage === selectedLanguage;
    if (!matchesLanguage) return false;
    if (!normalizedQuery) return true;

    const searchable = normalizeSearchText(
      [
        entry.courseTitle,
        entry.courseLanguage,
        entry.lessonTitle,
        entry.module,
        entry.learningObjective,
        entry.tryItPrompt,
        entry.commonMistake,
        entry.summary,
        ...entry.references,
        ...entry.concepts,
      ].join(" "),
    );

    return searchable.includes(normalizedQuery);
  });
}
