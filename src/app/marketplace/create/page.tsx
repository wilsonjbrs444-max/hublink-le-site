"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";

export default function CreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Active le rôle vendeur automatiquement si ce n'est pas déjà fait
      await fetch("/api/roles/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "seller" }),
      });

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          images: imageUrl ? [imageUrl] : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la création");
      router.push("/marketplace");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">Ajouter un produit</h1>
      <p className="mt-1 text-sm text-gray-600">
        Ton profil vendeur sera activé automatiquement si besoin.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <FileUpload label="Photo du produit" accept="image/*" onUploaded={setImageUrl} />
        <div>
          <label className="block text-sm font-medium">Nom du produit</label>
          <input
            required
            placeholder="Ex: PC portable HP EliteBook"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Prix (FCFA)</label>
            <input
              required
              type="number"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Stock</label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-hublink py-3 font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
        >
          {loading ? "Publication..." : "Mettre en vente"}
        </button>
      </form>
    </div>
  );
}
