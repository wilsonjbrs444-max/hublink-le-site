"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corrige un bug connu d'icônes manquantes avec Leaflet + bundlers
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type Technician = {
  id: string;
  userId: string;
  fullName: string;
  specialty: string | null;
  city: string | null;
  latitude: number;
  longitude: number;
};

export default function TechniciansMap({
  technicians,
}: {
  technicians: Technician[];
}) {
  // Centre par défaut : Douala, Cameroun
  const center: [number, number] =
    technicians.length > 0
      ? [technicians[0].latitude, technicians[0].longitude]
      : [4.0511, 9.7679];

  return (
    <MapContainer
      center={center}
      zoom={technicians.length > 0 ? 7 : 6}
      scrollWheelZoom={true}
      className="h-[70vh] w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {technicians.map((t) => (
        <Marker key={t.id} position={[t.latitude, t.longitude]} icon={markerIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{t.fullName}</p>
              <p className="text-hublink">{t.specialty}</p>
              <p className="text-gray-500">{t.city}</p>
              <Link
                href={`/profile/${t.userId}`}
                className="mt-1 block text-hublink underline"
              >
                Voir le profil
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
