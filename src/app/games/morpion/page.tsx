"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import PlayFriendModal from "@/components/games/PlayFriendModal";
import {
  checkMorpionWinner,
  isMorpionFull,
  morpionAiMove,
} from "@/lib/games/morpion";

export default function MorpionSoloPage() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"player" | "ai">("player");
  const [showFriendModal, setShowFriendModal] = useState(false);

  const winner = checkMorpionWinner(board);
  const isDraw = !winner && isMorpionFull(board);

  function play(i: number) {
    if (board[i] || winner || turn !== "player") return;
    const next = [...board];
    next[i] = "X";
    setBoard(next);
    if (checkMorpionWinner(next) || isMorpionFull(next)) return;
    setTurn("ai");
    setTimeout(() => {
      const aiIdx = morpionAiMove(next, "O");
      const afterAi = [...next];
      afterAi[aiIdx] = "O";
      setBoard(afterAi);
      setTurn("player");
    }, 500);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setTurn("player");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">❌⭕ Morpion</h1>
      <p className="mt-1 text-sm text-gray-500">Toi (X) contre l'ordinateur (O)</p>

      <div className="mx-auto mt-6 grid w-64 grid-cols-3 gap-2">
        {board.map((c, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            className="flex h-20 w-20 items-center justify-center rounded-lg border bg-white text-3xl font-bold text-gray-800"
          >
            {c}
          </button>
        ))}
      </div>

      {winner && (
        <p className="mt-4 font-semibold text-hublink">
          {winner === "X" ? "🎉 Tu as gagné !" : "😅 L'ordinateur a gagné."}
        </p>
      )}
      {isDraw && <p className="mt-4 font-semibold text-gray-600">Match nul !</p>}

      <div className="mt-6 flex flex-col gap-2">
        <button
          onClick={reset}
          className="rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Recommencer
        </button>
        <button
          onClick={() => setShowFriendModal(true)}
          className="flex items-center justify-center gap-2 rounded-md bg-hublink px-4 py-2 text-sm font-semibold text-white hover:bg-hublink-dark"
        >
          <Users size={16} /> Jouer avec un ami
        </button>
      </div>

      {showFriendModal && (
        <PlayFriendModal gameType="morpion" onClose={() => setShowFriendModal(false)} />
      )}
    </div>
  );
}
