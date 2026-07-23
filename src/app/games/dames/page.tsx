"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import PlayFriendModal from "@/components/games/PlayFriendModal";
import GameRules from "@/components/games/GameRules";
import {
  initialDamesBoard,
  getDamesMoves,
  applyDamesMove,
  checkDamesWinner,
  damesAiMove,
  DamesBoard,
} from "@/lib/games/dames";

export default function DamesPage() {
  const [board, setBoard] = useState<DamesBoard>(initialDamesBoard);
  const [selected, setSelected] = useState<number | null>(null);
  const [turn, setTurn] = useState<"player" | "ai">("player");
  const [showFriendModal, setShowFriendModal] = useState(false);

  const winner = checkDamesWinner(board);
  const myMoves = getDamesMoves(board, "r");
  const validTargets = selected
    ? myMoves.filter((m) => m.from === selected).map((m) => m.to)
    : [];

  function playMove(from: number, to: number) {
    const move = myMoves.find((m) => m.from === from && m.to === to);
    if (!move) return;
    const next = applyDamesMove(board, move);
    setBoard(next);
    setSelected(null);
    if (checkDamesWinner(next)) return;
    setTurn("ai");
    setTimeout(() => {
      const aiMove = damesAiMove(next, "n");
      if (aiMove) setBoard((b) => applyDamesMove(b, aiMove));
      setTurn("player");
    }, 600);
  }

  function click(i: number) {
    if (winner || turn !== "player") return;
    const piece = board[i];
    if (piece === "r" || piece === "rd") {
      setSelected(i);
      return;
    }
    if (selected !== null && validTargets.includes(i)) {
      playMove(selected, i);
    }
  }

  function reset() {
    setBoard(initialDamesBoard());
    setSelected(null);
    setTurn("player");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">⚪⚫ Dames</h1>
      <p className="mt-1 text-sm text-gray-500">Toi (rouge) contre l'ordinateur (noir)</p>

      <GameRules
        rules={[
          "Déplace tes pions en diagonale d'une case vers l'avant.",
          "Saute par-dessus un pion adverse pour le capturer (prise obligatoire si possible).",
          "Un pion qui atteint le bord opposé devient une dame et peut se déplacer en diagonale dans les deux sens.",
          "Le premier qui n'a plus de pions ou ne peut plus bouger perd.",
        ]}
      />

      {winner && (
        <p className="mt-3 font-semibold text-hublink">
          {winner === "r" ? "🎉 Tu as gagné !" : "😅 L'ordinateur a gagné."}
        </p>
      )}

      <div className="mx-auto mt-4 grid w-72 grid-cols-8 border-2 border-gray-700">
        {Array.from({ length: 64 }).map((_, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const dark = (row + col) % 2 === 1;
          const piece = board[i];
          const isSelected = selected === i;
          const isTarget = validTargets.includes(i);
          return (
            <button
              key={i}
              onClick={() => click(i)}
              className={`relative flex aspect-square items-center justify-center ${
                dark ? "bg-amber-800" : "bg-amber-100"
              } ${isSelected ? "ring-2 ring-hublink" : ""}`}
            >
              {isTarget && <span className="absolute h-3 w-3 rounded-full bg-hublink/60" />}
              {piece && (
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                    piece.startsWith("r")
                      ? "bg-red-600 text-white"
                      : "bg-gray-900 text-white"
                  }`}
                >
                  {(piece === "rd" || piece === "nd") && "★"}
                </span>
              )}
            </button>
          );
        })}
      </div>

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
        <PlayFriendModal
          gameType="dames"
          initialState={{ board: initialDamesBoard() }}
          onClose={() => setShowFriendModal(false)}
        />
      )}
    </div>
  );
}
