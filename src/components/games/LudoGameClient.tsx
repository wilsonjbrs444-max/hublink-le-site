"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLudoSession } from "@/lib/useLudoSession";
import LudoBoard from "@/components/games/LudoBoard";
import GameRules from "@/components/games/GameRules";
import { getValidPawnMoves, LUDO_COLOR_HEX, LudoColor } from "@/lib/games/ludo";

const DICE_FACES = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export default function LudoGameClient({
  gameId,
  currentUserId,
}: {
  gameId: string;
  currentUserId: string;
}) {
  const { game, error, roll, move } = useLudoSession(gameId);
  const [rolling, setRolling] = useState(false);

  if (error) return <p className="p-8 text-center text-sm text-red-600">{error}</p>;
  if (!game) return <p className="p-8 text-center text-sm text-gray-400">Chargement...</p>;

  const { state, seats } = game;
  const currentColor = state.activeColors[state.turnIndex] as LudoColor;
  const currentSeat = seats.find((s) => s.color === currentColor);
  const mySeat = seats.find((s) => s.userId === currentUserId);
  const myColor = (mySeat?.color as LudoColor) || null;
  const myTurn = currentSeat?.userId === currentUserId;
  const validMoves =
    myTurn && state.diceRolled && state.diceValue
      ? getValidPawnMoves(state.pawns, currentColor, state.diceValue)
      : [];

  async function handleRoll() {
    setRolling(true);
    try {
      await roll();
    } finally {
      setRolling(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-6 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🎲 Ludo</h1>

      <GameRules
        rules={[
          "Il faut un 6 pour sortir un pion, un 6 donne un tour supplémentaire.",
          "Capture un pion adverse en tombant dessus (hors case sûre = case colorée de départ).",
          "Premier à ramener ses 4 pions au centre : gagné !",
        ]}
      />

      {game.status === "waiting" && (
        <p className="mt-4 text-sm text-gray-500">
          En attente que tous les joueurs rejoignent via le lien...
        </p>
      )}

      {game.status !== "waiting" && (
        <>
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
            {seats.map((s) => (
              <span
                key={s.color}
                className="flex items-center gap-1 rounded-full px-2 py-1 font-medium text-white"
                style={{
                  backgroundColor: LUDO_COLOR_HEX[s.color as LudoColor],
                  outline: s.color === currentColor ? "2px solid #0B1230" : "none",
                }}
              >
                {s.name || "En attente..."} {s.type === "ai" && "🤖"}
              </span>
            ))}
          </div>

          {game.status === "finished" ? (
            <p className="mt-4 text-lg font-semibold text-hublink">
              {state.winner === myColor
                ? "🎉 Tu as gagné !"
                : `Partie terminée — ${
                    seats.find((s) => s.color === state.winner)?.name
                  } a gagné.`}
            </p>
          ) : (
            <p className="mt-3 text-sm font-medium" style={{ color: LUDO_COLOR_HEX[currentColor] }}>
              {myTurn ? "À toi de jouer" : `Tour de ${currentSeat?.name || "..."}`}
            </p>
          )}

          <LudoBoard
            state={state}
            activeColors={state.activeColors}
            myColor={myColor}
            validPawnIndices={validMoves}
            onPawnClick={(idx) => move(idx)}
          />

          {myTurn && game.status === "active" && (
            <div className="mt-4">
              {!state.diceRolled ? (
                <button
                  onClick={handleRoll}
                  disabled={rolling}
                  className="rounded-md bg-hublink px-6 py-2.5 text-lg font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
                >
                  {rolling ? "..." : "🎲 Lancer le dé"}
                </button>
              ) : (
                <p className="text-sm text-gray-600">
                  Dé : {DICE_FACES[state.diceValue || 0]} ({state.diceValue}) — choisis un pion à
                  déplacer sur le plateau
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
