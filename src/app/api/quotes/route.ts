import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    // Active le rôle entreprise automatiquement si besoin
    let companyProfile = await prisma.companyProfile.findUnique({
      where: { userId: user.id },
    });
    if (!companyProfile) {
      companyProfile = await prisma.companyProfile.create({
        data: { userId: user.id, companyName: user.fullName },
      });
      await prisma.userRole.upsert({
        where: { userId_role: { userId: user.id, role: "company" } },
        update: {},
        create: { userId: user.id, role: "company" },
      });
    }

    const { title, description } = await req.json();
    if (!description) {
      return NextResponse.json(
        { error: "La description est obligatoire." },
        { status: 400 }
      );
    }

    const quote = await prisma.quoteRequest.create({
      data: { companyId: companyProfile.id, title, description },
    });

    return NextResponse.json({ quote });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création." },
      { status: 500 }
    );
  }
}
