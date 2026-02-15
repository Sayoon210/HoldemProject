'use client';

import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from './Chip.module.css';

interface ChipProps {
    value: number;
    color?: 'red' | 'blue' | 'green';
    onThrowComplete?: () => void;
    className?: string;
}

const Chip: React.FC<ChipProps> = ({ value, color = 'red', onThrowComplete, className }) => {
    const controls = useAnimation();
    const [isThrown, setIsThrown] = React.useState(false);

    const handleDragEnd = async (event: any, info: any) => {
        // Detect throw: negative y velocity or significant offset
        if (info.velocity.y < -200 || info.offset.y < -60) {
            setIsThrown(true);

            // Calculate landing spot (bet area)
            // Since it's relative to the start, we move it up and perhaps randomly to the side
            const targetY = -180 + (Math.random() * 40 - 20);
            const targetX = Math.random() * 60 - 30;
            const rotation = Math.random() * 720 - 360;

            // Parabolic Arc Simulation using keyframes
            await controls.start({
                x: targetX,
                y: [0, targetY - 50, targetY], // Arc peak
                scale: [1, 1.4, 0.9], // Grow in air, shrink on landing
                rotate: rotation,
                transition: {
                    duration: 0.6,
                    ease: "easeOut",
                    times: [0, 0.5, 1]
                }
            });

            // Landing "Bounce" & "Thud"
            await controls.start({
                y: [targetY, targetY - 5, targetY],
                scale: [0.9, 0.95, 0.9],
                transition: { duration: 0.2, ease: "easeInOut" }
            });

            if (onThrowComplete) onThrowComplete();
        }
    };

    return (
        <motion.div
            className={`${styles.chip} ${styles[color]} ${className}`}
            drag={!isThrown}
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            animate={controls}
            whileTap={{ scale: 1.1 }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.4)' }}
            style={{ pointerEvents: isThrown ? 'none' : 'auto' }}
        >
            <div className={styles.innerCircle}>
                {value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            </div>
        </motion.div>
    );
};

export default Chip;
