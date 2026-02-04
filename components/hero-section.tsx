'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, Heart, Camera, Users } from 'lucide-react';
import Image from 'next/image';

interface HeroSectionProps {
    onExploreClick?: () => void;
    onContactsClick?: () => void;
}

interface Photo {
    id: string;
    name: string;
    webContentLink: string;
    thumbnailLink?: string;
}

interface Particle {
    id: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
}

export function HeroSection({ onExploreClick, onContactsClick }: HeroSectionProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
    const [particles, setParticles] = useState<Particle[]>([]);

    // Generate particles on client-side only to avoid hydration mismatch
    useEffect(() => {
        const generatedParticles: Particle[] = [];
        for (let i = 0; i < 20; i++) {
            generatedParticles.push({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                delay: Math.random() * 10,
                duration: 15 + Math.random() * 10,
            });
        }
        setParticles(generatedParticles);
    }, []);

    useEffect(() => {
        setIsLoaded(true);

        // Fetch random photos for background slideshow
        async function fetchPhotos() {
            try {
                setIsLoadingPhotos(true);
                const response = await fetch('/api/photos');
                const data = await response.json();

                if (data.files && data.files.length > 0) {
                    // Filter only images
                    const allPhotos = data.files.filter(
                        (p: { mimeType?: string }) => p.mimeType?.startsWith('image/')
                    );

                    // Shuffle array and pick 8 random photos
                    const shuffled = [...allPhotos].sort(() => Math.random() - 0.5);
                    const randomPhotos = shuffled.slice(0, 8);

                    setPhotos(randomPhotos);
                }
            } catch (error) {
                console.error('Failed to fetch photos:', error);
            } finally {
                setIsLoadingPhotos(false);
            }
        }
        fetchPhotos();
    }, []);

    // Auto-rotate background photos
    useEffect(() => {
        if (photos.length <= 1) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
                setIsTransitioning(false);
            }, 1000);
        }, 6000);

        return () => clearInterval(interval);
    }, [photos.length]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-50">
            {/* Background photos with Ken Burns effect */}
            <div className="absolute inset-0">
                {photos.length > 0 ? (
                    photos.map((photo, index) => (
                        <div
                            key={photo.id}
                            className={`absolute inset-0 transition-all duration-[2000ms] ${index === currentPhotoIndex
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-110'
                                }`}
                        >
                            <Image
                                src={photo.thumbnailLink || photo.webContentLink}
                                alt="Memory"
                                fill
                                className="object-cover animate-ken-burns"
                                sizes="100vw"
                                priority={index === 0}
                            />
                        </div>
                    ))
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-orange-800/20 to-rose-900/30" />
                )}
            </div>

            {/* Warm overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

            {/* Nostalgic film grain effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Warm bokeh lights */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-amber-500/10 blur-[100px] animate-float-slow" />
                <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-orange-400/10 blur-[80px] animate-float-slow-reverse" />
                <div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-rose-400/10 blur-[90px] animate-float-slow" />
            </div>

            {/* Floating memory particles - generated client-side to avoid hydration mismatch */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute w-1 h-1 rounded-full bg-amber-200/40 animate-float-particle-slow"
                        style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Badge */}
                <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-4 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <Camera className="w-4 h-4 text-amber-300" />
                    <span className="text-sm text-white/80 tracking-wide">CSE 53 • Class Memories</span>
                    <Heart className="w-4 h-4 text-rose-400" />
                </div>

                {/* Vintage Year Badge */}
                <div className={`inline-flex items-center gap-3 mb-8 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <span className="text-amber-400/60 text-lg">✧</span>
                    <div className="px-4 py-1.5 border border-amber-400/30 rounded-full bg-amber-900/20 backdrop-blur-sm">
                        <span className="text-xs text-amber-200/80 font-serif tracking-[0.3em] uppercase">Est. 2019</span>
                    </div>
                    <span className="text-amber-400/60 text-lg">✧</span>
                </div>

                {/* Main title - elegant, warm typography */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-light mb-6 leading-tight tracking-tight text-white">
                    <span className="block mb-2">Bangladesh University</span>
                    <span className="block text-3xl sm:text-4xl md:text-5xl text-amber-200/90 font-medium">
                        Cherished Memories
                    </span>
                </h1>

                {/* Decorative line */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className="w-16 h-px bg-gradient-to-r from-transparent to-amber-400/50" />
                    <span className="text-amber-300 text-2xl">✦</span>
                    <span className="w-16 h-px bg-gradient-to-l from-transparent to-amber-400/50" />
                </div>

                {/* Tagline */}
                <p className="text-lg sm:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                    A collection of moments we shared, friendships we built, and memories we'll treasure forever.
                </p>

                {/* CTA Buttons */}
                <div className={`flex flex-wrap gap-5 justify-center transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                    <button
                        onClick={onExploreClick}
                        className="group relative px-8 py-4 bg-amber-600/90 hover:bg-amber-500 text-white font-medium rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <Camera className="w-5 h-5" />
                            Browse Memories
                        </span>
                    </button>

                    <button
                        onClick={onContactsClick}
                        className="group px-8 py-4 text-white/90 hover:text-white font-medium rounded-full border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                    >
                        <span className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Meet Friends
                        </span>
                    </button>
                </div>

                {/* Stats with warm styling */}
                {/* <div className={`grid grid-cols-3 gap-8 sm:gap-16 mt-20 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                    {[
                        { value: '50+', label: 'Memories', icon: '📸' },
                        { value: '30+', label: 'Friends', icon: '👥' },
                        { value: '4+', label: 'Years', icon: '🎓' },
                    ].map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="text-3xl sm:text-4xl font-light text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-white/50 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                {/* Photo indicator dots - inside main content */}
                {photos.length > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                        {photos.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setIsTransitioning(true);
                                    setTimeout(() => {
                                        setCurrentPhotoIndex(index);
                                        setIsTransitioning(false);
                                    }, 500);
                                }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentPhotoIndex
                                    ? 'w-6 bg-amber-400'
                                    : 'bg-white/30 hover:bg-white/50'
                                    }`}
                                aria-label={`View photo ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom gradient fade - very smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-10">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </div>
        </section>
    );
}
