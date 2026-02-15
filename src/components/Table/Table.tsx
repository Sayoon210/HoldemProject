import React from 'react';
import styles from './Table.module.css';
import PlayerSlot from '../PlayerSlot/PlayerSlot';
import Card from '../Card/Card';

const Table: React.FC = () => {
    const players = [
        { id: 0, name: 'SAYOON', tokens: 25, bet: 2, isDealer: true },
        { id: 1, name: 'Player 2', tokens: 23, bet: 1 },
        { id: 2, name: 'Player 3', tokens: 25, status: 'folded' as const },
        { id: 3, name: 'Player 4', tokens: 10, bet: 5 },
        { id: 4, name: 'Player 5', tokens: 25 },
        { id: 5, name: 'Player 6', tokens: 5, status: 'all-in' as const, bet: 5 },
    ];

    return (
        <div className={styles.container}>
            {/* The actual semi-circle table */}
            <div className={styles.tableSurface}>
                {/* Community Cards Area (Straight Edge) */}
                <div className={styles.communityArea}>
                    <Card rank="A" suit="♠" />
                    <Card rank="K" suit="♠" />
                    <Card rank="Q" suit="♠" />
                    <div className={styles.cardPlaceholder}></div>
                    <div className={styles.cardPlaceholder}></div>
                </div>

                {/* Pot Info */}
                <div className={styles.potInfo}>
                    <span>POT: 13</span>
                </div>
            </div>

            {/* Players positioned around the arc */}
            <div className={styles.playerContainer}>
                {players.map((player, index) => (
                    <PlayerSlot
                        key={player.id}
                        name={player.name}
                        tokens={player.tokens}
                        bet={player.bet}
                        isDealer={player.isDealer}
                        status={player.status}
                        className={styles[`pos${index}`]}
                    />
                ))}
            </div>
        </div>
    );
};

export default Table;
