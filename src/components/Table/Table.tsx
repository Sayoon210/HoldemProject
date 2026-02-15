'use client';

import React from 'react';
import styles from './Table.module.css';
import PlayerSlot from '../PlayerSlot/PlayerSlot';
import Card from '../Card/Card';

const Table: React.FC = () => {
    const handleFold = (playerName: string) => {
        console.log(`${playerName} folded!`);
    };

    const players = [
        { id: 0, name: 'SAYOON', tokens: 24, bet: 2, isDealer: true, onFold: () => handleFold('SAYOON') },
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
                {/* Community Cards Area */}
                <div className={styles.communityArea}>
                    <Card isFaceDown />
                    <Card isFaceDown />
                    <Card isFaceDown />
                    <Card isFaceDown />
                    <Card isFaceDown />
                </div>

            </div>

            {/* Players positioned around the arc */}
            <div className={styles.playerContainer}>
                {players.map((player, index) => (
                    <div key={player.id} className={`${styles.playerSlotWrapper} ${styles[`pos${index}`]}`}>
                        <PlayerSlot
                            name={player.name}
                            tokens={player.tokens}
                            bet={player.bet}
                            isDealer={player.isDealer}
                            status={player.status}
                            cards={player.id === 0 ? [{ rank: 'A', suit: 'H' }, { rank: 'A', suit: 'D' }] : undefined}
                            draggableCards={player.id === 0}
                            onFold={(player as any).onFold}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Table;
