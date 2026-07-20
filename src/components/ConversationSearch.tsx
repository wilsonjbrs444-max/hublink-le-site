"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type Conversation = {
  id: string;
  otherName: string;
  otherId: string;
  lastMessage: string;
  isMine: boolean;
  createdAt: string;
};

export default function ConversationSearch({
  conversations,
}: {
  conversations: Conversation[];
}) {
  const [q, setQ] = useState("");

  const filtered = conversations.filter((c) =>
    c.otherName.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
        <Search size={16} className="text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Chercher une conversation..."
          className="w-full text-sm outline-none"
        />
      </div>

      <div className="mt-4 space-y-2">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/messages/${c.id}`}
            className="flex items-center gap-3 rounded-lg border bg-white p-4 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hublink-light text-sm font-semibold text-hublink">
              {c.otherName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900">{c.otherName}</p>
              <p className="truncate text-sm text-gray-500">
                {c.isMine ? "Toi : " : ""}
                {c.lastMessage}
              </p>
            </div>
            <span className="shrink-0 text-xs text-gray-400">
              {new Date(c.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-500">
            {q ? `Aucune conversation avec "${q}".` : "Aucun message pour le moment."}
          </p>
        )}
      </div>
    </div>
  );
}
