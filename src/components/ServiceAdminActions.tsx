"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ServiceAdminActions({
  serviceId,
  isActive,
}: {
  serviceId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function toggleActive() {
    setLoading(true);
    try {
      await fetch(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch(`/api/admin/services/${serviceId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleActive}
        disabled={loading}
        className="text-xs font-medium text-gray-600 hover:underline disabled:opacity-50"
      >
        {isActive ? "Désactiver" : "Activer"}
      </button>
      {confirming ? (
        <>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Confirmer
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="text-xs text-gray-400 hover:underline"
          >
            Annuler
          </button>
        </>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="text-xs font-medium text-red-500 hover:underline"
        >
          Supprimer
        </button>
      )}
    </div>
  );
}
