"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Trash2 } from "lucide-react";

export default function ProductOwnerActions({
  productId,
  isSold,
}: {
  productId: string;
  isSold: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function toggleSold() {
    setLoading(true);
    try {
      await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSold: !isSold }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch(`/api/products/${productId}`, { method: "DELETE" });
      router.push("/marketplace");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={toggleSold}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        {isSold ? "Remettre en vente" : (<><CheckCircle2 size={15} /> Marquer comme vendu</>)}
      </button>

      {confirmingDelete ? (
        <>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            Confirmer la suppression
          </button>
          <button
            onClick={() => setConfirmingDelete(false)}
            className="rounded-md px-3 py-2 text-sm text-gray-500 hover:underline"
          >
            Annuler
          </button>
        </>
      ) : (
        <button
          onClick={() => setConfirmingDelete(true)}
          className="flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          <Trash2 size={15} /> Supprimer l'annonce
        </button>
      )}
    </div>
  );
}
