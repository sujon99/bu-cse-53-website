'use client';

import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    rotationFactor?: number;
}

export function TiltCard({ children, className, rotationFactor = 20 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const rafRef = useRef<number | null>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current || !glareRef.current) return;

        const div = ref.current;
        const glare = glareRef.current;

        // Use requestAnimationFrame to smooth out updates and prevent jitter
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(() => {
            const rect = div.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            // Calculate mouse position relative to center of card
            const mouseX = e.clientX - rect.left - width / 2;
            const mouseY = e.clientY - rect.top - height / 2;

            // Calculate rotation
            const rY = (mouseX / (width / 2)) * rotationFactor;
            const rX = -(mouseY / (height / 2)) * rotationFactor;

            div.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.05, 1.05, 1.05)`;

            // Update glare
            // Calculate an angle for the gradient based on mouse position
            const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI) - 90;
            glare.style.background = `linear-gradient(${angle}deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)`;
            glare.style.opacity = '0.3';
        });
    }, [rotationFactor]);

    const handleMouseEnter = () => setIsHovering(true);

    const handleMouseLeave = () => {
        setIsHovering(false);
        if (ref.current) {
            ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
        if (glareRef.current) {
            glareRef.current.style.opacity = '0';
        }
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn("relative transition-transform duration-200 ease-out will-change-transform", className)}
            style={{
                transformStyle: 'preserve-3d',
            }}
        >
            {children}

            {/* Holographic/Glare Overlay */}
            <div
                ref={glareRef}
                className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-50 rounded-xl bg-gradient-to-tr from-transparent via-white/10 to-transparent"
            />
        </div>
    );
}
