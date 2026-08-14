import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const pushSubscriptions = pgTable("push_subscriptions", {
  id:        serial("id").primaryKey(),
  endpoint:  text("endpoint").unique().notNull(),
  p256dh:    text("p256dh").notNull(),
  auth:      text("auth").notNull(),
  /** Snapshot of the user's meal plan: { Monday: { breakfast: "slug", … }, … } */
  mealPlan:  jsonb("meal_plan")
               .$type<Record<string, Record<string, string>>>()
               .notNull()
               .default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type PushSubscription  = typeof pushSubscriptions.$inferSelect;
export type NewPushSubscription = typeof pushSubscriptions.$inferInsert;
