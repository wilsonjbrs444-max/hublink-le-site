"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Accueil", icon: "🏠" },
  { href: "/freelance", label: "Missions", icon: "💼" },
  { href: "/marketplace", label: "Boutique", icon: "🛒" },
  { href: "/technicians", label: "Techniciens", icon: "📍" },
  { href: "/dashboard", label: "Profil", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t bg-white lg:hidden">
      {tabs.map((t) => {
        const active =
          t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
              active ? "text-hublink" : "text-gray-400"
            }`}
          >
            <span className="text-lg">{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
