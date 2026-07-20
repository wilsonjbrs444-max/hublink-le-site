"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";

type Props = {
  initialData: {
    fullName: string;
    city: string;
    bio: string;
    avatarUrl: string;
    coverUrl: string;
  };
};

export default function EditProfileForm({ initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initialData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la mise à jour");
      router.push(`/profile/${data.user.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Aperçu couverture + avatar */}
      <div className="relative">
        <div className="h-32 w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-green-400">
          {form.coverUrl && (
            <img src={form.coverUrl} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="absolute -bottom-8 left-4 h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-hublink-light">
          {form.avatarUrl ? (
            <img src={form.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-hublink">
              {form.fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 pt-6 sm:grid-cols-2">
        <FileUpload
          label="Photo de profil"
          accept="image/*"
          currentUrl={form.avatarUrl}
          onUploaded={(url) => setForm({ ...form, avatarUrl: url })}
        />
        <FileUpload
          label="Photo de couverture"
          accept="image/*"
          currentUrl={form.coverUrl}
          onUploaded={(url) => setForm({ ...form, coverUrl: url })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Nom complet</label>
        <input
          required
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Ville</label>
        <input
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Bio / À propos</label>
        <textarea
          rows={3}
          maxLength={160}
          placeholder="Quelques mots sur toi..."
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
        <p className="mt-1 text-right text-xs text-gray-400">
          {form.bio.length}/160
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-hublink py-3 font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
      >
        {loading ? "Enregistrement..." : "Enregistrer le profil"}
      </button>
    </form>
  );
}
