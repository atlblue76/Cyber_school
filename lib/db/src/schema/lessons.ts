import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
  objectives: text("objectives").array().notNull(),
});

export const lessonProgressTable = pgTable("lesson_progress", {
  lessonId: integer("lesson_id").primaryKey(),
  completed: boolean("completed").notNull().default(false),
});

export type Lesson = typeof lessonsTable.$inferSelect;
export type InsertLesson = typeof lessonsTable.$inferInsert;
export type LessonProgressRow = typeof lessonProgressTable.$inferSelect;
