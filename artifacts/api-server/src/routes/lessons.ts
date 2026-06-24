import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  modulesTable,
  lessonsTable,
  lessonProgressTable,
  questionsTable,
} from "@workspace/db";
import {
  GetLessonParams,
  GetLessonResponse,
  CompleteLessonParams,
  CompleteLessonBody,
  CompleteLessonResponse,
} from "@workspace/api-zod";
import { getCompletedLessonIds } from "../lib/progress";

const router: IRouter = Router();

router.get("/lessons/:lessonId", async (req, res): Promise<void> => {
  const params = GetLessonParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, params.data.lessonId));

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const [module] = await db
    .select()
    .from(modulesTable)
    .where(eq(modulesTable.id, lesson.moduleId));

  const siblings = (
    await db
      .select()
      .from(lessonsTable)
      .where(eq(lessonsTable.moduleId, lesson.moduleId))
  ).sort((a, b) => a.order - b.order);

  const idx = siblings.findIndex((l) => l.id === lesson.id);
  const prevLessonId = idx > 0 ? siblings[idx - 1].id : null;
  const nextLessonId =
    idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1].id : null;

  const questions = (
    await db
      .select()
      .from(questionsTable)
      .where(eq(questionsTable.lessonId, lesson.id))
  ).sort((a, b) => a.order - b.order);

  const completed = await getCompletedLessonIds();

  const payload = {
    id: lesson.id,
    moduleId: lesson.moduleId,
    moduleTitle: module?.title ?? "",
    modulePhase: module?.phase ?? "",
    order: lesson.order,
    title: lesson.title,
    summary: lesson.summary,
    content: lesson.content,
    estimatedMinutes: lesson.estimatedMinutes,
    objectives: lesson.objectives,
    completed: completed.has(lesson.id),
    questions: questions.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    })),
    prevLessonId,
    nextLessonId,
  };

  res.json(GetLessonResponse.parse(payload));
});

router.post("/lessons/:lessonId/complete", async (req, res): Promise<void> => {
  const params = CompleteLessonParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = CompleteLessonBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, params.data.lessonId));

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  await db
    .insert(lessonProgressTable)
    .values({ lessonId: lesson.id, completed: body.data.completed })
    .onConflictDoUpdate({
      target: lessonProgressTable.lessonId,
      set: { completed: body.data.completed },
    });

  res.json(
    CompleteLessonResponse.parse({
      lessonId: lesson.id,
      completed: body.data.completed,
    }),
  );
});

export default router;
