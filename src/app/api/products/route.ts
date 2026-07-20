import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });
    if (!sellerProfile) {
      return NextResponse.json(
        { error: "Tu dois activer ton profil vendeur d'abord." },
        { status: 403 }
      );
    }

    const { name, description, price, stock, images } = await req.json();
    if (!name || !price) {
      return NextResponse.json(
        { error: "Nom et prix sont obligatoires." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        sellerId: sellerProfile.id,
        name,
        description,
        price: Number(price),
        stock: stock ? Number(stock) : 0,
        images: JSON.stringify(images || []),
      },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du produit." },
      { status: 500 }
    );
  }
}
