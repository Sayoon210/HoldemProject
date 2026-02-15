'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './PlayerSlot.module.css';
import Card from '../Card/Card';

interface PlayerSlotProps {
    name: string;
    tokens: number;
    bet?: number;
    isDealer?: boolean; // Joker marker
    status?: 'active' | 'folded' | 'all-in';
    cards?: { rank: string; suit: string }[];
    draggableCards?: boolean;
    onFold?: () => void;
    className?: string;
}

const PlayerSlot: React.FC<PlayerSlotProps> = ({
    tokens,
    bet = 0,
    isDealer = false,
    status = 'active',
    cards,
    draggableCards = false,
    onFold,
    className
}) => {
    const [isHandHovered, setIsHandHovered] = React.useState(false);
    const [isFolded, setIsFolded] = React.useState(false);

    const handleDragEnd = (event: any, info: any) => {
        if (!draggableCards) return;
        // Detect "throw" - vertical velocity is negative (upwards)
        const isThrown = info.velocity.y < -300 || info.offset.y < -150;
        if (isThrown) {
            setIsFolded(true);
            if (onFold) setTimeout(onFold, 500);
        }
    };

    if (isFolded) return null;

    return (
        <div className={`${styles.slot} ${className} ${styles[status]}`}>
            {/* Hand Set - Bundled for interaction and physics */}
            <motion.div
                className={styles.hand}
                drag={draggableCards}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.8}
                onDragEnd={handleDragEnd}
                onMouseEnter={() => setIsHandHovered(true)}
                onMouseLeave={() => setIsHandHovered(false)}
                animate={isFolded ? { y: -1000, opacity: 0 } : {
                    rotateX: isHandHovered && draggableCards ? 12 : 0,
                    y: isHandHovered && draggableCards ? -12 : 0,
                    scale: isHandHovered && draggableCards ? 1.05 : 1,
                }}
                whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ cursor: draggableCards ? 'grab' : 'default' }}
            >
                {cards ? (
                    cards.map((card, i) => (
                        <div key={i} className={styles.cardContainer} style={{
                            transform: `rotate(${(i - 0.5) * 12}deg) translateY(${Math.abs(i - 0.5) * 5}px)`,
                            zIndex: i
                        }}>
                            <Card
                                rank={card.rank}
                                suit={card.suit}
                                draggable={false} // Hand-level drag handles this
                                forcePeek={isHandHovered && draggableCards}
                            />
                        </div>
                    ))
                ) : (
                    <>
                        <div className={styles.cardContainer} style={{ transform: 'rotate(-6deg)', zIndex: 0 }}>
                            <Card isFaceDown />
                        </div>
                        <div className={styles.cardContainer} style={{ transform: 'rotate(6deg)', zIndex: 1 }}>
                            <Card isFaceDown />
                        </div>
                    </>
                )}
            </motion.div>

            <div className={styles.playerInfo}>
                <span className={styles.tokenLabel}>
                    {isDealer && '🃏 '} {tokens.toLocaleString()}
                </span>
            </div>

        </div>
    );
};

export default PlayerSlot;
