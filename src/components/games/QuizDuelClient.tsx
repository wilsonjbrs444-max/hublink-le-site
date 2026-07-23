"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDuelSession } from "@/lib/useDuelSession";
import GameRules from "@/components/games/GameRules";
import { QUIZ_QUESTIONS } from "@/lib/games/quizQuestions";

type QuizState = {
  order: number[];
  index: number;
  scores: Record<string, number>;
  lastAnsweredBy?: string | null;
};

export default function QuizDuelClient({
  sessionId,
  currentUserId,
}: {
  sessionId: string;
  currentUserId: string;
}) {
  const { session, error, sendMove } = useDuelSession(sessionId);
  const [selected, setSelected] = useState<number | null>(null);
  const [lastIndexAnswered, setLastIndexAnswered] = useState(-1);

  if (error) return <p className="p-8 text-center text-sm text-red-600">{error}</p>;
  if (!session) return <p className="p-8 text-center text-sm text-gray-400">Chargement...</p>;

  const state: QuizState = session.state
    ? JSON.parse(session.state)
    : { order: [], index: 0, scores: {} };

  const opponentId =
    session.player1Id === currentUserId ? session.player2Id : session.player1Id;
  const opponentName =
    session.player1Id === currentUserId ? session.player2?.fullName : session.player1.fullName;
  const myScore = state.scores?.[currentUserId] || 0;
  const opponentScore = (opponentId && state.scores?.[opponentId]) || 0;
  const totalQuestions = state.order?.length || 10;
  const finished = session.status === "finished" || state.index >= totalQuestions;
  const current = !finished ? QUIZ_QUESTIONS[state.order[state.index]] : null;

  useEffect(() => {
    if (state.index !== lastIndexAnswered) {
      setSelected(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index]);

  async function answer(i: number) {
    if (!current || selected !== null || finished) return;
    setSelected(i);
    setLastIndexAnswered(state.index);

    if (i !== current.answer) {
      // Mauvaise réponse : l'adversaire peut encore répondre, et toi aussi après un court délai
      setTimeout(() => setSelected(null), 600);
      return;
    }

    const scores = { ...(state.scores || {}) };
    scores[currentUserId] = (scores[currentUserId] || 0) + 1;
    const nextIndex = state.index + 1;
    const isOver = nextIndex >= totalQuestions;

    let winnerId: string | null = null;
    if (isOver) {
      const oppScore = (opponentId && scores[opponentId]) || 0;
      if (scores[currentUserId] > oppScore) winnerId = currentUserId;
      else if (oppScore > scores[currentUserId]) winnerId = opponentId || null;
    }

    await sendMove({
      state: { order: state.order, index: nextIndex, scores, lastAnsweredBy: currentUserId },
      nextTurnId: null,
      winnerId,
      status: isOver ? "finished" : "active",
    });
    setSelected(null);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🧠 Quiz — Duel</h1>

      <GameRules
        rules={[
          "Vous voyez la même question en même temps.",
          "Le premier qui tape la bonne réponse marque le point.",
          "10 questions au total, le meilleur score gagne.",
        ]}
      />

      {session.status === "waiting" ? (
        <p className="mt-4 text-sm text-gray-500">
          En attente qu'un adversaire rejoigne la partie via le lien...
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm text-gray-500">
            Score : toi {myScore} — {opponentScore} {opponentName || "adversaire"}
          </p>

          {finished ? (
            <p className="mt-6 text-lg font-semibold text-hublink">
              {session.winnerId === currentUserId
                ? "🎉 Tu as gagné le duel !"
                : session.winnerId
                ? "😅 Tu as perdu le duel."
                : "Match nul !"}
            </p>
          ) : (
            current && (
              <>
                <p className="mt-2 text-xs text-gray-400">
                  Question {state.index + 1} / {totalQuestions}
                </p>
                <p className="mt-4 text-base font-semibold text-gray-800">{current.q}</p>
                <div className="mt-4 space-y-2">
                  {current.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => answer(i)}
                      disabled={selected !== null}
                      className={`block w-full rounded-md border px-4 py-2.5 text-left text-sm ${
                        selected === i
                          ? i === current.answer
                            ? "border-green-400 bg-green-50 text-green-700"
                            : "border-red-300 bg-red-50 text-red-600"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )
          )}
        </>
      )}
    </div>
  );
}
