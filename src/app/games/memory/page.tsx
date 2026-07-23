"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const EMOJIS = ["🍎", "🍌", "🍇", "🍉", "🍒", "🥝", "🍍", "🍑"];

function shuffledDeck() {
  const deck = [...EMOJIS, ...EMOJIS].map((e, i) => ({ id: i, emoji: e }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MemoryPage() {
  const [deck, setDeck] = useState(shuffledDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (matched.length === deck.length && deck.length > 0) setRunning(false);
  }, [matched, deck.length]);

  function flip(idx: number) {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    const next = [...flipped, idx];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (deck[a].emoji === deck[b].emoji) {
        setMatched((m) => [...m, a, b]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 700);
      }
    }
  }

  function reset() {
    setDeck(shuffledDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setRunning(true);
  }

  const won = matched.length === deck.length;

  return (
    <div className="mx-auto max-w-md px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🃏 Memory</h1>
      <p className="mt-1 text-sm text-gray-500">
        {moves} coups · {seconds}s
      </p>

      {won && <p className="mt-2 font-semibold text-hublink">🎉 Terminé en {moves} coups !</p>}

      <div className="mx-auto mt-6 grid max-w-xs grid-cols-4 gap-2">
        {deck.map((card, i) => {
          const isVisible = flipped.includes(i) || matched.includes(i);
          return (
            <button
              key={card.id}
              onClick={() => flip(i)}
              className={`flex aspect-square items-center justify-center rounded-lg text-2xl ${
                isVisible ? "bg-white border" : "bg-hublink"
              }`}
            >
              {isVisible ? card.emoji : ""}
            </button>
          );
        })}
      </div>

      <button
        onClick={reset}
        className="mt-6 rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Recommencer
      </button>
    </div>
  );
}
