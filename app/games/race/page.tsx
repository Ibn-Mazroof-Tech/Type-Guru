import RaceGame from "@/components/games/RaceGame";
import { ModeNav } from "@/components/typing/ModeSelector";

export const metadata = { title: "Race - TypeGuru" };

export default function Page() {
  return (
    <div>
      <div className="max-w-3xl mx-auto px-5 pt-6 pb-0">
        <h1 className="text-2xl font-bold mb-1">
          <span className="text-brand-cyan">Race Mode</span>
        </h1>
        <p className="text-text-muted text-sm mb-5">
          Race against an AI opponent and reach the finish line with clean, accurate typing.
        </p>
        <ModeNav selected="race" />
      </div>
      <RaceGame />
    </div>
  );
}
