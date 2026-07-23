"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import PlayFriendModal from "@/components/games/PlayFriendModal";
import {
  emptyP4Board,
  dropP4Piece,
  checkP4Winner,
  isP4Full,
  p4AiMove,
  P4_COLS,
} from "@/lib/games/puissance4";

export default function Puissance4SoloPage() {
  const [board, setBoard] = useState(emptyP4Board());
  const [turn, setTurn] = useState<"player" | "ai">("player");
  const [showFriendModal, setShowFriendModal] = useState(false);

  const winner = checkP4Winner(board);
  const isDraw = !winner && isP4Full(board);

  function play(col: number) {
    if (winner || turn !== "player") return;
    const next = dropP4Piece(board, col, "R");
    if (!next) return;
    setBoard(next);
    if (checkP4Winner(next) || isP4Full(next)) return;
    setTurn("ai");
    setTimeout(() => {
      const aiCol = p4AiMove(next, "J");
      const afterAi = dropP4Piece(next, aiCol, "J");
      if (afterAi) setBoard(afterAi);
      setTurn("player");
    }, 500);
  }

  function reset() {
    setBoard(emptyP4Board());
    setTurn("player");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🔴🟡 Puissance 4</h1>
      <p className="mt-1 text-sm text-gray-500">Toi (🔴) contre l'ordinateur (🟡)</p>

      <div className="mx-auto mt-6 grid w-full max-w-xs grid-cols-7 gap-1 rounded-lg bg-blue-600 p-2">
        {board.map((c, i) => {
          const col = i % P4_COLS;
          return (
            <button
              key={i}
              onClick={() => play(col)}
              className="flex aspect-square items-center justify-center rounded-full bg-white text-lg"
            >
              {c === "R" ? "🔴" : c === "J" ? "🟡" : ""}
            </button>
          );
        })}
      </div>

      {winner && (
        <p className="mt-4 font-semibold text-hublink">
          {winner === "R" ? "🎉 Tu as gagné !" : "😅 L'ordinateur a gagné."}
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
        <PlayFriendModal gameType="puissance4" onClose={() => setShowFriendModal(false)} />
      )}
    </div>
  );
}
