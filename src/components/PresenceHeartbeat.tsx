"use client";

import { useEffect } from "react";
import { HEARTBEAT_INTERVAL_MS } from "@/lib/presence";

function sendHeartbeat() {
  fetch("/api/presence/heartbeat", { method: "POST", keepalive: true }).catch(
    () => {}
  );
}

function sendOffline() {
  // sendBeacon fonctionne même quand la page se ferme (contrairement à fetch)
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/presence/offline");
  } else {
    fetch("/api/presence/offline", { method: "POST", keepalive: true }).catch(
      () => {}
    );
  }
}

// Ce composant ne rend rien à l'écran : il fait juste vivre le statut
// "en ligne" tant que l'utilisateur a un onglet HUBLINK ouvert et actif.
export default function PresenceHeartbeat() {
  useEffect(() => {
    sendHeartbeat();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        sendHeartbeat();
      }
    }, HEARTBEAT_INTERVAL_MS);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        sendHeartbeat();
      } else {
        // Onglet mis en arrière-plan : on ne coupe pas tout de suite,
        // le seuil de tolérance côté serveur gère les cas courts.
      }
    }

    function handleBeforeUnload() {
      sendOffline();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
      sendOffline();
    };
  }, []);

  return null;
}
