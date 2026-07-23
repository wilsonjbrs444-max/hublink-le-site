"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import PlayFriendModal from "@/components/games/PlayFriendModal";
import GameRules from "@/components/games/GameRules";
import { PENDU_WORDS, PENDU_ALPHABET, PENDU_MAX_ERRORS } from "@/lib/games/pendu";

export default function PenduPage() {
  const [word, setWord] = useState(
    () => PENDU_WORDS[Math.floor(Math.random() * PENDU_WORDS.length)]
  );
  const [guessed, setGuessed] = useState<string[]>([]);
  const [showFriendModal, setShowFriendModal] = useState(false);

  const errors = guessed.filter((l) => !word.includes(l)).length;
  const lost = errors >= PENDU_MAX_ERRORS;
  const won = word.split("").every((l) => guessed.includes(l));

  function guess(letter: string) {
    if (guessed.includes(letter) || lost || won) return;
    setGuessed((g) => [...g, letter]);
  }

  function reset() {
    setWord(PENDU_WORDS[Math.floor(Math.random() * PENDU_WORDS.length)]);
    setGuessed([]);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🎯 Pendu</h1>
      <p className="mt-1 text-sm text-gray-500">
        {PENDU_MAX_ERRORS - errors} essai(s) restant(s)
      </p>

      <GameRules
        rules={[
          "En solo : un mot aléatoire est choisi, devine-le lettre par lettre.",
          "En duo : c'est toi (celui qui invite) qui choisis le mot secret, ton ami doit le deviner.",
          "Ton ami gagne s'il trouve le mot avant d'épuiser ses essais, sinon tu gagnes.",
        ]}
      />

      <p className="mt-6 text-3xl font-bold tracking-widest text-gray-800">
        {word
          .split("")
          .map((l) => (guessed.includes(l) || lost ? l : "_"))
          .join(" ")}
      </p>

      {won && <p className="mt-4 font-semibold text-hublink">🎉 Gagné !</p>}
      {lost && <p className="mt-4 font-semibold text-red-600">😅 Perdu ! Le mot était {word}.</p>}

      <div className="mx-auto mt-6 grid max-w-xs grid-cols-7 gap-1.5">
        {PENDU_ALPHABET.map((l) => {
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

      <div className="mt-6 flex flex-col gap-2">
        <button
          onClick={reset}
          className="rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Nouveau mot
        </button>
        <button
          onClick={() => setShowFriendModal(true)}
          className="flex items-center justify-center gap-2 rounded-md bg-hublink px-4 py-2 text-sm font-semibold text-white hover:bg-hublink-dark"
        >
          <Users size={16} /> Défier un ami (tu choisis le mot)
        </button>
      </div>

      {showFriendModal && (
        <PlayFriendModal
          gameType="pendu"
          initialState={{ phase: "setting_word", word: null, guessed: [] }}
          onClose={() => setShowFriendModal(false)}
        />
      )}
    </div>
  );
}
