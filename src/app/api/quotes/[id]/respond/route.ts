import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    const { price, message } = await req.json();

    const response = await prisma.quoteResponse.create({
      data: {
        quoteRequestId: params.id,
        partnerId: user.id,
        price: price ? Number(price) : null,
        message,
      },
    });

    return NextResponse.json({ response });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi de la réponse." },
      { status: 500 }
    );
  }
}
