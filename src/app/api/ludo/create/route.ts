import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { createNotification } from "@/lib/notify";
import { sendPushToUser } from "@/lib/push";
import { LUDO_COLORS, LudoColor, createInitialLudoState } from "@/lib/games/ludo";

type SeatPlan = { type: "ai" | "human" | "open"; userId?: string };

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const { seatPlan } = (await req.json()) as { seatPlan: SeatPlan[] };
  if (!Array.isArray(seatPlan) || seatPlan.length < 1 || seatPlan.length > 3) {
    return NextResponse.json({ error: "Il faut entre 2 et 4 joueurs au total." }, { status: 400 });
  }

  const colors: LudoColor[] = LUDO_COLORS.slice(0, seatPlan.length + 1);

  const seats: any[] = [
    { color: colors[0], type: "human", userId: user.id, name: user.fullName },
  ];

  for (let i = 0; i < seatPlan.length; i++) {
    const plan = seatPlan[i];
    const color = colors[i + 1];
    if (plan.type === "ai") {
      seats.push({ color, type: "ai", userId: null, name: "Ordinateur" });
    } else if (plan.type === "human" && plan.userId) {
      const friend = await prisma.user.findUnique({ where: { id: plan.userId } });
      seats.push({ color, type: "human", userId: plan.userId, name: friend?.fullName || "Joueur" });
    } else {
      seats.push({ color, type: "open", userId: null, name: null });
    }
  }

  const hasOpenSeat = seats.some((s) => s.type === "open");
  const status = hasOpenSeat ? "waiting" : "active";
  const state = createInitialLudoState(colors);

  const game = await prisma.ludoGame.create({
    data: {
      seats: JSON.stringify(seats),
      state: JSON.stringify(state),
      status,
      createdBy: user.id,
    },
  });

  const link = `/games/ludo/${game.id}`;
  for (const seat of seats) {
    if (seat.type === "human" && seat.userId && seat.userId !== user.id) {
      const existing = await prisma.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { userId: user.id } } },
            { participants: { some: { userId: seat.userId } } },
          ],
        },
      });
      let conversationId = existing?.id;
      if (!conversationId) {
        const created = await prisma.conversation.create({
          data: { participants: { create: [{ userId: user.id }, { userId: seat.userId }] } },
        });
        conversationId = created.id;
      }
      await prisma.message.create({
        data: {
          conversationId,
          senderId: user.id,
          content: `🎲 ${user.fullName} t'invite à une partie de Ludo ! Rejoins la partie : ${link}`,
        },
      });
      await createNotification(seat.userId, "defi_jeu", `${user.fullName} t'invite à une partie de Ludo !`, link);
      await sendPushToUser(seat.userId, {
        title: "Nouvelle partie de Ludo 🎲",
        body: `${user.fullName} t'invite à jouer !`,
        url: link,
      });
    }
  }

  return NextResponse.json({ gameId: game.id });
}
