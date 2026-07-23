"use client";

import { useEffect, useState, useCallback } from "react";

export type GameSession = {
  id: string;
  gameType: string;
  player1Id: string;
  player2Id: string | null;
  state: string;
  status: "waiting" | "active" | "finished";
  turnId: string | null;
  winnerId: string | null;
  player1: { id: string; fullName: string };
  player2: { id: string; fullName: string } | null;
};

export function useDuelSession(sessionId: string) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/games/${sessionId}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur");
        return;
      }
      setSession(data.session);
    } catch {
      // silencieux, on réessaiera au prochain poll
    }
  }, [sessionId]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [refresh]);

  async function sendMove(payload: {
    state: any;
    nextTurnId: string | null;
    winnerId?: string | null;
    status?: string;
  }) {
    const res = await fetch(`/api/games/${sessionId}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) setSession(data.session);
    return res.ok;
  }

  return { session, error, refresh, sendMove };
}
