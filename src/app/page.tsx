import { getSets } from "@/lib/pokemon-api";
import Link from "next/link";
import styles from "./page.module.css";

export default async function Home() {
  const sets = await getSets();
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
              <img src={set.images.logo} alt={set.name} className={styles.setLogo} />
            </div>
            <div className={styles.setInfo}>
              <h2>{set.name}</h2>
              <p>{set.releaseDate}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
