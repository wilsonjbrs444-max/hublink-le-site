import Link from "next/link";
import nextDynamic from "next/dynamic";
import { List } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TechniciansMap = nextDynamic(() => import("@/components/TechniciansMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] w-full items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
      Chargement de la carte...
    </div>
  ),
});

export default async function TechniciansMapPage() {
  const technicians = await prisma.freelanceProfile.findMany({
    where: { latitude: { not: null }, longitude: { not: null } },
    include: { user: true },
  });

  const points = technicians.map((t) => ({
    id: t.id,
    userId: t.user.id,
    fullName: t.user.fullName,
    specialty: t.specialty,
    city: t.city,
    latitude: t.latitude as number,
    longitude: t.longitude as number,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Carte des techniciens</h1>
          <p className="mt-1 text-sm text-gray-600">
            {points.length} technicien(s) localisé(s).
          </p>
        </div>
        <Link
          href="/technicians"
          className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <List size={16} /> Vue liste
        </Link>
      </div>

      <div className="mt-6">
        <TechniciansMap technicians={points} />
      </div>
    </div>
  );
}
