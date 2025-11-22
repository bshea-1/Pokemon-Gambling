import { PokemonCard } from "./pokemon-api";

export type RarityGroup = "Common" | "Uncommon" | "Rare";

function getRarityGroup(rarity: string): RarityGroup {
    const r = rarity?.toLowerCase() || "common";
    if (r.includes("common") && !r.includes("uncommon")) return "Common";
    if (r.includes("uncommon")) return "Uncommon";
    return "Rare";
}

export function generatePack(cards: PokemonCard[]): PokemonCard[] {
    const commons = cards.filter((c) => getRarityGroup(c.rarity) === "Common");
    const uncommons = cards.filter((c) => getRarityGroup(c.rarity) === "Uncommon");
    const rares = cards.filter((c) => getRarityGroup(c.rarity) === "Rare");

    const pack: PokemonCard[] = [];

    // Helper to pick random cards
    const pickRandom = (pool: PokemonCard[], count: number) => {
        const selected: PokemonCard[] = [];
        const poolCopy = [...pool];
        for (let i = 0; i < count; i++) {
            if (poolCopy.length === 0) break;
            const randomIndex = Math.floor(Math.random() * poolCopy.length);
            selected.push(poolCopy[randomIndex]);
            // Optional: don't remove if we want duplicates allowed? Usually no duplicates in a pack.
            poolCopy.splice(randomIndex, 1);
        }
        return selected;
    };

    // Standard distribution: 6 Commons, 3 Uncommons, 1 Rare
    // If pools are empty, fill with whatever is available (fallback)

    pack.push(...pickRandom(commons, 6));
    pack.push(...pickRandom(uncommons, 3));
    pack.push(...pickRandom(rares, 1));

    // If we don't have 10 cards (e.g. small set), fill with randoms
    while (pack.length < 10 && cards.length > 0) {
        const remaining = cards.filter(c => !pack.includes(c));
        if (remaining.length === 0) break;
        pack.push(remaining[Math.floor(Math.random() * remaining.length)]);
    }

    return pack;
}
