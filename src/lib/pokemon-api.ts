export interface PokemonCard {
    id: string;
    name: string;
    localId: string;
    image: string;
    rarity: string;
    category?: string;
    hp?: number;
    types?: string[];
    set: {
        id: string;
        name: string;
        cardCount: {
            official: number;
            total: number;
        };
    };
}

export interface PokemonSet {
    id: string;
    name: string;
    logo?: string;
    symbol?: string;
    cardCount: {
        total: number;
        official: number;
    };
    releaseDate?: string;
    serie?: {
        id: string;
        name: string;
    };
    cards?: PokemonCard[];
}

const API_URL = "https://api.tcgdex.net/v2/en";

const headers: HeadersInit = {
    "Content-Type": "application/json",
    "User-Agent": "Pokemon-TCG-Opener/1.0",
};

export async function getSets(): Promise<PokemonSet[]> {
    try {
        const res = await fetch(`${API_URL}/sets`, {
            headers,
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            console.error(`Failed to fetch sets: ${res.status} ${res.statusText}`);
            return [];
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching sets:", error);
        return [];
    }
}

export async function getSet(setId: string): Promise<PokemonSet | null> {
    try {
        const res = await fetch(`${API_URL}/sets/${setId}`, {
            headers,
            next: { revalidate: 3600 },
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching set ${setId}:`, error);
        return null;
    }
}

export async function getCardsForSet(setId: string): Promise<PokemonCard[]> {
    try {
        const set = await getSet(setId);

        if (!set || !set.cards) {
            console.error(`No cards found for set ${setId}`);
            return [];
        }

        // Fetch Commons and Uncommons to determine rarity
        // We fetch these lists to map IDs to rarities without fetching every single card detail
        const [commonsRes, uncommonsRes] = await Promise.all([
            fetch(`${API_URL}/cards?set=${setId}&rarity=Common`, { headers, next: { revalidate: 3600 } }),
            fetch(`${API_URL}/cards?set=${setId}&rarity=Uncommon`, { headers, next: { revalidate: 3600 } })
        ]);

        const commonsData = commonsRes.ok ? await commonsRes.json() : [];
        const uncommonsData = uncommonsRes.ok ? await uncommonsRes.json() : [];

        const commonIds = new Set(commonsData.map((c: any) => c.id));
        const uncommonIds = new Set(uncommonsData.map((c: any) => c.id));

        // Map rarity to cards and ensure all required fields are present
        const cardsWithRarity = set.cards.map(card => {
            let rarity = "Rare"; // Default to Rare for anything not Common/Uncommon (includes Holo, Ultra, Secret, etc.)

            if (commonIds.has(card.id)) {
                rarity = "Common";
            } else if (uncommonIds.has(card.id)) {
                rarity = "Uncommon";
            }

            return {
                ...card,
                rarity,
                // Populate the set info which is missing from the card summary
                set: {
                    id: set.id,
                    name: set.name,
                    cardCount: set.cardCount
                }
            } as PokemonCard;
        });

        return cardsWithRarity;
    } catch (error) {
        console.error(`Error fetching cards for set ${setId}:`, error);
        return [];
    }
}
