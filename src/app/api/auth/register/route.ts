import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, password, city, role } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Nom, email et mot de passe sont obligatoires." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        city,
        passwordHash,
        roles: { create: { role: role || "client" } },
        // Crée automatiquement le profil spécifique associé au rôle choisi
        ...(role === "freelance" && {
          freelanceProfile: { create: {} },
        }),
        ...(role === "seller" && {
          sellerProfile: { create: { shopName: `Boutique de ${fullName}` } },
        }),
        ...(role === "company" && {
          companyProfile: { create: { companyName: fullName } },
        }),
      },
    });

    const token = signToken({ userId: user.id, email: user.email });

    const res = NextResponse.json({
      user: { id: user.id, fullName: user.fullName, email: user.email },
    });
    res.cookies.set("hublink_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'inscription." },
      { status: 500 }
    );
  }
}
