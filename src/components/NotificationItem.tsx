"use client";

import { useRouter } from "next/navigation";

export default function NotificationItem({
  ids,
  link,
  isRead,
  children,
}: {
  ids: string[];
  link: string;
  isRead: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleClick() {
    if (!isRead) {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/notifications/${id}/read`, { method: "POST" })
        )
      );
    }
    router.push(link);
    router.refresh();
  }

  return (
    <button onClick={handleClick} className="block w-full text-left">
      {children}
    </button>
  );
}
