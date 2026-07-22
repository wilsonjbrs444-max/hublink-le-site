"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

export default function FavoriteButton({
  targetType,
  targetId,
  initialFavorited,
  isLoggedIn,
  size = 20,
  showLabel = false,
}: {
  targetType: "product" | "mission" | "technician";
  targetId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
  size?: number;
  showLabel?: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setFavorited((prev) => !prev);
    try {
      const res = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId }),
      });
      const data = await res.json();
      if (res.ok) {
        setFavorited(data.favorited);
      } else {
        setFavorited((prev) => !prev);
      }
    } catch {
      setFavorited((prev) => !prev);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
        favorited
          ? "border-red-200 bg-red-50 text-red-600"
          : "border-gray-200 text-gray-500 hover:bg-gray-50"
      }`}
    >
      <Heart size={size} className={favorited ? "fill-red-500 text-red-500" : ""} />
      {showLabel && (favorited ? "Enregistré" : "Enregistrer")}
    </button>
  );
}
