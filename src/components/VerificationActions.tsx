"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerificationActions({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function decide(decision: "certifie" | "rejete") {
    setLoading(true);
    try {
      await fetch(`/api/admin/verifications/${profileId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => decide("certifie")}
        disabled={loading}
        className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
      >
        ✓ Certifier
      </button>
      <button
        onClick={() => decide("rejete")}
        disabled={loading}
        className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
      >
        Rejeter
      </button>
    </div>
  );
}
