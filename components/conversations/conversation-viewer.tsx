'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote, Infinity, Shuffle } from "lucide-react";
import { ConstellationBackground } from '@/components/constellation-effect';
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
    sender: string;
    content: string;
    timestamp: string;
}

interface ConversationCluster {
    category: string;
    summary: string;
    messages: Message[];
}

interface ConversationViewerProps {
    messages: ConversationCluster[];
}

export function ConversationViewer({ messages: moments }: ConversationViewerProps) {
    const [currentMomentIndex, setCurrentMomentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (moments && moments.length > 0) {
            setCurrentMomentIndex(Math.floor(Math.random() * moments.length));
        }
    }, [moments]);

    if (!isClient) return null; // Prevent hydration mismatch

    if (!moments || moments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-stone-500">
                <Quote className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-serif italic">No funny moments found yet.</p>
            </div>
        );
    }

    const currentMoment = moments[currentMomentIndex];

    const handleNext = () => {
        setDirection(1);
        setCurrentMomentIndex((prev) => (prev + 1) % moments.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentMomentIndex((prev) => (prev - 1 + moments.length) % moments.length);
    };

    const handleRandom = () => {
        setDirection(Math.random() > 0.5 ? 1 : -1);
        let newIndex = Math.floor(Math.random() * moments.length);
        // Ensure we get a different one unless there's only 1
        let attempts = 0;
        while (newIndex === currentMomentIndex && moments.length > 1 && attempts < 5) {
            newIndex = Math.floor(Math.random() * moments.length);
            attempts++;
        }
        setCurrentMomentIndex(newIndex);
    };

    const formatDateTime = (timestampStr: string) => {
        const date = new Date(timestampStr.replace(' ', 'T')); // Handle potential format issues if needed
        if (isNaN(date.getTime())) return timestampStr;
        return date.toLocaleString([], {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getInitials = (name: string) => {
        return (name || "UF").split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // Muted, aesthetic colors matching the earth-tone theme
    const getUserColor = (name: string) => {
        const colors = [
            'bg-stone-500', 'bg-amber-600', 'bg-orange-600',
            'bg-rose-500', 'bg-emerald-600', 'bg-slate-500',
            'bg-indigo-500/80', 'bg-violet-600/80'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    // Slide transition variants
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95,
            filter: "blur(4px)"
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
                filter: { duration: 0.4 },
                when: "beforeChildren"
            }
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95,
            filter: "blur(4px)",
            transition: { duration: 0.3 }
        }),
    };

    // Container variant for staggering
    const containerVariants = {
        enter: {
            transition: { staggerChildren: 0.1 }
        },
        center: {
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        },
        exit: {
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    };

    // Message item variants aligned with parent states
    const messageVariants = {
        enter: { opacity: 0, y: 20, scale: 0.9 },
        center: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 400, damping: 20 }
        },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };


    // ... inside component ...

    return (
        <div className="w-full max-w-5xl mx-auto pt-4 pb-36 md:py-8 px-4 md:px-8 relative isolate">

            {/* ... Background Effects ... */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />
            <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl opacity-50">
                <ConstellationBackground />
            </div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 rounded-3xl">
                <div className="absolute top-1/4 left-1/4 w-40 md:w-64 h-40 md:h-64 rounded-full bg-amber-500/10 blur-[60px] md:blur-[80px] animate-float-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-48 md:w-80 h-48 md:h-80 rounded-full bg-rose-500/10 blur-[60px] md:blur-[100px] animate-float-slow-reverse" />
            </div>


            {/* --- HEADER --- */}
            <div className="flex justify-between items-center mb-2 md:mb-4 relative z-10 px-2 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1 md:h-10 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50" />
                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif text-foreground tracking-tight drop-shadow-sm">
                            Chats
                        </h2>
                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-widest pl-0.5">
                            <span>Moment {currentMomentIndex + 1}</span>
                            <span className="text-amber-500/50">•</span>
                            <span className="flex items-center gap-1">
                                of <Infinity className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRandom}
                        title="Random Moment"
                        className="rounded-full w-8 h-8 md:w-10 md:h-10 bg-white/50 dark:bg-black/20 backdrop-blur-md hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-900 dark:hover:text-amber-100 border-stone-200 dark:border-stone-800 transition-all shadow-sm mr-2"
                    >
                        <Shuffle className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrev}
                        className="rounded-full w-8 h-8 md:w-10 md:h-10 bg-white/50 dark:bg-black/20 backdrop-blur-md hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-900 dark:hover:text-amber-100 border-stone-200 dark:border-stone-800 transition-all shadow-sm"
                    >
                        <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNext}
                        className="rounded-full w-8 h-8 md:w-10 md:h-10 bg-white/50 dark:bg-black/20 backdrop-blur-md hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-900 dark:hover:text-amber-100 border-stone-200 dark:border-stone-800 transition-all shadow-sm"
                    >
                        <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="relative mt-4 md:mt-8 perspective-1000">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentMomentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full flex items-start justify-center p-0 md:p-2"
                    >
                        {/* Dynamic Height Card - Fully Auto Height (No Max Constraint) */}
                        <Card className="bg-white/60 dark:bg-stone-950/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl shadow-stone-200/50 dark:shadow-black/50 rounded-[2rem] w-full max-w-3xl h-auto flex flex-col relative overflow-hidden">

                            {/* Internal Card Decor */}
                            <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-br from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 md:w-40 md:h-40 bg-gradient-to-tr from-rose-500/5 to-transparent rounded-tr-full pointer-events-none" />

                            <div className="absolute top-6 right-6 md:top-8 md:right-10 opacity-10 pointer-events-none">
                                <Quote className="w-12 h-12 md:w-20 md:h-20 text-foreground rotate-12" />
                            </div>

                            {/* Summary / Title (Hidden as per request) */}
                            {/* <div className="mb-6 relative z-10 text-center"> ... </div> */}

                            {/* Content Area - No ScrollArea, grows naturally */}
                            <div className="flex-1 w-full p-4 md:p-10">
                                <motion.div
                                    className="space-y-6 md:space-y-8 relative z-10 pb-4"
                                    variants={containerVariants}
                                >
                                    {currentMoment?.messages?.map((msg, idx) => (
                                        <motion.div
                                            key={`${msg.timestamp}-${idx}`}
                                            variants={messageVariants}
                                            className={`flex gap-3 md:gap-5 items-start ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                        >
                                            {/* Profile Picture with Ring */}
                                            <div className="relative group shrink-0">
                                                <div className={`absolute -inset-0.5 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500 ${getUserColor(msg.sender || "Unknown").replace('bg-', 'bg-gradient-to-r from-transparent to-')}`}></div>
                                                <Avatar className={`w-8 h-8 md:w-12 md:h-12 border-2 border-white dark:border-stone-800 shadow-md relative z-10 ${getUserColor(msg.sender || "Unknown")}`}>
                                                    <AvatarFallback className="text-white text-[9px] md:text-[11px] font-bold tracking-wider w-full h-full flex justify-center items-center bg-transparent">
                                                        {getInitials(msg.sender || "Unknown Friend")}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>

                                            <div className={`max-w-[85%] space-y-1.5 md:space-y-2 ${idx % 2 === 0 ? 'items-start' : 'items-end flex flex-col'}`}>
                                                <div className={`flex flex-col px-1 ${idx % 2 === 0 ? 'items-start' : 'items-end'}`}>
                                                    <span className="text-[9px] md:text-[10px] text-stone-400 font-medium uppercase tracking-wide mb-0.5">{formatDateTime(msg.timestamp)}</span>
                                                    <span className="text-xs md:text-sm font-bold text-stone-700 dark:text-stone-200 tracking-tight">{msg.sender || "Unknown Friend"}</span>
                                                </div>

                                                <div
                                                    className={`
                                            p-4 md:p-6 text-sm md:text-[16px] leading-relaxed md:leading-7 shadow-sm backdrop-blur-md relative transition-all duration-300 hover:shadow-lg hover:scale-[1.01]
                                            ${idx % 2 === 0
                                                            ? 'bg-white/80 dark:bg-stone-800/60 rounded-[18px] md:rounded-[24px] rounded-tl-sm text-stone-700 dark:text-stone-200 border border-stone-100 dark:border-stone-700/50'
                                                            : 'bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-[18px] md:rounded-[24px] rounded-tr-sm text-white border border-amber-400/20 shadow-amber-500/20'}
                                            `}
                                                >
                                                    {/* Detailed Text Rendering */}
                                                    {msg.content.split('\n').map((line, i) => (
                                                        <p key={i} className="min-h-[1.2em] break-words">{line}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </Card>

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
