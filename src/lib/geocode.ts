/**
 * Convertit un nom de ville en coordonnées GPS via Nominatim (OpenStreetMap),
 * gratuit et sans clé API. On ne l'appelle qu'une fois par mise à jour de
 * profil, donc pas de souci de limite de requêtes.
 */
export async function geocodeCity(
  city: string
): Promise<{ latitude: number; longitude: number } | null> {
  if (!city?.trim()) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      city
    )}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "HUBLINK-App/1.0" },
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.[0]) return null;

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.error("Erreur géocodage:", err);
    return null;
  }
}
