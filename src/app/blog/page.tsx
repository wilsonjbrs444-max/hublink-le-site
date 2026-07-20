import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DEFAULT_BLOG_POSTS } from "@/lib/seedBlog";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
  });

  if (posts.length === 0) {
    try {
      await prisma.blogPost.createMany({ data: DEFAULT_BLOG_POSTS });
    } catch (e) {
      // Ignoré : déjà inséré par une autre requête concurrente
    }
    posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold">Blog HUBLINK</h1>
      <p className="mt-1 text-sm text-gray-600">
        Actualités, conseils et tutoriels tech.
      </p>

      <div className="mt-8 space-y-4">
        {posts.map((p: any) => (
          <Link
            key={p.id}
            href={`/blog/${p.slug}`}
            className="block rounded-lg border bg-white p-5 shadow-sm hover:shadow-md"
          >
            {p.category && (
              <span className="text-xs font-medium text-hublink">
                {p.category}
              </span>
            )}
            <h2 className="mt-1 font-semibold text-gray-900">{p.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {p.content}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              {p.authorName} ·{" "}
              {new Date(p.publishedAt).toLocaleDateString("fr-FR")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
