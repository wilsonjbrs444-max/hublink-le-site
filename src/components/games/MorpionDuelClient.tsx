"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDuelSession } from "@/lib/useDuelSession";
import {
  checkMorpionWinner,
  isMorpionFull,
  MorpionState,
} from "@/lib/games/morpion";

export default function MorpionDuelClient({
  sessionId,
  currentUserId,
}: {
  sessionId: string;
  currentUserId: string;
}) {
  const { session, error, sendMove } = useDuelSession(sessionId);

  if (error) {
    return <p className="p-8 text-center text-sm text-red-600">{error}</p>;
  }
  if (!session) {
    return <p className="p-8 text-center text-sm text-gray-400">Chargement...</p>;
  }

  const state: MorpionState = JSON.parse(session.state || '{"board":[null,null,null,null,null,null,null,null,null]}');
  const board = state.board;
  const isPlayer1 = session.player1Id === currentUserId;
  const mySymbol = isPlayer1 ? "X" : "O";
  const myTurn = session.turnId === currentUserId;
  const opponentName = isPlayer1 ? session.player2?.fullName : session.player1.fullName;

  async function play(i: number) {
    if (board[i] || !myTurn || session!.status === "finished") return;
    const next = [...board];
    next[i] = mySymbol;
    const winnerSymbol = checkMorpionWinner(next);
    const draw = !winnerSymbol && isMorpionFull(next);
    const winnerId = winnerSymbol
      ? isPlayer1
        ? winnerSymbol === "X"
          ? session!.player1Id
          : session!.player2Id
        : winnerSymbol === "O"
        ? session!.player2Id
        : session!.player1Id
      : null;
    const nextTurn = isPlayer1 ? session!.player2Id : session!.player1Id;

    await sendMove({
      state: { board: next },
      nextTurnId: winnerSymbol || draw ? null : nextTurn,
      winnerId,
      status: winnerSymbol || draw ? "finished" : "active",
    });
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">❌⭕ Morpion — Duel</h1>

      {session.status === "waiting" && (
        <p className="mt-4 text-sm text-gray-500">
          En attente qu'un adversaire rejoigne la partie via le lien...
        </p>
      )}

      {session.status !== "waiting" && (
        <>
          <p className="mt-1 text-sm text-gray-500">
            Toi ({mySymbol}) contre {opponentName || "..."}
          </p>
          <p className="mt-1 text-xs font-medium text-hublink">
            {session.status === "finished"
              ? session.winnerId === currentUserId
                ? "🎉 Tu as gagné !"
                : session.winnerId
                ? "😅 Tu as perdu."
                : "Match nul !"
              : myTurn
              ? "À toi de jouer"
              : "Au tour de l'adversaire..."}
          </p>

          <div className="mx-auto mt-6 grid w-64 grid-cols-3 gap-2">
            {board.map((c: string | null, i: number) => (
              <button
                key={i}
                onClick={() => play(i)}
                className="flex h-20 w-20 items-center justify-center rounded-lg border bg-white text-3xl font-bold text-gray-800 disabled:opacity-70"
                disabled={!!c || !myTurn || session.status === "finished"}
              >
                {c}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
