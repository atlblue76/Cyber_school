import {
  pgTable,
  serial,
  text,
  integer,
} from "drizzle-orm/pg-core";

export const questionsTable = pgTable("questions", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  order: integer("order").notNull(),
  prompt: text("prompt").notNull(),
  options: text("options").array().notNull(),
  correctIndex: integer("correct_index").notNull(),
  explanation: text("explanation").notNull(),
});

export type Question = typeof questionsTable.$inferSelect;
export type InsertQuestion = typeof questionsTable.$inferInsert;
