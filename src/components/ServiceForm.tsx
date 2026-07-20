"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  serviceId?: string;
  initialData?: {
    title: string;
    icon: string;
    description: string;
    priceIndicative: string;
  };
};

export default function ServiceForm({ serviceId, initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(
    initialData || { title: "", icon: "🛠", description: "", priceIndicative: "Sur devis" }
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = serviceId ? `/api/admin/services/${serviceId}` : "/api/admin/services";
      const method = serviceId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      router.push("/admin/services");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Titre</label>
        <input
          required
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Icône (emoji)</label>
        <input
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          rows={3}
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Prix indicatif</label>
        <input
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={form.priceIndicative}
          onChange={(e) => setForm({ ...form, priceIndicative: e.target.value })}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-hublink py-3 font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
      >
        {loading ? "Enregistrement..." : serviceId ? "Mettre à jour" : "Créer le service"}
      </button>
    </form>
  );
}
