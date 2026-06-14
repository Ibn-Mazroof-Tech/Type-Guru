import Link from "next/link";

export const metadata = { title: "Games — TypeGuru" };

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <h1 className="text-2xl font-bold mb-4">Games</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/games/race" className="card p-5 text-center hover:shadow">🏁 Race</Link>
        <Link href="/games/falling" className="card p-5 text-center hover:shadow">🍂 Falling Words</Link>
        <Link href="/games/word-builder" className="card p-5 text-center hover:shadow">🧩 Word Builder</Link>
      </div>
    </div>
  );
}
