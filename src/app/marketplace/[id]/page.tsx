import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import MessageSellerButton from "@/components/MessageSellerButton";
import ProductOwnerActions from "@/components/ProductOwnerActions";
import { Monitor } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { seller: { include: { user: true } } },
  });

  if (!product) notFound();

  const currentUser = await getCurrentUser();
  const isOwner = currentUser?.id === product.seller.userId;
  const images: string[] = product.images ? JSON.parse(product.images) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-100">
          {images[0] ? (
            <img src={images[0]} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <Monitor size={56} className="text-gray-300" />
          )}
        </div>

        <div>
          {product.isSold && (
            <span className="mb-2 inline-block rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-white">
              Vendu
            </span>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-xl font-semibold text-hublink">
            {Number(product.price).toLocaleString("fr-FR")} FCFA
          </p>
          {product.description && (
            <p className="mt-4 text-sm text-gray-700">{product.description}</p>
          )}
          <p className="mt-4 text-sm text-gray-500">
            Vendu par{" "}
            <Link
              href={`/profile/${product.seller.userId}`}
              className="text-hublink hover:underline"
            >
              {product.seller.shopName}
            </Link>
          </p>
          <p className="mt-1 text-xs text-gray-400">Stock : {product.stock}</p>

          <div className="mt-6">
            {isOwner ? (
              <ProductOwnerActions productId={product.id} isSold={product.isSold} />
            ) : (
              !product.isSold && (
                <MessageSellerButton
                  targetUserId={product.seller.userId}
                  initialMessage={`Bonjour, votre annonce "${product.name}" m'intéresse.`}
                  label="Écrire au vendeur"
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
