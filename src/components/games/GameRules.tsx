"use client";

import { useState } from "react";
import { Info } from "lucide-react";

export default function GameRules({
  title = "Comment jouer",
  rules,
}: {
  title?: string;
  rules: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 rounded-lg border bg-blue-50 text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-blue-800"
      >
        <Info size={15} /> {title}
        <span className="ml-auto text-xs text-blue-500">{open ? "Cacher" : "Voir"}</span>
      </button>
      {open && (
        <ul className="space-y-1 px-3 pb-3 text-xs text-blue-700">
          {rules.map((r, i) => (
            <li key={i}>• {r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
