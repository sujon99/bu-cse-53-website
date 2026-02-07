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

    // Mix of university/memory themed emojis - 8 distinct icons for 8 items
    const ICONS = ['🎓', '📜', '📚', '📷', '🍂', '✨', '🍁'];

    // Generate items on client-side only to avoid hydration mismatch
    useEffect(() => {
        const generatedItems: FloatingItem[] = [];

        // Generate diverse floating icons (8 items total for balanced look)
        for (let i = 0; i < 8; i++) {
            generatedItems.push({
                id: i,
                type: 'leaf', // Reusing 'leaf' as generic floating type
                left: Math.random() * 100,
                delay: Math.random() * 20,
                duration: 15 + Math.random() * 15, // Slow, peaceful fall
                size: 20 + Math.random() * 10,
                rotation: -20 + Math.random() * 40,
            });
        }

        // Keep a few subtle sparkles
        for (let i = 0; i < 5; i++) {
            generatedItems.push({
                id: 200 + i,
                type: 'sparkle',
                left: Math.random() * 100,
                delay: Math.random() * 15,
                duration: 10 + Math.random() * 10,
                size: 3 + Math.random() * 4,
                rotation: 0,
            });
        }

        setItems(generatedItems);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[50]" aria-hidden="true">
            {items.map((item) => {
                if (item.type === 'sparkle') {
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
                }

                // Main floating icons
                const iconEmoji = ICONS[item.id % ICONS.length];
                return (
                    <div
                        key={item.id}
                        className="absolute animate-fall-leaves opacity-60 grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                        style={{
                            left: `${item.left}%`,
                            top: '-10%',
                            fontSize: `${item.size}px`,
                            animationDelay: `${item.delay}s`,
                            animationDuration: `${item.duration}s`,
                            transform: `rotate(${item.rotation}deg)`,
                            textShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        {iconEmoji}
                    </div>
                );
            })}
        </div>
    );
}
