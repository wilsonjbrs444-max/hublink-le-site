import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import LeaveFreelanceButton from "@/components/LeaveFreelanceButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const myMissions = await prisma.mission.findMany({
    where: { clientId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { offers: true } } },
  });

  const myOffers = user.freelanceProfile
    ? await prisma.missionOffer.findMany({
        where: { freelanceId: user.freelanceProfile.id },
        orderBy: { createdAt: "desc" },
        include: { mission: true },
      })
    : [];

  const myProducts = user.sellerProfile
    ? await prisma.product.findMany({
        where: { sellerId: user.sellerProfile.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold">Bonjour {user.fullName} 👋</h1>
      <p className="mt-1 text-sm text-gray-600">
        {user.freelanceProfile
          ? "Compte freelance actif"
          : "Compte client"}
      </p>
      <Link
        href={`/profile/${user.id}`}
        className="mt-2 inline-block text-sm text-hublink hover:underline"
      >
        Voir mon profil public →
      </Link>
      <Link
        href="/profile/edit"
        className="mt-1 ml-4 inline-block text-sm text-hublink hover:underline"
      >
        Modifier ma photo / bio →
      </Link>

      {/* Missions publiées par cet utilisateur (côté client) */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            Mes missions publiées ({myMissions.length})
          </h2>
          <Link
            href="/freelance/create"
            className="text-sm font-medium text-hublink hover:underline"
          >
            + Nouvelle mission
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {myMissions.map((m: any) => (
            <Link
              key={m.id}
              href={`/freelance/${m.id}`}
              className="flex items-center justify-between rounded-lg border bg-white p-4 hover:shadow-sm"
            >
              <div>
                <p className="font-medium">{m.title}</p>
                <p className="text-xs text-gray-500">
                  Statut : {m.status} · {m._count.offers} offre(s)
                </p>
              </div>
              <span className="text-sm text-gray-400">→</span>
            </Link>
          ))}
          {myMissions.length === 0 && (
            <p className="text-sm text-gray-500">
              Tu n'as encore publié aucune mission.
            </p>
          )}
        </div>
      </section>

      {/* Offres envoyées par cet utilisateur (côté freelance) */}
      {user.freelanceProfile && (
        <section className="mt-10">
          <h2 className="font-semibold text-gray-900">
            Mes offres envoyées ({myOffers.length})
          </h2>
          <div className="mt-3 space-y-2">
            {myOffers.map((o: any) => (
              <Link
                key={o.id}
                href={`/freelance/${o.missionId}`}
                className="flex items-center justify-between rounded-lg border bg-white p-4 hover:shadow-sm"
              >
                <div>
                  <p className="font-medium">{o.mission.title}</p>
                  <p className="text-xs text-gray-500">
                    Ton offre : {Number(o.price).toLocaleString("fr-FR")} FCFA ·{" "}
                    Statut : {o.status}
                  </p>
                </div>
                <span className="text-sm text-gray-400">→</span>
              </Link>
            ))}
            {myOffers.length === 0 && (
              <p className="text-sm text-gray-500">
                Tu n'as encore envoyé aucune offre.{" "}
                <Link href="/freelance" className="text-hublink underline">
                  Voir les missions ouvertes
                </Link>
              </p>
            )}
          </div>
        </section>
      )}
      {/* Produits en vente (côté vendeur) */}
      {user.sellerProfile && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Mes produits en vente ({myProducts.length})
            </h2>
            <Link
              href="/marketplace/create"
              className="text-sm font-medium text-hublink hover:underline"
            >
              + Ajouter un produit
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {myProducts.map((p: any) => (
              <Link
                key={p.id}
                href={`/marketplace/${p.id}`}
                className="flex items-center justify-between rounded-lg border bg-white p-4 hover:shadow-sm"
              >
                <div>
                  <p className="font-medium">
                    {p.name}
                    {p.isSold && (
                      <span className="ml-2 rounded-full bg-gray-800 px-2 py-0.5 text-xs text-white">
                        Vendu
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">Stock : {p.stock}</p>
                </div>
                <span className="font-semibold text-hublink">
                  {Number(p.price).toLocaleString("fr-FR")} FCFA
                </span>
              </Link>
            ))}
            {myProducts.length === 0 && (
              <p className="text-sm text-gray-500">
                Tu n'as encore aucun produit en vente.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Vérification technicien */}
      {user.freelanceProfile && (
        <div className="mt-6 rounded-lg border bg-white p-4 text-sm">
          Statut de certification :{" "}
          <span className="font-medium">
            {user.freelanceProfile.certificationStatus === "certifie"
              ? "✓ Certifié"
              : user.freelanceProfile.certificationStatus === "en_attente"
              ? "En attente de validation"
              : "Non vérifié"}
          </span>
          {user.freelanceProfile.certificationStatus === "non_verifie" && (
            <a
              href="/freelance/verification"
              className="ml-3 text-hublink underline"
            >
              Envoyer mes documents
            </a>
          )}
          <LeaveFreelanceButton />
        </div>
      )}

      {/* Devenir freelance si pas encore le cas */}
      {!user.freelanceProfile && (
        <div className="mt-10 rounded-lg border border-dashed p-5 text-center">
          <p className="text-sm text-gray-600">
            Tu peux aussi proposer tes services comme technicien.
          </p>
          <Link
            href="/freelance/become"
            className="mt-2 inline-block text-sm font-semibold text-hublink hover:underline"
          >
            Devenir freelance →
          </Link>
        </div>
      )}
    </div>
  );
}
