import Link from "next/link";
import { MapPin, BadgeCheck, Star, Search, Map } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TechniciansPage({
  searchParams,
}: {
  searchParams: { q?: string; city?: string };
}) {
  const q = searchParams.q?.trim() || "";
  const city = searchParams.city?.trim() || "";

  const technicians = await prisma.freelanceProfile.findMany({
    where: {
      ...(q && {
        OR: [
          { specialty: { contains: q } },
          { skills: { contains: q } },
          { user: { fullName: { contains: q } } },
        ],
      }),
      ...(city && { city: { contains: city } }),
    },
    include: { user: true },
    orderBy: { ratingAvg: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trouver un technicien</h1>
          <p className="mt-1 text-sm text-gray-600">
            Techniciens et freelances disponibles sur HUBLINK.
          </p>
        </div>
        <Link
          href="/technicians/map"
          className="flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Map size={16} /> Voir la carte
        </Link>
      </div>

      <form className="mt-6 flex flex-col gap-3 rounded-lg border bg-white p-4 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-md border px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Métier, compétence, nom..."
            className="w-full text-sm outline-none"
          />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-md border px-3 py-2">
          <MapPin size={16} className="text-gray-400" />
          <input
            name="city"
            defaultValue={city}
            placeholder="Ville"
            className="w-full text-sm outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-hublink px-5 py-2 text-sm font-semibold text-white hover:bg-hublink-dark"
        >
          Rechercher
        </button>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {technicians.map((t: any) => {
          const skills: string[] = t.skills ? JSON.parse(t.skills) : [];
          return (
            <Link
              href={`/profile/${t.user.id}`}
              key={t.id}
              className="block rounded-lg border bg-white p-5 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-hublink-light text-lg font-semibold text-hublink">
                  {t.user.avatarUrl ? (
                    <img src={t.user.avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    t.user.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t.user.fullName}</p>
                  <p className="text-xs font-medium text-hublink">
                    {t.specialty || "Technicien"}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={12} /> {t.city || "Ville non précisée"}
                  </p>
                </div>
                {t.certificationStatus === "certifie" && (
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    <BadgeCheck size={13} /> Certifié
                  </span>
                )}
              </div>

              {t.bio && (
                <p className="mt-3 line-clamp-2 text-sm text-gray-600">{t.bio}</p>
              )}

              {skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {skills.slice(0, 3).map((s: any) => (
                    <span
                      key={s}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  {Number(t.ratingAvg).toFixed(1)} ({t.ratingCount})
                </span>
                <span className="text-gray-500">
                  {t.yearsExperience || 0} ans d'expérience
                </span>
              </div>

              {t.hourlyRate && (
                <p className="mt-2 text-sm font-semibold text-hublink">
                  {Number(t.hourlyRate).toLocaleString("fr-FR")} FCFA / heure
                </p>
              )}
            </Link>
          );
        })}
        {technicians.length === 0 && (
          <p className="text-sm text-gray-500">
            Aucun technicien ne correspond à ta recherche.
          </p>
        )}
      </div>
    </div>
  );
}
