"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";

type Grid = number[][]; // 4x4, 0 = vide

function emptyGrid(): Grid {
  return Array.from({ length: 4 }, () => Array(4).fill(0));
}

function addRandomTile(grid: Grid): Grid {
  const empty: [number, number][] = [];
  grid.forEach((row, r) => row.forEach((v, c) => v === 0 && empty.push([r, c])));
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = grid.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slideRowLeft(row: number[]): { row: number[]; gained: number; moved: boolean } {
  const vals = row.filter((v) => v !== 0);
  let gained = 0;
  for (let i = 0; i < vals.length - 1; i++) {
    if (vals[i] === vals[i + 1]) {
      vals[i] *= 2;
      gained += vals[i];
      vals.splice(i + 1, 1);
    }
  }
  while (vals.length < 4) vals.push(0);
  const moved = vals.some((v, i) => v !== row[i]);
  return { row: vals, gained, moved };
}

function rotateGrid(grid: Grid): Grid {
  const next = emptyGrid();
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) next[c][3 - r] = grid[r][c];
  return next;
}

function moveGrid(grid: Grid, dir: "left" | "right" | "up" | "down") {
  let g = grid;
  let rotations = 0;
  if (dir === "up") rotations = 3;
  else if (dir === "right") rotations = 2;
  else if (dir === "down") rotations = 1;
  for (let i = 0; i < rotations; i++) g = rotateGrid(g);

  let gained = 0;
  let moved = false;
  const newGrid = g.map((row) => {
    const res = slideRowLeft(row);
    gained += res.gained;
    if (res.moved) moved = true;
    return res.row;
  });

  let result = newGrid;
  for (let i = 0; i < (4 - rotations) % 4; i++) result = rotateGrid(result);
  return { grid: result, gained, moved };
}

export default function Game2048Page() {
  const [grid, setGrid] = useState<Grid>(() => addRandomTile(addRandomTile(emptyGrid())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const move = useCallback(
    (dir: "left" | "right" | "up" | "down") => {
      const { grid: next, gained, moved } = moveGrid(grid, dir);
      if (!moved) return;
      const withTile = addRandomTile(next);
      setGrid(withTile);
      setScore((s) => {
        const ns = s + gained;
        setBest((b) => Math.max(b, ns));
        return ns;
      });
    },
    [grid]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") move("left");
      if (e.key === "ArrowRight") move("right");
      if (e.key === "ArrowUp") move("up");
      if (e.key === "ArrowDown") move("down");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 25) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left");
    else move(dy > 0 ? "down" : "up");
    touchStart.current = null;
  }

  const gameOver =
    !moveGrid(grid, "left").moved &&
    !moveGrid(grid, "right").moved &&
    !moveGrid(grid, "up").moved &&
    !moveGrid(grid, "down").moved;

  function reset() {
    setGrid(addRandomTile(addRandomTile(emptyGrid())));
    setScore(0);
  }

  const tileColors: Record<number, string> = {
    2: "bg-gray-100 text-gray-700", 4: "bg-gray-200 text-gray-700",
    8: "bg-orange-200 text-white", 16: "bg-orange-300 text-white",
    32: "bg-orange-400 text-white", 64: "bg-orange-500 text-white",
    128: "bg-yellow-300 text-white", 256: "bg-yellow-400 text-white",
    512: "bg-yellow-500 text-white", 1024: "bg-yellow-600 text-white",
    2048: "bg-hublink text-white",
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🔢 2048</h1>
      <p className="mt-1 text-sm text-gray-500">
        Score : {score} · Record : {best}
      </p>

      {gameOver && <p className="mt-2 font-semibold text-red-600">Partie terminée !</p>}

      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="mx-auto mt-4 grid w-72 grid-cols-4 gap-2 rounded-lg bg-gray-300 p-2"
      >
        {grid.flat().map((v, i) => (
          <div
            key={i}
            className={`flex aspect-square items-center justify-center rounded-md text-xl font-bold ${
              v ? tileColors[v] || "bg-hublink-dark text-white" : "bg-gray-200"
            }`}
          >
            {v || ""}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-4 grid w-32 grid-cols-3 gap-1">
        <div />
        <button onClick={() => move("up")} className="rounded-md border bg-white p-2"><ArrowUp size={16} className="mx-auto" /></button>
        <div />
        <button onClick={() => move("left")} className="rounded-md border bg-white p-2"><ArrowLeft size={16} className="mx-auto" /></button>
        <button onClick={() => move("down")} className="rounded-md border bg-white p-2"><ArrowDown size={16} className="mx-auto" /></button>
        <button onClick={() => move("right")} className="rounded-md border bg-white p-2"><ArrowRight size={16} className="mx-auto" /></button>
      </div>
      <p className="mt-1 text-xs text-gray-400">Ou glisse ton doigt sur la grille</p>

      <button
        onClick={reset}
        className="mt-6 rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Recommencer
      </button>
    </div>
  );
}
