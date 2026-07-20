import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentUser();
    if (!admin || !admin.isAdmin) {
      return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 403 });
    }

    const { title, icon, description, priceIndicative } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Le titre est obligatoire." }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug: slugify(title),
        icon,
        description,
        priceIndicative,
      },
    });

    return NextResponse.json({ service });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
