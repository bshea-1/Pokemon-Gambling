"use client";

import { PokemonSet } from "@/lib/pokemon-api";
import { motion } from "framer-motion";
import styles from "./Pack.module.css";

interface PackProps {
    set: PokemonSet;
    onOpen: () => void;
}

export default function Pack({ set, onOpen }: PackProps) {
    const handleDragEnd = (event: any, info: any) => {
        if (info.offset.y > 50) {
            onOpen();
        }
    };

    return (
        <div className={styles.packContainer}>
            <motion.div
                className={styles.crimpTop}
                drag="y"
                dragConstraints={{ top: 0, bottom: 100 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className={styles.pullTab} />
            </motion.div>

            <motion.div
                className={styles.packBody}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
            >
                <div className={styles.foilTexture} />
                <div className={styles.packContent}>
                    {set.logo && <img src={set.logo} alt={set.name} className={styles.setLogo} />}
                    {!set.logo && <div className={styles.setName}>{set.name}</div>}
                    <div className={styles.packText}>10 Additional Cards</div>
                    <div className={styles.packText} style={{ fontSize: '0.7rem', marginTop: '5px' }}>Swipe Top Down to Open</div>
                </div>
                <div className={styles.crimpBottom} />
                <div className={styles.shine} />
            </motion.div>
        </div>
    );
}
