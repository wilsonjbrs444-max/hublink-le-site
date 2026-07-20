"use client";

import { useState } from "react";

export default function ServiceRequestForm({ slug }: { slug: string }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/services/${slug}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
        ✅ Ta demande a été envoyée. Notre équipe te recontacte rapidement.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        required
        rows={4}
        placeholder="Décris ton besoin pour ce service..."
        className="w-full rounded-md border px-3 py-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-hublink py-2.5 font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
      >
        {loading ? "Envoi..." : "Demander un devis gratuit"}
      </button>
    </form>
  );
}
