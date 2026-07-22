import Link from "next/link";
import { Bell, Search, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Logo from "./Logo";
import { getCurrentUser } from "@/lib/currentUser";
import PresenceHeartbeat from "./PresenceHeartbeat";

export default async function Navbar() {
  const user = await getCurrentUser();
  const unreadCount = user
    ? await prisma.notification.count({
        where: { userId: user.id, isRead: false },
      })
    : 0;

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur dark:bg-gray-950/90">
      {user && <PresenceHeartbeat />}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
        <Logo variant="icon" showText={false} />

        <div className="flex shrink-0 items-center gap-1 text-sm sm:gap-2">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Search size={19} />
          </Link>
          {user && (
            <Link
              href="/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          )}
          {user?.isAdmin && (
            <Link
              href="/admin"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10"
            >
              <ShieldCheck size={19} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
