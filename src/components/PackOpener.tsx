"use client";

import { PokemonCard, PokemonSet } from "@/lib/pokemon-api";
import { generatePack } from "@/lib/pack-logic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Pack from "./Pack";
import Card from "./Card";
import styles from "./PackOpener.module.css";
import clsx from "clsx";

interface PackOpenerProps {
    set: PokemonSet;
    pool: PokemonCard[];
}

export default function PackOpener({ set, pool }: PackOpenerProps) {
    const [stage, setStage] = useState<"unopened" | "opening" | "opened">("unopened");
    const [pack, setPack] = useState<PokemonCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

    const handleOpenPack = () => {
        setStage("opening");
        // Simulate animation delay
        setTimeout(() => {
            const newPack = generatePack(pool);
            setPack(newPack);
            setStage("opened");
            setCurrentIndex(0);
            setRevealedIndices(new Set());
        }, 1500);
    };

    const handleNext = () => {
        if (currentIndex < pack.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleReveal = (index: number) => {
        if (!revealedIndices.has(index)) {
            const newRevealed = new Set(revealedIndices);
            newRevealed.add(index);
            setRevealedIndices(newRevealed);
        }
    };

    const reset = () => {
        setStage("unopened");
        setPack([]);
        setCurrentIndex(0);
        setRevealedIndices(new Set());
    };

    return (
        <div className={styles.container}>
            <AnimatePresence mode="wait">
                {stage === "unopened" && (
                    <motion.div
                        key="pack"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                        className={styles.centerContent}
                    >
                        <Pack set={set} onOpen={handleOpenPack} />
                        <p className={styles.instruction}>Tap to Open</p>
                    </motion.div>
                )}

                {stage === "opening" && (
                    <motion.div
                        key="opening"
                        className={styles.centerContent}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className={styles.burst} />
                    </motion.div>
                )}

                {stage === "opened" && (
                    <motion.div
                        key="cards"
                        className={styles.cardsContainer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className={styles.carousel}>
                            <button
                                className={clsx(styles.navButton, styles.prev)}
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                            >
                                ←
                            </button>

                            <div className={styles.cardWrapper}>
                                <AnimatePresence mode="popLayout" custom={currentIndex}>
                                    {pack.map((card, index) => (
                                        index === currentIndex && (
                                            <motion.div
                                                key={card.id}
                                                initial={{ x: 300, opacity: 0, rotateY: -15 }}
                                                animate={{ x: 0, opacity: 1, rotateY: 0 }}
                                                exit={{ x: -300, opacity: 0, rotateY: 15 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                drag="x"
                                                dragConstraints={{ left: 0, right: 0 }}
                                                dragElastic={0.2}
                                                onDragEnd={(e, { offset, velocity }) => {
                                                    const swipe = offset.x;

                                                    if (swipe < -100) {
                                                        handleNext();
                                                    } else if (swipe > 100) {
                                                        handlePrev();
                                                    }
                                                }}
                                                className={styles.activeCard}
                                            >
                                                <Card
                                                    card={card}
                                                    isRevealed={revealedIndices.has(index)}
                                                    onReveal={() => handleReveal(index)}
                                                />
                                            </motion.div>
                                        )
                                    ))}
                                </AnimatePresence>
                            </div>

                            <button
                                className={clsx(styles.navButton, styles.next)}
                                onClick={handleNext}
                                disabled={currentIndex === pack.length - 1}
                            >
                                →
                            </button>
                        </div>

                        <div className={styles.controls}>
                            <div className={styles.counter}>
                                Card {currentIndex + 1} / {pack.length}
                            </div>
                            {currentIndex === pack.length - 1 && revealedIndices.has(currentIndex) && (
                                <button className={styles.openAnother} onClick={reset}>
                                    Open Another Pack
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
