import Link from "next/link";
import Logo from "./Logo";
import { getCurrentUser } from "@/lib/currentUser";
import LogoutButton from "./LogoutButton";

const links = [
  { href: "/", label: "Accueil", icon: "🏠" },
  { href: "/services", label: "Services", icon: "🧰" },
  { href: "/marketplace", label: "Marketplace", icon: "🛒" },
  { href: "/freelance", label: "Freelance", icon: "💼" },
  { href: "/technicians", label: "Trouver un technicien", icon: "📍" },
  { href: "/quotes", label: "Demandes de devis", icon: "📋" },
  { href: "/training", label: "Formations", icon: "🎓" },
  { href: "/blog", label: "Blog", icon: "📰" },
];

export default async function Sidebar() {
  const user = await getCurrentUser();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#0B1230] lg:flex">
      <div className="px-5 py-6">
        <Logo variant="light" size="sm" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        <p className="px-2 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Menu principal
        </p>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <span className="text-base">{l.icon}</span>
            {l.label}
          </Link>
        ))}

        {user && (
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <span className="text-base">📊</span>
            Tableau de bord
          </Link>
        )}
        {user?.isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg bg-purple-500/10 px-3 py-2.5 text-sm font-medium text-purple-300 hover:bg-purple-500/20"
          >
            <span className="text-base">🛡</span>
            Panel Admin
          </Link>
        )}
      </nav>

      <div className="space-y-3 p-4">
        {!user?.freelanceProfile && (
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-green-500 p-4">
            <p className="text-sm font-semibold text-white">
              Devenez prestataire
            </p>
            <p className="mt-1 text-xs text-blue-50">
              Rejoignez notre réseau de professionnels et gagnez plus.
            </p>
            <Link
              href="/freelance/become"
              className="mt-3 block rounded-md bg-white py-2 text-center text-xs font-semibold text-blue-700 hover:bg-blue-50"
            >
              S'inscrire maintenant →
            </Link>
          </div>
        )}

        <div className="rounded-xl bg-white/5 p-4 text-xs text-slate-300">
          <p className="font-semibold text-white">Besoin d'aide ?</p>
          <Link href="/support" className="mt-2 flex items-center gap-2 hover:text-white">
            💬 Centre d'aide
          </Link>
          <a
            href="https://wa.me/237695124132"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 hover:text-white"
          >
            📞 +237 695 124 132
          </a>
        </div>

        {user ? (
          <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
            <span className="truncate text-xs text-slate-300">
              {user.fullName}
            </span>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/login"
              className="flex-1 rounded-md border border-white/20 py-2 text-center text-xs font-medium text-slate-200 hover:bg-white/5"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="flex-1 rounded-md bg-white py-2 text-center text-xs font-semibold text-[#0B1230] hover:bg-slate-100"
            >
              Inscription
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
