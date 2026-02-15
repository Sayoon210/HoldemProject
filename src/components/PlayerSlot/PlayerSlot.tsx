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
    const [isDragging, setIsDragging] = React.useState(false);
    const [isFolded, setIsFolded] = React.useState(false);
    const [dragY, setDragY] = React.useState(0);

    const handleDrag = (event: any, info: any) => {
        setDragY(info.offset.y);
    };

    const handleDragEnd = (event: any, info: any) => {
        setIsDragging(false);
        if (!draggableCards || isFolded) return;

        // If dragged upward past 40px or flicked with enough velocity
        const shouldFold = info.offset.y < -40 || info.velocity.y < -150;

        if (shouldFold) {
            setIsFolded(true);
            if (onFold) onFold();
        }
        setDragY(0); // Reset drag state
    };

    const isBundled = isFolded || isHandHovered || isDragging;

    return (
        <div className={`${styles.slot} ${className} ${styles[status]} ${isFolded ? styles.folded : ''}`}>
            {/* Hand Set - Wrapped for stable event detection */}
            <div
                className={styles.handWrapper}
                onMouseEnter={() => !isFolded && setIsHandHovered(true)}
                onMouseLeave={() => !isFolded && setIsHandHovered(false)}
            >
                <motion.div
                    className={styles.hand}
                    drag={draggableCards && !isFolded ? "y" : false}
                    dragConstraints={{ top: -80, bottom: 5, left: 0, right: 0 }}
                    dragElastic={0.1} // Stricter limit
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 35 }}
                    onDragStart={() => setIsDragging(true)}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                    animate={isFolded ? {
                        y: -160,
                        scale: 0.7,
                        filter: 'brightness(0.15) grayscale(1)',
                        opacity: 0.4,
                        rotateX: 0,
                    } : {
                        rotateX: 0, // Removed hover-lift to stop 'shaking'
                        y: 0,       // Removed hover-lift to stop 'shaking'
                        scale: 1,
                        filter: 'brightness(1) grayscale(0)',
                        opacity: 1
                    }}
                    whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
                    transition={isBundled && !isFolded ? {
                        type: 'spring',
                        stiffness: 400,
                        damping: 30
                    } : (isFolded ? {
                        y: { type: 'tween', ease: [0.05, 0.7, 0.1, 1.0], duration: 0.5 },
                        scale: { type: 'tween', ease: 'circIn', duration: 0.5 },
                        filter: { type: 'tween', ease: 'circIn', duration: 0.5 },
                        opacity: { type: 'tween', ease: 'circIn', duration: 0.5 }
                    } : {
                        duration: 0
                    })}
                    style={{
                        cursor: draggableCards && !isFolded ? 'grab' : 'default',
                        pointerEvents: !isFolded ? 'auto' : 'none', // Critical for interaction
                        touchAction: 'none'
                    }}
                >
                    {/* Fold Indicator Tooltip */}
                    {!isFolded && dragY < -40 && (
                        <div className={styles.foldTooltip}>FOLD?</div>
                    )}

                    {cards ? (
                        cards.map((card, i) => (
                            <div
                                key={i}
                                className={`${styles.cardContainer} ${(!isBundled && draggableCards) ? styles.upright : ''}`}
                                style={{
                                    transform: isBundled
                                        ? `rotate(${(i - 0.5) * 12}deg) translateY(${Math.abs(i - 0.5) * 5}px)`
                                        : 'none',
                                    zIndex: i
                                }}
                            >
                                <Card
                                    rank={card.rank}
                                    suit={card.suit}
                                    draggable={false}
                                    forcePeek={false} // No peeking on hover anymore, we flip to back
                                    isFaceDown={isBundled} // Flip to back when bundled/hovered
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
            </div>

            <div className={styles.playerInfo}>
                <span className={styles.tokenLabel}>
                    {isDealer && '🃏 '} {tokens.toLocaleString()}
                </span>
            </div>

        </div>
    );
};

export default PlayerSlot;
