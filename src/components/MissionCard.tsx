import Link from "next/link";
import { MapPin } from "lucide-react";

type Props = {
  id: string;
  title: string;
  description: string;
  budget: number | null;
  city: string | null;
  urgency: string;
  offersCount: number;
};

const urgencyStyle: Record<string, { label: string; dot: string; text: string }> = {
  aujourd_hui: { label: "Aujourd'hui", dot: "bg-red-500", text: "text-red-700" },
  cette_semaine: { label: "Cette semaine", dot: "bg-orange-500", text: "text-orange-700" },
  flexible: { label: "Flexible", dot: "bg-green-500", text: "text-green-700" },
};

export default function MissionCard({
  id,
  title,
  description,
  budget,
  city,
  urgency,
  offersCount,
}: Props) {
  const u = urgencyStyle[urgency] || urgencyStyle.flexible;

  return (
    <Link
      href={`/freelance/${id}`}
      className="block rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className={`flex items-center gap-1.5 text-xs font-medium ${u.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${u.dot}`} />
          {u.label}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-gray-600">{description}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-gray-500">
          <MapPin size={14} /> {city || "Non précisé"}
        </span>
        <span className="font-semibold text-hublink">
          {budget ? `${budget.toLocaleString("fr-FR")} FCFA` : "Budget à discuter"}
        </span>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        {offersCount} offre{offersCount > 1 ? "s" : ""} reçue{offersCount > 1 ? "s" : ""}
      </div>
    </Link>
  );
}
