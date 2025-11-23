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
        // TCGdex returns the full set with cards included
        const set = await getSet(setId);

        if (!set || !set.cards) {
            console.error(`No cards found for set ${setId}`);
            return [];
        }

        // Fetch full card details for each card in the set
        // For now, we'll use the basic card info from the set
        // If we need full details, we'd need to fetch each card individually
        return set.cards;
    } catch (error) {
        console.error(`Error fetching cards for set ${setId}:`, error);
        return [];
    }
}
