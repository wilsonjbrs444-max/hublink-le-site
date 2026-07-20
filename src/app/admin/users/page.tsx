import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import DeleteUserButton from "@/components/DeleteUserButton";
import ToggleAdminButton from "@/components/ToggleAdminButton";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admin = await getCurrentUser();
  if (!admin) redirect("/login");
  if (!admin.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-gray-500">
        Accès réservé aux administrateurs.
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { roles: true },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <AdminNav current="/admin/users" />
      <h1 className="text-2xl font-bold">Utilisateurs ({users.length})</h1>
      <p className="mt-1 text-sm text-gray-600">
        Tous les comptes inscrits sur HUBLINK.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rôles</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Inscrit le</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">
                  {u.fullName}
                  {u.isAdmin && (
                    <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                      Admin
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {u.roles.map((r: any) => (
                      <span
                        key={r.id}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                      >
                        {r.role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{u.city || "-"}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  {u.id !== admin.id && (
                    <div className="flex items-center gap-2">
                      <ToggleAdminButton userId={u.id} isAdmin={u.isAdmin} />
                      <DeleteUserButton userId={u.id} userName={u.fullName} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
