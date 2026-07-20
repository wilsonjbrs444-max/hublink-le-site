"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";

export default function VerificationPage() {
  const router = useRouter();
  const [docs, setDocs] = useState({
    cniDocumentUrl: "",
    diplomaDocumentUrl: "",
    certificateDocumentUrl: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!docs.cniDocumentUrl || !docs.diplomaDocumentUrl) {
      setError("La CNI et le diplôme sont obligatoires.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/freelance/verification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docs),
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

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">Vérification technicien</h1>
      <p className="mt-1 text-sm text-gray-600">
        Envoie tes documents pour obtenir le badge "✓ Technicien certifié
        HUBLINK" (photo ou PDF, 5 Mo max).
      </p>

      {success ? (
        <div className="mt-8 rounded-md bg-green-50 p-4 text-sm text-green-700">
          ✅ Tes documents ont été envoyés. Statut : en attente de validation
          par notre équipe.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <FileUpload
            label="Ta CNI *"
            onUploaded={(url) => setDocs({ ...docs, cniDocumentUrl: url })}
          />
          <FileUpload
            label="Ton diplôme *"
            onUploaded={(url) => setDocs({ ...docs, diplomaDocumentUrl: url })}
          />
          <FileUpload
            label="Un certificat (optionnel)"
            onUploaded={(url) =>
              setDocs({ ...docs, certificateDocumentUrl: url })
            }
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-hublink py-3 font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Envoyer pour vérification"}
          </button>
        </form>
      )}
    </div>
  );
}
