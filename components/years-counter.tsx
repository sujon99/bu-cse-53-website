'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Calendar, Heart, Hourglass } from 'lucide-react';

// Custom hook for counting up animation
function useCounter(end: number, duration: number = 2000, start: boolean = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;

        // Start from 0
        setCount(0);

        let startTime: number | null = null;
        let animationFrame: number;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out quart function for smooth landing
            const easeProgress = 1 - Math.pow(1 - progress, 4);

            setCount(Math.floor(easeProgress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            }
        };

        animationFrame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, start]);

    return count;
}

interface ParticleStyle {
    top: string;
    left: string;
    animationDelay: string;
    animationDuration: string;
    transform: string;
}

export function YearsCounter() {
    const [isVisible, setIsVisible] = useState(false);
    const [stats, setStats] = useState({ years: 0, months: 0, days: 0 });
    const [particles, setParticles] = useState<ParticleStyle[]>([]);
    const sectionRef = useRef<HTMLElement>(null);

    const START_DATE = new Date('2019-01-01');

    // Generate particles on client-side only to avoid hydration mismatch
    useEffect(() => {
        const newParticles = [...Array(5)].map((_, i) => ({
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + i}s`, // Slower duration
            transform: `scale(${0.5 + Math.random()})`
        }));
        setParticles(newParticles);
    }, []);

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            const diff = now.getTime() - START_DATE.getTime();

            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
            const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
            const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));

            setStats({ years, months, days });
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000 * 60 * 60 * 24);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const totalDays = Math.floor((Date.now() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));

    // Animated counters
    const animatedYears = useCounter(stats.years, 2000, isVisible);
    const animatedMonths = useCounter(stats.years * 12 + stats.months, 2500, isVisible);
    const animatedDays = useCounter(totalDays, 3000, isVisible);

    return (
        <section
            ref={sectionRef}
            className="relative py-24 px-4 overflow-hidden"
        >
            {/* Background Texture */}
            <div className="absolute inset-0 bg-stone-50/50 dark:bg-stone-900/50" />
            <div className={`absolute top-10 left-10 text-9xl text-amber-500/5 rotate-12 transition-all duration-[2000ms] ease-out font-serif ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                2019
            </div>
            <div className={`absolute bottom-10 right-10 text-9xl text-amber-500/5 -rotate-12 transition-all duration-[2000ms] ease-out delay-1000 font-serif ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {new Date().getFullYear()}
            </div>

            <div className={`relative max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Decorative Header */}
                <div className="flex items-center justify-center gap-6 mb-12">
                    <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60" />
                    <div className="relative">
                        <div className="px-10 py-2 border border-amber-200/50 rounded-full bg-amber-50/30 backdrop-blur-sm shadow-sm flex flex-col items-center">
                            <span className="text-[10px] uppercase tracking-widest text-amber-600/70 font-medium mb-0.5">Since</span>
                            <span className="text-xl font-serif text-amber-800 dark:text-amber-200 tracking-[0.2em] font-light leading-none">2019</span>
                        </div>
                    </div>
                    <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60" />
                </div>

                {/* Main Counter */}
                <div className="relative mb-20 inline-block group cursor-default">
                    <h2 className="text-8xl sm:text-9xl md:text-[10rem] font-serif text-foreground leading-[0.8] tracking-tight drop-shadow-sm transition-transform duration-700 group-hover:scale-105 relative">
                        <span className="bg-gradient-to-br from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent">
                            {animatedYears}
                        </span>
                        <span className="text-5xl text-amber-500 absolute top-2 right-12 sm:right-20 md:right-28">+</span>
                    </h2>
                    <div className="text-xl sm:text-3xl mt-6 font-light tracking-[0.3em] text-muted-foreground uppercase border-b border-amber-200/30 pb-2 inline-block">
                        Years Together
                    </div>

                    {/* Floating particles around number */}
                    <div className="absolute -inset-20 pointer-events-none">
                        {particles.map((style, i) => (
                            <div
                                key={i}
                                className={`absolute w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-pulse`}
                                style={style as React.CSSProperties}
                            />
                        ))}
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                        {
                            value: animatedMonths,
                            label: 'Total Months',
                            icon: Calendar,
                            delay: 200,
                            color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30',
                            border: 'border-rose-100 hover:border-rose-200'
                        },
                        {
                            value: animatedDays.toLocaleString(),
                            label: 'Days Passed',
                            icon: Hourglass,
                            delay: 400,
                            color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
                            border: 'border-amber-100 hover:border-amber-200'
                        },
                        {
                            value: '∞',
                            label: 'Memories Made',
                            icon: Heart,
                            delay: 600,
                            color: 'text-red-500 bg-red-50 dark:bg-red-950/30',
                            border: 'border-red-100 hover:border-red-200'
                        },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className={`group p-8 rounded-2xl bg-white/60 dark:bg-stone-800/60 border ${item.border} dark:border-stone-700/50 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                                }`}
                            style={{ transitionDelay: `${item.delay}ms` }}
                        >
                            <div className={`mb-5 inline-flex p-4 rounded-full group-hover:scale-110 transition-transform duration-500 ${item.color}`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div className="text-4xl font-light text-foreground mb-2 font-serif tracking-tight">
                                {item.value}
                            </div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 flex justify-center opacity-80 hover:opacity-100 transition-opacity">
                    <div className="relative px-10 py-6">
                        <span className="absolute top-0 left-0 text-6xl text-amber-200/50 font-serif leading-none">“</span>
                        <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 italic font-medium font-serif max-w-lg leading-relaxed">
                            Time flies when you&apos;re making memories with the best people. Here&apos;s to many more years.
                        </p>
                        <span className="absolute bottom-0 right-0 text-6xl text-amber-200/50 font-serif leading-none">”</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
