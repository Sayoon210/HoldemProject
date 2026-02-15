import React from 'react';
import styles from './PlayerSlot.module.css';
import Card from '../Card/Card';

interface PlayerSlotProps {
    name: string;
    tokens: number;
    bet?: number;
    isDealer?: boolean; // Joker marker
    status?: 'active' | 'folded' | 'all-in';
    cards?: { rank: string; suit: string }[];
    className?: string;
}

const PlayerSlot: React.FC<PlayerSlotProps> = ({
    name,
    tokens,
    bet = 0,
    isDealer = false,
    status = 'active',
    cards,
    className
}) => {
    return (
        <div className={`${styles.slot} ${className} ${styles[status]}`}>
            {/* Cards slightly overlapping above or behind the avatar */}
            <div className={styles.hand}>
                {cards ? (
                    cards.map((card, i) => (
                        <div key={i} className={styles.cardWrapper} style={{ transform: `rotate(${(i - 0.5) * 10}deg)` }}>
                            <Card rank={card.rank} suit={card.suit} />
                        </div>
                    ))
                ) : (
                    <>
                        <div className={styles.cardWrapper} style={{ transform: 'rotate(-5deg)' }}>
                            <Card isFaceDown />
                        </div>
                        <div className={styles.cardWrapper} style={{ transform: 'rotate(5deg)' }}>
                            <Card isFaceDown />
                        </div>
                    </>
                )}
            </div>

            <div className={styles.playerInfo}>
                <div className={styles.avatar}>
                    {isDealer && <div className={styles.jokerMarker}>🃏</div>}
                </div>
                <div className={styles.details}>
                    <span className={styles.name}>{name}</span>
                    <span className={styles.tokenLabel}>{tokens} 🪙</span>
                </div>
            </div>

            {/* Betting area in front of the player */}
            {bet > 0 && (
                <div className={styles.betArea}>
                    <div className={styles.chipStack}>
                        <span className={styles.betAmount}>{bet}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerSlot;
