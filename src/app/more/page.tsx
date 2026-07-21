import Link from "next/link";
import { redirect } from "next/navigation";
import { Wrench, Settings, LayoutDashboard, User as UserIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/currentUser";

export const dynamic = "force-dynamic";

export default async function MorePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const items = [
    { href: `/profile/${user.id}`, label: "Mon profil", Icon: UserIcon },
    { href: "/services", label: "Services", Icon: Wrench },
    { href: "/dashboard", label: "Tableau de bord", Icon: LayoutDashboard },
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
