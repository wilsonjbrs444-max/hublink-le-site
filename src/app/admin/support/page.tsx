import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import AdminNav from "@/components/AdminNav";
import TicketStatusSelect from "@/components/TicketStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  const admin = await getCurrentUser();
  if (!admin) redirect("/login");
  if (!admin.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-gray-500">
        Accès réservé aux administrateurs.
      </div>
    );
  }

  const tickets = await prisma.supportTicket.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <AdminNav current="/admin/support" />
      <h1 className="text-2xl font-bold">Tickets support ({tickets.length})</h1>

      <div className="mt-6 space-y-2">
        {tickets.map((t) => (
          <div key={t.id} className="rounded-lg border bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900">{t.subject}</p>
                <p className="text-xs text-gray-500">
                  {t.user.fullName} · {t.user.email}
                </p>
              </div>
              <TicketStatusSelect ticketId={t.id} currentStatus={t.status} />
            </div>
            {t.description && (
              <p className="mt-2 text-sm text-gray-600">{t.description}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              {new Date(t.createdAt).toLocaleString("fr-FR")}
            </p>
          </div>
        ))}
        {tickets.length === 0 && (
          <p className="text-sm text-gray-500">Aucun ticket.</p>
        )}
      </div>
    </div>
  );
}
