import {
  pgTable, text, integer, timestamp, primaryKey,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("users", {
  id:            text("id").primaryKey().$defaultFn(() => createId()),
  name:          text("name"),
  email:         text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image:         text("image"),
  passwordHash:  text("password_hash"),
  plan:          text("plan").default("free").notNull(),
  streakDays:    integer("streak_days").default(0).notNull(),
  lastActiveAt:  timestamp("last_active_at", { mode: "date" }),
  createdAt:     timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  userId:            text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type:              text("type").notNull(),
  provider:          text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token:     text("refresh_token"),
  access_token:      text("access_token"),
  expires_at:        integer("expires_at"),
  token_type:        text("token_type"),
  scope:             text("scope"),
  id_token:          text("id_token"),
  session_state:     text("session_state"),
}, (t) => ({ pk: primaryKey({ columns: [t.provider, t.providerAccountId] }) }));

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId:       text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires:      timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token:      text("token").notNull(),
  expires:    timestamp("expires", { mode: "date" }).notNull(),
}, (t) => ({ pk: primaryKey({ columns: [t.identifier, t.token] }) }));

export const typingTests = pgTable("typing_tests", {
  id:          text("id").primaryKey().$defaultFn(() => createId()),
  userId:      text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  wpm:         integer("wpm").notNull(),
  accuracy:    integer("accuracy").notNull(),
  errors:      integer("errors").notNull().default(0),
  mode:        text("mode").notNull(),
  duration:    integer("duration").notNull().default(60),
  completedAt: timestamp("completed_at", { mode: "date" }).defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id:                text("id").primaryKey().$defaultFn(() => createId()),
  userId:            text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  plan:              text("plan").notNull(),
  amountPaid:        integer("amount_paid").notNull(),
  startDate:         timestamp("start_date", { mode: "date" }).notNull(),
  endDate:           timestamp("end_date", { mode: "date" }).notNull(),
  razorpayOrderId:   text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  status:            text("status").notNull().default("active"),
  createdAt:         timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const certifications = pgTable("certifications", {
  id:               text("id").primaryKey().$defaultFn(() => createId()),
  userId:           text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  certType:         text("cert_type").notNull(),
  wpmAchieved:      integer("wpm_achieved").notNull(),
  accuracyAchieved: integer("accuracy_achieved").notNull(),
  pdfUrl:           text("pdf_url"),
  issuedAt:         timestamp("issued_at", { mode: "date" }).defaultNow().notNull(),
});

export const leaderboard = pgTable("leaderboard", {
  userId:       text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  mode:         text("mode").notNull(),
  bestWpm:      integer("best_wpm").notNull().default(0),
  bestAccuracy: integer("best_accuracy").notNull().default(0),
  streakDays:   integer("streak_days").notNull().default(0),
  updatedAt:    timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (t) => ({ pk: primaryKey({ columns: [t.userId, t.mode] }) }));

export type User           = typeof users.$inferSelect;
export type NewUser        = typeof users.$inferInsert;
export type TypingTest     = typeof typingTests.$inferSelect;
export type NewTypingTest  = typeof typingTests.$inferInsert;
export type Subscription   = typeof subscriptions.$inferSelect;
export type Certification  = typeof certifications.$inferSelect;
export type LeaderboardRow = typeof leaderboard.$inferSelect;
