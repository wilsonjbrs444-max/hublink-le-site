import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

async function assertOwner(userId: string, productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { seller: true },
  });
  if (!product) return null;
  if (product.seller.userId !== userId) return null;
  return product;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }
    const product = await assertOwner(user.id, params.id);
    if (!product) {
      return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    }

    const { isSold } = await req.json();

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: { isSold: !!isSold },
    });

    return NextResponse.json({ product: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }
    const product = await assertOwner(user.id, params.id);
    if (!product) {
      return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
