"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const QUESTIONS = [
  { q: "Quelle est la capitale économique du Cameroun ?", options: ["Yaoundé", "Douala", "Garoua", "Bafoussam"], answer: 1 },
  { q: "Que signifie « HTTP » ?", options: ["HyperText Transfer Protocol", "High Tech Transfer Point", "Home Tool Transfer Program", "Hyperlink Text Tool Process"], answer: 0 },
  { q: "Combien y a-t-il de Go dans 1 To ?", options: ["100", "1000", "10000", "10"], answer: 1 },
  { q: "Quel langage est utilisé pour structurer une page web ?", options: ["CSS", "Python", "HTML", "SQL"], answer: 2 },
  { q: "Quelle entreprise a créé le langage JavaScript ?", options: ["Microsoft", "Netscape", "Google", "Apple"], answer: 1 },
  { q: "Quel est le plus long fleuve du Cameroun ?", options: ["Le Nil", "La Sanaga", "Le Congo", "Le Niger"], answer: 1 },
  { q: "Que veut dire « Wi-Fi » à l'origine ?", options: ["Wireless Fidelity", "Wire Free", "Wide Field", "Web Finder"], answer: 0 },
  { q: "Quel est le format d'image le plus compressé ?", options: ["BMP", "PNG", "JPEG", "TIFF"], answer: 2 },
  { q: "En quelle année le Cameroun a-t-il obtenu son indépendance ?", options: ["1958", "1960", "1962", "1965"], answer: 1 },
  { q: "Quel composant est le « cerveau » d'un ordinateur ?", options: ["RAM", "Disque dur", "CPU", "Carte graphique"], answer: 2 },
];

export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const current = QUESTIONS[index];

  function answer(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === current.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (index + 1 < QUESTIONS.length) {
        setIndex((idx) => idx + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 800);
  }

  function reset() {
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

      {!finished ? (
        <>
          <p className="mt-1 text-sm text-gray-500">
            Question {index + 1} / {QUESTIONS.length} · Score : {score}
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
            Score final : {score} / {QUESTIONS.length}
          </p>
          <button
            onClick={reset}
            className="mt-4 rounded-md bg-hublink px-6 py-2.5 text-sm font-semibold text-white hover:bg-hublink-dark"
          >
            Rejouer
          </button>
        </>
      )}
    </div>
  );
}
