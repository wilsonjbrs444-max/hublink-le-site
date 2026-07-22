"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { StaticOnlineDot } from "./OnlineDot";
import { useOnlineStatuses } from "@/lib/useOnlineStatuses";

type Conversation = {
  id: string;
  otherName: string;
  otherId: string;
  otherOnline: boolean;
  lastMessage: string;
  isMine: boolean;
  unread: boolean;
  createdAt: string;
};

export default function ConversationSearch({
  conversations,
}: {
  conversations: Conversation[];
}) {
  const [q, setQ] = useState("");

  const initialStatuses = Object.fromEntries(
    conversations.map((c) => [c.otherId, c.otherOnline])
  );
  const otherIds = conversations.map((c) => c.otherId).filter(Boolean);
  const liveStatuses = useOnlineStatuses(otherIds, initialStatuses);

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
            className={`flex items-center gap-3 rounded-lg border p-4 hover:shadow-sm ${
              c.unread
                ? "border-hublink/30 bg-hublink-light/40"
                : "bg-white"
            }`}
          >
            <div className="relative h-10 w-10 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hublink-light text-sm font-semibold text-hublink">
                {c.otherName.charAt(0).toUpperCase()}
              </div>
              <StaticOnlineDot
                online={liveStatuses[c.otherId] ?? c.otherOnline}
                className="absolute bottom-0 right-0"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={
                  c.unread ? "font-bold text-gray-900" : "font-medium text-gray-900"
                }
              >
                {c.otherName}
              </p>
              <p
                className={`truncate text-sm ${
                  c.unread ? "font-semibold text-gray-800" : "text-gray-500"
                }`}
              >
                {c.isMine ? "Toi : " : ""}
                {c.lastMessage}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span
                className={`text-xs ${c.unread ? "font-semibold text-hublink" : "text-gray-400"}`}
              >
                {new Date(c.createdAt).toLocaleDateString("fr-FR")}
              </span>
              {c.unread && (
                <span className="h-2.5 w-2.5 rounded-full bg-hublink" />
              )}
            </div>
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
