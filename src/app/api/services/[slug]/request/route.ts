import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Connecte-toi pour envoyer une demande." },
        { status: 401 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { slug: params.slug },
    });
    if (!service) {
      return NextResponse.json(
        { error: "Service introuvable." },
        { status: 404 }
      );
    }

    const { message } = await req.json();

    const request_ = await prisma.serviceRequest.create({
      data: {
        serviceId: service.id,
        userId: user.id,
        message,
      },
    });

    return NextResponse.json({ request: request_ });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi de la demande." },
      { status: 500 }
    );
  }
}
