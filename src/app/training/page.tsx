import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DEFAULT_COURSES } from "@/lib/seedTraining";

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  let courses = await prisma.course.findMany({
    include: { _count: { select: { lessons: true } } },
    orderBy: { createdAt: "asc" },
  });

  if (courses.length === 0) {
    try {
      for (const c of DEFAULT_COURSES) {
        await prisma.course.create({
          data: {
            title: c.title,
            description: c.description,
            category: c.category,
            lessons: {
              create: c.lessons.map((l, i) => ({
                title: l.title,
                content: l.content,
                position: i,
              })),
            },
          },
        });
      }
    } catch (e) {
      // Ignoré : déjà créé par une autre requête concurrente
    }
    courses = await prisma.course.findMany({
      include: { _count: { select: { lessons: true } } },
      orderBy: { createdAt: "asc" },
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold">Centre de formation</h1>
      <p className="mt-1 text-sm text-gray-600">
        Cours gratuits pour progresser en informatique et réussir sur HUBLINK.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {courses.map((c: any) => (
          <Link
            key={c.id}
            href={`/training/${c.id}`}
            className="block rounded-lg border bg-white p-5 shadow-sm hover:shadow-md"
          >
            {c.category && (
              <span className="text-xs font-medium text-hublink">
                {c.category}
              </span>
            )}
            <h2 className="mt-1 font-semibold text-gray-900">{c.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{c.description}</p>
            <p className="mt-2 text-xs text-gray-400">
              {c._count.lessons} leçon(s) · Gratuit
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
