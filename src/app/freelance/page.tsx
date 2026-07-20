import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MissionCard from "@/components/MissionCard";

export const dynamic = "force-dynamic";

export default async function FreelanceListPage() {
  const missions = await prisma.mission.findMany({
    where: { status: "ouverte" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { offers: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">HUBLINK Freelance</h1>
          <p className="mt-1 text-sm text-gray-600">
            Missions publiées par des particuliers et entreprises.
          </p>
        </div>
        <Link
          href="/freelance/create"
          className="rounded-md bg-hublink px-4 py-2 text-sm font-semibold text-white hover:bg-hublink-dark"
        >
          + Publier une mission
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {missions.map((m: any) => (
          <MissionCard
            key={m.id}
            id={m.id}
            title={m.title}
            description={m.description}
            budget={m.budget ? Number(m.budget) : null}
            city={m.city}
            urgency={m.urgency}
            offersCount={m._count.offers}
          />
        ))}
        {missions.length === 0 && (
          <p className="text-sm text-gray-500">
            Aucune mission ouverte pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
