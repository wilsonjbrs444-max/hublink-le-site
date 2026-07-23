"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import PlayFriendModal from "@/components/games/PlayFriendModal";
import GameRules from "@/components/games/GameRules";

type Phase = "idle" | "waiting" | "ready" | "tooSoon" | "result";

export default function ReactionPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [best, setBest] = useState<number | null>(null);
  const [last, setLast] = useState<number | null>(null);
  const [showFriendModal, setShowFriendModal] = useState(false);
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
      setBest((b) => (b === null ? time : Math.min(b, time)));
      setPhase("result");
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">⚡ Réaction rapide</h1>
      <p className="mt-1 text-sm text-gray-500">
        Meilleur temps : {best !== null ? `${best} ms` : "—"}
      </p>

      <GameRules
        rules={[
          "Attends que l'écran devienne vert, puis tape le plus vite possible.",
          "Si tu tapes trop tôt, c'est raté !",
          "En duel : chacun tente sa chance à tour de rôle, le temps le plus court gagne.",
        ]}
      />

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
      >
        {phase === "idle" && "Toucher pour commencer"}
        {phase === "waiting" && "Attends le vert..."}
        {phase === "ready" && "TAPE !"}
        {phase === "tooSoon" && "Trop tôt ! Recommence"}
        {phase === "result" && `${last} ms — Rejouer`}
      </button>

      {(phase === "tooSoon" || phase === "result") && (
        <button
          onClick={start}
          className="mt-4 rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Réessayer
        </button>
      )}

      <button
        onClick={() => setShowFriendModal(true)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        <Users size={16} /> Défier un ami
      </button>

      {showFriendModal && (
        <PlayFriendModal
          gameType="reaction"
          initialState={{ phase: "p1_turn", times: {} }}
          onClose={() => setShowFriendModal(false)}
        />
      )}
    </div>
  );
}
