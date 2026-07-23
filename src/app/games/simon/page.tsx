"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const COLORS = [
  { id: 0, bg: "bg-red-500" },
  { id: 1, bg: "bg-green-500" },
  { id: 2, bg: "bg-yellow-400" },
  { id: 3, bg: "bg-blue-500" },
];

export default function SimonPage() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "showing" | "playing" | "over">("idle");
  const [best, setBest] = useState(0);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  function clearTimeouts() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }

  function playSequence(seq: number[]) {
    setStatus("showing");
    seq.forEach((id, i) => {
      timeouts.current.push(
        setTimeout(() => setActiveId(id), i * 700)
      );
      timeouts.current.push(
        setTimeout(() => setActiveId(null), i * 700 + 400)
      );
    });
    timeouts.current.push(
      setTimeout(() => {
        setStatus("playing");
        setPlayerInput([]);
      }, seq.length * 700)
    );
  }

  function start() {
    clearTimeouts();
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first);
    setBest((b) => b);
    playSequence(first);
  }

  function press(id: number) {
    if (status !== "playing") return;
    const next = [...playerInput, id];
    setPlayerInput(next);

    if (sequence[next.length - 1] !== id) {
      clearTimeouts();
      setStatus("over");
      setBest((b) => Math.max(b, sequence.length - 1));
      return;
    }
    if (next.length === sequence.length) {
      const grown = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(grown);
      setTimeout(() => playSequence(grown), 600);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🎵 Simon</h1>
      <p className="mt-1 text-sm text-gray-500">
        Niveau : {Math.max(sequence.length - (status === "playing" ? 0 : 1), 0)} · Record : {best}
      </p>

      {status === "idle" && (
        <button
          onClick={start}
          className="mt-6 rounded-md bg-hublink px-6 py-2.5 text-sm font-semibold text-white hover:bg-hublink-dark"
        >
          Commencer
        </button>
      )}
      {status === "over" && (
        <>
          <p className="mt-4 font-semibold text-red-600">Perdu ! Niveau atteint : {sequence.length - 1}</p>
          <button
            onClick={start}
            className="mt-3 rounded-md bg-hublink px-6 py-2.5 text-sm font-semibold text-white hover:bg-hublink-dark"
          >
            Rejouer
          </button>
        </>
      )}
      {status === "showing" && <p className="mt-4 text-sm text-gray-500">Regarde bien...</p>}
      {status === "playing" && <p className="mt-4 text-sm text-gray-500">À toi de reproduire !</p>}

      {status !== "idle" && (
        <div className="mx-auto mt-6 grid w-56 grid-cols-2 gap-3">
          {COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => press(c.id)}
              className={`aspect-square rounded-xl ${c.bg} ${
                activeId === c.id ? "opacity-100 ring-4 ring-white" : "opacity-60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
