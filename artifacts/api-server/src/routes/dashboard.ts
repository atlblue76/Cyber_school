import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db } from "@workspace/db";
import { attemptsTable } from "@workspace/db";
import { GetDashboardResponse } from "@workspace/api-zod";
import { loadModuleStats, getExamStats, pct } from "../lib/progress";

const router: IRouter = Router();

router.get("/dashboard", async (_req, res): Promise<void> => {
  const { modules, lessons, completed, statsByModule } =
    await loadModuleStats();

  const totalModules = modules.length;
  const completedModules = modules.filter(
    (m) => statsByModule.get(m.id)!.progressPct === 100,
  ).length;
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l) => completed.has(l.id)).length;
  const overallProgressPct = pct(completedLessons, totalLessons);

  let currentModule = modules.find(
    (m) => statsByModule.get(m.id)!.progressPct < 100,
  );
  if (!currentModule && modules.length > 0) {
    currentModule = modules[modules.length - 1];
  }

  let nextLessonId: number | null = null;
  if (currentModule) {
    const moduleLessons = lessons
      .filter((l) => l.moduleId === currentModule!.id)
      .sort((a, b) => a.order - b.order);
    const next = moduleLessons.find((l) => !completed.has(l.id));
    nextLessonId = next ? next.id : (moduleLessons[0]?.id ?? null);
  }

  const examStats = await getExamStats();
  const { examsTable } = await import("@workspace/db");
  const exams = await db.select().from(examsTable);

  const certs = Array.from(new Set([...modules.flatMap((m) => m.certTags)]));

  const certReadiness = certs.map((cert) => {
    const certModules = modules.filter((m) => m.certTags.includes(cert));
    let lessonTotal = 0;
    let lessonDone = 0;
    for (const m of certModules) {
      const s = statsByModule.get(m.id)!;
      lessonTotal += s.lessonCount;
      lessonDone += s.completedLessons;
    }
    const studyPct = pct(lessonDone, lessonTotal);

    const certExams = exams.filter((e) => e.cert === cert);
    const bestExamPcts = certExams
      .map((e) => examStats.get(e.id)?.bestPercentage)
      .filter((v): v is number => v != null);
    const bestExamPct =
      bestExamPcts.length > 0 ? Math.max(...bestExamPcts) : null;
    const examsTaken = certExams.reduce(
      (sum, e) => sum + (examStats.get(e.id)?.attemptsTaken ?? 0),
      0,
    );

    const readinessPct =
      bestExamPct != null
        ? Math.round(studyPct * 0.5 + bestExamPct * 0.5)
        : Math.round(studyPct * 0.5);

    return {
      cert,
      readinessPct,
      bestExamPct,
      examsTaken,
    };
  });

  const recent = await db
    .select()
    .from(attemptsTable)
    .orderBy(desc(attemptsTable.createdAt))
    .limit(6);

  const recentAttempts = recent.map((a) => ({
    id: a.id,
    kind: a.kind,
    refId: a.refId,
    title: a.title,
    score: a.score,
    total: a.total,
    percentage: a.percentage,
    passed: a.passed,
    createdAt: a.createdAt.toISOString(),
  }));

  res.json(
    GetDashboardResponse.parse({
      totalModules,
      completedModules,
      totalLessons,
      completedLessons,
      overallProgressPct,
      currentPhaseTitle: currentModule
        ? `${currentModule.phase} — ${currentModule.title}`
        : "All phases complete",
      currentModuleId: currentModule ? currentModule.id : null,
      nextLessonId,
      certReadiness,
      recentAttempts,
    }),
  );
});

export default router;
