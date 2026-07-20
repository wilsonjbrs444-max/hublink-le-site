import Link from "next/link";
import {
  Search,
  Briefcase,
  Wrench,
  MapPin,
  ShoppingCart,
  User,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() || "";

  let missions: any[] = [];
  let services: any[] = [];
  let technicians: any[] = [];
  let products: any[] = [];
  let people: any[] = [];

  if (q.length >= 2) {
    [missions, services, technicians, products, people] = await Promise.all([
      prisma.mission.findMany({
        where: {
          status: "ouverte",
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.service.findMany({
        where: {
          isActive: true,
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.freelanceProfile.findMany({
        where: {
          OR: [
            { specialty: { contains: q } },
            { user: { fullName: { contains: q } } },
          ],
        },
        include: { user: true },
        take: 5,
      }),
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.user.findMany({
        where: { fullName: { contains: q } },
        take: 5,
      }),
    ]);
  }

  const hasResults =
    missions.length + services.length + technicians.length + products.length + people.length > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <form className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3 shadow-sm">
        <Search size={18} className="text-gray-400" />
        <input
          name="q"
          defaultValue={q}
          autoFocus
          placeholder="Rechercher une mission, un service, un technicien, un produit, une personne..."
          className="w-full text-sm outline-none"
        />
      </form>

      {q.length > 0 && q.length < 2 && (
        <p className="mt-4 text-sm text-gray-500">Tape au moins 2 caractères.</p>
      )}

      {q.length >= 2 && !hasResults && (
        <p className="mt-4 text-sm text-gray-500">Aucun résultat pour "{q}".</p>
      )}

      {people.length > 0 && (
        <section className="mt-6">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
            <User size={14} /> Personnes
          </h2>
          <div className="mt-2 space-y-2">
            {people.map((p: any) => (
              <Link
                key={p.id}
                href={`/profile/${p.id}`}
                className="flex items-center gap-3 rounded-lg border bg-white p-3 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-hublink-light text-sm font-semibold text-hublink">
                  {p.avatarUrl ? (
                    <img src={p.avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    p.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="font-medium text-gray-900">{p.fullName}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {technicians.length > 0 && (
        <section className="mt-6">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
            <MapPin size={14} /> Techniciens
          </h2>
          <div className="mt-2 space-y-2">
            {technicians.map((t: any) => (
              <Link
                key={t.id}
                href={`/profile/${t.user.id}`}
                className="block rounded-lg border bg-white p-3 hover:shadow-sm"
              >
                <p className="font-medium text-gray-900">{t.user.fullName}</p>
                <p className="text-xs text-hublink">{t.specialty}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {missions.length > 0 && (
        <section className="mt-6">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
            <Briefcase size={14} /> Missions
          </h2>
          <div className="mt-2 space-y-2">
            {missions.map((m: any) => (
              <Link
                key={m.id}
                href={`/freelance/${m.id}`}
                className="block rounded-lg border bg-white p-3 hover:shadow-sm"
              >
                <p className="font-medium text-gray-900">{m.title}</p>
                <p className="line-clamp-1 text-xs text-gray-500">{m.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="mt-6">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
            <Wrench size={14} /> Services
          </h2>
          <div className="mt-2 space-y-2">
            {services.map((s: any) => (
              <Link
                key={s.id}
                href={`/services/${s.slug}`}
                className="flex items-center gap-2 rounded-lg border bg-white p-3 hover:shadow-sm"
              >
                <span>{s.icon}</span>
                <span className="font-medium text-gray-900">{s.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="mt-6">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
            <ShoppingCart size={14} /> Marketplace
          </h2>
          <div className="mt-2 space-y-2">
            {products.map((p: any) => (
              <Link
                key={p.id}
                href={`/marketplace/${p.id}`}
                className="flex items-center justify-between rounded-lg border bg-white p-3 hover:shadow-sm"
              >
                <span className="font-medium text-gray-900">{p.name}</span>
                <span className="text-sm text-hublink">
                  {Number(p.price).toLocaleString("fr-FR")} FCFA
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
