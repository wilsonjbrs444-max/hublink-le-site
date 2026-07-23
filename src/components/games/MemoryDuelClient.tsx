"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDuelSession } from "@/lib/useDuelSession";
import GameRules from "@/components/games/GameRules";
import { MemoryCard } from "@/lib/games/memory";

type MemoryState = {
  deck: MemoryCard[];
  matched: number[];
  scores: Record<string, number>;
};

export default function MemoryDuelClient({
  sessionId,
  currentUserId,
}: {
  sessionId: string;
  currentUserId: string;
}) {
  const { session, error, sendMove } = useDuelSession(sessionId);
  const [peek, setPeek] = useState<number[]>([]); // cartes retournées non résolues (local)
  const [busy, setBusy] = useState(false);

  if (error) return <p className="p-8 text-center text-sm text-red-600">{error}</p>;
  if (!session) return <p className="p-8 text-center text-sm text-gray-400">Chargement...</p>;

  const state: MemoryState = session.state
    ? JSON.parse(session.state)
    : { deck: [], matched: [], scores: {} };
  const deck = state.deck || [];
  const myTurn = session.turnId === currentUserId;
  const opponentId =
    session.player1Id === currentUserId ? session.player2Id : session.player1Id;
  const opponentName =
    session.player1Id === currentUserId ? session.player2?.fullName : session.player1.fullName;
  const myScore = state.scores?.[currentUserId] || 0;
  const opponentScore = (opponentId && state.scores?.[opponentId]) || 0;
  const finished = deck.length > 0 && state.matched.length === deck.length;

  async function flip(idx: number) {
    if (!myTurn || busy || finished) return;
    if (state.matched.includes(idx) || peek.includes(idx)) return;

    const next = [...peek, idx];
    setPeek(next);

    if (next.length === 2) {
      setBusy(true);
      const [a, b] = next;
      const isMatch = deck[a].emoji === deck[b].emoji;
      setTimeout(async () => {
        const matched = isMatch ? [...state.matched, a, b] : state.matched;
        const scores = { ...(state.scores || {}) };
        if (isMatch) scores[currentUserId] = (scores[currentUserId] || 0) + 1;
        const isOver = matched.length === deck.length;
        let winnerId: string | null = null;
        if (isOver) {
          const oppScore = (opponentId && scores[opponentId]) || 0;
          if (scores[currentUserId] > oppScore) winnerId = currentUserId;
          else if (oppScore > scores[currentUserId]) winnerId = opponentId || null;
        }
        await sendMove({
          state: { deck, matched, scores },
          nextTurnId: isMatch && !isOver ? currentUserId : opponentId,
          winnerId,
          status: isOver ? "finished" : "active",
        });
        setPeek([]);
        setBusy(false);
      }, 700);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🃏 Memory — Duel</h1>

      <GameRules
        rules={[
          "Vous jouez à tour de rôle.",
          "Si tu trouves une paire, tu rejoues. Sinon, c'est au tour de l'autre.",
          "Le joueur avec le plus de paires à la fin gagne.",
        ]}
      />

      {session.status === "waiting" ? (
        <p className="mt-4 text-sm text-gray-500">
          En attente qu'un adversaire rejoigne la partie via le lien...
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm text-gray-500">
            Paires : toi {myScore} — {opponentScore} {opponentName || "adversaire"}
          </p>
          <p className="mt-1 text-xs font-medium text-hublink">
            {finished
              ? session.winnerId === currentUserId
                ? "🎉 Tu as gagné !"
                : session.winnerId
                ? "😅 Tu as perdu."
                : "Égalité !"
              : myTurn
              ? "À toi de jouer"
              : "Au tour de l'adversaire..."}
          </p>

          <div className="mx-auto mt-6 grid max-w-xs grid-cols-4 gap-2">
            {deck.map((card, i) => {
              const isVisible = peek.includes(i) || state.matched.includes(i);
              return (
                <button
                  key={card.id}
                  onClick={() => flip(i)}
                  disabled={!myTurn || busy || finished}
                  className={`flex aspect-square items-center justify-center rounded-lg text-2xl disabled:opacity-90 ${
                    isVisible ? "bg-white border" : "bg-hublink"
                  }`}
                >
                  {isVisible ? card.emoji : ""}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
