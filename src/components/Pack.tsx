"use client";

import { PokemonSet } from "@/lib/pokemon-api";
import { motion } from "framer-motion";
import styles from "./Pack.module.css";

interface PackProps {
    set: PokemonSet;
    onOpen: () => void;
}

export default function Pack({ set, onOpen }: PackProps) {
    return (
        <motion.div
            className={styles.packContainer}
            whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
        >
            <div className={styles.packBody}>
                <div className={styles.crimpTop} />
                <div className={styles.packContent}>
                    <img src={set.images.logo} alt={set.name} className={styles.setLogo} />
                    <div className={styles.packText}>10 Additional Cards</div>
                </div>
                <div className={styles.crimpBottom} />
                <div className={styles.shine} />
            </div>
        </motion.div>
    );
}
