"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import PlayFriendModal from "@/components/games/PlayFriendModal";
import GameRules from "@/components/games/GameRules";
import { QUIZ_QUESTIONS } from "@/lib/games/quizQuestions";

const ROUND_SIZE = 15;
const DUEL_ROUND_SIZE = 10;

function pickQuestions() {
  const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, ROUND_SIZE);
}

function randomOrder() {
  return Array.from({ length: QUIZ_QUESTIONS.length }, (_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, DUEL_ROUND_SIZE);
}

export default function QuizPage() {
  const [questions, setQuestions] = useState(pickQuestions);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);

  const current = questions[index];

  function answer(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === current.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex((idx) => idx + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 800);
  }

  function reset() {
    setQuestions(pickQuestions());
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 pb-24 text-center">
      <Link href="/games" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft size={15} /> Retour aux jeux
      </Link>
      <h1 className="mt-3 text-xl font-bold">🧠 Quiz</h1>
      <p className="mt-1 text-xs text-gray-400">
        {QUIZ_QUESTIONS.length} questions dans la banque · {ROUND_SIZE} par partie
      </p>

      <GameRules
        rules={[
          "En solo : réponds à 15 questions tirées au hasard, ton score s'affiche à la fin.",
          "En duo : les deux joueurs voient la même question en même temps, le premier qui répond correctement marque le point.",
          "Après chaque question, on passe directement à la suivante.",
          "Celui qui a le plus de points après 10 questions gagne le duel.",
        ]}
      />

      {!finished ? (
        <>
          <p className="mt-4 text-sm text-gray-500">
            Question {index + 1} / {questions.length} · Score : {score}
          </p>
          <p className="mt-6 text-base font-semibold text-gray-800">{current.q}</p>
          <div className="mt-4 space-y-2">
            {current.options.map((opt, i) => {
              const isCorrect = selected !== null && i === current.answer;
              const isWrong = selected === i && i !== current.answer;
              return (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  disabled={selected !== null}
                  className={`block w-full rounded-md border px-4 py-2.5 text-left text-sm ${
                    isCorrect
                      ? "border-green-400 bg-green-50 text-green-700"
                      : isWrong
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <p className="mt-6 text-lg font-semibold text-hublink">
            Score final : {score} / {questions.length}
          </p>
          <button
            onClick={reset}
            className="mt-4 rounded-md bg-hublink px-6 py-2.5 text-sm font-semibold text-white hover:bg-hublink-dark"
          >
            Rejouer
          </button>
        </>
      )}

      <button
        onClick={() => setShowFriendModal(true)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        <Users size={16} /> Défier un ami (duel de rapidité)
      </button>

      {showFriendModal && (
        <PlayFriendModal
          gameType="quiz"
          initialState={{ order: randomOrder(), index: 0, scores: {} }}
          onClose={() => setShowFriendModal(false)}
        />
      )}
    </div>
  );
}
