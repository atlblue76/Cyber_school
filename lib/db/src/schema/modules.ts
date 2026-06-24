import {
  pgTable,
  serial,
  text,
  integer,
  real,
} from "drizzle-orm/pg-core";

export const modulesTable = pgTable("modules", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  order: integer("order").notNull(),
  phase: text("phase").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  accentColor: text("accent_color").notNull(),
  estimatedHours: real("estimated_hours").notNull(),
  certTags: text("cert_tags").array().notNull(),
  objectives: text("objectives").array().notNull(),
  scenario: text("scenario").notNull(),
});

export type Module = typeof modulesTable.$inferSelect;
export type InsertModule = typeof modulesTable.$inferInsert;
