"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

export default function MessageSellerButton({
  targetUserId,
  initialMessage,
  label = "Écrire au vendeur",
  fullWidth = true,
}: {
  targetUserId: string;
  initialMessage: string;
  label?: string;
  fullWidth?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/conversations/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, initialMessage }),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      router.push(`/messages/${data.conversationId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center justify-center gap-2 rounded-md bg-hublink py-3 px-4 font-semibold text-white hover:bg-hublink-dark disabled:opacity-50 ${
          fullWidth ? "w-full" : ""
        }`}
      >
        {loading ? "..." : (<><MessageCircle size={17} /> {label}</>)}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
