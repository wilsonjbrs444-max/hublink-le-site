"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

export default function CreateMissionPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    city: "",
    urgency: "flexible",
    categoryId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budget: form.budget ? Number(form.budget) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la publication");
      router.push(`/freelance/${data.mission.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-2xl font-bold">Publier une mission</h1>
      <p className="mt-1 text-sm text-gray-600">
        Décrivez votre besoin, les techniciens vous enverront des offres.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium">Titre de la mission</label>
          <input
            required
            placeholder="Ex: Mon ordinateur ne démarre plus"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            required
            rows={4}
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Catégorie</label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Sélectionner...</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Budget (FCFA)</label>
            <input
              type="number"
              placeholder="25000"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Ville</label>
            <input
              placeholder="Douala"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Urgence</label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.urgency}
            onChange={(e) => setForm({ ...form, urgency: e.target.value })}
          >
            <option value="aujourd_hui">🔴 Aujourd'hui</option>
            <option value="cette_semaine">🟠 Cette semaine</option>
            <option value="flexible">🟢 Flexible</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-hublink py-3 font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
        >
          {loading ? "Publication..." : "Publier la mission"}
        </button>
      </form>
    </div>
  );
}
