"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-hublink hover:underline"
      >
        Changer le mot de passe
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600">
          Mot de passe actuel
        </label>
        <input
          required
          type="password"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600">
          Nouveau mot de passe (8 caractères min.)
        </label>
        <input
          required
          type="password"
          minLength={8}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && (
        <p className="text-xs text-green-600">✓ Mot de passe mis à jour.</p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-hublink px-3 py-1.5 text-xs font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
        >
          {loading ? "..." : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-gray-500 hover:underline"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
