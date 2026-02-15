import React from 'react';
import styles from './Controls.module.css';

const Controls: React.FC = () => {
    return (
        <div className={styles.controls}>
            <button className={`${styles.button} ${styles.fold}`}>FOLD</button>
            <button className={`${styles.button} ${styles.check}`}>CHECK / CALL</button>
            <div className={styles.raiseContainer}>
                <button className={`${styles.button} ${styles.raise}`}>RAISE</button>
                <input type="range" className={styles.slider} min="1" max="10" />
            </div>
        </div>
    );
};

export default Controls;
