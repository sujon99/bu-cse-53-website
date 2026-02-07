'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <Button
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-40 rounded-full w-12 h-12 shadow-lg bg-amber-500 hover:bg-amber-600 text-white sm:bottom-8 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            size="icon"
            aria-label="Back to top"
        >
            <ChevronUp className="w-6 h-6" />
        </Button>
    );
}
