import { Metadata } from "next";
import { TypingTest } from "@/components/typing/TypingTest";

export const metadata: Metadata = { title: "Practice — TypeGuru" };

export default function PracticePage() {
  return (
    <div>
      <div className="max-w-3xl mx-auto px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold mb-1">
          ⌨️ <span className="text-brand-cyan">Typing Practice</span>
        </h1>
        <p className="text-text-muted text-sm">Choose a mode and start typing. Results are saved automatically.</p>
      </div>
      <TypingTest />
    </div>
  );
}
