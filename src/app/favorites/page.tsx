import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { Heart, MapPin, Star, Monitor } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const productIds = favorites.filter((f) => f.targetType === "product").map((f) => f.targetId);
  const missionIds = favorites.filter((f) => f.targetType === "mission").map((f) => f.targetId);
  const technicianIds = favorites
    .filter((f) => f.targetType === "technician")
    .map((f) => f.targetId);

  const [products, missions, technicians] = await Promise.all([
    productIds.length
      ? prisma.product.findMany({ where: { id: { in: productIds } }, include: { seller: true } })
      : [],
    missionIds.length
      ? prisma.mission.findMany({ where: { id: { in: missionIds } } })
      : [],
    technicianIds.length
      ? prisma.user.findMany({
          where: { id: { in: technicianIds } },
          include: { freelanceProfile: true },
        })
      : [],
  ]);

  const hasAny = products.length + missions.length + technicians.length > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 pb-24">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Heart size={22} className="fill-red-500 text-red-500" /> Mes favoris
      </h1>

      {!hasAny && (
        <p className="mt-6 text-sm text-gray-500">
          Tu n'as encore rien enregistré. Le cœur ❤️ sur une annonce, une mission
          ou un profil technicien l'ajoute ici.
        </p>
      )}

      {products.length > 0 && (
        <section className="mt-8">
          <h2 className="font-semibold text-gray-900">Produits ({products.length})</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {products.map((p: any) => {
              const images: string[] = p.images ? JSON.parse(p.images) : [];
              return (
                <Link
                  key={p.id}
                  href={`/marketplace/${p.id}`}
                  className="overflow-hidden rounded-lg border bg-white"
                >
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
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {missions.length > 0 && (
        <section className="mt-8">
          <h2 className="font-semibold text-gray-900">Missions ({missions.length})</h2>
          <div className="mt-3 space-y-2">
            {missions.map((m: any) => (
              <Link
                key={m.id}
                href={`/freelance/${m.id}`}
                className="block rounded-lg border bg-white p-4 hover:shadow-sm"
              >
                <p className="font-medium">{m.title}</p>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={12} /> {m.city || "Non précisé"} · Statut : {m.status}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {technicians.length > 0 && (
        <section className="mt-8">
          <h2 className="font-semibold text-gray-900">Techniciens ({technicians.length})</h2>
          <div className="mt-3 space-y-2">
            {technicians.map((t: any) => (
              <Link
                key={t.id}
                href={`/profile/${t.id}`}
                className="flex items-center gap-3 rounded-lg border bg-white p-4 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hublink-light text-sm font-semibold text-hublink">
                  {t.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{t.fullName}</p>
                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {Number(t.freelanceProfile?.ratingAvg || 0).toFixed(1)} ·{" "}
                    {t.freelanceProfile?.specialty || "Technicien"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
