"use client";

import { PokemonCard, PokemonSet } from "@/lib/pokemon-api";
import { generatePack } from "@/lib/pack-logic";
import { useState } from "react";
import Pack from "./Pack";
import Card from "./Card";
import styles from "./PackOpener.module.css";
import { motion, AnimatePresence } from "framer-motion";

interface PackOpenerProps {
    set: PokemonSet;
    pool: PokemonCard[];
}

export default function PackOpener({ set, pool }: PackOpenerProps) {
    const [stage, setStage] = useState<"unopened" | "opening" | "opened">("unopened");
    const [pack, setPack] = useState<PokemonCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
    const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number }>>([]);

    const handleOpenPack = () => {
        console.log("Opening pack...");
        setStage("opening");

        // Create particle burst
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50
        }));
        setParticles(newParticles);

        // Simulate animation delay
        setTimeout(() => {
            console.log("Generating pack from pool size:", pool.length);
            const newPack = generatePack(pool);
            console.log("Pack generated:", newPack);
            setPack(newPack);
            setStage("opened");
            setCurrentIndex(0);
            setRevealedIndices(new Set());
            setParticles([]);
        }, 1500);
    };

    const handleReveal = () => {
        if (!revealedIndices.has(currentIndex)) {
            setRevealedIndices(new Set([...revealedIndices, currentIndex]));
        }
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

    const handleOpenAnother = () => {
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
                        key="unopened"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className={styles.centerContent}
                    >
                        <Pack set={set} onOpen={handleOpenPack} />
                    </motion.div>
                )}

                {stage === "opening" && (
                    <motion.div
                        key="opening"
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className={styles.centerContent}
                    >
                        <div className={styles.burst}>
                            {particles.map((particle) => (
                                <motion.div
                                    key={particle.id}
                                    className={styles.particle}
                                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                    animate={{
                                        x: particle.x * 5,
                                        y: particle.y * 5,
                                        opacity: 0,
                                        scale: 0
                                    }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {stage === "opened" && pack.length > 0 && (
                    <motion.div
                        key="opened"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className={styles.cardsContainer}
                    >
                        <div className={styles.carousel}>
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className={styles.navButton}
                            >
                                ‹
                            </button>

                            <motion.div
                                className={styles.cardWrapper}
                                key={currentIndex}
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                            >
                                <Card
                                    card={pack[currentIndex]}
                                    isRevealed={revealedIndices.has(currentIndex)}
                                    onReveal={handleReveal}
                                />
                            </motion.div>

                            <button
                                onClick={handleNext}
                                disabled={currentIndex === pack.length - 1}
                                className={styles.navButton}
                            >
                                ›
                            </button>
                        </div>

                        <div className={styles.controls}>
                            <p className={styles.counter}>
                                Card {currentIndex + 1} of {pack.length}
                            </p>
                            <button onClick={handleOpenAnother} className={styles.openAnother}>
                                Open Another Pack
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
