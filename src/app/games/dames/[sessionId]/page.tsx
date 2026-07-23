import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import DamesDuelClient from "@/components/games/DamesDuelClient";

export const dynamic = "force-dynamic";

export default async function DamesDuelPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <DamesDuelClient sessionId={params.sessionId} currentUserId={user.id} />;
}
