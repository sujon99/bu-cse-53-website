'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Heart, Quote } from 'lucide-react';

const friendshipQuotes = [
    {
        text: "Friends are the family we choose for ourselves.",
        author: "Edna Buchanan"
    },
    {
        text: "The best things in life aren't things. They're friends.",
        author: "Unknown"
    },
    {
        text: "Together we made memories that will last a lifetime.",
        author: "CSE-53 Batch"
    },
    {
        text: "Good friends are like stars. You don't always see them, but you know they're always there.",
        author: "Unknown"
    },
    {
        text: "A true friend is one soul in two bodies.",
        author: "Aristotle"
    },
    {
        text: "We didn't realize we were making memories, we just knew we were having fun.",
        author: "Winnie the Pooh"
    },
    {
        text: "Friends make the good times better and the hard times easier.",
        author: "Unknown"
    },
    {
        text: "Years from now, we'll look back and remember these golden days.",
        author: "CSE-53 Batch"
    }
];

export function FriendQuotes() {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Auto-cycle quotes
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentQuoteIndex((prev) => (prev + 1) % friendshipQuotes.length);
                setIsTransitioning(false);
            }, 500);
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    // Intersection Observer
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

    const currentQuote = friendshipQuotes[currentQuoteIndex];

    return (
        <section
            ref={sectionRef}
            className={`relative py-20 px-4 overflow-hidden transition-all duration-1000 paper-texture ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
            {/* Warm gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-amber-950/5 to-background" />

            {/* Vintage paper background tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/25 via-amber-50/20 to-amber-50/25 dark:from-amber-950/15 dark:via-amber-950/10 dark:to-amber-950/15" />

            {/* Paper grain texture overlay */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Decorative elements */}
            <div className="absolute top-1/4 left-10 text-6xl opacity-10 rotate-[-15deg]">❝</div>
            <div className="absolute bottom-1/4 right-10 text-6xl opacity-10 rotate-[15deg]">❞</div>

            <div className="relative max-w-3xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/10 border border-amber-200/20 mb-6">
                        <Heart className="w-4 h-4 text-amber-500" />
                        <span className="text-sm text-amber-600 dark:text-amber-400 tracking-wide">Words of Friendship</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif font-light text-foreground">
                        Quotes That <span className="text-amber-600 dark:text-amber-400">Inspire</span> Us
                    </h2>
                </div>

                {/* Quote card with warm, paper-like styling */}
                <div className="relative">
                    {/* Paper shadow layers */}
                    <div className="absolute inset-0 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg transform rotate-1 translate-x-1 translate-y-1" />
                    <div className="absolute inset-0 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg transform -rotate-1 -translate-x-1 translate-y-2" />

                    {/* Main quote card */}
                    <div className="relative bg-white dark:bg-neutral-900 rounded-lg p-8 sm:p-12 shadow-xl border border-amber-100 dark:border-neutral-800">
                        {/* Quote icon */}
                        <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-400 flex items-center justify-center shadow-lg">
                            <Quote className="w-4 h-4 text-white" />
                        </div>

                        {/* Quote content */}
                        <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                            <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif font-light text-foreground leading-relaxed mb-6 italic">
                                "{currentQuote.text}"
                            </blockquote>

                            <cite className="flex items-center gap-3 text-muted-foreground not-italic">
                                <span className="w-8 h-px bg-gradient-to-r from-amber-400 to-amber-400" />
                                <span className="text-sm">{currentQuote.author}</span>
                            </cite>
                        </div>

                        {/* Decorative heart */}
                        <div className="absolute -bottom-3 right-8">
                            <Heart className="w-6 h-6 text-amber-400 fill-amber-400 opacity-60" />
                        </div>
                    </div>
                </div>

                {/* Quote indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {friendshipQuotes.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setIsTransitioning(true);
                                setTimeout(() => {
                                    setCurrentQuoteIndex(index);
                                    setIsTransitioning(false);
                                }, 300);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentQuoteIndex
                                ? 'w-6 bg-gradient-to-r from-amber-400 to-amber-400'
                                : 'w-1.5 bg-neutral-300 dark:bg-neutral-600 hover:bg-amber-300'
                                }`}
                            aria-label={`View quote ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
