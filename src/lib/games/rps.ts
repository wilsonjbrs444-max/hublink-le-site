export type RpsChoice = "pierre" | "papier" | "ciseaux";

export const RPS_EMOJI: Record<RpsChoice, string> = {
  pierre: "🪨",
  papier: "📄",
  ciseaux: "✂️",
};

// Retourne "a" si le choix a bat le choix b, "b" si b bat a, ou null si égalité
export function rpsResult(a: RpsChoice, b: RpsChoice): "a" | "b" | null {
  if (a === b) return null;
  const beats: Record<RpsChoice, RpsChoice> = {
    pierre: "ciseaux",
    papier: "pierre",
    ciseaux: "papier",
  };
  return beats[a] === b ? "a" : "b";
}
