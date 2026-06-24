import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { examsTable, examQuestionsTable, attemptsTable } from "@workspace/db";
import {
  ListExamsResponse,
  GetExamParams,
  GetExamResponse,
  SubmitExamParams,
  SubmitExamBody,
  SubmitExamResponse,
} from "@workspace/api-zod";
import { getExamStats } from "../lib/progress";

const router: IRouter = Router();

router.get("/exams", async (_req, res): Promise<void> => {
  const exams = (await db.select().from(examsTable)).sort((a, b) =>
    a.cert.localeCompare(b.cert),
  );
  const stats = await getExamStats();

  const payload = exams.map((e) => {
    const s = stats.get(e.id)!;
    return {
      id: e.id,
      slug: e.slug,
      cert: e.cert,
      title: e.title,
      description: e.description,
      icon: e.icon,
      accentColor: e.accentColor,
      questionCount: s.questionCount,
      passPercentage: e.passPercentage,
      bestPercentage: s.bestPercentage,
      attemptsTaken: s.attemptsTaken,
    };
  });

  res.json(ListExamsResponse.parse(payload));
});

router.get("/exams/:examId", async (req, res): Promise<void> => {
  const params = GetExamParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [exam] = await db
    .select()
    .from(examsTable)
    .where(eq(examsTable.id, params.data.examId));

  if (!exam) {
    res.status(404).json({ error: "Exam not found" });
    return;
  }

  const questions = (
    await db
      .select()
      .from(examQuestionsTable)
      .where(eq(examQuestionsTable.examId, exam.id))
  ).sort((a, b) => a.order - b.order);

  res.json(
    GetExamResponse.parse({
      id: exam.id,
      slug: exam.slug,
      cert: exam.cert,
      title: exam.title,
      description: exam.description,
      icon: exam.icon,
      accentColor: exam.accentColor,
      passPercentage: exam.passPercentage,
      timeLimitMinutes: exam.timeLimitMinutes,
      questions: questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      })),
    }),
  );
});

router.post("/exams/:examId/submit", async (req, res): Promise<void> => {
  const params = SubmitExamParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = SubmitExamBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [exam] = await db
    .select()
    .from(examsTable)
    .where(eq(examsTable.id, params.data.examId));

  if (!exam) {
    res.status(404).json({ error: "Exam not found" });
    return;
  }

  const questions = (
    await db
      .select()
      .from(examQuestionsTable)
      .where(eq(examQuestionsTable.examId, exam.id))
  ).sort((a, b) => a.order - b.order);

  const answerMap = new Map<number, number>();
  for (const a of body.data.answers) {
    answerMap.set(a.questionId, a.selectedIndex);
  }

  const answers = questions.map((q) => {
    const selectedIndex = answerMap.get(q.id) ?? -1;
    return {
      questionId: q.id,
      selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect: selectedIndex === q.correctIndex,
      explanation: q.explanation,
    };
  });

  const score = answers.filter((a) => a.isCorrect).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= exam.passPercentage;

  const [attempt] = await db
    .insert(attemptsTable)
    .values({
      kind: "exam",
      refId: exam.id,
      title: exam.title,
      score,
      total,
      percentage,
      passed,
    })
    .returning();

  res.json(
    SubmitExamResponse.parse({
      id: attempt.id,
      kind: "exam",
      refId: exam.id,
      title: exam.title,
      score,
      total,
      percentage,
      passed,
      answers,
    }),
  );
});

export default router;
