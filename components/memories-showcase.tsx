'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface Photo {
    id: string;
    name: string;
    webContentLink: string;
    thumbnailLink?: string;
    width?: number;
    height?: number;
    rotation?: number;
}

interface MemoriesShowcaseProps {
    onViewAllClick?: () => void;
}

// Gallery style types
type GalleryStyle = 'polaroid' | 'vintage' | 'modern' | 'filmstrip' | 'scrapbook' | 'retro' | 'goldenHour' | 'blackAndWhite' | 'faded';

interface StyleConfig {
    name: string;
    icon: string;
    frameClass: string;
    imageClass: string;
    captionClass: string;
    caption: string;
    transitions: { active: string; inactive: string }[];
}

const GALLERY_STYLES: Record<GalleryStyle, StyleConfig> = {
    polaroid: {
        name: 'Polaroid',
        icon: '📸',
        frameClass: 'bg-white dark:bg-neutral-900 p-3 pb-16 rounded-sm shadow-2xl shadow-black/20',
        imageClass: 'rounded-sm',
        captionClass: 'text-neutral-600 dark:text-neutral-400 font-handwriting',
        caption: 'A beautiful memory ✨',
        transitions: [
            { active: 'opacity-100 scale-100 rotate-0', inactive: 'opacity-0 scale-110 rotate-2' },
            { active: 'opacity-100 scale-100 rotate-0', inactive: 'opacity-0 scale-90 -rotate-2' },
            { active: 'opacity-100 scale-100 rotate-0', inactive: 'opacity-0 translate-y-10 rotate-1' },
            { active: 'opacity-100 scale-100 rotate-0', inactive: 'opacity-0 -translate-y-10 -rotate-1' },
        ],
    },
    vintage: {
        name: 'Vintage',
        icon: '🌿',
        frameClass: 'bg-amber-50 dark:bg-amber-950/30 p-4 pb-16 rounded-lg border-4 border-amber-200/50 dark:border-amber-800/50 shadow-2xl',
        imageClass: 'rounded sepia-[0.3]',
        captionClass: 'text-amber-800 dark:text-amber-300 font-serif italic',
        caption: 'Memories from the past 🍂',
        transitions: [
            { active: 'opacity-100 blur-0 grayscale-0', inactive: 'opacity-0 blur-sm grayscale' },
            { active: 'opacity-100 blur-0 sepia-[0.3]', inactive: 'opacity-0 blur-md sepia' },
            { active: 'opacity-100 blur-0 scale-100', inactive: 'opacity-0 scale-105 blur-sm' },
            { active: 'opacity-100 blur-0 translate-y-0', inactive: 'opacity-0 translate-y-4 blur-[2px]' },
        ],
    },
    modern: {
        name: 'Modern',
        icon: '✨',
        frameClass: 'bg-transparent p-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/30',
        imageClass: 'rounded-2xl',
        captionClass: 'hidden',
        caption: '',
        transitions: [
            { active: 'opacity-100 translate-y-0 scale-100', inactive: 'opacity-0 translate-y-4 scale-95' },
            { active: 'opacity-100 translate-x-0 scale-100', inactive: 'opacity-0 -translate-x-4 scale-95' },
            { active: 'opacity-100 translate-x-0 scale-100', inactive: 'opacity-0 translate-x-4 scale-95' },
            { active: 'opacity-100 translate-y-0 scale-100', inactive: 'opacity-0 -translate-y-4 scale-95' },
        ],
    },
    filmstrip: {
        name: 'Filmstrip',
        icon: '🎬',
        frameClass: 'bg-neutral-900 p-1 pb-12 rounded-none shadow-2xl border-y-8 border-neutral-800',
        imageClass: 'rounded-none',
        captionClass: 'text-white/70 font-mono text-xs tracking-widest uppercase',
        caption: 'Frame {index} of {total}',
        transitions: [
            { active: 'opacity-100 translate-x-0', inactive: 'opacity-0 -translate-x-full' },
            { active: 'opacity-100 translate-x-0', inactive: 'opacity-0 translate-x-full' },
            { active: 'opacity-100 translate-y-0', inactive: 'opacity-0 translate-y-full' },
            { active: 'opacity-100 scale-100', inactive: 'opacity-0 scale-125' },
        ],
    },
    scrapbook: {
        name: 'Scrapbook',
        icon: '📖',
        frameClass: 'bg-amber-100 dark:bg-amber-900/20 p-6 pb-20 rounded-none shadow-xl rotate-1 border border-amber-200/50',
        imageClass: 'rounded-none rotate-[-1deg]',
        captionClass: 'text-amber-900 dark:text-amber-200 font-handwriting text-lg',
        caption: 'Our precious moments 💖',
        transitions: [
            { active: 'opacity-100 rotate-[-1deg] scale-100', inactive: 'opacity-0 rotate-[5deg] scale-90' },
            { active: 'opacity-100 rotate-[-1deg] scale-100', inactive: 'opacity-0 rotate-[-5deg] scale-90' },
            { active: 'opacity-100 rotate-[-1deg] translate-y-0', inactive: 'opacity-0 translate-y-10 rotate-3' },
            { active: 'opacity-100 rotate-[-1deg] translate-x-0', inactive: 'opacity-0 translate-x-10 -rotate-3' },
        ],
    },
    retro: {
        name: 'Retro',
        icon: '🎞️',
        frameClass: 'bg-stone-900 p-3 pb-14 rounded-lg shadow-2xl border-4 border-stone-700 vignette-frame',
        imageClass: 'rounded-sm sepia-[0.5] contrast-110 saturate-[0.9]',
        captionClass: 'text-stone-400 font-mono text-xs tracking-wider uppercase',
        caption: '· Vintage Memories ·',
        transitions: [
            { active: 'opacity-100 scale-100 brightness-100', inactive: 'opacity-0 scale-95 brightness-50' },
            { active: 'opacity-100 blur-0 sepia-[0.5]', inactive: 'opacity-0 blur-sm sepia' },
            { active: 'opacity-100 translate-y-0', inactive: 'opacity-0 -translate-y-8' },
            { active: 'opacity-100 scale-100', inactive: 'opacity-0 scale-110 rotate-1' },
        ],
    },
    goldenHour: {
        name: 'Golden Hour',
        icon: '🌅',
        frameClass: 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40 p-4 pb-16 rounded-2xl shadow-2xl shadow-amber-500/20 border border-amber-200/50 dark:border-amber-700/30',
        imageClass: 'rounded-xl brightness-105 saturate-110 contrast-[0.95]',
        captionClass: 'text-amber-700 dark:text-amber-300 font-serif italic',
        caption: 'Golden days to remember ☀️',
        transitions: [
            { active: 'opacity-100 brightness-105 scale-100', inactive: 'opacity-0 brightness-75 scale-105' },
            { active: 'opacity-100 saturate-110 translate-x-0', inactive: 'opacity-0 saturate-50 translate-x-4' },
            { active: 'opacity-100 translate-y-0 rotate-0', inactive: 'opacity-0 translate-y-6 rotate-1' },
            { active: 'opacity-100 blur-0', inactive: 'opacity-0 blur-[2px]' },
        ],
    },
    blackAndWhite: {
        name: 'B&W Classic',
        icon: '📻',
        frameClass: 'bg-neutral-100 dark:bg-neutral-950 p-2 pb-12 rounded-none shadow-2xl border-8 border-neutral-300 dark:border-neutral-700',
        imageClass: 'rounded-none grayscale contrast-125',
        captionClass: 'text-neutral-500 dark:text-neutral-400 font-serif text-sm italic',
        caption: 'Timeless moments in monochrome',
        transitions: [
            { active: 'opacity-100 grayscale contrast-125 scale-100', inactive: 'opacity-0 grayscale-0 scale-95' },
            { active: 'opacity-100 translate-x-0', inactive: 'opacity-0 -translate-x-full' },
            { active: 'opacity-100 translate-y-0', inactive: 'opacity-0 translate-y-full' },
            { active: 'opacity-100 blur-0', inactive: 'opacity-0 blur-md' },
        ],
    },
    faded: {
        name: 'Faded',
        icon: '🎭',
        frameClass: 'bg-slate-50 dark:bg-slate-900/50 p-5 pb-18 rounded-lg shadow-xl border border-slate-200/80 dark:border-slate-700/50',
        imageClass: 'rounded-md saturate-[0.6] brightness-110 contrast-[0.85]',
        captionClass: 'text-slate-500 dark:text-slate-400 font-light tracking-wide',
        caption: 'Faded but never forgotten 🍂',
        transitions: [
            { active: 'opacity-100 saturate-[0.6] scale-100', inactive: 'opacity-0 saturate-100 scale-90' },
            { active: 'opacity-100 brightness-110 translate-y-0', inactive: 'opacity-0 brightness-150 translate-y-4' },
            { active: 'opacity-100 rotate-0', inactive: 'opacity-0 rotate-2' },
            { active: 'opacity-100 blur-0 translate-x-0', inactive: 'opacity-0 blur-[1px] translate-x-2' },
        ],
    },
};

export function MemoriesShowcase({ onViewAllClick }: MemoriesShowcaseProps) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStyle, setSelectedStyle] = useState<GalleryStyle>('polaroid');
    const sectionRef = useRef<HTMLElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Touch swipe state
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && photos.length > 1) {
            // Swipe left = next photo
            setCurrentIndex((prev) => (prev + 1) % photos.length);
        }
        if (isRightSwipe && photos.length > 1) {
            // Swipe right = previous photo
            setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
        }
    };

    // Fetch random photos from API
    useEffect(() => {
        async function fetchPhotos() {
            try {
                const response = await fetch('/api/photos');
                const data = await response.json();

                if (data.files && data.files.length > 0) {
                    // Filter only images AND landscape orientation (width > height)
                    // Account for EXIF rotation: if 90 or 270 degrees, swap width/height
                    const allPhotos = data.files.filter(
                        (p: { mimeType?: string; width?: number; height?: number; rotation?: number }) => {
                            if (!p.mimeType?.startsWith('image/')) return false;

                            let width = p.width || 0;
                            let height = p.height || 0;

                            // Swap dimensions if rotated 90 or 270 degrees
                            if (p.rotation === 90 || p.rotation === 270) {
                                [width, height] = [height, width];
                            }

                            // Filter checks:
                            // 1. Must be high quality (width >= 1920)
                            // 2. Must be landscape orientation (width > height)
                            return width >= 1080 && width > height;
                        }
                    );

                    // Shuffle array and pick 10 random photos
                    const shuffled = [...allPhotos].sort(() => Math.random() - 0.5);
                    const randomPhotos = shuffled.slice(0, 10);

                    setPhotos(randomPhotos);
                }
            } catch (error) {
                console.error('Failed to fetch photos for showcase:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPhotos();
    }, []);

    // Auto-rotate carousel
    useEffect(() => {
        if (photos.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % photos.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [photos.length]);

    // Intersection Observer for scroll animation
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

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    return (
        <section
            ref={sectionRef}
            className={`relative py-20 px-4 overflow-hidden transition-all duration-1000 paper-texture ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
            {/* Warm background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-amber-950/5 to-background" />

            {/* Vintage paper background tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-amber-50/30 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-amber-950/20" />

            {/* Paper grain texture overlay */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative max-w-6xl mx-auto">
                {/* Section header with warm styling */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/10 border border-amber-200/20 mb-6">
                        <Camera className="w-4 h-4 text-amber-500" />
                        <span className="text-sm text-amber-600 dark:text-amber-400 tracking-wide">Gallery Preview</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif font-light text-foreground mb-4">
                        Our Cherished <span className="text-amber-600 dark:text-amber-400">Memories</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Moments frozen in time, stories that will last forever
                    </p>
                </div>

                {/* Carousel with dynamic style frame */}
                <div className="relative group">
                    {/* Main image container - dynamic style */}
                    <div
                        ref={carouselRef}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        className={`relative aspect-[4/3] max-w-4xl mx-auto overflow-hidden transition-all duration-500 ${GALLERY_STYLES[selectedStyle].frameClass}`}
                    >
                        {/* Photo area */}
                        <div className={`relative w-full h-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 transition-all duration-500 ${GALLERY_STYLES[selectedStyle].imageClass}`}>
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
                                </div>
                            ) : photos.length > 0 ? (
                                <>
                                    {photos.map((photo, index) => (
                                        <div
                                            key={photo.id}
                                            className={`absolute inset-0 transition-all duration-700 ${index === currentIndex
                                                ? GALLERY_STYLES[selectedStyle].transitions[index % GALLERY_STYLES[selectedStyle].transitions.length].active
                                                : GALLERY_STYLES[selectedStyle].transitions[index % GALLERY_STYLES[selectedStyle].transitions.length].inactive
                                                }`}
                                        >
                                            <Image
                                                src={photo.thumbnailLink || photo.webContentLink}
                                                alt={photo.name}
                                                fill
                                                className={`object-cover object-center transition-all duration-500 ${GALLERY_STYLES[selectedStyle].imageClass}`}
                                                sizes="(max-width: 768px) 100vw, 80vw"
                                                priority={index === 0}
                                            />
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    <p>No memories to display</p>
                                </div>
                            )}

                            {/* Navigation arrows - hidden by default, visible on hover */}
                            {photos.length > 1 && (
                                <>
                                    <button
                                        onClick={goToPrevious}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center text-neutral-700 dark:text-white transition-all shadow-lg opacity-20 group-hover:opacity-80 hover:!opacity-100"
                                        aria-label="Previous photo"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={goToNext}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center text-neutral-700 dark:text-white transition-all shadow-lg opacity-20 group-hover:opacity-80 hover:!opacity-100"
                                        aria-label="Next photo"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Dynamic caption area */}
                        <div className={`absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center px-4 ${GALLERY_STYLES[selectedStyle].captionClass}`}>
                            <p className="text-sm text-center">
                                {GALLERY_STYLES[selectedStyle].caption
                                    .replace('{index}', String(currentIndex + 1))
                                    .replace('{total}', String(photos.length))}
                            </p>
                        </div>
                    </div>

                    {/* Side preview photos */}
                    <div className="hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2 w-32 h-40 bg-white dark:bg-neutral-900 p-2 pb-8 rounded-sm shadow-xl rotate-[-8deg] opacity-60 hover:opacity-100 transition-opacity">
                        {photos[((currentIndex - 1) + photos.length) % photos.length] && (
                            <div className="relative w-full h-full rounded-sm overflow-hidden">
                                <Image
                                    src={photos[((currentIndex - 1) + photos.length) % photos.length].thumbnailLink || photos[((currentIndex - 1) + photos.length) % photos.length].webContentLink}
                                    alt="Previous memory"
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                />
                            </div>
                        )}
                    </div>
                    <div className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2 w-32 h-40 bg-white dark:bg-neutral-900 p-2 pb-8 rounded-sm shadow-xl rotate-[8deg] opacity-60 hover:opacity-100 transition-opacity">
                        {photos[(currentIndex + 1) % photos.length] && (
                            <div className="relative w-full h-full rounded-sm overflow-hidden">
                                <Image
                                    src={photos[(currentIndex + 1) % photos.length].thumbnailLink || photos[(currentIndex + 1) % photos.length].webContentLink}
                                    alt="Next memory"
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Style selector - below gallery */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {(Object.keys(GALLERY_STYLES) as GalleryStyle[]).map((styleKey) => {
                        const style = GALLERY_STYLES[styleKey];
                        return (
                            <button
                                key={styleKey}
                                onClick={() => setSelectedStyle(styleKey)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedStyle === styleKey
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                <span className="mr-1.5">{style.icon}</span>
                                {style.name}
                            </button>
                        );
                    })}
                </div>

                {/* Dots indicator - show all as dots */}
                {photos.length > 1 && (
                    <div className="flex justify-center gap-2 mt-8 flex-wrap">
                        {photos.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'w-8 bg-amber-500'
                                    : 'w-2 bg-neutral-300 dark:bg-neutral-600 hover:bg-amber-300'
                                    }`}
                                aria-label={`Go to photo ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* View all button */}
                <div className="text-center mt-10">
                    <button
                        onClick={onViewAllClick}
                        className="inline-flex items-center gap-2 px-6 py-3 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium rounded-full border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all"
                    >
                        <Camera className="w-4 h-4" />
                        View All Memories
                    </button>
                </div>
            </div>
        </section>
    );
}
