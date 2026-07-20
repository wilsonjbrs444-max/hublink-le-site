import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {post.category && (
        <span className="text-xs font-medium text-hublink">
          {post.category}
        </span>
      )}
      <h1 className="mt-1 text-2xl font-bold">{post.title}</h1>
      <p className="mt-2 text-xs text-gray-400">
        {post.authorName} ·{" "}
        {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
      </p>

      <div className="mt-6 whitespace-pre-line text-gray-700">
        {post.content}
      </div>
    </div>
  );
}
