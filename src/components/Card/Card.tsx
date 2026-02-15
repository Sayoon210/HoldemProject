'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Card.module.css';

interface CardProps {
    rank?: string; // A, 2, 3, ..., J, Q, K
    suit?: string; // C, H, S, D
    isFaceDown?: boolean;
    onFold?: () => void;
    draggable?: boolean;
    forcePeek?: boolean;
}

const rankMap: Record<string, number> = {
    'A': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '10': 9, 'J': 10, 'Q': 11, 'K': 12
};

const suitMap: Record<string, number> = {
    'C': 0, 'H': 1, 'S': 2, 'D': 3
};

const Card: React.FC<CardProps> = ({
    rank = 'A',
    suit = 'S',
    isFaceDown = false,
    draggable = false,
    forcePeek = false
}) => {
    // Calculate sprite position (adjusted for 80px width)
    const cardWidth = 80;
    const cardHeight = 111;
    const col = rankMap[rank] ?? 0;
    const row = suitMap[suit] ?? 2;
    const backgroundPosition = `-${col * cardWidth}px -${row * cardHeight}px`;

    // Reveal only if forcePeek is true (handled by parent Hand for hero)
    const showFront = forcePeek && draggable;
    const displayFaceDown = isFaceDown || (!showFront && !(!draggable && !isFaceDown));

    return (
        <motion.div
            className={`${styles.card} ${displayFaceDown ? styles.isBack : ''}`}
            style={{
                backgroundImage: displayFaceDown
                    ? 'url("/assets/cards/card_backs.png")'
                    : 'url("/assets/cards/playing_cards.png")',
                backgroundPosition: displayFaceDown ? '0 0' : backgroundPosition,
                touchAction: 'none',
                zIndex: draggable ? 100 : 1,
                width: '80px',
                height: '111px',
                backgroundSize: displayFaceDown ? 'cover' : '1040px 444px',
                backgroundRepeat: 'no-repeat',
                borderRadius: '6px',
                boxShadow: showFront
                    ? '0 15px 30px rgba(0,0,0,0.5)'
                    : '0 4px 10px rgba(0,0,0,0.4)',
                position: 'relative',
                userSelect: 'none',
                backgroundColor: 'white',
                flexShrink: 0,
            }}
            animate={{
                rotateX: showFront ? 20 : 0,
                scale: showFront ? 1.02 : 1,
                opacity: 1,
                transition: { type: 'spring', stiffness: 300, damping: 20 }
            }}
        />
    );
};

export default Card;
