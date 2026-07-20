import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const admin = await getCurrentUser();
  if (!admin) redirect("/login");
  if (!admin.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-gray-500">
        Accès réservé aux administrateurs.
      </div>
    );
  }

  const [
    usersCount,
    missionsCount,
    productsCount,
    quotesCount,
    pendingVerifications,
    openTickets,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.mission.count(),
    prisma.product.count(),
    prisma.quoteRequest.count(),
    prisma.freelanceProfile.count({ where: { certificationStatus: "en_attente" } }),
    prisma.supportTicket.count({ where: { status: "ouvert" } }),
  ]);

  const stats = [
    { label: "Utilisateurs", value: usersCount, href: "/admin/users" },
    { label: "Missions publiées", value: missionsCount, href: "/admin/missions" },
    { label: "Produits en vente", value: productsCount, href: "/admin/products" },
    { label: "Demandes de devis", value: quotesCount, href: "/quotes" },
    {
      label: "Vérifications en attente",
      value: pendingVerifications,
      href: "/admin/verifications",
      highlight: pendingVerifications > 0,
    },
    {
      label: "Tickets support ouverts",
      value: openTickets,
      href: "/admin/support",
      highlight: openTickets > 0,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <AdminNav current="/admin" />
      <h1 className="text-2xl font-bold">Panel Admin HUBLINK</h1>
      <p className="mt-1 text-sm text-gray-600">
        Vue d'ensemble et contrôle total de la plateforme.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s: any) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-lg border p-5 shadow-sm hover:shadow-md ${
              s.highlight ? "border-orange-300 bg-orange-50" : "bg-white"
            }`}
          >
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="mt-1 text-sm text-gray-600">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/users"
          className="rounded-md bg-hublink px-4 py-2 text-sm font-semibold text-white hover:bg-hublink-dark"
        >
          Gérer les utilisateurs
        </Link>
        <Link
          href="/admin/verifications"
          className="rounded-md border border-hublink px-4 py-2 text-sm font-semibold text-hublink hover:bg-hublink-light"
        >
          Valider les techniciens
        </Link>
        <Link
          href="/admin/services"
          className="rounded-md border border-hublink px-4 py-2 text-sm font-semibold text-hublink hover:bg-hublink-light"
        >
          Gérer les services
        </Link>
      </div>
    </div>
  );
}
