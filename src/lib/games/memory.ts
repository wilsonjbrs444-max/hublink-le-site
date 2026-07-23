export const MEMORY_EMOJIS = ["🍎", "🍌", "🍇", "🍉", "🍒", "🥝", "🍍", "🍑"];

export type MemoryCard = { id: number; emoji: string };

export function shuffledMemoryDeck(): MemoryCard[] {
  const deck = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS].map((e, i) => ({ id: i, emoji: e }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
