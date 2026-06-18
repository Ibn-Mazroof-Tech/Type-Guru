import FallingWordsGame from "@/components/games/FallingWordsGame";
import { ModeNav } from "@/components/typing/ModeSelector";

export const metadata = { title: "Falling Words - TypeGuru" };

export default function Page() {
  return (
    <div>
      <div className="max-w-3xl mx-auto px-5 pt-6 pb-0">
        <h1 className="text-2xl font-bold mb-1">
          <span className="text-brand-cyan">Falling Words</span>
        </h1>
        <p className="text-text-muted text-sm mb-5">
          Type each falling word before it reaches the ground and keep your streak alive.
        </p>
        <ModeNav selected="falling" />
      </div>
      <FallingWordsGame />
    </div>
  );
}
