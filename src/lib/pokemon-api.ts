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

// Use the provided key as default if env var is missing (for easier deployment)
const API_KEY = process.env.POKEMON_TCG_API_KEY || "5f2c1517-6505-4bb7-b9ee-3a428bbbcad7";

const headers: HeadersInit = {
    "Content-Type": "application/json",
    // Some APIs block requests without a User-Agent
    "User-Agent": "Pokemon-TCG-Opener/1.0",
};

if (API_KEY) {
    headers["X-Api-Key"] = API_KEY;
}

export async function getSets(): Promise<PokemonSet[]> {
    try {
        const res = await fetch(`${API_URL}/sets?orderBy=-releaseDate`, {
            headers,
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            console.error(`Failed to fetch sets: ${res.status} ${res.statusText}`);
            const text = await res.text();
            console.error("Response body:", text.slice(0, 500)); // Log first 500 chars
            return [];
        }

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
            headers,
            next: { revalidate: 3600 },
        });

        if (!res.ok) return null;

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
            headers,
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            console.error(`Failed to fetch cards for set ${setId}: ${res.status}`);
            return [];
        }

        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching cards for set ${setId}:`, error);
        return [];
    }
}
