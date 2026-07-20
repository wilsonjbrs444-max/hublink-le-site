import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import AdminNav from "@/components/AdminNav";
import AdminDeleteButton from "@/components/AdminDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const admin = await getCurrentUser();
  if (!admin) redirect("/login");
  if (!admin.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-gray-500">
        Accès réservé aux administrateurs.
      </div>
    );
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { seller: true },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <AdminNav current="/admin/products" />
      <h1 className="text-2xl font-bold">Produits ({products.length})</h1>

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Vendeur</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.seller.shopName}</td>
                <td className="px-4 py-3 text-gray-600">
                  {Number(p.price).toLocaleString("fr-FR")} FCFA
                </td>
                <td className="px-4 py-3">
                  {p.isSold ? (
                    <span className="rounded-full bg-gray-800 px-2 py-1 text-xs text-white">
                      Vendu
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                      Disponible
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <AdminDeleteButton url={`/api/admin/products/${p.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-4 text-sm text-gray-500">Aucun produit.</p>
        )}
      </div>
    </div>
  );
}
