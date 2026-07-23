"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";

const SIZE = 14;
type Point = { x: number; y: number };

function randomFood(snake: Point[]): Point {
  let food: Point;
  do {
    food = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
}

export default function SnakePage() {
  const [snake, setSnake] = useState<Point[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Point>(() => randomFood([{ x: 7, y: 7 }]));
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  const changeDir = useCallback((nx: number, ny: number) => {
    if (dirRef.current.x === -nx && dirRef.current.y === -ny) return; // pas de demi-tour
    setDir({ x: nx, y: ny });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowUp") changeDir(0, -1);
      if (e.key === "ArrowDown") changeDir(0, 1);
      if (e.key === "ArrowLeft") changeDir(-1, 0);
      if (e.key === "ArrowRight") changeDir(1, 0);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [changeDir]);

  useEffect(() => {
    if (!running || gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };
        if (
          head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE ||
          prev.some((s) => s.x === head.x && s.y === head.y)
        ) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }
        const ate = head.x === food.x && head.y === food.y;
        const next = [head, ...prev];
        if (ate) {
          setScore((s) => s + 1);
          setFood(randomFood(next));
        } else {
          next.pop();
        }
        return next;
      });
    }, 160);
    return () => clearInterval(interval);
  }, [running, gameOver, food]);

  function reset() {
    setSnake([{ x: 7, y: 7 }]);
    setFood(randomFood([{ x: 7, y: 7 }]));
    setDir({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setRunning(true);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🐍 Snake</h1>
      <p className="mt-1 text-sm text-gray-500">Score : {score}</p>
      {gameOver && <p className="mt-2 font-semibold text-red-600">Partie terminée !</p>}

      <div
        className="mx-auto mt-4 grid bg-gray-800"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
          width: 280,
          height: 280,
        }}
      >
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const x = i % SIZE;
          const y = Math.floor(i / SIZE);
          const isSnake = snake.some((s) => s.x === x && s.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={i}
              className={
                isHead
                  ? "bg-green-400"
                  : isSnake
                  ? "bg-green-600"
                  : isFood
                  ? "bg-red-500"
                  : "bg-gray-900"
              }
            />
          );
        })}
      </div>

      <div className="mx-auto mt-4 grid w-32 grid-cols-3 gap-1">
        <div />
        <button onClick={() => changeDir(0, -1)} className="rounded-md border bg-white p-2"><ArrowUp size={16} className="mx-auto" /></button>
        <div />
        <button onClick={() => changeDir(-1, 0)} className="rounded-md border bg-white p-2"><ArrowLeft size={16} className="mx-auto" /></button>
        <button onClick={() => changeDir(0, 1)} className="rounded-md border bg-white p-2"><ArrowDown size={16} className="mx-auto" /></button>
        <button onClick={() => changeDir(1, 0)} className="rounded-md border bg-white p-2"><ArrowRight size={16} className="mx-auto" /></button>
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
