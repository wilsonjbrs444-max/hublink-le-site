"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Message = {
  id: string;
  content: string;
  imageUrl?: string | null;
  senderId: string;
  createdAt: string;
  sender: { fullName: string };
};

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
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

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

  return (
    <div className="flex h-[70vh] flex-col rounded-lg border bg-white">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => {
          const isMine = m.senderId === currentUserId;
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  isMine ? "bg-hublink text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.imageUrl && (
                  <a href={m.imageUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={m.imageUrl}
                      alt="Photo envoyée"
                      className="mb-1 max-h-64 rounded-md object-cover"
                    />
                  </a>
                )}
                {m.content && <span>{m.content}</span>}
                <div
                  className={`mt-1 text-[10px] ${
                    isMine ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {new Date(m.createdAt).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
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
