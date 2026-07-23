"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { LudoState } from "@/lib/games/ludo";

export type LudoSeat = {
  color: string;
  type: "human" | "ai" | "open";
  userId: string | null;
  name: string | null;
};

export type LudoGame = {
  id: string;
  seats: LudoSeat[];
  state: LudoState;
  status: "waiting" | "active" | "finished";
  createdBy: string;
};

export function useLudoSession(gameId: string) {
  const [game, setGame] = useState<LudoGame | null>(null);
  const [error, setError] = useState("");
  const aiInFlight = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/ludo/${gameId}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur");
        return;
      }
      setGame(data.game);
    } catch {
      // on réessaiera au prochain cycle
    }
  }, [gameId]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Si c'est le tour d'une IA, un des clients connectés déclenche son coup
  useEffect(() => {
    if (!game || game.status !== "active" || aiInFlight.current) return;
    const currentColor = game.state.activeColors[game.state.turnIndex];
    const seat = game.seats.find((s) => s.color === currentColor);
    if (seat?.type === "ai") {
      aiInFlight.current = true;
      const t = setTimeout(async () => {
        try {
          await fetch(`/api/ludo/${gameId}/ai-move`, { method: "POST" });
          await refresh();
        } finally {
          aiInFlight.current = false;
        }
      }, 900);
      return () => clearTimeout(t);
    }
  }, [game, gameId, refresh]);

  async function roll() {
    const res = await fetch(`/api/ludo/${gameId}/roll`, { method: "POST" });
    const data = await res.json();
    if (res.ok) setGame(data.game);
    return data;
  }

  async function move(pawnIndex: number) {
    const res = await fetch(`/api/ludo/${gameId}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pawnIndex }),
    });
    const data = await res.json();
    if (res.ok) setGame(data.game);
    return data;
  }

  return { game, error, roll, move };
}
