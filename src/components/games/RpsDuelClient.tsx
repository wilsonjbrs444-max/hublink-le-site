"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDuelSession } from "@/lib/useDuelSession";
import { RpsChoice, RPS_EMOJI, rpsResult } from "@/lib/games/rps";

type RpsState = {
  choices: Record<string, RpsChoice>;
  scores: Record<string, number>;
  lastResult?: string;
};

const CHOICES: RpsChoice[] = ["pierre", "papier", "ciseaux"];

export default function RpsDuelClient({
  sessionId,
  currentUserId,
}: {
  sessionId: string;
  currentUserId: string;
}) {
  const { session, error, sendMove } = useDuelSession(sessionId);
  const [picked, setPicked] = useState<RpsChoice | null>(null);

  if (error) return <p className="p-8 text-center text-sm text-red-600">{error}</p>;
  if (!session) return <p className="p-8 text-center text-sm text-gray-400">Chargement...</p>;

  const state: RpsState = session.state
    ? JSON.parse(session.state)
    : { choices: {}, scores: {} };
  const opponentId =
    session.player1Id === currentUserId ? session.player2Id : session.player1Id;
  const opponentName =
    session.player1Id === currentUserId ? session.player2?.fullName : session.player1.fullName;
  const myScore = state.scores?.[currentUserId] || 0;
  const opponentScore = (opponentId && state.scores?.[opponentId]) || 0;
  const iChose = !!state.choices?.[currentUserId];
  const opponentChose = !!(opponentId && state.choices?.[opponentId]);

  async function play(choice: RpsChoice) {
    if (session!.status === "waiting" || iChose) return;
    setPicked(choice);
    const choices = { ...(state.choices || {}), [currentUserId]: choice };

    if (opponentId && choices[opponentId]) {
      // Les deux ont choisi : on calcule le résultat et on relance un round
      const r = rpsResult(choices[currentUserId], choices[opponentId]);
      const scores = { ...(state.scores || {}) };
      let lastResult = "Égalité !";
      if (r === "a") {
        scores[currentUserId] = (scores[currentUserId] || 0) + 1;
        lastResult = "win";
      } else if (r === "b") {
        scores[opponentId] = (scores[opponentId] || 0) + 1;
        lastResult = "lose";
      }
      await sendMove({
        state: { choices: {}, scores, lastResult },
        nextTurnId: null,
        status: "active",
      });
      setPicked(null);
    } else {
      await sendMove({ state: { choices, scores: state.scores || {} }, nextTurnId: null, status: "active" });
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🪨📄✂️ Pierre-Papier-Ciseaux — Duel</h1>

      {session.status === "waiting" ? (
        <p className="mt-4 text-sm text-gray-500">
          En attente qu'un adversaire rejoigne la partie via le lien...
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm text-gray-500">
            Score : toi {myScore} — {opponentScore} {opponentName || "adversaire"}
          </p>

          {state.lastResult && (
            <p className="mt-3 font-semibold text-hublink">
              {state.lastResult === "win"
                ? "🎉 Tu as gagné le dernier round !"
                : state.lastResult === "lose"
                ? "😅 Tu as perdu le dernier round."
                : "Dernier round : égalité !"}
            </p>
          )}

          <p className="mt-4 text-sm text-gray-500">
            {iChose && !opponentChose && "En attente du choix de l'adversaire..."}
            {!iChose && "Fais ton choix pour ce round"}
          </p>

          <div className="mt-4 flex justify-center gap-3">
            {CHOICES.map((c) => (
              <button
                key={c}
                onClick={() => play(c)}
                disabled={iChose}
                className="flex h-16 w-16 items-center justify-center rounded-full border bg-white text-3xl hover:bg-gray-50 disabled:opacity-40"
              >
                {RPS_EMOJI[c]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
