import Link from "next/link";
import { Monitor, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() || "";

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(q && {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { seller: { shopName: { contains: q } } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    include: { seller: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="mt-1 text-sm text-gray-600">
            Matériel informatique vendu par nos vendeurs vérifiés.
          </p>
        </div>
        <Link
          href="/marketplace/create"
          className="shrink-0 rounded-md bg-hublink px-4 py-2 text-sm font-semibold text-white hover:bg-hublink-dark"
        >
          + Vendre un produit
        </Link>
      </div>

      <form className="mt-6 flex items-center gap-2 rounded-lg border bg-white p-4">
        <Search size={16} className="text-gray-400" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Un article, une boutique..."
          className="w-full text-sm outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-hublink px-4 py-1.5 text-sm font-semibold text-white hover:bg-hublink-dark"
        >
          Rechercher
        </button>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p: any) => {
          const images: string[] = p.images ? JSON.parse(p.images) : [];
          return (
            <div
              key={p.id}
              className="overflow-hidden rounded-lg border bg-white shadow-sm"
            >
              <Link href={`/marketplace/${p.id}`} className="block">
                <div className="flex aspect-video items-center justify-center bg-gray-100 text-4xl">
                  {images[0] ? (
                    <img
                      src={images[0]}
                      alt={p.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Monitor size={32} className="text-gray-300" />
                  )}
                </div>
                <div className="px-4 pt-4">
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <Link
                  href={`/profile/${p.seller.userId}`}
                  className="mt-1 block text-xs text-hublink hover:underline"
                >
                  Vendu par {p.seller.shopName}
                </Link>
                <p className="mt-2 font-semibold text-hublink">
                  {Number(p.price).toLocaleString("fr-FR")} FCFA
                </p>
              </div>
            </div>
          );
        })}
        {products.length === 0 && (
          <p className="col-span-full text-sm text-gray-500">
            {q
              ? `Aucun résultat pour "${q}".`
              : "Aucun produit en vente pour le moment. Les vendeurs peuvent en ajouter depuis leur tableau de bord."}
          </p>
        )}
      </div>
    </div>
  );
}
