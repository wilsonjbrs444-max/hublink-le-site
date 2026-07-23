import Link from "next/link";
import { Wrench, Settings, LayoutDashboard, User as UserIcon, Heart, Gamepad2 } from "lucide-react";
import { getCurrentUser } from "@/lib/currentUser";

export const dynamic = "force-dynamic";

export default async function MorePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-bold">Bienvenue sur HUBLINK</h1>
        <p className="mt-2 text-sm text-gray-600">
          Connecte-toi ou crée un compte pour accéder à ton profil, tes
          messages et bien plus.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/register"
            className="rounded-md bg-hublink py-3 text-center font-semibold text-white hover:bg-hublink-dark"
          >
            Créer un compte
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-hublink py-3 text-center font-semibold text-hublink hover:bg-hublink-light"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const items = [
    { href: `/profile/${user.id}`, label: "Mon profil", Icon: UserIcon },
    { href: "/favorites", label: "Mes favoris", Icon: Heart },
    { href: "/services", label: "Services", Icon: Wrench },
    { href: "/dashboard", label: "Tableau de bord", Icon: LayoutDashboard },
    { href: "/games", label: "Jeux", Icon: Gamepad2 },
    { href: "/settings", label: "Paramètres", Icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-md px-4 py-6 pb-24">
      <h1 className="mb-4 text-xl font-bold">Vous</h1>
      <div className="divide-y rounded-lg border bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <item.Icon size={20} className="text-hublink" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
