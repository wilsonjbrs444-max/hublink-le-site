"use client";

import { useState, useRef } from "react";
import { FileText } from "lucide-react";

type Props = {
  label: string;
  accept?: string;
  onUploaded: (url: string) => void;
  currentUrl?: string;
};

export default function FileUpload({
  label,
  accept = "image/*,application/pdf",
  onUploaded,
  currentUrl,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'upload");

      setPreview(data.url);
      onUploaded(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  const isImage = preview && /\.(jpe?g|png|webp)$/i.test(preview);

  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="mt-1 flex items-center gap-3">
        {preview && isImage && (
          <img
            src={preview}
            alt=""
            className="h-14 w-14 rounded-md border object-cover"
          />
        )}
        {preview && !isImage && (
          <span className="flex items-center gap-1 text-sm text-green-700">
            <FileText size={16} /> Fichier envoyé
          </span>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? "Envoi..." : preview ? "Changer" : "Choisir un fichier"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
