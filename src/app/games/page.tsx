import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

const GAMES = [
  { href: "/games/morpion", emoji: "❌⭕", name: "Morpion", duo: true },
  { href: "/games/puissance4", emoji: "🔴🟡", name: "Puissance 4", duo: true },
  { href: "/games/rps", emoji: "🪨📄✂️", name: "Pierre-Papier-Ciseaux", duo: true },
  { href: "/games/memory", emoji: "🃏", name: "Memory", duo: true },
  { href: "/games/pendu", emoji: "🎯", name: "Pendu", duo: true },
  { href: "/games/quiz", emoji: "🧠", name: "Quiz", duo: true },
  { href: "/games/2048", emoji: "🔢", name: "2048", duo: false },
  { href: "/games/snake", emoji: "🐍", name: "Snake", duo: false },
  { href: "/games/devine-nombre", emoji: "🎲", name: "Devine le nombre", duo: false },
  { href: "/games/simon", emoji: "🎵", name: "Simon", duo: false },
];

export const dynamic = "force-dynamic";

export default function GamesHubPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-6 pb-24">
      <Link href="/more" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour
      </Link>
      <h1 className="mt-3 text-2xl font-bold">🎮 Jeux</h1>
      <p className="mt-1 text-sm text-gray-500">
        Joue seul ou défie un ami. D'autres jeux arrivent bientôt !
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {GAMES.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="flex flex-col items-center gap-2 rounded-xl border bg-white p-5 text-center hover:shadow-sm"
          >
            <span className="text-4xl">{g.emoji}</span>
            <span className="text-sm font-semibold text-gray-800">{g.name}</span>
            {g.duo && (
              <span className="flex items-center gap-1 rounded-full bg-hublink-light px-2 py-0.5 text-[10px] font-medium text-hublink">
                <Users size={10} /> Solo ou duo
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
