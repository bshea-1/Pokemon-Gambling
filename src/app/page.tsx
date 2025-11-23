import { getSets } from "@/lib/pokemon-api";
import Link from "next/link";
import styles from "./page.module.css";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic';

export default async function Home() {
  const sets = await getSets();

  // If no sets loaded, show a message
  if (sets.length === 0) {
    return (
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Pokemon TCG Pack Opener</h1>
          <p className={styles.subtitle}>Unable to load sets. Please try again later.</p>
        </header>
      </main>
    );
  }

  // Filter for main sets or popular ones to avoid clutter
  const displaySets = sets.slice(0, 12); // Top 12 newest sets

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pokemon TCG Pack Opener</h1>
        <p className={styles.subtitle}>Select a set to start opening packs</p>
      </header>

      <div className={styles.grid}>
        {displaySets.map((set) => (
          <Link href={`/open?setId=${set.id}`} key={set.id} className={styles.card}>
            <div className={styles.logoWrapper}>
              {set.logo && <img src={set.logo} alt={set.name} className={styles.setLogo} />}
              {!set.logo && <div className={styles.noLogo}>{set.name}</div>}
            </div>
            <div className={styles.setInfo}>
              <h2>{set.name}</h2>
              <p>{set.releaseDate || 'Release date unknown'}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
