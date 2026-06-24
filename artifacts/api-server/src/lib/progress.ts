import { db } from "@workspace/db";
import {
  modulesTable,
  lessonsTable,
  lessonProgressTable,
  examsTable,
  examQuestionsTable,
  attemptsTable,
} from "@workspace/db";

export type ModuleStats = {
  lessonCount: number;
  completedLessons: number;
  progressPct: number;
};

export async function getCompletedLessonIds(): Promise<Set<number>> {
  const rows = await db.select().from(lessonProgressTable);
  return new Set(rows.filter((r) => r.completed).map((r) => r.lessonId));
}

export function pct(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}

export async function loadModuleStats(): Promise<{
  modules: (typeof modulesTable.$inferSelect)[];
  lessons: (typeof lessonsTable.$inferSelect)[];
  completed: Set<number>;
  statsByModule: Map<number, ModuleStats>;
}> {
  const [modules, lessons, completed] = await Promise.all([
    db.select().from(modulesTable),
    db.select().from(lessonsTable),
    getCompletedLessonIds(),
  ]);

  modules.sort((a, b) => a.order - b.order);
  lessons.sort((a, b) => a.order - b.order);

  const statsByModule = new Map<number, ModuleStats>();
  for (const m of modules) {
    const ls = lessons.filter((l) => l.moduleId === m.id);
    const done = ls.filter((l) => completed.has(l.id)).length;
    statsByModule.set(m.id, {
      lessonCount: ls.length,
      completedLessons: done,
      progressPct: pct(done, ls.length),
    });
  }

  return { modules, lessons, completed, statsByModule };
}

export async function getExamStats(): Promise<
  Map<number, { questionCount: number; bestPercentage: number | null; attemptsTaken: number }>
> {
  const [examQs, attempts] = await Promise.all([
    db.select().from(examQuestionsTable),
    db.select().from(attemptsTable),
  ]);

  const exams = await db.select().from(examsTable);
  const map = new Map<
    number,
    { questionCount: number; bestPercentage: number | null; attemptsTaken: number }
  >();

  for (const e of exams) {
    const qCount = examQs.filter((q) => q.examId === e.id).length;
    const examAttempts = attempts.filter(
      (a) => a.kind === "exam" && a.refId === e.id,
    );
    const best =
      examAttempts.length > 0
        ? Math.max(...examAttempts.map((a) => a.percentage))
        : null;
    map.set(e.id, {
      questionCount: qCount,
      bestPercentage: best,
      attemptsTaken: examAttempts.length,
    });
  }

  return map;
}
