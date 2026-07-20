"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OfferForm({ missionId }: { missionId: string }) {
  const router = useRouter();
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/missions/${missionId}/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");
      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
        ✅ Ton offre a été envoyée au client !
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border bg-white p-5">
      <h3 className="font-semibold">Faire une offre</h3>
      <div>
        <label className="block text-sm font-medium">Ton prix (FCFA)</label>
        <input
          required
          type="number"
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Message</label>
        <textarea
          rows={3}
          placeholder="Je peux intervenir aujourd'hui..."
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-hublink py-2 font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
      >
        {loading ? "Envoi..." : "Envoyer mon offre"}
      </button>
    </form>
  );
}
