import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import ServiceAdminActions from "@/components/ServiceAdminActions";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const admin = await getCurrentUser();
  if (!admin) redirect("/login");
  if (!admin.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-gray-500">
        Accès réservé aux administrateurs.
      </div>
    );
  }

  const services = await prisma.service.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <AdminNav current="/admin/services" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gérer les services</h1>
        <Link
          href="/admin/services/create"
          className="rounded-md bg-hublink px-4 py-2 text-sm font-semibold text-white hover:bg-hublink-dark"
        >
          + Ajouter un service
        </Link>
      </div>

      <div className="mt-8 space-y-2">
        {services.map((s) => (
          <div
            key={s.id}
            className={`flex items-center justify-between rounded-lg border bg-white p-4 ${
              !s.isActive ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="font-medium text-gray-900">{s.title}</p>
                <p className="text-xs text-gray-500">{s.priceIndicative}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/services/${s.id}/edit`}
                className="text-xs font-medium text-hublink hover:underline"
              >
                Modifier
              </Link>
              <ServiceAdminActions serviceId={s.id} isActive={s.isActive} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
