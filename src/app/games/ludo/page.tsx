"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GameRules from "@/components/games/GameRules";

type Friend = { id: string; fullName: string };
type SeatChoice = { mode: "ai" | "friend" | "open"; friendId?: string };

export default function LudoLobbyPage() {
  const router = useRouter();
  const [totalPlayers, setTotalPlayers] = useState(4);
  const [seats, setSeats] = useState<SeatChoice[]>([
    { mode: "ai" },
    { mode: "ai" },
    { mode: "ai" },
  ]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/games/friends")
      .then((r) => r.json())
      .then((d) => setFriends(d.friends || []));
  }, []);

  useEffect(() => {
    setSeats((prev) => {
      const needed = totalPlayers - 1;
      const next = [...prev];
      while (next.length < needed) next.push({ mode: "ai" });
      while (next.length > needed) next.pop();
      return next;
    });
  }, [totalPlayers]);

  function updateSeat(i: number, choice: SeatChoice) {
    setSeats((prev) => prev.map((s, idx) => (idx === i ? choice : s)));
  }

  async function createGame() {
    setLoading(true);
    try {
      const seatPlan = seats.map((s) =>
        s.mode === "ai"
          ? { type: "ai" }
          : s.mode === "friend"
          ? { type: "human", userId: s.friendId }
          : { type: "open" }
      );
      const res = await fetch("/api/ludo/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatPlan }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur.");
        return;
      }
      router.push(`/games/ludo/${data.gameId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold text-center">🎲 Ludo</h1>

      <GameRules
        rules={[
          "2 à 4 joueurs, chacun avec 4 pions à faire sortir de la maison puis à emmener jusqu'au centre.",
          "Il faut un 6 pour sortir un pion de la maison. Un 6 donne aussi un tour supplémentaire.",
          "Atterrir sur un pion adverse (hors case sûre) le renvoie à la maison.",
          "Le premier à ramener ses 4 pions au centre gagne.",
        ]}
      />

      <p className="mt-6 text-sm font-medium text-gray-700">Nombre de joueurs</p>
      <div className="mt-2 flex gap-2">
        {[2, 3, 4].map((n) => (
          <button
            key={n}
            onClick={() => setTotalPlayers(n)}
            className={`flex-1 rounded-md border py-2 text-sm font-semibold ${
              totalPlayers === n ? "border-hublink bg-hublink-light text-hublink" : "text-gray-600"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <p className="mt-5 text-sm text-gray-500">Toi, tu es déjà le joueur 1.</p>

      <div className="mt-2 space-y-3">
        {seats.map((seat, i) => (
          <div key={i} className="rounded-md border p-3">
            <p className="text-xs font-medium text-gray-500">Joueur {i + 2}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => updateSeat(i, { mode: "ai" })}
                className={`flex-1 rounded-md border py-1.5 text-xs font-semibold ${
                  seat.mode === "ai" ? "border-hublink bg-hublink-light text-hublink" : "text-gray-600"
                }`}
              >
                🤖 Ordinateur
              </button>
              <button
                onClick={() => updateSeat(i, { mode: "friend", friendId: friends[0]?.id })}
                className={`flex-1 rounded-md border py-1.5 text-xs font-semibold ${
                  seat.mode === "friend" ? "border-hublink bg-hublink-light text-hublink" : "text-gray-600"
                }`}
              >
                👤 Ami
              </button>
              <button
                onClick={() => updateSeat(i, { mode: "open" })}
                className={`flex-1 rounded-md border py-1.5 text-xs font-semibold ${
                  seat.mode === "open" ? "border-hublink bg-hublink-light text-hublink" : "text-gray-600"
                }`}
              >
                🔗 Lien
              </button>
            </div>
            {seat.mode === "friend" && (
              <select
                value={seat.friendId || ""}
                onChange={(e) => updateSeat(i, { mode: "friend", friendId: e.target.value })}
                className="mt-2 w-full rounded-md border px-2 py-1.5 text-sm"
              >
                <option value="">Choisir un ami...</option>
                {friends.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fullName}
                  </option>
                ))}
              </select>
            )}
            {seat.mode === "friend" && friends.length === 0 && (
              <p className="mt-1 text-xs text-gray-400">
                Tu ne suis personne — choisis plutôt "Lien" pour inviter n'importe qui.
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={createGame}
        disabled={loading}
        className="mt-6 w-full rounded-md bg-hublink py-3 text-sm font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
      >
        {loading ? "Création..." : "Créer la partie"}
      </button>
    </div>
  );
}
