import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import FollowButton from "@/components/FollowButton";
import MessageButton from "@/components/MessageButton";
import OnlineDot from "@/components/OnlineDot";
import { isEffectivelyOnline } from "@/lib/presence";
import { MapPin, BadgeCheck, Star, Monitor, Phone, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const profileUser = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      freelanceProfile: true,
      sellerProfile: { include: { products: { where: { isActive: true } } } },
      missionsPosted: { orderBy: { createdAt: "desc" }, take: 10 },
      _count: { select: { followers: true, following: true } },
    },
  });

  if (!profileUser) notFound();

  const currentUser = await getCurrentUser();
  const isOwnProfile = currentUser?.id === profileUser.id;

  const isFollowing = currentUser
    ? !!(await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: profileUser.id,
          },
        },
      }))
    : false;

  const skills: string[] = profileUser.freelanceProfile?.skills
    ? JSON.parse(profileUser.freelanceProfile.skills)
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12">
      {/* Couverture + avatar en overlay */}
      <div className="relative">
        <div className="h-40 w-full overflow-hidden rounded-b-lg bg-gradient-to-br from-blue-500 to-green-400 sm:h-56">
          {profileUser.coverUrl && (
            <img
              src={profileUser.coverUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="absolute -bottom-10 left-6 h-24 w-24 rounded-full border-4 border-white bg-hublink-light shadow-sm sm:h-28 sm:w-28">
          <div className="h-full w-full overflow-hidden rounded-full">
            {profileUser.avatarUrl ? (
              <img
                src={profileUser.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-hublink">
                {profileUser.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {!isOwnProfile && (
            <OnlineDot
              userId={profileUser.id}
              initialOnline={isEffectivelyOnline(
                profileUser.isOnline,
                profileUser.lastActiveAt
              )}
              size="lg"
            />
          )}
        </div>
      </div>

      {/* Infos principales */}
      <div className="mt-12 flex items-start justify-between px-2 sm:px-0">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            {profileUser.fullName}
            {profileUser.freelanceProfile?.certificationStatus === "certifie" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                <BadgeCheck size={13} /> Certifié
              </span>
            )}
          </h1>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={13} /> {profileUser.city || "Ville non précisée"}
          </p>
          <p className="mt-1 text-sm text-gray-600">
  <Link href={`/profile/${profileUser.id}/followers`} className="hover:underline">
    <span className="font-semibold">{profileUser._count.followers}</span> abonnés
  </Link>{" "}
  ·{" "}
  <Link href={`/profile/${profileUser.id}/following`} className="hover:underline">
    <span className="font-semibold">{profileUser._count.following}</span> abonnements
  </Link>
</p>
        </div>

        {isOwnProfile && (
          <div className="flex flex-col items-end gap-2">
            <Link
              href="/profile/edit"
              className="rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Modifier le profil
            </Link>
            {!profileUser.freelanceProfile && (
              <Link
                href="/freelance/become"
                className="rounded-md bg-hublink px-4 py-2 text-sm font-semibold text-white hover:bg-hublink-dark"
              >
                + Devenir technicien
              </Link>
            )}
          </div>
        )}
        {!isOwnProfile && currentUser && (
  <div className="flex gap-2">
    <FollowButton
      targetUserId={profileUser.id}
      initialFollowing={isFollowing}
    />
    {isFollowing && <MessageButton targetUserId={profileUser.id} />}
  </div>
)}
        {!currentUser && (
          <Link
            href="/login"
            className="rounded-md bg-hublink px-4 py-2 text-sm font-semibold text-white hover:bg-hublink-dark"
          >
            + S'abonner
          </Link>
        )}
      </div>

      {profileUser.bio && (
        <p className="mt-4 px-2 text-sm text-gray-700 sm:px-0">{profileUser.bio}</p>
      )}

      {/* Service freelance */}
      {profileUser.freelanceProfile && (
        <section className="mt-6">
          <h2 className="font-semibold text-gray-900">
            {profileUser.freelanceProfile.specialty || "Technicien / Freelance"}
          </h2>
          <div className="mt-3 rounded-lg border bg-white p-5">
            <div className="flex flex-wrap gap-2">
              {skills.map((s: any) => (
                <span
                  key={s}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                >
                  {s}
                </span>
              ))}
              {skills.length === 0 && (
                <span className="text-xs text-gray-400">
                  Aucune compétence renseignée
                </span>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-gray-500">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {Number(profileUser.freelanceProfile.ratingAvg).toFixed(1)} (
                {profileUser.freelanceProfile.ratingCount}) ·{" "}
                {profileUser.freelanceProfile.yearsExperience || 0} ans d'expérience
              </span>
              {profileUser.freelanceProfile.hourlyRate && (
                <span className="font-semibold text-hublink">
                  {Number(profileUser.freelanceProfile.hourlyRate).toLocaleString("fr-FR")} FCFA/h
                </span>
              )}
            </div>

            {/* Coordonnées de contact */}
            <div className="mt-4 space-y-1.5 border-t pt-4 text-sm">
              {profileUser.phone && (
                <p className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} /> {profileUser.phone}
                </p>
              )}
              <p className="flex items-center gap-2 text-gray-600">
                <Mail size={14} /> {profileUser.email}
              </p>
            </div>
          </div>
        </section>

      )}

      {/* Produits en vente */}
      {profileUser.sellerProfile && profileUser.sellerProfile.products.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-gray-900">
            Produits en vente ({profileUser.sellerProfile.products.length})
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {profileUser.sellerProfile.products.map((p: any) => {
              const images: string[] = p.images ? JSON.parse(p.images) : [];
              return (
                <div key={p.id} className="overflow-hidden rounded-lg border bg-white">
                  <div className="flex aspect-square items-center justify-center bg-gray-100">
                    {images[0] ? (
                      <img src={images[0]} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <Monitor size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div className="p-2">
                    <p className="truncate text-xs font-medium">{p.name}</p>
                    <p className="text-xs font-semibold text-hublink">
                      {Number(p.price).toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Missions publiées */}
      {profileUser.missionsPosted.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-gray-900">
            Missions publiées ({profileUser.missionsPosted.length})
          </h2>
          <div className="mt-3 space-y-2">
            {profileUser.missionsPosted.map((m: any) => (
              <Link
                key={m.id}
                href={`/freelance/${m.id}`}
                className="block rounded-lg border bg-white p-4 hover:shadow-sm"
              >
                <p className="font-medium">{m.title}</p>
                <p className="text-xs text-gray-500">Statut : {m.status}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!profileUser.freelanceProfile &&
        !profileUser.sellerProfile &&
        profileUser.missionsPosted.length === 0 && (
          <p className="mt-6 text-sm text-gray-500">
            Ce membre n'a pas encore d'activité publique sur HUBLINK.
          </p>
        )}
    </div>
  );
}
