import Link from "next/link";
import {
  Wrench,
  Briefcase,
  MapPin,
  ShoppingCart,
  MessageCircle,
  LayoutDashboard,
  ShieldCheck,
  Bell,
  Search,
  Settings,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Logo from "./Logo";
import { getCurrentUser } from "@/lib/currentUser";

const links = [
  { href: "/services", label: "Services", Icon: Wrench },
  { href: "/freelance", label: "Freelance", Icon: Briefcase },
  { href: "/technicians", label: "Techniciens", Icon: MapPin },
  { href: "/marketplace", label: "Marketplace", Icon: ShoppingCart },
  { href: "/messages", label: "Messages", Icon: MessageCircle },
];

export default async function Navbar() {
  const user = await getCurrentUser();
  const unreadCount = user
    ? await prisma.notification.count({
        where: { userId: user.id, isRead: false },
      })
    : 0;

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur dark:bg-gray-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
        <div className="scale-90 sm:scale-100">
  <Logo variant="icon" showText={false} />
</div>

        <nav className="flex origin-left scale-90 items-center gap-px overflow-x-auto sm:scale-100 sm:gap-1">
          <Link
            href="/search"
            className="flex w-9 shrink-0 flex-col items-center gap-0.5 rounded-lg py-1.5 text-gray-500 transition hover:bg-hublink-light hover:text-hublink dark:text-gray-400 sm:w-14 sm:px-0"
          >
            <Search size={19} strokeWidth={2} />
            <span className="hidden text-[10px] font-medium leading-none sm:inline">Recherche</span>
          </Link>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex w-9 shrink-0 flex-col items-center gap-0.5 rounded-lg py-1.5 text-gray-500 transition hover:bg-hublink-light hover:text-hublink dark:text-gray-400 sm:w-14 sm:px-0"
            >
              <l.Icon size={19} strokeWidth={2} />
              <span className="hidden text-[10px] font-medium leading-none sm:inline">{l.label}</span>
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className="flex w-9 shrink-0 flex-col items-center gap-0.5 rounded-lg py-1.5 text-gray-500 transition hover:bg-hublink-light hover:text-hublink dark:text-gray-400 sm:w-14 sm:px-0"
            >
              <LayoutDashboard size={19} strokeWidth={2} />
              <span className="hidden text-[10px] font-medium leading-none sm:inline">Tableau</span>
            </Link>
          )}
          {user?.isAdmin && (
            <Link
              href="/admin"
              className="flex w-9 shrink-0 flex-col items-center gap-0.5 rounded-lg py-1.5 text-purple-600 transition hover:bg-purple-50 dark:hover:bg-purple-500/10 sm:w-14 sm:px-0"
            >
              <ShieldCheck size={19} strokeWidth={2} />
              <span className="hidden text-[10px] font-medium leading-none sm:inline">Admin</span>
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-1 text-sm sm:gap-2">
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
          {user && (
            <Link
              href="/settings"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <Settings size={18} />
            </Link>
          )}
          {user ? (
            <Link
              href={`/profile/${user.id}`}
              className="hidden items-center gap-2 rounded-full py-1 pl-1 pr-3 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 sm:flex"
            >
              <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-hublink-light text-xs font-semibold text-hublink">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  user.fullName.charAt(0).toUpperCase()
                )}
              </span>
              {user.fullName.split(" ")[0]}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-2 py-2 font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:px-3"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-hublink px-2 py-2 font-medium text-white hover:bg-hublink-dark sm:px-3"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

