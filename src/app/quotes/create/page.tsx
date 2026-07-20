"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateQuotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la création");
      router.push(`/quotes/${data.quote.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">Demander un devis</h1>
      <p className="mt-1 text-sm text-gray-600">
        Ex : "J'ai besoin de 15 ordinateurs" ou "Installer 30 caméras".
        Ton profil entreprise sera activé automatiquement.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium">Titre</label>
          <input
            placeholder="Ex: Équipement de 15 postes de travail"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description du besoin</label>
          <textarea
            required
            rows={5}
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-hublink py-3 font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Envoyer la demande"}
        </button>
      </form>
    </div>
  );
}
