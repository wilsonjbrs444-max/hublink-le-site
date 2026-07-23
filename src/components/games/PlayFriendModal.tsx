"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Copy, Check } from "lucide-react";

type Friend = { id: string; fullName: string; avatarUrl: string | null };

export default function PlayFriendModal({
  gameType,
  initialState,
  onClose,
}: {
  gameType: string;
  initialState?: any;
  onClose: () => void;
}) {
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  async function loadFriends() {
    const res = await fetch("/api/games/friends");
    const data = await res.json();
    setFriends(data.friends || []);
  }

  useEffect(() => {
    loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function challenge(opponentUserId?: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/games/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameType, opponentUserId, initialState }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur.");
        return;
      }
      if (opponentUserId) {
        router.push(`/games/${gameType}/${data.sessionId}`);
      } else {
        setShareLink(`${window.location.origin}/games/${gameType}/${data.sessionId}`);
      }
    } finally {
      setLoading(false);
    }
  }

  function copyLink() {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-sm rounded-t-xl bg-white p-4 sm:rounded-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Jouer avec un ami</h3>
          <button onClick={onClose} aria-label="Fermer">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {shareLink ? (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Envoie ce lien à qui tu veux (WhatsApp, etc.), la personne rejoint
              automatiquement la partie en cliquant dessus :
            </p>
            <div className="mt-2 flex items-center gap-2 rounded-md border bg-gray-50 px-3 py-2">
              <span className="flex-1 truncate text-xs text-gray-700">{shareLink}</span>
              <button onClick={copyLink} aria-label="Copier">
                {copied ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-gray-500" />
                )}
              </button>
            </div>
            <button
              onClick={() => router.push(shareLink.replace(window.location.origin, ""))}
              className="mt-3 w-full rounded-md bg-hublink py-2.5 text-sm font-semibold text-white hover:bg-hublink-dark"
            >
              Ouvrir la partie
            </button>
          </div>
        ) : (
          <div className="mt-3 max-h-72 space-y-1 overflow-y-auto">
            {friends === null && (
              <p className="py-4 text-center text-sm text-gray-400">Chargement...</p>
            )}
            {friends?.length === 0 && (
              <p className="py-2 text-sm text-gray-500">
                Tu ne suis encore personne. Génère plutôt un lien à partager :
              </p>
            )}
            {friends?.map((f) => (
              <button
                key={f.id}
                disabled={loading}
                onClick={() => challenge(f.id)}
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-gray-50 disabled:opacity-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-hublink-light text-sm font-semibold text-hublink">
                  {f.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-800">{f.fullName}</span>
              </button>
            ))}
            <button
              disabled={loading}
              onClick={() => challenge(undefined)}
              className="mt-2 w-full rounded-md border py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? "..." : "🔗 Générer un lien à partager"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
