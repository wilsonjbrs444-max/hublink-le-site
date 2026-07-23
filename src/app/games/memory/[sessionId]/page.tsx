import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import MemoryDuelClient from "@/components/games/MemoryDuelClient";

export const dynamic = "force-dynamic";

export default async function MemoryDuelPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <MemoryDuelClient sessionId={params.sessionId} currentUserId={user.id} />;
}
