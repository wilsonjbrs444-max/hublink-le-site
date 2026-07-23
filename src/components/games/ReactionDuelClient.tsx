"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDuelSession } from "@/lib/useDuelSession";
import GameRules from "@/components/games/GameRules";

type ReactionState = {
  phase: "p1_turn" | "p2_turn" | "done";
  times: Record<string, number>;
};

type Phase = "idle" | "waiting" | "ready" | "tooSoon" | "result";

function ReactionAttempt({ onFinish }: { onFinish: (ms: number) => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [last, setLast] = useState<number | null>(null);
  const startTime = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function start() {
    setPhase("waiting");
    const delay = 1000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      startTime.current = Date.now();
      setPhase("ready");
    }, delay);
  }

  function click() {
    if (phase === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase("tooSoon");
      return;
    }
    if (phase === "ready") {
      const time = Date.now() - startTime.current;
      setLast(time);
      setPhase("result");
      onFinish(time);
    }
  }

  return (
    <button
      onClick={phase === "waiting" || phase === "ready" ? click : start}
      className={`mx-auto mt-6 flex h-56 w-56 items-center justify-center rounded-xl text-lg font-bold text-white ${
        phase === "ready"
          ? "bg-green-500"
          : phase === "waiting"
          ? "bg-red-500"
          : phase === "tooSoon"
          ? "bg-orange-500"
          : "bg-hublink"
      }`}
      disabled={phase === "result"}
    >
      {phase === "idle" && "Toucher pour commencer"}
      {phase === "waiting" && "Attends le vert..."}
      {phase === "ready" && "TAPE !"}
      {phase === "tooSoon" && "Trop tôt !"}
      {phase === "result" && `${last} ms — envoyé`}
    </button>
  );
}

export default function ReactionDuelClient({
  sessionId,
  currentUserId,
}: {
  sessionId: string;
  currentUserId: string;
}) {
  const { session, error, sendMove } = useDuelSession(sessionId);

  if (error) return <p className="p-8 text-center text-sm text-red-600">{error}</p>;
  if (!session) return <p className="p-8 text-center text-sm text-gray-400">Chargement...</p>;

  const state: ReactionState = session.state
    ? JSON.parse(session.state)
    : { phase: "p1_turn", times: {} };
  const isPlayer1 = session.player1Id === currentUserId;
  const opponentName = isPlayer1 ? session.player2?.fullName : session.player1.fullName;
  const myTurnNow =
    (state.phase === "p1_turn" && isPlayer1) || (state.phase === "p2_turn" && !isPlayer1);

  async function finishAttempt(ms: number) {
    const times = { ...state.times, [currentUserId]: ms };
    if (state.phase === "p1_turn") {
      await sendMove({
        state: { phase: "p2_turn", times },
        nextTurnId: session!.player2Id,
        status: "active",
      });
    } else {
      const oppId = isPlayer1 ? session!.player2Id : session!.player1Id;
      const oppTime = (oppId && times[oppId]) || Infinity;
      let winnerId: string | null = null;
      if (ms < oppTime) winnerId = currentUserId;
      else if (oppTime < ms) winnerId = oppId;
      await sendMove({
        state: { phase: "done", times },
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
      <h1 className="mt-3 text-xl font-bold">⚡ Réaction rapide — Duel</h1>

      <GameRules
        rules={[
          "Chacun tente sa chance à tour de rôle : un seul essai chacun.",
          "Le temps de réaction le plus court gagne le duel.",
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
            Toi : {state.times[currentUserId]} ms · {opponentName} :{" "}
            {state.times[isPlayer1 ? session.player2Id || "" : session.player1Id]} ms
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
            <ReactionAttempt onFinish={finishAttempt} />
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
