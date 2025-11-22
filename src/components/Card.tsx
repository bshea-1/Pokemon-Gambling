"use client";

import { PokemonCard } from "@/lib/pokemon-api";
import { motion } from "framer-motion";
import { useState } from "react";
import styles from "./Card.module.css";

interface CardProps {
    card: PokemonCard;
    isRevealed: boolean;
    onReveal?: () => void;
}

export default function Card({ card, isRevealed, onReveal }: CardProps) {
    const [isFlipped, setIsFlipped] = useState(!isRevealed);

    // If isRevealed is true, we show the front.
    // If isRevealed is false, we show the back.
    // However, we might want an animation where it starts back-up and flips.

    return (
        <div className={styles.cardContainer} onClick={onReveal}>
            <motion.div
                className={styles.cardInner}
                initial={false}
                animate={{ rotateY: isRevealed ? 0 : 180 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front */}
                <div className={styles.cardFront}>
                    <img src={card.images.large} alt={card.name} className={styles.cardImage} />
                    <div className={styles.shine} />
                </div>

                {/* Back */}
                <div className={styles.cardBack}>
                    <div className={styles.backPattern} />
                </div>
            </motion.div>
        </div>
    );
}
