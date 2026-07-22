"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteMissionButton({ missionId }: { missionId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!confirm("Confirmer que cette mission est bien terminée ?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/missions/${missionId}/complete`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur.");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "..." : "✅ Marquer la mission comme terminée"}
    </button>
  );
}
