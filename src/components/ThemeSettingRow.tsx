"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";

const OPTIONS = [
  { value: "light", label: "Clair", Icon: Sun },
  { value: "dark", label: "Sombre", Icon: Moon },
  { value: "system", label: "Système", Icon: Laptop },
];

export default function ThemeSettingRow() {
  const [choice, setChoice] = useState("system");

  useEffect(() => {
    const stored = localStorage.getItem("hublink_theme_choice");
    setChoice(stored || "system");
  }, []);

  function apply(value: string) {
    setChoice(value);
    localStorage.setItem("hublink_theme_choice", value);

    if (value === "system") {
      localStorage.removeItem("hublink_theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    } else {
      localStorage.setItem("hublink_theme", value);
      document.documentElement.classList.toggle("dark", value === "dark");
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="font-medium text-gray-900">Apparence</p>
      <p className="mt-0.5 text-xs text-gray-500">
        Choisis comment HUBLINK s'affiche sur cet appareil.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => apply(o.value)}
            className={`flex flex-col items-center gap-1.5 rounded-lg border py-3 text-xs font-medium transition ${
              choice === o.value
                ? "border-hublink bg-hublink-light text-hublink"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <o.Icon size={18} />
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
