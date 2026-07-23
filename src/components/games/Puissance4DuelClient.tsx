"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDuelSession } from "@/lib/useDuelSession";
import {
  emptyP4Board,
  dropP4Piece,
  checkP4Winner,
  isP4Full,
  Puissance4State,
  P4_COLS,
} from "@/lib/games/puissance4";

export default function Puissance4DuelClient({
  sessionId,
  currentUserId,
}: {
  sessionId: string;
  currentUserId: string;
}) {
  const { session, error, sendMove } = useDuelSession(sessionId);

  if (error) return <p className="p-8 text-center text-sm text-red-600">{error}</p>;
  if (!session) return <p className="p-8 text-center text-sm text-gray-400">Chargement...</p>;

  const state: Puissance4State = session.state
    ? JSON.parse(session.state)
    : { board: emptyP4Board() };
  const board = state.board.length ? state.board : emptyP4Board();
  const isPlayer1 = session.player1Id === currentUserId;
  const mySymbol = isPlayer1 ? "R" : "J";
  const myTurn = session.turnId === currentUserId;
  const opponentName = isPlayer1 ? session.player2?.fullName : session.player1.fullName;

  async function play(col: number) {
    if (!myTurn || session!.status === "finished") return;
    const next = dropP4Piece(board, col, mySymbol);
    if (!next) return;
    const winnerSymbol = checkP4Winner(next);
    const draw = !winnerSymbol && isP4Full(next);
    const winnerId = winnerSymbol
      ? mySymbol === winnerSymbol
        ? currentUserId
        : isPlayer1
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
    <div className="mx-auto max-w-md px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🔴🟡 Puissance 4 — Duel</h1>

      {session.status === "waiting" && (
        <p className="mt-4 text-sm text-gray-500">
          En attente qu'un adversaire rejoigne la partie via le lien...
        </p>
      )}

      {session.status !== "waiting" && (
        <>
          <p className="mt-1 text-sm text-gray-500">
            Toi ({mySymbol === "R" ? "🔴" : "🟡"}) contre {opponentName || "..."}
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

          <div className="mx-auto mt-6 grid w-full max-w-xs grid-cols-7 gap-1 rounded-lg bg-blue-600 p-2">
            {board.map((c: string | null, i: number) => {
              const col = i % P4_COLS;
              return (
                <button
                  key={i}
                  onClick={() => play(col)}
                  disabled={!myTurn || session.status === "finished"}
                  className="flex aspect-square items-center justify-center rounded-full bg-white text-lg disabled:opacity-90"
                >
                  {c === "R" ? "🔴" : c === "J" ? "🟡" : ""}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
