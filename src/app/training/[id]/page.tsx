import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: { lessons: { orderBy: { position: "asc" } } },
  });

  if (!course) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {course.category && (
        <span className="text-xs font-medium text-hublink">
          {course.category}
        </span>
      )}
      <h1 className="mt-1 text-2xl font-bold">{course.title}</h1>
      <p className="mt-2 text-gray-600">{course.description}</p>

      <div className="mt-8 space-y-4">
        {course.lessons.map((lesson: any, i: any) => (
          <div key={lesson.id} className="rounded-lg border bg-white p-5">
            <p className="text-xs font-medium text-gray-400">
              Leçon {i + 1}
            </p>
            <h2 className="mt-1 font-semibold text-gray-900">
              {lesson.title}
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
              {lesson.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
