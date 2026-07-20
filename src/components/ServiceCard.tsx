import Link from "next/link";

type Props = {
  slug: string;
  icon: string | null;
  title: string;
  description: string | null;
  priceIndicative: string | null;
};

export default function ServiceCard({
  slug,
  icon,
  title,
  description,
  priceIndicative,
}: Props) {
  return (
    <Link
      href={`/services/${slug}`}
      className="block rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
      {priceIndicative && (
        <p className="mt-3 text-sm font-medium text-hublink">
          {priceIndicative}
        </p>
      )}
    </Link>
  );
}
