import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import SupportTicketForm from "@/components/SupportTicketForm";

export const dynamic = "force-dynamic";

const FAQ = [
  {
    q: "Comment publier une mission sur HUBLINK Freelance ?",
    a: "Va sur la page Freelance puis clique sur \"Publier une mission\". Décris ton besoin, ton budget et ta ville, les techniciens t'enverront des offres.",
  },
  {
    q: "Comment devenir freelance/technicien ?",
    a: "Depuis la page d'accueil ou ton tableau de bord, clique sur \"Devenir freelance\" et complète ton profil (compétences, tarif, ville).",
  },
  {
    q: "Comment vendre un produit sur le Marketplace ?",
    a: "Va sur Marketplace puis \"Vendre un produit\". Ton profil vendeur s'active automatiquement.",
  },
  {
    q: "HUBLINK prend-il une commission ?",
    a: "Oui, une commission est prélevée sur chaque mission réalisée via la plateforme.",
  },
];

export default async function SupportPage() {
  const user = await getCurrentUser();

  const myTickets = user
    ? await prisma.supportTicket.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold">Assistance</h1>
      <p className="mt-1 text-sm text-gray-600">
        Questions fréquentes et support HUBLINK.
      </p>

      <section className="mt-8">
        <h2 className="font-semibold text-gray-900">Questions fréquentes</h2>
        <div className="mt-3 space-y-3">
          {FAQ.map((item: any) => (
            <details
              key={item.q}
              className="rounded-lg border bg-white p-4 open:shadow-sm"
            >
              <summary className="cursor-pointer font-medium text-gray-900">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {user ? (
        <section className="mt-10">
          <SupportTicketForm />

          <h2 className="mt-8 font-semibold text-gray-900">
            Mes tickets ({myTickets.length})
          </h2>
          <div className="mt-3 space-y-2">
            {myTickets.map((t: any) => (
              <div key={t.id} className="rounded-lg border bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{t.subject}</p>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    {t.status}
                  </span>
                </div>
                {t.description && (
                  <p className="mt-1 text-sm text-gray-600">{t.description}</p>
                )}
              </div>
            ))}
            {myTickets.length === 0 && (
              <p className="text-sm text-gray-500">Aucun ticket ouvert.</p>
            )}
          </div>
        </section>
      ) : (
        <p className="mt-10 text-sm text-gray-500">
          <a href="/login" className="text-hublink underline">
            Connecte-toi
          </a>{" "}
          pour ouvrir un ticket de support.
        </p>
      )}
    </div>
  );
}
