import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import VerificationActions from "@/components/VerificationActions";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminVerificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-gray-500">
        Accès réservé aux administrateurs.
      </div>
    );
  }

  const pending = await prisma.freelanceProfile.findMany({
    where: { certificationStatus: "en_attente" },
    include: { user: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <AdminNav current="/admin/verifications" />
      <h1 className="text-2xl font-bold">Vérifications en attente</h1>
      <p className="mt-1 text-sm text-gray-600">
        Techniciens ayant soumis leurs documents pour certification.
      </p>

      <div className="mt-8 space-y-3">
        {pending.map((p: any) => (
          <div key={p.id} className="rounded-lg border bg-white p-5">
            <p className="font-semibold">{p.user.fullName}</p>
            <div className="mt-2 space-y-1 text-sm">
              {p.cniDocumentUrl && (
                <a
                  href={p.cniDocumentUrl}
                  target="_blank"
                  className="block text-hublink underline"
                >
                  Voir la CNI
                </a>
              )}
              {p.diplomaDocumentUrl && (
                <a
                  href={p.diplomaDocumentUrl}
                  target="_blank"
                  className="block text-hublink underline"
                >
                  Voir le diplôme
                </a>
              )}
              {p.certificateDocumentUrl && (
                <a
                  href={p.certificateDocumentUrl}
                  target="_blank"
                  className="block text-hublink underline"
                >
                  Voir le certificat
                </a>
              )}
            </div>
            <div className="mt-3">
              <VerificationActions profileId={p.id} />
            </div>
          </div>
        ))}
        {pending.length === 0 && (
          <p className="text-sm text-gray-500">Aucune vérification en attente.</p>
        )}
      </div>
    </div>
  );
}
