import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import AdminNav from "@/components/AdminNav";
import AdminDeleteButton from "@/components/AdminDeleteButton";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  ouverte: "bg-green-100 text-green-700",
  attribuee: "bg-blue-100 text-blue-700",
  en_cours: "bg-orange-100 text-orange-700",
  terminee: "bg-gray-100 text-gray-600",
  annulee: "bg-red-100 text-red-600",
};

export default async function AdminMissionsPage() {
  const admin = await getCurrentUser();
  if (!admin) redirect("/login");
  if (!admin.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-gray-500">
        Accès réservé aux administrateurs.
      </div>
    );
  }

  const missions = await prisma.mission.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true, _count: { select: { offers: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <AdminNav current="/admin/missions" />
      <h1 className="text-2xl font-bold">Missions ({missions.length})</h1>

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Offres</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((m) => (
              <tr key={m.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{m.title}</td>
                <td className="px-4 py-3 text-gray-600">{m.client.fullName}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyle[m.status] || ""}`}>
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{m._count.offers}</td>
                <td className="px-4 py-3">
                  <AdminDeleteButton url={`/api/admin/missions/${m.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {missions.length === 0 && (
          <p className="p-4 text-sm text-gray-500">Aucune mission.</p>
        )}
      </div>
    </div>
  );
}
