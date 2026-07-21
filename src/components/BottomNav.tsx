"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, MapPin, Briefcase, MessageCircle, User } from "lucide-react";

const tabs = [
  { href: "/marketplace", label: "Marketplace", Icon: ShoppingCart },
  { href: "/technicians", label: "Techniciens", Icon: MapPin },
  { href: "/freelance", label: "Freelance", Icon: Briefcase },
  { href: "/messages", label: "Messages", Icon: MessageCircle },
  { href: "/more", label: "Vous", Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t bg-white pb-[env(safe-area-inset-bottom)] dark:border-gray-800 dark:bg-gray-950 lg:hidden">
      {tabs.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
              active ? "text-hublink" : "text-gray-400 dark:text-gray-500"
            }`}
          >
            <t.Icon size={22} strokeWidth={active ? 2.4 : 2} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
