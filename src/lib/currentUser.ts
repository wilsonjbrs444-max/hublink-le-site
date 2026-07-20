import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const token = cookies().get("hublink_token")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { roles: true, freelanceProfile: true, sellerProfile: true, companyProfile: true },
  });
  return user;
}
