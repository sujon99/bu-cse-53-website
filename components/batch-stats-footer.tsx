'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Users, Camera, Video, MapPin, Heart } from 'lucide-react';

interface Stats {
    totalFriends: number;
    totalPhotos: number;
    totalVideos: number;
    cities: string[];
    uniqueCitiesCount: number;
}

// Custom hook for counting up animation
function useCounter(end: number, duration: number = 2000, start: boolean = false) {
    const [count, setCount] = useState(0);
    const countRef = useRef<number | null>(null);

    useEffect(() => {
        if (!start) {
            return;
        }

        if (end === 0) {
            setCount(0);
            return;
        }

        const startTime = Date.now();

        function step() {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function - ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(end * easeOut);

            setCount(currentCount);

            if (progress < 1) {
                countRef.current = requestAnimationFrame(step);
            } else {
                setCount(end); // Ensure final value is exact
            }
        }

        countRef.current = requestAnimationFrame(step);

        return () => {
            if (countRef.current) {
                cancelAnimationFrame(countRef.current);
            }
        };
    }, [end, duration, start]);

    return count;
}

export function BatchStatsFooter() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [startCounting, setStartCounting] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Fetch stats
    useEffect(() => {
        async function fetchStats() {
            try {
                setIsLoading(true);
                const response = await fetch('/api/stats');
                const data = await response.json();

                if (data.success && data.stats) {
                    setStats(data.stats);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStats();
    }, []);

    // Intersection Observer for visibility and counting trigger
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    setTimeout(() => setStartCounting(true), 400);
                }
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Animated counters - trigger when stats loaded AND visible
    const shouldCount = startCounting && !isLoading && stats !== null;
    const friendsCount = useCounter(stats?.totalFriends || 0, 2000, shouldCount);
    const photosCount = useCounter(stats?.totalPhotos || 0, 2500, shouldCount);
    const videosCount = useCounter(stats?.totalVideos || 0, 2000, shouldCount);
    const citiesCount = useCounter(stats?.uniqueCitiesCount || 0, 1800, shouldCount);

    const statItems = [
        { icon: Users, value: friendsCount, label: 'Friends', suffix: '+' },
        { icon: Camera, value: photosCount, label: 'Photos', suffix: '+' },
        { icon: Video, value: videosCount, label: 'Videos', suffix: '' },
        { icon: MapPin, value: citiesCount, label: 'Cities', suffix: '' },
    ];

    return (
        <footer
            ref={sectionRef}
            className={`relative py-24 sm:py-20 px-4 overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            {/* Elegant gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-stone-50/40 to-amber-50/30 dark:via-stone-900/40 dark:to-amber-950/20" />

            {/* Soft radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.05)_0%,transparent_70%)]" />

            {/* Paper texture overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative max-w-5xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <span className="w-16 h-px bg-gradient-to-r from-transparent to-amber-400/40" />
                        <Heart className="w-4 h-4 text-amber-500/60 fill-amber-500/40" />
                        <span className="w-16 h-px bg-gradient-to-l from-transparent to-amber-400/40" />
                    </div>
                    <p className="text-[11px] text-stone-400 dark:text-stone-500 tracking-[0.3em] uppercase font-medium mb-3">
                        Our Journey Together
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-serif font-light text-stone-700 dark:text-stone-200 tracking-tight">
                        CSE <span className="text-amber-600 dark:text-amber-400 font-normal">53</span>
                    </h2>
                </div>

                {/* Stats Grid - Large elegant numbers */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-16">
                    {statItems.map((stat, index) => (
                        <div
                            key={stat.label}
                            className={`group text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: `${index * 120 + 200}ms` }}
                        >
                            {/* Large number display */}
                            <div className="mb-3">
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-5xl sm:text-6xl md:text-7xl font-extralight text-stone-700 dark:text-stone-100 tabular-nums tracking-tighter">
                                        {isLoading ? '—' : stat.value}
                                    </span>
                                    {stat.suffix && !isLoading && (
                                        <span className="text-2xl sm:text-3xl text-amber-500/70 font-light">{stat.suffix}</span>
                                    )}
                                </div>
                            </div>

                            {/* Icon + Label */}
                            <div className="flex items-center justify-center gap-2">
                                <stat.icon className="w-4 h-4 text-stone-400 dark:text-stone-500" />
                                <span className="text-sm text-stone-500 dark:text-stone-400 tracking-wide">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cities Section */}
                {stats && stats.cities.length > 0 && (
                    <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                        }`} style={{ transitionDelay: '700ms' }}>
                        <p className="text-[11px] text-stone-400 dark:text-stone-500 tracking-[0.2em] uppercase mb-5">
                            Spread Across
                        </p>
                        <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto">
                            {stats.cities.map((city) => (
                                <span
                                    key={city}
                                    className="px-4 py-2 bg-white/70 dark:bg-stone-800/50 rounded-full text-sm text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/40 backdrop-blur-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300/50 dark:hover:border-amber-600/40 hover:text-amber-800 dark:hover:text-amber-300 transition-all duration-300 cursor-default"
                                >
                                    {city}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Elegant divider with decorative element */}
                <div className="flex items-center justify-center gap-6 mb-10">
                    <span className="w-24 h-px bg-gradient-to-r from-transparent to-stone-300/50 dark:to-stone-600/50" />
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/60" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                    </div>
                    <span className="w-24 h-px bg-gradient-to-l from-transparent to-stone-300/50 dark:to-stone-600/50" />
                </div>

                {/* Footer text */}
                <div className="text-center space-y-3">
                    <p className="text-base text-stone-600 dark:text-stone-300 font-serif">
                        Computer Science & Technology of Bangladesh University
                    </p>
                    <p className="text-sm text-stone-400 dark:text-stone-500">
                        Made with <Heart className="inline w-3.5 h-3.5 text-rose-400 fill-rose-400 mx-1 -mt-0.5" /> by CSE 53 Batch
                    </p>
                    <p className="text-xs text-stone-300 dark:text-stone-600 pt-2">
                        © {new Date().getFullYear()} All memories treasured forever
                    </p>
                </div>
            </div>
        </footer>
    );
}
