"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ToggleAdminButton({
  userId,
  isAdmin,
}: {
  userId: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await fetch(`/api/admin/users/${userId}/toggle-admin`, { method: "POST" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-md px-2 py-1 text-xs font-semibold disabled:opacity-50 ${
        isAdmin
          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
          : "bg-purple-50 text-purple-600 hover:bg-purple-100"
      }`}
    >
      {isAdmin ? "Retirer admin" : "Rendre admin"}
    </button>
  );
}
