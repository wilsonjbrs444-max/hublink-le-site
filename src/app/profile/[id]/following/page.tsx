import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FollowingPage({
  params,
}: {
  params: { id: string };
}) {
  const profileUser = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, fullName: true },
  });
  if (!profileUser) notFound();

  const following = await prisma.follow.findMany({
    where: { followerId: params.id },
    include: { following: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-md px-4 py-6 pb-24">
      <Link href={`/profile/${params.id}`} className="text-sm text-hublink hover:underline">
        ← {profileUser.fullName}
      </Link>
      <h1 className="mt-3 mb-4 text-xl font-bold">Abonnements ({following.length})</h1>

      {following.length === 0 && (
        <p className="text-sm text-gray-500">Aucun abonnement pour le moment.</p>
      )}

      <div className="divide-y rounded-lg border bg-white">
        {following.map((f) => (
          <Link
            key={f.id}
            href={`/profile/${f.following.id}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-hublink-light text-sm font-semibold text-hublink">
              {f.following.avatarUrl ? (
                <img src={f.following.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                f.following.fullName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{f.following.fullName}</p>
              {f.following.city && (
                <p className="text-xs text-gray-500">{f.following.city}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
