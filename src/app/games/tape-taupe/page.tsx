"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import PlayFriendModal from "@/components/games/PlayFriendModal";
import GameRules from "@/components/games/GameRules";

const HOLES = 9;
const DURATION = 30;

export default function TapeLaTaupePage() {
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const moleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      setActiveHole(null);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
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

  function start() {
    setScore(0);
    setTimeLeft(DURATION);
    setRunning(true);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🔨 Tape-la-taupe</h1>
      <p className="mt-1 text-sm text-gray-500">
        Score : {score} · Temps : {timeLeft}s
      </p>

      <GameRules
        rules={[
          "Tape sur la taupe dès qu'elle sort du trou.",
          `Tu as ${DURATION} secondes pour marquer un maximum de points.`,
          "En duel : chacun joue son propre round de 30 secondes, celui qui a le meilleur score gagne.",
        ]}
      />

      {!running && timeLeft === DURATION && (
        <button
          onClick={start}
          className="mt-6 rounded-md bg-hublink px-6 py-2.5 text-sm font-semibold text-white hover:bg-hublink-dark"
        >
          Commencer
        </button>
      )}
      {!running && timeLeft === 0 && (
        <>
          <p className="mt-3 font-semibold text-hublink">Terminé ! Score : {score}</p>
          <button
            onClick={start}
            className="mt-3 rounded-md bg-hublink px-6 py-2.5 text-sm font-semibold text-white hover:bg-hublink-dark"
          >
            Rejouer
          </button>
        </>
      )}

      {(running || (timeLeft > 0 && timeLeft < DURATION)) && (
        <div className="mx-auto mt-6 grid w-64 grid-cols-3 gap-3">
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

      <button
        onClick={() => setShowFriendModal(true)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        <Users size={16} /> Défier un ami
      </button>

      {showFriendModal && (
        <PlayFriendModal
          gameType="tape-taupe"
          initialState={{ phase: "p1_turn", scores: {} }}
          onClose={() => setShowFriendModal(false)}
        />
      )}
    </div>
  );
}
