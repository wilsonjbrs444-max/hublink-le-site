"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "Trouve un technicien informatique près de chez toi.",
  "Publie une mission, reçois des offres en quelques heures.",
  "Achète et vends du matériel informatique en confiance.",
  "Des services pros : réseaux, cybersécurité, développement...",
];

export default function RotatingTagline() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 400);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className={`mx-auto mt-4 max-w-2xl text-lg text-gray-600 transition-opacity duration-400 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {PHRASES[index]}
    </p>
  );
}
