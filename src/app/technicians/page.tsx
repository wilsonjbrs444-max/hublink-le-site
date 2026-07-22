import Link from "next/link";
import { MapPin, Search, Map } from "lucide-react";
import { prisma } from "@/lib/prisma";
import TechniciansGrid from "@/components/TechniciansGrid";
import { isEffectivelyOnline } from "@/lib/presence";

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

      <TechniciansGrid
        technicians={technicians.map((t: any) => ({
          id: t.id,
          userId: t.user.id,
          fullName: t.user.fullName,
          avatarUrl: t.user.avatarUrl,
          specialty: t.specialty,
          city: t.city,
          bio: t.bio,
          skills: t.skills ? JSON.parse(t.skills) : [],
          certificationStatus: t.certificationStatus,
          ratingAvg: t.ratingAvg,
          ratingCount: t.ratingCount,
          yearsExperience: t.yearsExperience,
          hourlyRate: t.hourlyRate,
          isOnline: isEffectivelyOnline(t.user.isOnline, t.user.lastActiveAt),
        }))}
      />
    </div>
  );
}
