"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDuelSession } from "@/lib/useDuelSession";
import GameRules from "@/components/games/GameRules";
import { PENDU_ALPHABET, PENDU_MAX_ERRORS } from "@/lib/games/pendu";

type PenduState = {
  phase: "setting_word" | "guessing";
  word: string | null;
  guessed: string[];
};

export default function PenduDuelClient({
  sessionId,
  currentUserId,
}: {
  sessionId: string;
  currentUserId: string;
}) {
  const { session, error, sendMove } = useDuelSession(sessionId);
  const [wordInput, setWordInput] = useState("");

  if (error) return <p className="p-8 text-center text-sm text-red-600">{error}</p>;
  if (!session) return <p className="p-8 text-center text-sm text-gray-400">Chargement...</p>;

  const state: PenduState = session.state
    ? JSON.parse(session.state)
    : { phase: "setting_word", word: null, guessed: [] };

  const isSetter = session.player1Id === currentUserId; // le créateur choisit le mot
  const guesserId = isSetter ? session.player2Id : currentUserId;
  const guesserName = isSetter ? session.player2?.fullName : "toi";
  const opponentName = isSetter ? session.player2?.fullName : session.player1.fullName;

  const errors = state.word
    ? state.guessed.filter((l) => !state.word!.includes(l)).length
    : 0;
  const lost = errors >= PENDU_MAX_ERRORS;
  const won = state.word ? state.word.split("").every((l) => state.guessed.includes(l)) : false;

  async function submitWord(e: React.FormEvent) {
    e.preventDefault();
    const clean = wordInput.trim().toUpperCase().replace(/[^A-Z]/g, "");
    if (clean.length < 3) return;
    await sendMove({
      state: { phase: "guessing", word: clean, guessed: [] },
      nextTurnId: session!.player2Id,
      status: "active",
    });
  }

  async function guess(letter: string) {
    if (isSetter || !state.word || state.guessed.includes(letter) || lost || won) return;
    const guessed = [...state.guessed, letter];
    const newErrors = guessed.filter((l) => !state.word!.includes(l)).length;
    const newWon = state.word.split("").every((l) => guessed.includes(l));
    const newLost = newErrors >= PENDU_MAX_ERRORS;
    const isOver = newWon || newLost;

    await sendMove({
      state: { phase: "guessing", word: state.word, guessed },
      nextTurnId: isOver ? null : session!.player2Id,
      winnerId: isOver ? (newWon ? guesserId : session!.player1Id) : null,
      status: isOver ? "finished" : "active",
    });
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🎯 Pendu — Duel</h1>

      <GameRules
        rules={[
          "Celui qui a créé la partie choisit un mot secret.",
          "L'autre joueur devine le mot lettre par lettre.",
          `Le devineur gagne s'il trouve le mot avant ${PENDU_MAX_ERRORS} erreurs, sinon le créateur gagne.`,
        ]}
      />

      {session.status === "waiting" && (
        <p className="mt-4 text-sm text-gray-500">
          En attente qu'un adversaire rejoigne la partie via le lien...
        </p>
      )}

      {session.status === "active" && state.phase === "setting_word" && (
        <>
          {isSetter ? (
            <form onSubmit={submitWord} className="mt-6">
              <p className="text-sm text-gray-600">Choisis un mot secret pour {opponentName} :</p>
              <input
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                className="mt-2 w-full rounded-md border px-3 py-2 text-center uppercase tracking-widest"
                placeholder="MOTSECRET"
                maxLength={20}
              />
              <button
                type="submit"
                className="mt-3 w-full rounded-md bg-hublink py-2.5 text-sm font-semibold text-white hover:bg-hublink-dark"
              >
                Valider le mot
              </button>
            </form>
          ) : (
            <p className="mt-6 text-sm text-gray-500">
              {opponentName} est en train de choisir un mot pour toi...
            </p>
          )}
        </>
      )}

      {state.phase === "guessing" && state.word && (
        <>
          <p className="mt-3 text-sm text-gray-500">
            {isSetter
              ? `${PENDU_MAX_ERRORS - errors} essai(s) restant(s) pour ${guesserName}`
              : `${PENDU_MAX_ERRORS - errors} essai(s) restant(s)`}
          </p>

          <p className="mt-6 text-3xl font-bold tracking-widest text-gray-800">
            {state.word
              .split("")
              .map((l) => (state.guessed.includes(l) || lost ? l : "_"))
              .join(" ")}
          </p>

          {won && (
            <p className="mt-4 font-semibold text-hublink">
              {isSetter ? `😅 ${guesserName} a trouvé le mot !` : "🎉 Tu as trouvé le mot !"}
            </p>
          )}
          {lost && (
            <p className="mt-4 font-semibold text-red-600">
              {isSetter ? "🎉 Ton mot n'a pas été trouvé, tu gagnes !" : `😅 Perdu ! Le mot était ${state.word}.`}
            </p>
          )}

          {!isSetter && (
            <div className="mx-auto mt-6 grid max-w-xs grid-cols-7 gap-1.5">
              {PENDU_ALPHABET.map((l) => {
                const used = state.guessed.includes(l);
                const correct = used && state.word!.includes(l);
                return (
                  <button
                    key={l}
                    onClick={() => guess(l)}
                    disabled={used || lost || won}
                    className={`flex h-9 items-center justify-center rounded text-sm font-semibold ${
                      used
                        ? correct
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-500"
                        : "bg-white border text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
