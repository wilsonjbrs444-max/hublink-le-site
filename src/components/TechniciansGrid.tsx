"use client";

import Link from "next/link";
import { MapPin, BadgeCheck, Star } from "lucide-react";
import { StaticOnlineDot } from "./OnlineDot";
import { useOnlineStatuses } from "@/lib/useOnlineStatuses";

type Technician = {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  specialty: string | null;
  city: string | null;
  bio: string | null;
  skills: string[];
  certificationStatus: string;
  ratingAvg: number;
  ratingCount: number;
  yearsExperience: number | null;
  hourlyRate: number | null;
  isOnline: boolean;
};

export default function TechniciansGrid({
  technicians,
}: {
  technicians: Technician[];
}) {
  const initialStatuses = Object.fromEntries(
    technicians.map((t) => [t.userId, t.isOnline])
  );
  const liveStatuses = useOnlineStatuses(
    technicians.map((t) => t.userId),
    initialStatuses
  );

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {technicians.map((t) => (
        <Link
          href={`/profile/${t.userId}`}
          key={t.id}
          className="block rounded-lg border bg-white p-5 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-hublink-light text-lg font-semibold text-hublink">
                {t.avatarUrl ? (
                  <img src={t.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  t.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <StaticOnlineDot
                online={liveStatuses[t.userId] ?? t.isOnline}
                className="absolute bottom-0 right-0"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{t.fullName}</p>
              <p className="text-xs font-medium text-hublink">
                {t.specialty || "Technicien"}
              </p>
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={12} /> {t.city || "Ville non précisée"}
              </p>
            </div>
            {t.certificationStatus === "certifie" && (
              <span className="ml-auto flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                <BadgeCheck size={13} /> Certifié
              </span>
            )}
          </div>

          {t.bio && <p className="mt-3 line-clamp-2 text-sm text-gray-600">{t.bio}</p>}

          {t.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {t.skills.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-gray-500">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              {Number(t.ratingAvg).toFixed(1)} ({t.ratingCount})
            </span>
            <span className="text-gray-500">
              {t.yearsExperience || 0} ans d'expérience
            </span>
          </div>

          {t.hourlyRate && (
            <p className="mt-2 text-sm font-semibold text-hublink">
              {Number(t.hourlyRate).toLocaleString("fr-FR")} FCFA / heure
            </p>
          )}
        </Link>
      ))}
      {technicians.length === 0 && (
        <p className="text-sm text-gray-500">
          Aucun technicien ne correspond à ta recherche.
        </p>
      )}
    </div>
  );
}
