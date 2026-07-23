"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDuelSession } from "@/lib/useDuelSession";
import GameRules from "@/components/games/GameRules";
import {
  getDamesMoves,
  applyDamesMove,
  checkDamesWinner,
  DamesBoard,
  initialDamesBoard,
} from "@/lib/games/dames";

type DamesState = { board: DamesBoard };

export default function DamesDuelClient({
  sessionId,
  currentUserId,
}: {
  sessionId: string;
  currentUserId: string;
}) {
  const { session, error, sendMove } = useDuelSession(sessionId);
  const [selected, setSelected] = useState<number | null>(null);

  if (error) return <p className="p-8 text-center text-sm text-red-600">{error}</p>;
  if (!session) return <p className="p-8 text-center text-sm text-gray-400">Chargement...</p>;

  const state: DamesState = session.state ? JSON.parse(session.state) : { board: initialDamesBoard() };
  const board = state.board;
  const isPlayer1 = session.player1Id === currentUserId;
  const myTeam: "r" | "n" = isPlayer1 ? "r" : "n";
  const myTurn = session.turnId === currentUserId;
  const opponentName = isPlayer1 ? session.player2?.fullName : session.player1.fullName;
  const winner = checkDamesWinner(board);
  const myMoves = getDamesMoves(board, myTeam);
  const validTargets = selected
    ? myMoves.filter((m) => m.from === selected).map((m) => m.to)
    : [];

  async function play(from: number, to: number) {
    const move = myMoves.find((m) => m.from === from && m.to === to);
    if (!move) return;
    const next = applyDamesMove(board, move);
    setSelected(null);
    const w = checkDamesWinner(next);
    const winnerId = w === "r" ? session!.player1Id : w === "n" ? session!.player2Id : null;
    const nextTurn = isPlayer1 ? session!.player2Id : session!.player1Id;

    await sendMove({
      state: { board: next },
      nextTurnId: w ? null : nextTurn,
      winnerId,
      status: w ? "finished" : "active",
    });
  }

  function click(i: number) {
    if (!myTurn || winner) return;
    const piece = board[i];
    const mine = myTeam === "r" ? piece === "r" || piece === "rd" : piece === "n" || piece === "nd";
    if (mine) {
      setSelected(i);
      return;
    }
    if (selected !== null && validTargets.includes(i)) {
      play(selected, i);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">⚪⚫ Dames — Duel</h1>

      <GameRules
        rules={[
          "Déplace tes pions en diagonale, capture en sautant par-dessus un pion adverse.",
          "Un pion qui atteint le bord opposé devient une dame.",
          "Le premier qui n'a plus de pions ou ne peut plus bouger perd.",
        ]}
      />

      {session.status === "waiting" ? (
        <p className="mt-4 text-sm text-gray-500">
          En attente qu'un adversaire rejoigne la partie via le lien...
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm text-gray-500">
            Toi ({myTeam === "r" ? "rouge" : "noir"}) contre {opponentName || "..."}
          </p>
          <p className="mt-1 text-xs font-medium text-hublink">
            {winner
              ? session.winnerId === currentUserId
                ? "🎉 Tu as gagné !"
                : "😅 Tu as perdu."
              : myTurn
              ? "À toi de jouer"
              : "Au tour de l'adversaire..."}
          </p>

          <div className="mx-auto mt-4 grid w-72 grid-cols-8 border-2 border-gray-700">
            {board.map((piece, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const dark = (row + col) % 2 === 1;
              const isSelected = selected === i;
              const isTarget = validTargets.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => click(i)}
                  disabled={!myTurn}
                  className={`relative flex aspect-square items-center justify-center ${
                    dark ? "bg-amber-800" : "bg-amber-100"
                  } ${isSelected ? "ring-2 ring-hublink" : ""}`}
                >
                  {isTarget && <span className="absolute h-3 w-3 rounded-full bg-hublink/60" />}
                  {piece && (
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        piece.startsWith("r") ? "bg-red-600 text-white" : "bg-gray-900 text-white"
                      }`}
                    >
                      {(piece === "rd" || piece === "nd") && "★"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
