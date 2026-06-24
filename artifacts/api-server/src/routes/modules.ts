import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { questionsTable } from "@workspace/db";
import {
  GetModuleParams,
  GetModuleResponse,
  ListModulesResponse,
} from "@workspace/api-zod";
import { loadModuleStats } from "../lib/progress";

const router: IRouter = Router();

router.get("/modules", async (_req, res): Promise<void> => {
  const { modules, statsByModule } = await loadModuleStats();

  const payload = modules.map((m) => {
    const s = statsByModule.get(m.id)!;
    return {
      id: m.id,
      slug: m.slug,
      order: m.order,
      phase: m.phase,
      title: m.title,
      subtitle: m.subtitle,
      description: m.description,
      icon: m.icon,
      accentColor: m.accentColor,
      estimatedHours: m.estimatedHours,
      certTags: m.certTags,
      lessonCount: s.lessonCount,
      completedLessons: s.completedLessons,
      progressPct: s.progressPct,
    };
  });

  res.json(ListModulesResponse.parse(payload));
});

router.get("/modules/:moduleId", async (req, res): Promise<void> => {
  const params = GetModuleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { modules, lessons, completed, statsByModule } =
    await loadModuleStats();

  const m = modules.find((mod) => mod.id === params.data.moduleId);
  if (!m) {
    res.status(404).json({ error: "Module not found" });
    return;
  }

  const moduleLessons = lessons
    .filter((l) => l.moduleId === m.id)
    .sort((a, b) => a.order - b.order);

  const allQuestions = await db.select().from(questionsTable);

  const lessonSummaries = moduleLessons.map((l) => ({
    id: l.id,
    moduleId: l.moduleId,
    order: l.order,
    title: l.title,
    summary: l.summary,
    estimatedMinutes: l.estimatedMinutes,
    questionCount: allQuestions.filter((q) => q.lessonId === l.id).length,
    completed: completed.has(l.id),
  }));

  const payload = {
    id: m.id,
    slug: m.slug,
    order: m.order,
    phase: m.phase,
    title: m.title,
    subtitle: m.subtitle,
    description: m.description,
    icon: m.icon,
    accentColor: m.accentColor,
    estimatedHours: m.estimatedHours,
    certTags: m.certTags,
    objectives: m.objectives,
    scenario: m.scenario,
    progressPct: statsByModule.get(m.id)!.progressPct,
    lessons: lessonSummaries,
  };

  res.json(GetModuleResponse.parse(payload));
});

export default router;
