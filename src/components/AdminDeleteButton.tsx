"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function AdminDeleteButton({
  url,
  label = "Supprimer",
}: {
  url: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch(url, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="font-semibold text-red-600 hover:underline"
        >
          Confirmer
        </button>
        <button onClick={() => setConfirming(false)} className="text-gray-400 hover:underline">
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1 text-xs font-medium text-red-500 hover:underline"
    >
      <Trash2 size={13} /> {label}
    </button>
  );
}
