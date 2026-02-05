'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { GraduationCap, Briefcase, BookOpen, Video, Users, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { ScrollAnimation } from '@/components/scroll-animation';

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    icon: React.ElementType;
    date?: string;
    images: string[];
    rotation?: string;
}

const EVENTS: TimelineEvent[] = [
    {
        year: '2019',
        title: 'The Beginning of an Era',
        description: 'Our journey began in the halls of Bangladesh University, CSE Department (Batch 53). It all started with that first orientation call from Sadiq Ikbal Sir—igniting dreams and forging the first bonds of a lifelong friendship.',
        icon: Users,
        date: 'Admission & Orientation',
        images: [
            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop'
        ],
        rotation: '-rotate-2'
    },
    {
        year: '2020',
        title: 'Navigating the Unknown',
        description: 'As the world paused for the pandemic, our determination didn\'t. We pivoted to online classes, turning screens into classrooms and chat rooms into hangouts, proving that connection transcends distance.',
        icon: Video,
        date: 'Covid & Online Classes',
        images: [
            'https://images.unsplash.com/photo-1584697964405-8334442a3a02?q=80&w=800&auto=format&fit=crop'
        ],
        rotation: 'rotate-1'
    },
    {
        year: '2022',
        title: 'A Decade of Semesters',
        description: 'Ten semesters of grueling exams, late-night projects, and endless coffee runs. We conquered the academic rigors together, transforming from eager freshmen into seasoned scholars.',
        icon: BookOpen,
        date: '10 Semesters Complete',
        images: [
            'https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop'
        ],
        rotation: '-rotate-3'
    },
    {
        year: '2022',
        title: 'Stepping into the Professional World',
        description: 'Leaving the classroom behind, we stepped into the industry. The internship phase was our crucible, applying knowledge to practice and paving the way for our future careers.',
        icon: Briefcase,
        date: 'Internship Period',
        images: [
            'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop'
        ],
        rotation: 'rotate-2'
    },
    {
        year: '2026',
        title: 'The Grand Finale',
        description: 'January 18, 2026. Caps thrown high, degrees in hand. We officially graduated, sealing our legacy in a grand convocation ceremony. The end of a chapter, but the beginning of our legend.',
        icon: GraduationCap,
        date: 'Jan 18, 2026',
        images: [
            'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1627556947514-6937ee35bb65?q=80&w=800&auto=format&fit=crop'
        ],
        rotation: '-rotate-1'
    }
];

function ImageCarousel({ images, title }: { images: string[], title: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
        if (isLeftSwipe) {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }
        if (isRightSwipe) {
            setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div
            className="relative aspect-[4/3] bg-stone-100 mb-6 overflow-hidden shadow-inner group/carousel border-8 border-white touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <Image
                src={images[currentIndex]}
                alt={`${title} - image ${currentIndex + 1}`}
                fill
                className="object-cover sepia-[0.15] brightness-[0.95] contrast-[1.1] group-hover/carousel:sepia-0 transition-all duration-700 ease-out select-none"
                unoptimized
                draggable={false}
            />
            {/* Grain overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 hover:bg-white text-white hover:text-stone-800 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 items-center justify-center shadow-lg"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={nextImage}
                        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 hover:bg-white text-white hover:text-stone-800 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 items-center justify-center shadow-lg"
                    >
                        <ChevronRight size={16} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 p-1 px-2 rounded-full bg-black/20 backdrop-blur-[2px]">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300 ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export function MemoryTimeline() {
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setVisibleItems((prev) => (prev.includes(index) ? prev : [...prev, index]));
                    } else {
                        // Remove item when it goes out of view for reverse animation
                        const index = Number(entry.target.getAttribute('data-index'));
                        setVisibleItems((prev) => prev.filter(i => i !== index));
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const items = document.querySelectorAll('.timeline-item');
        items.forEach((item) => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="relative py-20 px-2 sm:py-20 sm:px-4 overflow-hidden" ref={timelineRef}>
            {/* Background Texture - Vintage Paper */}
            <div className="absolute inset-0 bg-[#f7f5f2] dark:bg-stone-950 opacity-100 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d6d3d1' fill-opacity='0.2'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Top shadow overlay to blend with previous section */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-10" />

            <div className="max-w-6xl mx-auto relative z-10">
                <ScrollAnimation>
                    <div className="text-center mb-24 space-y-8">
                        <span className="text-sm font-bold tracking-[0.4em] text-amber-600/80 dark:text-amber-500 uppercase font-sans border border-amber-200/50 px-4 py-1.5 rounded-full bg-amber-50/50 backdrop-blur-sm mb-4 inline-block">Our Journey</span>
                        <h2 className="text-5xl sm:text-6xl font-serif text-stone-800 dark:text-stone-100 drop-shadow-sm">
                            Timeline of <span className="italic text-amber-600 dark:text-amber-500">Memories</span>
                        </h2>
                        <div className="flex justify-center items-center gap-4">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300" />
                            <span className="text-2xl">✨</span>
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300" />
                        </div>
                    </div>
                </ScrollAnimation>

                <div className="relative">
                    {/* Elegant Long-Wave Line (Desktop & Mobile) */}
                    <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-10 sm:-translate-x-1/2 h-full overflow-hidden pointer-events-none">
                        {/* High-Resolution Aesthetic Wavy Line - Long Repeat (400px) */}
                        <div className="w-full h-full opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-normal"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='400' viewBox='0 0 40 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 C 30 100 30 100 20 200 C 10 300 10 300 20 400' stroke='%23d97706' stroke-width='1.5' fill='none' stroke-dasharray='4 8' stroke-linecap='round'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'repeat-y',
                                backgroundPosition: 'center top'
                            }}
                        />
                        {/* Gradient Fade overlay */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#f7f5f2] dark:from-stone-950 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#f7f5f2] dark:from-stone-950 to-transparent"></div>
                    </div>


                    <div className="space-y-32 sm:space-y-48 pb-16">
                        {EVENTS.map((event, index) => {
                            const isVisible = visibleItems.includes(index);
                            return (
                                <div
                                    key={index}
                                    data-index={index}
                                    className={`timeline-item relative flex flex-col sm:flex-row items-center group ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                                        }`}
                                >
                                    {/* Timeline Node (Center Icon) */}
                                    <div className="absolute left-4 sm:left-1/2 z-20 transform sm:-translate-x-1/2 flex items-center justify-center">
                                        <div className={`w-10 h-10 rounded-full bg-[#fcfbf9] dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all duration-700 z-20 ${isVisible ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'
                                            }`}>
                                            <div className="w-5 h-5 bg-amber-100/80 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Spacer for alternating layout */}
                                    <div className="hidden sm:block w-1/2" />

                                    {/* Content Wrapper */}
                                    <div className={`w-full sm:w-1/2 pl-12 sm:pl-20 sm:pr-20 transform transition-all duration-1000 ease-out ${isVisible
                                        ? 'opacity-100 translate-x-0 translate-y-0'
                                        : `opacity-0 translate-y-12 ${index % 2 === 0 ? 'sm:-translate-x-12' : 'sm:translate-x-12'}`
                                        }`}>

                                        {/* Polaroid Image Card */}
                                        <div className={`relative bg-white p-3 pb-6 sm:p-5 sm:pb-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transform transition-transform duration-500 hover:z-30 hover:scale-[1.03] hover:-rotate-1 ${event.rotation} w-full max-w-lg mx-auto sm:mx-0 border border-stone-100 dark:border-stone-800 ${index % 2 !== 0 ? 'sm:ml-auto' : ''
                                            }`}>
                                            {/* Vintage Paper Texture Overlay on Card */}
                                            <div className="absolute inset-0 bg-stone-50/30 opacity-50 mix-blend-multiply pointer-events-none"
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")` }}
                                            />

                                            {/* Tape element */}
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-amber-100/90 rotate-[-2deg] backdrop-blur-[1px] border-l-2 border-r-2 border-white/40 z-20 shadow-sm"
                                                style={{
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                    clipPath: 'polygon(2% 10%, 98% 0%, 100% 90%, 2% 100%, 0% 10%)',
                                                    backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.4) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.4) 75%, transparent 75%, transparent)',
                                                    backgroundSize: '8px 8px'
                                                }}
                                            />

                                            {/* Date Stamp */}
                                            <div className="absolute -right-4 -top-6 bg-white border-2 border-amber-600/20 text-amber-700/90 font-bold px-3 py-1 rounded-sm rotate-12 shadow-md font-mono text-xs z-40 uppercase tracking-widest">
                                                {event.date}
                                            </div>

                                            {/* Image Carousel */}
                                            <ImageCarousel images={event.images} title={event.title} />

                                            {/* Text Content Area */}
                                            <div className="px-3 relative">
                                                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-200/0 via-amber-200/50 to-amber-200/0 sm:block hidden"></div>

                                                <div className="flex items-baseline gap-3 mb-3">
                                                    <span className="font-serif text-3xl text-stone-800 dark:text-stone-200 font-bold tracking-tight">{event.year}</span>
                                                    <div className="h-px w-8 bg-stone-300 dark:bg-stone-700"></div>
                                                    <event.icon className="w-5 h-5 text-amber-600/80" />
                                                </div>

                                                <h3 className="font-serif text-xl sm:text-2xl leading-tight text-stone-800 dark:text-stone-100 mb-3 font-medium">
                                                    {event.title}
                                                </h3>

                                                <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 font-sans leading-relaxed tracking-wide opacity-90">
                                                    {event.description}
                                                </p>

                                                {/* Handwritten Note decoration */}
                                                {/* <div className="mt-4 pt-4 border-t border-dashed border-stone-200 dark:border-stone-800">
                                                    <p className="font-handwriting text-stone-400 text-sm rotate-[-1deg]">
                                                        ~ captured memory
                                                    </p>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
