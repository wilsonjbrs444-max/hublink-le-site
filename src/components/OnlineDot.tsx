"use client";

import { useEffect, useState } from "react";

export function StaticOnlineDot({
  online,
  size = "md",
  className = "",
}: {
  online: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-2 w-2 border",
    md: "h-2.5 w-2.5 border-2",
    lg: "h-3.5 w-3.5 border-2",
  }[size];

  return (
    <span
      className={`block rounded-full border-white dark:border-gray-950 ${sizeClasses} ${
        online ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
      } ${className}`}
      title={online ? "En ligne" : "Hors ligne"}
      aria-label={online ? "En ligne" : "Hors ligne"}
    />
  );
}

// Point de présence positionné en bas à droite d'un avatar (façon Messenger).
// Se met à jour toutes les 20s pour un seul utilisateur (ex: profil, en-tête
// de conversation).
export default function OnlineDot({
  userId,
  initialOnline,
  size = "md",
}: {
  userId: string;
  initialOnline: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [online, setOnline] = useState(initialOnline);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const res = await fetch(`/api/presence/status?ids=${userId}`);
        const data = await res.json();
        if (!cancelled && typeof data.statuses?.[userId] === "boolean") {
          setOnline(data.statuses[userId]);
        }
      } catch {
        // silencieux : on garde le dernier statut connu
      }
    }

    const interval = setInterval(refresh, 20000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [userId]);

  return (
    <StaticOnlineDot
      online={online}
      size={size}
      className="absolute bottom-0 right-0"
    />
  );
}
