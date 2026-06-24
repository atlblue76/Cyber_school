import {
  pgTable,
  serial,
  text,
  integer,
} from "drizzle-orm/pg-core";

export const examsTable = pgTable("exams", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  cert: text("cert").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  accentColor: text("accent_color").notNull(),
  passPercentage: integer("pass_percentage").notNull(),
  timeLimitMinutes: integer("time_limit_minutes").notNull(),
});

export const examQuestionsTable = pgTable("exam_questions", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull(),
  order: integer("order").notNull(),
  prompt: text("prompt").notNull(),
  options: text("options").array().notNull(),
  correctIndex: integer("correct_index").notNull(),
  explanation: text("explanation").notNull(),
});

export type Exam = typeof examsTable.$inferSelect;
export type InsertExam = typeof examsTable.$inferInsert;
export type ExamQuestion = typeof examQuestionsTable.$inferSelect;
export type InsertExamQuestion = typeof examQuestionsTable.$inferInsert;
