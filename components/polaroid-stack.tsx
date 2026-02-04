'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';

interface Photo {
    id: string;
    src: string;
    alt: string;
}

interface PolaroidStackProps {
    className?: string;
}

const CAPTIONS = ['✨ Memories', '❤️ Friends', '📸 2019-∞', '🎓 CSE 53', '🌟 Forever'];

export function PolaroidStack({ className = '' }: PolaroidStackProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [stackPhotos, setStackPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Detect if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 640px)').matches || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle click outside to collapse on mobile
    useEffect(() => {
        if (!isMobile || !isExpanded) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
                setSelectedIndex(null);
            }
        };

        // Add listener with a small delay to prevent immediate collapse
        const timer = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMobile, isExpanded]);

    // Fetch photos from API on mount
    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await fetch('/api/photos');
                const data = await response.json();

                if (data.files && data.files.length > 0) {
                    const imageFiles = data.files.filter(
                        (p: { mimeType?: string }) => p.mimeType?.startsWith('image/')
                    );

                    const shuffled = [...imageFiles].sort(() => Math.random() - 0.5);
                    const selected = shuffled.slice(0, 5);

                    setStackPhotos(selected.map((photo: { id: string; thumbnailLink?: string; webContentLink?: string; name?: string }, idx: number) => ({
                        id: photo.id || `photo-${idx}`,
                        src: photo.thumbnailLink || photo.webContentLink || '',
                        alt: photo.name || `Memory ${idx + 1}`,
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch photos for stack:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPhotos();
    }, []);

    // Memoize base positions
    const positions = useMemo(() => {
        return stackPhotos.map((_, index) => {
            const total = stackPhotos.length;

            const stackedRotation = -12 + (index * 6);
            const stackedX = index * 2;
            const stackedY = index * 1;

            const fanRotation = -25 + (index * (50 / Math.max(total - 1, 1)));
            const fanX = -60 + (index * (120 / Math.max(total - 1, 1)));
            const fanY = Math.abs(index - Math.floor(total / 2)) * 8;

            return {
                stacked: {
                    transform: `translateX(${stackedX}px) translateY(${stackedY}px) rotate(${stackedRotation}deg)`,
                    zIndex: index + 1,
                },
                expanded: {
                    transform: `translateX(${fanX}px) translateY(${fanY}px) rotate(${fanRotation}deg)`,
                    zIndex: index + 1,
                },
            };
        });
    }, [stackPhotos]);

    // Handle stack tap/click
    const handleStackTap = () => {
        if (isMobile) {
            if (!isExpanded) {
                setIsExpanded(true);
            }
        }
    };

    // Handle individual photo tap
    const handlePhotoTap = (index: number) => {
        if (isMobile && isExpanded) {
            setSelectedIndex(prev => prev === index ? null : index);
        }
    };

    if (isLoading) {
        return (
            <div className={`relative w-32 h-40 sm:w-40 sm:h-48 ${className}`}>
                <div className="animate-pulse bg-stone-200 dark:bg-stone-700 rounded-lg w-full h-full" />
            </div>
        );
    }

    if (stackPhotos.length === 0) {
        return (
            <div className={`relative w-32 h-40 sm:w-40 sm:h-48 ${className}`}>
                <div className="w-full h-full bg-white dark:bg-stone-100 p-2 pb-6 rounded-sm shadow-lg flex items-center justify-center">
                    <span className="text-4xl">📷</span>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-32 h-40 sm:w-40 sm:h-48 cursor-pointer select-none ${className}`}
            onMouseEnter={() => !isMobile && setIsExpanded(true)}
            onMouseLeave={() => !isMobile && (setIsExpanded(false), setSelectedIndex(null))}
            onClick={handleStackTap}
        >
            {stackPhotos.map((photo, index) => {
                const pos = positions[index];
                const basePos = isExpanded ? pos.expanded : pos.stacked;

                const isSelected = isExpanded && selectedIndex === index;
                const zIndex = isSelected ? 100 : (isExpanded ? index + 1 : index + 1);
                const scale = isSelected ? 'scale(1.05)' : 'scale(1)';

                return (
                    <div
                        key={photo.id}
                        className="absolute inset-0 will-change-transform"
                        style={{
                            transform: `${basePos.transform} ${scale}`,
                            zIndex,
                            transformOrigin: 'center bottom',
                            transition: 'transform 0.3s ease-out',
                        }}
                        onMouseEnter={() => !isMobile && isExpanded && setSelectedIndex(index)}
                        onMouseLeave={() => !isMobile && setSelectedIndex(null)}
                        onClick={(e) => {
                            if (isMobile && isExpanded) {
                                e.stopPropagation();
                                handlePhotoTap(index);
                            }
                        }}
                    >
                        <div
                            className="w-full h-full bg-white p-1.5 sm:p-2 pb-5 sm:pb-7 rounded-sm"
                            style={{
                                boxShadow: isSelected
                                    ? '0 20px 40px rgba(0,0,0,0.3)'
                                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                transition: 'box-shadow 0.3s ease-out',
                            }}
                        >
                            <div className="relative w-full h-full bg-stone-100 overflow-hidden">
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    fill
                                    className="object-cover sepia-[0.15] saturate-[0.95]"
                                    sizes="160px"
                                    loading="eager"
                                    draggable={false}
                                />
                            </div>

                            <div className="absolute bottom-1 sm:bottom-1.5 left-0 right-0 text-center">
                                <span className="text-[10px] sm:text-xs text-stone-500 font-handwriting">
                                    {CAPTIONS[index % CAPTIONS.length]}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}

            <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-stone-400 whitespace-nowrap pointer-events-none"
                style={{
                    opacity: isExpanded ? 0 : 0.7,
                    transition: 'opacity 0.3s',
                }}
            >
                <span className="hidden sm:inline">Hover</span>
                <span className="sm:hidden">Tap</span>
                {' '}to explore
            </div>
        </div>
    );
}
