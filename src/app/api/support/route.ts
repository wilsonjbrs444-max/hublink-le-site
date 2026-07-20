import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    const { subject, description } = await req.json();
    if (!subject) {
      return NextResponse.json(
        { error: "Le sujet est obligatoire." },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.create({
      data: { userId: user.id, subject, description },
    });

    return NextResponse.json({ ticket });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du ticket." },
      { status: 500 }
    );
  }
}
