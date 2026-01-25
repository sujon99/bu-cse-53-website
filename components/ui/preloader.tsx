'use client';

import React from 'react';

export function Preloader() {
    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
                {/* Outer Ring */}
                <div className="w-12 h-12 rounded-full border-4 border-primary/20"></div>
                {/* Inner Spinning Ring */}
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading memories...</p>
        </div>
    );
}
