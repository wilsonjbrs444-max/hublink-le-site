import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FollowersPage({
  params,
}: {
  params: { id: string };
}) {
  const profileUser = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, fullName: true },
  });
  if (!profileUser) notFound();

  const followers = await prisma.follow.findMany({
    where: { followingId: params.id },
    include: { follower: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-md px-4 py-6 pb-24">
      <Link href={`/profile/${params.id}`} className="text-sm text-hublink hover:underline">
        ← {profileUser.fullName}
      </Link>
      <h1 className="mt-3 mb-4 text-xl font-bold">Abonnés ({followers.length})</h1>

      {followers.length === 0 && (
        <p className="text-sm text-gray-500">Aucun abonné pour le moment.</p>
      )}

      <div className="divide-y rounded-lg border bg-white">
        {followers.map((f) => (
          <Link
            key={f.id}
            href={`/profile/${f.follower.id}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-hublink-light text-sm font-semibold text-hublink">
              {f.follower.avatarUrl ? (
                <img src={f.follower.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                f.follower.fullName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{f.follower.fullName}</p>
              {f.follower.city && (
                <p className="text-xs text-gray-500">{f.follower.city}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
