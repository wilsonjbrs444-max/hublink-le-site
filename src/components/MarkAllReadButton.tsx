"use client";

import { useRouter } from "next/navigation";

export default function MarkAllReadButton() {
  const router = useRouter();

  async function handleClick() {
    await fetch("/api/notifications/read-all", { method: "POST" });
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      className="text-sm font-medium text-hublink hover:underline"
    >
      Tout marquer comme lu
    </button>
  );
}
