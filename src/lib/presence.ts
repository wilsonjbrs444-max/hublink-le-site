// Un utilisateur est considéré "en ligne" si son onglet a envoyé un signal
// (heartbeat) il y a moins de ONLINE_THRESHOLD_MS. Ça sert de filet de
// sécurité si le navigateur se ferme brutalement (crash, coupure réseau)
// sans avoir pu prévenir le serveur qu'il passait hors ligne.
export const ONLINE_THRESHOLD_MS = 60 * 1000; // 60 secondes
export const HEARTBEAT_INTERVAL_MS = 20 * 1000; // 20 secondes

export function isEffectivelyOnline(
  isOnline: boolean,
  lastActiveAt: Date | string | null
): boolean {
  if (!isOnline || !lastActiveAt) return false;
  const last = new Date(lastActiveAt).getTime();
  return Date.now() - last < ONLINE_THRESHOLD_MS;
}
