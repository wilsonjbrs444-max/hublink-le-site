"use client";

import { useEffect, useState } from "react";

// Poll le statut en ligne d'un groupe d'utilisateurs (listes de conversations,
// cartes de techniciens, etc.) en un seul appel réseau plutôt qu'un par carte.
export function useOnlineStatuses(
  ids: string[],
  initial: Record<string, boolean> = {}
) {
  const [statuses, setStatuses] = useState<Record<string, boolean>>(initial);
  const key = ids.slice().sort().join(",");

  useEffect(() => {
    if (!key) return;
    let cancelled = false;

    async function refresh() {
      try {
        const res = await fetch(`/api/presence/status?ids=${key}`);
        const data = await res.json();
        if (!cancelled && data.statuses) {
          setStatuses((prev) => ({ ...prev, ...data.statuses }));
        }
      } catch {
        // silencieux : on garde les derniers statuts connus
      }
    }

    refresh();
    const interval = setInterval(refresh, 20000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [key]);

  return statuses;
}
