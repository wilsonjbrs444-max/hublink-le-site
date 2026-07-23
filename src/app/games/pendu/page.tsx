"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const WORDS = [
  "ORDINATEUR", "RESEAU", "CAMEROUN", "TECHNICIEN", "SERVEUR",
  "CLAVIER", "IMPRIMANTE", "LOGICIEL", "CYBERSECURITE", "INTERNET",
  "TELEPHONE", "MARKETPLACE", "FREELANCE", "INNOVATION", "DOUALA",
];

const ALPHABET = "AZERTYUIOPQSDFGHJKLMWXCVBN".split("");
const MAX_ERRORS = 7;

export default function PenduPage() {
  const [word, setWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guessed, setGuessed] = useState<string[]>([]);

  const errors = guessed.filter((l) => !word.includes(l)).length;
  const lost = errors >= MAX_ERRORS;
  const won = word.split("").every((l) => guessed.includes(l));

  function guess(letter: string) {
    if (guessed.includes(letter) || lost || won) return;
    setGuessed((g) => [...g, letter]);
  }

  function reset() {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuessed([]);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🎯 Pendu</h1>
      <p className="mt-1 text-sm text-gray-500">
        {MAX_ERRORS - errors} essai(s) restant(s)
      </p>

      <p className="mt-6 text-3xl font-bold tracking-widest text-gray-800">
        {word
          .split("")
          .map((l) => (guessed.includes(l) || lost ? l : "_"))
          .join(" ")}
      </p>

      {won && <p className="mt-4 font-semibold text-hublink">🎉 Gagné !</p>}
      {lost && <p className="mt-4 font-semibold text-red-600">😅 Perdu ! Le mot était {word}.</p>}

      <div className="mx-auto mt-6 grid max-w-xs grid-cols-7 gap-1.5">
        {ALPHABET.map((l) => {
          const used = guessed.includes(l);
          const correct = used && word.includes(l);
          return (
            <button
              key={l}
              onClick={() => guess(l)}
              disabled={used || lost || won}
              className={`flex h-9 items-center justify-center rounded text-sm font-semibold ${
                used
                  ? correct
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-500"
                  : "bg-white border text-gray-700 hover:bg-gray-50"
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>

      <button
        onClick={reset}
        className="mt-6 rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Nouveau mot
      </button>
    </div>
  );
}
