'use client';

import React, { useEffect, useState } from 'react';

interface FloatingItem {
    id: number;
    type: 'leaf' | 'camera' | 'sparkle';
    left: number;
    delay: number;
    duration: number;
    size: number;
    rotation: number;
}

// Leaf emoji variants for variety
const LEAF_EMOJIS = ['🍂', '🍁', '🍃', '🌿'];
const CAMERA_EMOJIS = ['📷', '📸', '🎞️'];

export function FloatingDecorations() {
    const [items, setItems] = useState<FloatingItem[]>([]);

    // Generate items on client-side only to avoid hydration mismatch
    useEffect(() => {
        const generatedItems: FloatingItem[] = [];

        // Generate falling leaves (4 items - subtle)
        for (let i = 0; i < 4; i++) {
            generatedItems.push({
                id: i,
                type: 'leaf',
                left: Math.random() * 100,
                delay: Math.random() * 25, // More spread out
                duration: 20 + Math.random() * 15,
                size: 16 + Math.random() * 12,
                rotation: Math.random() * 360,
            });
        }

        // Generate falling cameras (3 items - subtle)
        for (let i = 0; i < 3; i++) {
            generatedItems.push({
                id: 100 + i,
                type: 'camera',
                left: 10 + Math.random() * 80,
                delay: Math.random() * 20, // More spread out
                duration: 25 + Math.random() * 15,
                size: 22 + Math.random() * 10,
                rotation: -15 + Math.random() * 30,
            });
        }

        // Generate dust/sparkle particles (8 items - subtle)
        for (let i = 0; i < 8; i++) {
            generatedItems.push({
                id: 200 + i,
                type: 'sparkle',
                left: Math.random() * 100,
                delay: Math.random() * 15,
                duration: 12 + Math.random() * 12,
                size: 3 + Math.random() * 5,
                rotation: 0,
            });
        }

        setItems(generatedItems);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[50]" aria-hidden="true">
            {items.map((item) => {
                if (item.type === 'leaf') {
                    const leafEmoji = LEAF_EMOJIS[item.id % LEAF_EMOJIS.length];
                    return (
                        <div
                            key={item.id}
                            className="absolute animate-fall-leaves opacity-60"
                            style={{
                                left: `${item.left}%`,
                                top: '-5%',
                                fontSize: `${item.size}px`,
                                animationDelay: `${item.delay}s`,
                                animationDuration: `${item.duration}s`,
                                transform: `rotate(${item.rotation}deg)`,
                            }}
                        >
                            {leafEmoji}
                        </div>
                    );
                }

                if (item.type === 'camera') {
                    const cameraEmoji = CAMERA_EMOJIS[(item.id - 100) % CAMERA_EMOJIS.length];
                    return (
                        <div
                            key={item.id}
                            className="absolute animate-fall-camera opacity-60"
                            style={{
                                left: `${item.left}%`,
                                top: '-5%',
                                fontSize: `${item.size}px`,
                                animationDelay: `${item.delay}s`,
                                animationDuration: `${item.duration}s`,
                            }}
                        >
                            {cameraEmoji}
                        </div>
                    );
                }

                // Sparkle/dust particle
                return (
                    <div
                        key={item.id}
                        className="absolute rounded-full bg-amber-300/50 animate-sparkle-float"
                        style={{
                            left: `${item.left}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${item.size}px`,
                            height: `${item.size}px`,
                            animationDelay: `${item.delay}s`,
                            animationDuration: `${item.duration}s`,
                            boxShadow: '0 0 6px 2px rgba(251, 191, 36, 0.3)',
                        }}
                    />
                );
            })}
        </div>
    );
}
