"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MessageButton({ targetUserId }: { targetUserId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/conversations/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/messages/${data.conversationId}`);
      } else {
        alert(data.error || "Impossible d'envoyer un message.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? "..." : "Message"}
    </button>
  );
}
