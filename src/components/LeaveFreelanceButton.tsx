"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LeaveFreelanceButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  async function handleLeave() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/freelance/profile", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="mt-2 text-xs">
        <p className="text-gray-600">Confirmer l'arrêt du mode technicien ?</p>
        <div className="mt-1 flex gap-2">
          <button
            onClick={handleLeave}
            disabled={loading}
            className="rounded-md bg-red-600 px-2 py-1 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "..." : "Confirmer"}
          </button>
          <button onClick={() => setConfirming(false)} className="text-gray-500 hover:underline">
            Annuler
          </button>
        </div>
        {error && <p className="mt-1 text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="mt-2 text-xs font-medium text-red-600 hover:underline"
    >
      Quitter le mode technicien
    </button>
  );
}
