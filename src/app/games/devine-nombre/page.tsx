"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DevineNombrePage() {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [history, setHistory] = useState<{ value: number; hint: string }[]>([]);
  const [won, setWon] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(guess);
    if (!n || n < 1 || n > 100 || won) return;
    let hint = "🎉 Trouvé !";
    if (n < target) hint = "📈 Plus grand";
    else if (n > target) hint = "📉 Plus petit";
    else setWon(true);
    setHistory((h) => [{ value: n, hint }, ...h]);
    setGuess("");
  }

  function reset() {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setHistory([]);
    setWon(false);
    setGuess("");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🔢 Devine le nombre</h1>
      <p className="mt-1 text-sm text-gray-500">Entre 1 et 100 — trouve-le en un minimum d'essais</p>

      {won ? (
        <p className="mt-4 font-semibold text-hublink">
          🎉 Trouvé en {history.length} essai(s) !
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6 flex gap-2">
          <input
            type="number"
            min={1}
            max={100}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-center text-lg"
            placeholder="Ton nombre"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md bg-hublink px-4 py-2 text-sm font-semibold text-white hover:bg-hublink-dark"
          >
            Valider
          </button>
        </form>
      )}

      <div className="mt-4 space-y-1">
        {history.map((h, i) => (
          <p key={i} className="text-sm text-gray-600">
            {h.value} → {h.hint}
          </p>
        ))}
      </div>

      <button
        onClick={reset}
        className="mt-6 rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Recommencer
      </button>
    </div>
  );
}
