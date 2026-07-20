import { prisma } from "@/lib/prisma";
import { DEFAULT_SERVICES } from "@/lib/seedServices";
import ServiceCard from "@/components/ServiceCard";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  let services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
  });

  // Première visite : on remplit directement la table (pas d'appel réseau)
  if (services.length === 0) {
    try {
      await prisma.service.createMany({ data: DEFAULT_SERVICES });
    } catch (e) {
      // Ignoré : une autre requête a déjà inséré les données (cas du dev/strict mode)
    }
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { title: "asc" },
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-bold">Services HUBLINK</h1>
      <p className="mt-1 text-sm text-gray-600">
        Tous nos services informatiques, réalisés par notre équipe et nos partenaires certifiés.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s: any) => (
          <ServiceCard
            key={s.id}
            slug={s.slug}
            icon={s.icon}
            title={s.title}
            description={s.description}
            priceIndicative={s.priceIndicative}
          />
        ))}
      </div>
    </div>
  );
}
