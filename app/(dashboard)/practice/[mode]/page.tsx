import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { TypingTest } from "@/components/typing/TypingTest";
import { type ModeId } from "@/components/typing/ModeSelector";

const PRACTICE_MODES = ["general", "government", "data", "coding", "arabic"] as const;

const GAME_MODE_PATHS: Partial<Record<ModeId, string>> = {
  race: "/games/race",
  falling: "/games/falling",
  "word-builder": "/games/word-builder",
};

const MODE_TITLES: Record<(typeof PRACTICE_MODES)[number], string> = {
  general: "General Speed",
  government: "Govt. Exam Prep",
  data: "Data Entry",
  coding: "Code Typing",
  arabic: "Arabic / Urdu",
};

type PracticeMode = (typeof PRACTICE_MODES)[number];

interface PageProps {
  params: {
    mode: string;
  };
}

function isPracticeMode(mode: string): mode is PracticeMode {
  return PRACTICE_MODES.includes(mode as PracticeMode);
}

export function generateStaticParams() {
  return PRACTICE_MODES.map((mode) => ({ mode }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isPracticeMode(params.mode)) {
    return { title: "Practice - TypeGuru" };
  }

  return { title: `${MODE_TITLES[params.mode]} - TypeGuru` };
}

export default function PracticeModePage({ params }: PageProps) {
  const gamePath = GAME_MODE_PATHS[params.mode as ModeId];
  if (gamePath) redirect(gamePath);
  if (!isPracticeMode(params.mode)) notFound();

  return (
    <div>
      <div className="max-w-3xl mx-auto px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold mb-1">
          <span className="text-brand-cyan">Typing Practice</span>
        </h1>
        <p className="text-text-muted text-sm">Choose a mode and start typing. Results are saved automatically.</p>
      </div>
      <TypingTest initialMode={params.mode} />
    </div>
  );
}
