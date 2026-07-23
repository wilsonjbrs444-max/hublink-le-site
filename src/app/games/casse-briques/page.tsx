"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GameRules from "@/components/games/GameRules";

const WIDTH = 300;
const HEIGHT = 420;
const PADDLE_WIDTH = 70;
const PADDLE_HEIGHT = 10;
const BALL_RADIUS = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 7;
const BRICK_HEIGHT = 18;
const BRICK_GAP = 4;
const BRICK_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#2563EB"];

export default function CasseBriquesPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const stateRef = useRef({
    paddleX: WIDTH / 2 - PADDLE_WIDTH / 2,
    ballX: WIDTH / 2,
    ballY: HEIGHT - 40,
    ballVX: 2.2,
    ballVY: -2.6,
    bricks: [] as boolean[],
    score: 0,
    lives: 3,
  });

  function initBricks() {
    return Array(BRICK_ROWS * BRICK_COLS).fill(true);
  }

  function resetGame() {
    stateRef.current = {
      paddleX: WIDTH / 2 - PADDLE_WIDTH / 2,
      ballX: WIDTH / 2,
      ballY: HEIGHT - 40,
      ballVX: 2.2,
      ballVY: -2.6,
      bricks: initBricks(),
      score: 0,
      lives: 3,
    };
    setScore(0);
    setLives(3);
    setStatus("playing");
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const brickW = (WIDTH - BRICK_GAP * (BRICK_COLS + 1)) / BRICK_COLS;

    function draw() {
      const s = stateRef.current;
      ctx!.clearRect(0, 0, WIDTH, HEIGHT);

      // Briques
      for (let r = 0; r < BRICK_ROWS; r++) {
        for (let c = 0; c < BRICK_COLS; c++) {
          const idx = r * BRICK_COLS + c;
          if (!s.bricks[idx]) continue;
          const x = BRICK_GAP + c * (brickW + BRICK_GAP);
          const y = BRICK_GAP + r * (BRICK_HEIGHT + BRICK_GAP) + 20;
          ctx!.fillStyle = BRICK_COLORS[r % BRICK_COLORS.length];
          ctx!.fillRect(x, y, brickW, BRICK_HEIGHT);
        }
      }

      // Balle
      ctx!.beginPath();
      ctx!.arc(s.ballX, s.ballY, BALL_RADIUS, 0, Math.PI * 2);
      ctx!.fillStyle = "#0B1230";
      ctx!.fill();

      // Raquette
      ctx!.fillStyle = "#2563EB";
      ctx!.fillRect(s.paddleX, HEIGHT - PADDLE_HEIGHT - 6, PADDLE_WIDTH, PADDLE_HEIGHT);
    }

    function step() {
      const s = stateRef.current;
      if (status === "playing") {
        s.ballX += s.ballVX;
        s.ballY += s.ballVY;

        if (s.ballX <= BALL_RADIUS || s.ballX >= WIDTH - BALL_RADIUS) s.ballVX *= -1;
        if (s.ballY <= BALL_RADIUS) s.ballVY *= -1;

        // Raquette
        if (
          s.ballY + BALL_RADIUS >= HEIGHT - PADDLE_HEIGHT - 6 &&
          s.ballY + BALL_RADIUS <= HEIGHT &&
          s.ballX >= s.paddleX &&
          s.ballX <= s.paddleX + PADDLE_WIDTH &&
          s.ballVY > 0
        ) {
          const hitPos = (s.ballX - s.paddleX) / PADDLE_WIDTH - 0.5;
          s.ballVX = hitPos * 5;
          s.ballVY = -Math.abs(s.ballVY);
        }

        // Briques
        const brickW = (WIDTH - BRICK_GAP * (BRICK_COLS + 1)) / BRICK_COLS;
        for (let r = 0; r < BRICK_ROWS; r++) {
          for (let c = 0; c < BRICK_COLS; c++) {
            const idx = r * BRICK_COLS + c;
            if (!s.bricks[idx]) continue;
            const x = BRICK_GAP + c * (brickW + BRICK_GAP);
            const y = BRICK_GAP + r * (BRICK_HEIGHT + BRICK_GAP) + 20;
            if (
              s.ballX + BALL_RADIUS > x &&
              s.ballX - BALL_RADIUS < x + brickW &&
              s.ballY + BALL_RADIUS > y &&
              s.ballY - BALL_RADIUS < y + BRICK_HEIGHT
            ) {
              s.bricks[idx] = false;
              s.ballVY *= -1;
              s.score += 10;
              setScore(s.score);
            }
          }
        }

        if (s.bricks.every((b) => !b)) {
          setStatus("won");
        }

        if (s.ballY > HEIGHT) {
          s.lives -= 1;
          setLives(s.lives);
          if (s.lives <= 0) {
            setStatus("lost");
          } else {
            s.ballX = WIDTH / 2;
            s.ballY = HEIGHT - 40;
            s.ballVX = 2.2;
            s.ballVY = -2.6;
          }
        }
      }
      draw();
      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [status]);

  function movePaddle(clientX: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * WIDTH;
    stateRef.current.paddleX = Math.max(0, Math.min(WIDTH - PADDLE_WIDTH, x - PADDLE_WIDTH / 2));
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🧱 Casse-briques</h1>
      <p className="mt-1 text-sm text-gray-500">
        Score : {score} · Vies : {"❤️".repeat(Math.max(lives, 0))}
      </p>

      <GameRules
        rules={[
          "Fais glisser ton doigt sur l'écran pour déplacer la raquette.",
          "Renvoie la balle pour détruire toutes les briques.",
          "Tu perds une vie si la balle tombe en bas — 3 vies au total.",
        ]}
      />

      {status === "won" && <p className="mt-2 font-semibold text-hublink">🎉 Toutes les briques détruites !</p>}
      {status === "lost" && <p className="mt-2 font-semibold text-red-600">Perdu ! Score final : {score}</p>}

      <div className="mx-auto mt-4" style={{ width: WIDTH }}>
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="mx-auto touch-none rounded-lg bg-gray-100"
          onMouseMove={(e) => movePaddle(e.clientX)}
          onTouchMove={(e) => movePaddle(e.touches[0].clientX)}
        />
      </div>

      {status !== "playing" && (
        <button
          onClick={resetGame}
          className="mt-6 rounded-md bg-hublink px-6 py-2.5 text-sm font-semibold text-white hover:bg-hublink-dark"
        >
          {status === "idle" ? "Commencer" : "Rejouer"}
        </button>
      )}
    </div>
  );
}
