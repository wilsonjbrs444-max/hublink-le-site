import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { createNotification } from "@/lib/notify";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    const { missionId, targetUserId, rating, comment } = await req.json();

    const ratingNum = Number(rating);
    if (!missionId || !targetUserId || !ratingNum || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }

    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: { offers: { where: { status: "acceptee" }, include: { freelance: true } } },
    });
    if (!mission) {
      return NextResponse.json({ error: "Mission introuvable." }, { status: 404 });
    }
    if (mission.status !== "terminee") {
      return NextResponse.json(
        { error: "La mission doit être terminée avant de laisser un avis." },
        { status: 400 }
      );
    }

    const acceptedOffer = mission.offers[0];
    const freelanceUserId = acceptedOffer?.freelance.userId;

    const isClient = user.id === mission.clientId;
    const isAcceptedFreelance = user.id === freelanceUserId;

    if (!isClient && !isAcceptedFreelance) {
      return NextResponse.json(
        { error: "Tu ne fais pas partie de cette mission." },
        { status: 403 }
      );
    }
    const expectedTarget = isClient ? freelanceUserId : mission.clientId;
    if (targetUserId !== expectedTarget) {
      return NextResponse.json({ error: "Cible d'avis invalide." }, { status: 400 });
    }

    const existing = await prisma.review.findUnique({
      where: {
        missionId_reviewerId_targetUserId: {
          missionId,
          reviewerId: user.id,
          targetUserId,
        },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Tu as déjà laissé un avis pour cette mission." },
        { status: 409 }
      );
    }

    await prisma.review.create({
      data: {
        missionId,
        reviewerId: user.id,
        targetUserId,
        rating: ratingNum,
        comment: comment || null,
      },
    });

    const targetFreelanceProfile = await prisma.freelanceProfile.findUnique({
      where: { userId: targetUserId },
    });
    if (targetFreelanceProfile) {
      const agg = await prisma.review.aggregate({
        where: { targetUserId },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await prisma.freelanceProfile.update({
        where: { userId: targetUserId },
        data: {
          ratingAvg: agg._avg.rating || 0,
          ratingCount: agg._count.rating,
        },
      });
    }

    await createNotification(
      targetUserId,
      "nouvel_avis",
      `${user.fullName} t'a laissé un avis ${ratingNum}/5.`,
      `/profile/${targetUserId}`
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi de l'avis." },
      { status: 500 }
    );
  }
}
