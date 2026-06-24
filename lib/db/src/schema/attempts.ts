import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const attemptsTable = pgTable("attempts", {
  id: serial("id").primaryKey(),
  kind: text("kind").notNull(),
  refId: integer("ref_id").notNull(),
  title: text("title").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  percentage: integer("percentage").notNull(),
  passed: boolean("passed").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Attempt = typeof attemptsTable.$inferSelect;
export type InsertAttempt = typeof attemptsTable.$inferInsert;
