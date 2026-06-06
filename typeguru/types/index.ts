export type TypingMode = "general" | "government" | "data" | "coding" | "arabic";
export type UserPlan  = "free" | "pro" | "daypass";
export type CertType  = "govt_typing" | "data_entry" | "speed_typist";

export interface TestResult {
  wpm:      number;
  accuracy: number;
  errors:   number;
  mode:     TypingMode;
  duration: number;
}

export interface LeaderboardEntry {
  rank:         number;
  userId:       string;
  userName:     string | null;
  userImage:    string | null;
  bestWpm:      number;
  bestAccuracy: number;
  streakDays:   number;
  mode:         string;
  location?:    string;
}

export interface KeyScore {
  key:      string;
  score:    number;  // 0–100
  attempts: number;
  errors:   number;
}
