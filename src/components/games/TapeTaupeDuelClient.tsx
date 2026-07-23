"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDuelSession } from "@/lib/useDuelSession";
import GameRules from "@/components/games/GameRules";

const HOLES = 9;
const DURATION = 30;

type TapeState = {
  phase: "p1_turn" | "p2_turn" | "done";
  scores: Record<string, number>;
};

function WhackRound({ onFinish }: { onFinish: (score: number) => void }) {
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const moleTimeout = useRef<NodeJS.Timeout | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      setActiveHole(null);
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinish(score);
      }
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, timeLeft]);

  useEffect(() => {
    if (!running) return;
    function popMole() {
      setActiveHole(Math.floor(Math.random() * HOLES));
      const delay = 500 + Math.random() * 500;
      moleTimeout.current = setTimeout(() => {
        setActiveHole(null);
        moleTimeout.current = setTimeout(popMole, 300 + Math.random() * 400);
      }, delay);
    }
    popMole();
    return () => {
      if (moleTimeout.current) clearTimeout(moleTimeout.current);
    };
  }, [running]);

  function whack(i: number) {
    if (i !== activeHole) return;
    setScore((s) => s + 1);
    setActiveHole(null);
  }

  return (
    <div>
      <p className="mt-2 text-sm text-gray-500">
        Score : {score} · Temps : {timeLeft}s
      </p>
      {!running ? (
        <button
          onClick={() => setRunning(true)}
          className="mt-4 rounded-md bg-hublink px-6 py-2.5 text-sm font-semibold text-white hover:bg-hublink-dark"
        >
          C'est parti !
        </button>
      ) : (
        <div className="mx-auto mt-4 grid w-64 grid-cols-3 gap-3">
          {Array.from({ length: HOLES }).map((_, i) => (
            <button
              key={i}
              onClick={() => whack(i)}
              className="flex aspect-square items-center justify-center rounded-full bg-amber-900 text-3xl"
            >
              {activeHole === i ? "🐹" : ""}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TapeTaupeDuelClient({
  sessionId,
  currentUserId,
}: {
  sessionId: string;
  currentUserId: string;
}) {
  const { session, error, sendMove } = useDuelSession(sessionId);

  if (error) return <p className="p-8 text-center text-sm text-red-600">{error}</p>;
  if (!session) return <p className="p-8 text-center text-sm text-gray-400">Chargement...</p>;

  const state: TapeState = session.state
    ? JSON.parse(session.state)
    : { phase: "p1_turn", scores: {} };
  const isPlayer1 = session.player1Id === currentUserId;
  const opponentName = isPlayer1 ? session.player2?.fullName : session.player1.fullName;
  const myTurnNow =
    (state.phase === "p1_turn" && isPlayer1) || (state.phase === "p2_turn" && !isPlayer1);

  async function finishRound(score: number) {
    const scores = { ...state.scores, [currentUserId]: score };
    if (state.phase === "p1_turn") {
      await sendMove({
        state: { phase: "p2_turn", scores },
        nextTurnId: session!.player2Id,
        status: "active",
      });
    } else {
      const oppId = isPlayer1 ? session!.player2Id : session!.player1Id;
      const oppScore = (oppId && scores[oppId]) || 0;
      let winnerId: string | null = null;
      if (score > oppScore) winnerId = currentUserId;
      else if (oppScore > score) winnerId = oppId;
      await sendMove({
        state: { phase: "done", scores },
        nextTurnId: null,
        winnerId,
        status: "finished",
      });
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🔨 Tape-la-taupe — Duel</h1>

      <GameRules
        rules={[
          "Chacun joue son propre round de 30 secondes, à tour de rôle.",
          "Celui qui a tapé le plus de taupes gagne le duel.",
        ]}
      />

      {session.status === "waiting" && (
        <p className="mt-4 text-sm text-gray-500">
          En attente qu'un adversaire rejoigne la partie via le lien...
        </p>
      )}

      {session.status === "finished" && (
        <>
          <p className="mt-4 text-sm text-gray-500">
            Toi : {state.scores[currentUserId] || 0} · {opponentName} :{" "}
            {state.scores[isPlayer1 ? session.player2Id || "" : session.player1Id] || 0}
          </p>
          <p className="mt-2 font-semibold text-hublink">
            {session.winnerId === currentUserId
              ? "🎉 Tu as gagné le duel !"
              : session.winnerId
              ? "😅 Tu as perdu le duel."
              : "Égalité !"}
          </p>
        </>
      )}

      {session.status === "active" && (
        <>
          {myTurnNow ? (
            <WhackRound onFinish={finishRound} />
          ) : (
            <p className="mt-6 text-sm text-gray-500">
              En attente que {opponentName || "l'adversaire"} termine son tour...
            </p>
          )}
        </>
      )}
    </div>
  );
}
