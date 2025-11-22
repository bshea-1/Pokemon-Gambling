import { getCardsForSet, getSet } from "@/lib/pokemon-api";
import PackOpener from "@/components/PackOpener";
import Link from "next/link";
import styles from "./page.module.css";

interface PageProps {
    searchParams: Promise<{ setId: string }>;
}

export default async function OpenPage({ searchParams }: PageProps) {
    const { setId } = await searchParams;

    if (!setId) {
        return (
            <div className={styles.error}>
                <h1>No Set Selected</h1>
                <Link href="/" className={styles.backButton}>Go Back</Link>
            </div>
        );
    }

    const set = await getSet(setId);
    const cards = await getCardsForSet(setId);

    if (!set || cards.length === 0) {
        return (
            <div className={styles.error}>
                <h1>Set Not Found or Empty</h1>
                <Link href="/" className={styles.backButton}>Go Back</Link>
            </div>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>← Back to Sets</Link>
                <h1 className={styles.title}>{set.name} Pack Opening</h1>
            </div>

            <div className={styles.content}>
                <PackOpener set={set} pool={cards} />
            </div>
        </main>
    );
}
