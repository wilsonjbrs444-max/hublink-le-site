"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SupportTicketForm() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");
      setSubject("");
      setDescription("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border bg-white p-5">
      <h2 className="font-semibold">Ouvrir un ticket</h2>
      <div>
        <label className="block text-sm font-medium">Sujet</label>
        <input
          required
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          rows={3}
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-hublink px-4 py-2 text-sm font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
      >
        {loading ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}
