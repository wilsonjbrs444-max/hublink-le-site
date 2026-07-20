import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import ConversationThread from "@/components/ConversationThread";

export const dynamic = "force-dynamic";

export default async function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.id },
    include: {
      participants: { include: { user: true } },
      messages: { orderBy: { createdAt: "asc" }, include: { sender: true } },
    },
  });

  if (!conversation) notFound();

  const isParticipant = conversation.participants.some(
    (p: any) => p.userId === user.id
  );
  if (!isParticipant) notFound();

  const other = conversation.participants.find((p: any) => p.userId !== user.id)?.user;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/messages" className="text-sm text-hublink hover:underline">
        ← Tous les messages
      </Link>

      {other && (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-hublink-light text-sm font-semibold text-hublink">
            {other.fullName.charAt(0).toUpperCase()}
          </div>
          <Link href={`/profile/${other.id}`} className="font-semibold hover:underline">
            {other.fullName}
          </Link>
        </div>
      )}

      <div className="mt-4">
        <ConversationThread
          conversationId={conversation.id}
          currentUserId={user.id}
          initialMessages={conversation.messages.map((m: any) => ({
            ...m,
            createdAt: m.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
