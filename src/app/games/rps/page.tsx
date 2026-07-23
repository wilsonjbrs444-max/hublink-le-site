"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import PlayFriendModal from "@/components/games/PlayFriendModal";
import { RpsChoice, RPS_EMOJI, rpsResult } from "@/lib/games/rps";

const CHOICES: RpsChoice[] = ["pierre", "papier", "ciseaux"];

export default function RpsSoloPage() {
  const [result, setResult] = useState<string | null>(null);
  const [mine, setMine] = useState<RpsChoice | null>(null);
  const [aiChoice, setAiChoice] = useState<RpsChoice | null>(null);
  const [score, setScore] = useState({ me: 0, ai: 0 });
  const [showFriendModal, setShowFriendModal] = useState(false);

  function play(choice: RpsChoice) {
    const ai = CHOICES[Math.floor(Math.random() * 3)];
    setMine(choice);
    setAiChoice(ai);
    const r = rpsResult(choice, ai);
    if (r === "a") {
      setResult("🎉 Tu gagnes !");
      setScore((s) => ({ ...s, me: s.me + 1 }));
    } else if (r === "b") {
      setResult("😅 L'ordinateur gagne.");
      setScore((s) => ({ ...s, ai: s.ai + 1 }));
    } else {
      setResult("Égalité !");
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🪨📄✂️ Pierre-Papier-Ciseaux</h1>
      <p className="mt-1 text-sm text-gray-500">
        Score : toi {score.me} — {score.ai} ordinateur
      </p>

      {mine && (
        <div className="mt-6 flex items-center justify-center gap-6 text-5xl">
          <span>{RPS_EMOJI[mine]}</span>
          <span className="text-lg text-gray-400">VS</span>
          <span>{aiChoice && RPS_EMOJI[aiChoice]}</span>
        </div>
      )}
      {result && <p className="mt-3 font-semibold text-hublink">{result}</p>}

      <div className="mt-6 flex justify-center gap-3">
        {CHOICES.map((c) => (
          <button
            key={c}
            onClick={() => play(c)}
            className="flex h-16 w-16 items-center justify-center rounded-full border bg-white text-3xl hover:bg-gray-50"
          >
            {RPS_EMOJI[c]}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowFriendModal(true)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-hublink px-4 py-2 text-sm font-semibold text-white hover:bg-hublink-dark"
      >
        <Users size={16} /> Jouer avec un ami
      </button>

      {showFriendModal && (
        <PlayFriendModal gameType="rps" onClose={() => setShowFriendModal(false)} />
      )}
    </div>
  );
}
