import WordBuilderGame from "@/components/games/WordBuilderGame";
import { ModeNav } from "@/components/typing/ModeSelector";

export const metadata = { title: "Word Builder - TypeGuru" };

export default function Page() {
  return (
    <div>
      <div className="max-w-3xl mx-auto px-5 pt-6 pb-0">
        <h1 className="text-2xl font-bold mb-1">
          <span className="text-brand-cyan">Word Builder</span>
        </h1>
        <p className="text-text-muted text-sm mb-5">
          Unscramble words under pressure and solve as many as you can before the session ends.
        </p>
        <ModeNav selected="word-builder" />
      </div>
      <WordBuilderGame />
    </div>
  );
}
