import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import OfferForm from "@/components/OfferForm";
import AcceptOfferButton from "@/components/AcceptOfferButton";
import MessageSellerButton from "@/components/MessageSellerButton";
import DeleteMissionButton from "@/components/DeleteMissionButton";
import { MapPin, Star, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

const urgencyStyle: Record<string, { label: string; dot: string; text: string }> = {
  aujourd_hui: { label: "Aujourd'hui", dot: "bg-red-500", text: "text-red-700" },
  cette_semaine: { label: "Cette semaine", dot: "bg-orange-500", text: "text-orange-700" },
  flexible: { label: "Flexible", dot: "bg-green-500", text: "text-green-700" },
};

export default async function MissionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const mission = await prisma.mission.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      category: true,
      offers: {
        include: { freelance: { include: { user: true } } },
        orderBy: { price: "asc" },
      },
    },
  });

  if (!mission) notFound();

  const currentUser = await getCurrentUser();
  const isClient = currentUser?.id === mission.clientId;
  const isFreelance = !!currentUser?.freelanceProfile;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{mission.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Publié par{" "}
              <Link href={`/profile/${mission.clientId}`} className="text-hublink hover:underline">
                {mission.client.fullName}
              </Link>{" "}
              {" "}·{" "}
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} /> {mission.city || "Non précisé"}
              </span>
              {mission.category && ` · ${mission.category.name}`}
            </p>
          </div>
          <span className={`flex items-center gap-1.5 text-sm font-medium ${urgencyStyle[mission.urgency]?.text || ""}`}>
            <span className={`h-2 w-2 rounded-full ${urgencyStyle[mission.urgency]?.dot || "bg-gray-400"}`} />
            {urgencyStyle[mission.urgency]?.label || mission.urgency}
          </span>
        </div>

        <p className="mt-4 whitespace-pre-line text-gray-700">
          {mission.description}
        </p>

        <div className="mt-4 text-lg font-semibold text-hublink">
          {mission.budget
            ? `${Number(mission.budget).toLocaleString("fr-FR")} FCFA`
            : "Budget à discuter"}
        </div>

        {currentUser && !isClient && (
          <div className="mt-5">
            <MessageSellerButton
              targetUserId={mission.clientId}
              initialMessage={`Bonjour, je vous contacte au sujet de votre mission "${mission.title}".`}
              label="Contacter le client"
              fullWidth={false}
            />
          </div>
        )}
        {isClient && (
          <div className="mt-5">
            <DeleteMissionButton missionId={mission.id} />
          </div>
        )}
      </div>

      {/* Formulaire d'offre — visible seulement pour les freelances, pas le client lui-même */}
      {isFreelance && !isClient && mission.status === "ouverte" && (
        <div className="mt-6">
          <OfferForm missionId={mission.id} />
        </div>
      )}

      {!currentUser && (
        <p className="mt-6 text-sm text-gray-500">
          <a href="/login" className="text-hublink underline">
            Connecte-toi
          </a>{" "}
          pour proposer une offre sur cette mission.
        </p>
      )}

      <div className="mt-8">
        <h2 className="font-semibold text-gray-900">
          Offres reçues ({mission.offers.length})
        </h2>
        <div className="mt-3 space-y-3">
          {mission.offers.map((offer: any) => (
            <div
              key={offer.id}
              className="flex items-center justify-between rounded-lg border bg-white p-4"
            >
              <div>
                <Link
                  href={`/profile/${offer.freelance.user.id}`}
                  className="font-medium text-gray-900 hover:text-hublink hover:underline"
                >
                  {offer.freelance.user.fullName}
                </Link>
                {offer.message && (
                  <p className="mt-1 text-sm text-gray-600">{offer.message}</p>
                )}
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {Number(offer.freelance.ratingAvg).toFixed(1)} ·{" "}
                  {offer.freelance.yearsExperience || 0} ans d'expérience
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-hublink">
                  {Number(offer.price).toLocaleString("fr-FR")} FCFA
                </span>
                {offer.status === "acceptee" && (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    <CheckCircle2 size={13} /> Acceptée
                  </span>
                )}
                {offer.status === "refusee" && (
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
                    Refusée
                  </span>
                )}
                {isClient &&
                  mission.status === "ouverte" &&
                  offer.status === "en_attente" && (
                    <AcceptOfferButton
                      missionId={mission.id}
                      offerId={offer.id}
                    />
                  )}
              </div>
            </div>
          ))}
          {mission.offers.length === 0 && (
            <p className="text-sm text-gray-500">
              Aucune offre reçue pour le moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
