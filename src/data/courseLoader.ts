// Carrega o conteúdo de UM curso sob demanda.
//
// `src/data/mockData.ts` concatena os 5 arquivos de conteúdo (~514 KB no
// bundle). Telas que precisam de um curso só — a página pública do curso, o
// editor, o projeto — não deveriam baixar os 13. Aqui cada curso vem do seu
// arquivo, via `import()` dinâmico: quem abre "Python do Zero" não baixa HTML,
// CSS, SQL nem Git. #peso-5
//
// As telas de agregação (dashboard, revisão, referência) continuam usando
// `courses` de mockData — elas realmente precisam de tudo, e são pós-login.
import type { Course } from "@/data/mockData";

type ContentModule = () => Promise<Course[]>;

const FOUNDATION: ContentModule = async () => [(await import("@/data/foundationCourse")).foundationProgrammingCourse];
const WEB: ContentModule = async () => (await import("@/data/modernWebCourses")).modernWebCourses;
const PYTHON_SQL: ContentModule = async () => (await import("@/data/modernPythonSqlCourses")).modernPythonSqlCourses;
const PROFESSIONAL: ContentModule = async () => (await import("@/data/modernProfessionalCourses")).modernProfessionalCourses;
const ALGORITHMS: ContentModule = async () => [(await import("@/data/modernAlgorithmCourse")).modernAlgorithmCourse];
// Os cursos 11, 12 e 13 são montados dentro de mockData (createReactNativeCourse
// e afins), então continuam vindo de lá — ainda assim só quando pedidos.
const FROM_INDEX: ContentModule = async () => (await import("@/data/mockData")).courses;

const LOADER_BY_COURSE: Record<string, ContentModule> = {
  "10": FOUNDATION,
  "1": PYTHON_SQL,
  "6": PYTHON_SQL,
  "2": WEB,
  "9": WEB,
  "4": WEB,
  "3": PROFESSIONAL,
  "5": PROFESSIONAL,
  "7": PROFESSIONAL,
  "8": ALGORITHMS,
  "11": FROM_INDEX,
  "12": FROM_INDEX,
  "13": FROM_INDEX,
};

const cache = new Map<string, Course>();

export async function loadCourse(courseId: string): Promise<Course | undefined> {
  const cached = cache.get(courseId);
  if (cached) return cached;

  const loader = LOADER_BY_COURSE[courseId] ?? FROM_INDEX;
  const list = await loader();
  list.forEach((course) => cache.set(course.id, course));
  return cache.get(courseId);
}

export async function loadLesson(
  courseId: string,
  lessonId: string,
): Promise<{ course: Course; lesson: Course["lessons"][number]; lessonIndex: number } | undefined> {
  const course = await loadCourse(courseId);
  if (!course) return undefined;
  const lessonIndex = course.lessons.findIndex((lesson) => lesson.id === lessonId);
  if (lessonIndex < 0) return undefined;
  return { course, lesson: course.lessons[lessonIndex], lessonIndex };
}
