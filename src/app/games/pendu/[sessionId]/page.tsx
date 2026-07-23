import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import PenduDuelClient from "@/components/games/PenduDuelClient";

export const dynamic = "force-dynamic";

export default async function PenduDuelPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <PenduDuelClient sessionId={params.sessionId} currentUserId={user.id} />;
}
