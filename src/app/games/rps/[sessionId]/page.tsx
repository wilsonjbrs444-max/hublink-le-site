import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import RpsDuelClient from "@/components/games/RpsDuelClient";

export const dynamic = "force-dynamic";

export default async function RpsDuelPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <RpsDuelClient sessionId={params.sessionId} currentUserId={user.id} />;
}
