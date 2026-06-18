import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWPM(wpm: number): string {
  return wpm.toString().padStart(3, "0");
}

export function getAccuracyColor(acc: number): string {
  if (acc >= 98) return "text-brand-green";
  if (acc >= 95) return "text-brand-cyan";
  if (acc >= 90) return "text-brand-gold";
  return "text-brand-red";
}

export function getPlanEndDate(plan: string): Date {
  const now = new Date();
  if (plan === "daypass")     { now.setDate(now.getDate() + 1);        return now; }
  if (plan === "pro_monthly") { now.setMonth(now.getMonth() + 1);      return now; }
  if (plan === "pro_yearly")  { now.setFullYear(now.getFullYear() + 1); return now; }
  return now;
}

export const PLAN_PRICES = {
  pro_monthly: 29900,   // ₹299 in paise
  pro_yearly:  199900,  // ₹1999 in paise
  daypass:     1100,    // ₹11 in paise
} as const;

export const MODE_LABELS: Record<string, string> = {
  general:    "General Speed",
  government: "Govt. Exam Prep",
  data:       "Data Entry",
  coding:     "Code Typing",
  arabic:     "Arabic / Urdu",
  race:       "Race",
  falling:    "Falling Words",
  "word-builder": "Word Builder",
};

export const PRO_MODES: string[] = [];

// Accepts null/undefined gracefully — returns false instead of throwing
export function isPro(plan: string | null | undefined): boolean {
  if (!plan) return false;
  return (
    plan === "pro"         ||
    plan === "pro_monthly" ||
    plan === "pro_yearly"  ||
    plan === "daypass"
  );
}
