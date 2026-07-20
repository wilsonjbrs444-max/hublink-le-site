"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SPECIALTIES = [
  "Développement Web",
  "Développement Mobile",
  "Cybersécurité",
  "Réseaux Informatiques",
  "Maintenance PC",
  "Installation Windows/Linux",
  "Caméras de Surveillance",
  "Serveurs",
  "Cloud",
  "Graphisme",
  "Montage vidéo",
  "Marketing digital",
  "Administration systèmes",
  "Autre",
];

export default function BecomeFreelancePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    specialty: "",
    customSpecialty: "",
    bio: "",
    skillsInput: "",
    yearsExperience: "",
    hourlyRate: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.specialty) {
      setError("Choisis ta spécialité principale.");
      return;
    }
    if (form.specialty === "Autre" && !form.customSpecialty.trim()) {
      setError("Précise ton métier (tu as choisi \"Autre\").");
      return;
    }
    setLoading(true);
    try {
      // 1. Active le rôle freelance (crée le profil vide si besoin)
      const activateRes = await fetch("/api/roles/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "freelance" }),
      });
      if (!activateRes.ok) {
        const d = await activateRes.json();
        throw new Error(d.error || "Connecte-toi d'abord pour devenir technicien.");
      }

      // 2. Complète le profil avec les infos du formulaire
      const skills = form.skillsInput
        .split(",")
        .map((s: any) => s.trim())
        .filter(Boolean);

      const finalSpecialty =
        form.specialty === "Autre" ? form.customSpecialty.trim() : form.specialty;

      const res = await fetch("/api/freelance/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialty: finalSpecialty,
          bio: form.bio,
          skills,
          yearsExperience: form.yearsExperience,
          hourlyRate: form.hourlyRate,
          city: form.city,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la mise à jour");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">Devenir technicien HUBLINK</h1>
      <p className="mt-1 text-sm text-gray-600">
        Ton nom et ta photo viennent déjà de ton compte. Dis-nous juste dans
        quoi tu es technicien.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium">
            Tu es technicien en quoi ? *
          </label>
          <select
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.specialty}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
          >
            <option value="">Sélectionner...</option>
            {SPECIALTIES.map((s: any) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {form.specialty === "Autre" && (
          <div>
            <label className="block text-sm font-medium">
              Précise ton métier *
            </label>
            <input
              required
              placeholder="Ex: Technicien en électroménager connecté"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={form.customSpecialty}
              onChange={(e) => setForm({ ...form, customSpecialty: e.target.value })}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            rows={3}
            placeholder="Technicien en réseaux et maintenance PC depuis 3 ans..."
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Autres compétences (séparées par des virgules)
          </label>
          <input
            placeholder="Réseaux, Maintenance PC, Installation Windows"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.skillsInput}
            onChange={(e) => setForm({ ...form, skillsInput: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Années d'expérience</label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={form.yearsExperience}
              onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tarif horaire (FCFA)</label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={form.hourlyRate}
              onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
            />
          </div>
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

        <p className="text-xs text-gray-500">
          Ton nom, ta photo de profil, ton téléphone et ton email (déjà sur
          ton compte) seront visibles par les clients qui te trouvent.
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-hublink py-3 font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
        >
          {loading ? "Activation..." : "Devenir technicien"}
        </button>
      </form>
    </div>
  );
}
