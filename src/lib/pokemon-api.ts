export interface PokemonCard {
    id: string;
    name: string;
    supertype: string;
    subtypes: string[];
    rarity: string;
    images: {
        small: string;
        large: string;
    };
    set: {
        id: string;
        name: string;
        series: string;
        total: number;
    };
}

export interface PokemonSet {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    images: {
        symbol: string;
        logo: string;
    };
    releaseDate: string;
}

const API_URL = "https://api.pokemontcg.io/v2";

export async function getSets(): Promise<PokemonSet[]> {
    try {
        const res = await fetch(`${API_URL}/sets?orderBy=-releaseDate`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching sets:", error);
        return [];
    }
}

export async function getSet(setId: string): Promise<PokemonSet | null> {
    try {
        const res = await fetch(`${API_URL}/sets/${setId}`, {
            next: { revalidate: 3600 },
        });
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching set ${setId}:`, error);
        return null;
    }
}

export async function getCardsForSet(setId: string): Promise<PokemonCard[]> {
    try {
        // Fetch all cards for the set. Note: API is paginated, but for pack opening we might need a good pool.
        // We'll fetch the first page or two. For a real app, we'd want to fetch all or cache them.
        // 250 is usually enough for a set.
        const res = await fetch(`${API_URL}/cards?q=set.id:${setId}&pageSize=250`, {
            next: { revalidate: 3600 },
        });
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching cards for set ${setId}:`, error);
        return [];
    }
}
