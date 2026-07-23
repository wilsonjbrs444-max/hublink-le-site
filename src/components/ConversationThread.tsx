"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Gamepad2 } from "lucide-react";

type Message = {
  id: string;
  content: string;
  imageUrl?: string | null;
  senderId: string;
  createdAt: string;
  readAt?: string | null;
  deletedForEveryone?: boolean;
  sender: { fullName: string };
};

function extractGameLink(content: string): { text: string; link: string | null } {
  const match = content.match(/\/games\/[a-z0-9]+\/[a-zA-Z0-9-]+/);
  if (!match) return { text: content, link: null };
  return { text: content.replace(match[0], "").trim(), link: match[0] };
}

export default function ConversationThread({
  conversationId,
  currentUserId,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;
    setSending(true);
    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          alert(uploadData.error || "Erreur lors de l'envoi de l'image.");
          setSending(false);
          return;
        }
        imageUrl = uploadData.url;
      }

      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, imageUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        setContent("");
        clearImage();
      }
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(messageId: string, scope: "me" | "everyone") {
    setOpenMenuId(null);
    try {
      const res = await fetch(`/api/messages/${messageId}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Impossible de supprimer ce message.");
        return;
      }

      if (scope === "me") {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, content: "", imageUrl: null, deletedForEveryone: true }
              : m
          )
        );
      }
    } catch {
      alert("Erreur réseau, réessaie.");
    }
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-lg border bg-white">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => {
          const isMine = m.senderId === currentUserId;
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className="group relative max-w-[75%]">
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${
                    m.deletedForEveryone
                      ? "border border-dashed border-gray-300 bg-gray-50 italic text-gray-400"
                      : isMine
                      ? "bg-hublink text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.deletedForEveryone ? (
                    <span>🚫 Message supprimé</span>
                  ) : (
                    <>
                      {m.imageUrl && (
                        <a href={m.imageUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={m.imageUrl}
                            alt="Photo envoyée"
                            className="mb-1 max-h-64 rounded-md object-cover"
                          />
                        </a>
                      )}
                      {m.content && (() => {
                        const { text, link } = extractGameLink(m.content);
                        return (
                          <>
                            {text && <span>{text}</span>}
                            {link && (
                              <Link
                                href={link}
                                className={`mt-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold ${
                                  isMine
                                    ? "bg-white/20 text-white hover:bg-white/30"
                                    : "bg-hublink text-white hover:bg-hublink-dark"
                                }`}
                              >
                                <Gamepad2 size={16} /> Rejoindre la partie
                              </Link>
                            )}
                          </>
                        );
                      })()}
                    </>
                  )}
                  <div
                    className={`mt-1 flex items-center gap-1 text-[10px] ${
                      m.deletedForEveryone
                        ? "text-gray-400"
                        : isMine
                        ? "text-blue-100"
                        : "text-gray-400"
                    }`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {isMine && !m.deletedForEveryone && (
                      <span className={m.readAt ? "text-blue-300" : ""}>
                        {m.readAt ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>

                {!m.deletedForEveryone && (
                  <button
                    type="button"
                    onClick={() => setOpenMenuId(openMenuId === m.id ? null : m.id)}
                    className={`absolute top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 opacity-0 shadow group-hover:opacity-100 ${
                      isMine ? "-left-7" : "-right-7"
                    }`}
                    aria-label="Options du message"
                  >
                    <MoreVertical size={14} />
                  </button>
                )}

                {openMenuId === m.id && (
                  <div
                    ref={menuRef}
                    className={`absolute z-10 mt-1 w-52 rounded-md border bg-white py-1 text-sm shadow-lg ${
                      isMine ? "right-0" : "left-0"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id, "me")}
                      className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      Supprimer pour moi
                    </button>
                    {isMine && (
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id, "everyone")}
                        className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
                      >
                        Supprimer pour tout le monde
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {imagePreview && (
        <div className="flex items-center gap-2 border-t bg-gray-50 p-2">
          <img src={imagePreview} alt="Aperçu" className="h-14 w-14 rounded-md object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="text-xs text-red-600 hover:underline"
          >
            Retirer
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="flex gap-2 border-t p-3">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          aria-label="Ajouter une photo"
        >
          📷
        </button>
        <input
          placeholder="Écris un message..."
          className="flex-1 rounded-md border px-3 py-2 text-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-md bg-hublink px-4 py-2 text-sm font-semibold text-white hover:bg-hublink-dark disabled:opacity-50"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
