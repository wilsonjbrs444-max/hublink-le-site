import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    const { role } = await req.json();
    const validRoles = ["client", "freelance", "seller", "company"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Rôle invalide." }, { status: 400 });
    }

    // Ajoute le rôle s'il n'existe pas déjà
    await prisma.userRole.upsert({
      where: { userId_role: { userId: user.id, role } },
      update: {},
      create: { userId: user.id, role },
    });

    // Crée le profil spécifique associé si nécessaire
    if (role === "freelance") {
      await prisma.freelanceProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id, skills: "[]" },
      });
    }
    if (role === "seller") {
      await prisma.sellerProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id, shopName: `Boutique de ${user.fullName}` },
      });
    }
    if (role === "company") {
      await prisma.companyProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id, companyName: user.fullName },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'activation du rôle." },
      { status: 500 }
    );
  }
}
