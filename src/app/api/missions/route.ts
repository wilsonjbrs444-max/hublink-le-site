import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Tu dois être connecté pour publier une mission." },
        { status: 401 }
      );
    }

    const { title, description, budget, city, urgency, categoryId } =
      await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Titre et description sont obligatoires." },
        { status: 400 }
      );
    }

    const mission = await prisma.mission.create({
      data: {
        clientId: user.id,
        title,
        description,
        budget,
        city,
        urgency: urgency || "flexible",
        categoryId: categoryId || null,
      },
    });

    return NextResponse.json({ mission });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la publication." },
      { status: 500 }
    );
  }
}
