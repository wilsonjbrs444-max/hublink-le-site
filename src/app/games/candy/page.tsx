"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GameRules from "@/components/games/GameRules";
import {
  CANDY_SIZE,
  CANDY_TYPES,
  generateCandyGrid,
  findCandyMatches,
  collapseCandyGrid,
  areAdjacent,
  CandyGrid,
} from "@/lib/games/candy";

const START_MOVES = 25;

export default function CandyPage() {
  const [grid, setGrid] = useState<CandyGrid>(generateCandyGrid);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(START_MOVES);
  const [busy, setBusy] = useState(false);

  const gameOver = moves <= 0;

  function resolveCascades(startGrid: CandyGrid, initialGained: number) {
    let current = startGrid;
    let gained = initialGained;
    let matches = findCandyMatches(current);
    while (matches.size > 0) {
      gained += matches.size * 10;
      current = collapseCandyGrid(current, matches);
      matches = findCandyMatches(current);
    }
    return { grid: current, gained };
  }

  function trySwap(a: number, b: number) {
    if (!areAdjacent(a, b) || busy || gameOver) {
      setSelected(b);
      return;
    }
    const swapped = [...grid];
    [swapped[a], swapped[b]] = [swapped[b], swapped[a]];
    const matches = findCandyMatches(swapped);
    if (matches.size === 0) {
      setSelected(null);
      return; // pas de match, on ne fait rien (l'échange est refusé)
    }
    setBusy(true);
    const { grid: finalGrid, gained } = resolveCascades(swapped, 0);
    setGrid(finalGrid);
    setScore((s) => s + gained);
    setMoves((m) => m - 1);
    setSelected(null);
    setBusy(false);
  }

  function click(i: number) {
    if (busy || gameOver) return;
    if (selected === null) {
      setSelected(i);
      return;
    }
    if (selected === i) {
      setSelected(null);
      return;
    }
    trySwap(selected, i);
  }

  function reset() {
    setGrid(generateCandyGrid());
    setScore(0);
    setMoves(START_MOVES);
    setSelected(null);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🍬 Candy Match</h1>
      <p className="mt-1 text-sm text-gray-500">
        Score : {score} · Coups restants : {moves}
      </p>

      <GameRules
        rules={[
          "Touche un bonbon, puis touche un bonbon adjacent pour les échanger.",
          "Si l'échange aligne 3 bonbons identiques (ligne ou colonne), ils explosent et tu marques des points.",
          "Les bonbons au-dessus tombent et de nouveaux apparaissent — parfois ça enchaîne plusieurs explosions d'affilée !",
          `Tu as ${START_MOVES} coups pour faire le meilleur score possible.`,
        ]}
      />

      {gameOver && (
        <p className="mt-3 font-semibold text-hublink">🎉 Partie terminée ! Score final : {score}</p>
      )}

      <div
        className="mx-auto mt-4 grid gap-0.5 rounded-lg bg-gray-200 p-1"
        style={{ gridTemplateColumns: `repeat(${CANDY_SIZE}, 1fr)`, width: 288 }}
      >
        {grid.map((type, i) => (
          <button
            key={i}
            onClick={() => click(i)}
            disabled={gameOver}
            className={`flex aspect-square items-center justify-center rounded text-lg ${
              selected === i ? "bg-hublink-light ring-2 ring-hublink" : "bg-white"
            }`}
          >
            {CANDY_TYPES[type]}
          </button>
        ))}
      </div>

      <button
        onClick={reset}
        className="mt-6 rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Nouvelle partie
      </button>
    </div>
  );
}
