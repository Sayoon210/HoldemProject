import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    rank?: string;
    suit?: string;
    isFaceDown?: boolean;
}

const Card: React.FC<CardProps> = ({ rank, suit, isFaceDown = false }) => {
    if (isFaceDown) {
        return <div className={`${styles.card} ${styles.back}`}></div>;
    }

    return (
        <div className={styles.card}>
            <span className={styles.rank}>{rank}</span>
            <span className={styles.suit}>{suit}</span>
        </div>
    );
};

export default Card;
