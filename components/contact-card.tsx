'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Facebook, Linkedin, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import type { Contact } from './contact-directory';

interface ContactCardProps {
  contact: Contact;
}

// Custom WhatsApp Icon to match Lucide style
// Custom icons for the card
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

export function ContactCard({ contact }: ContactCardProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = contact.imageUrls && contact.imageUrls.length > 0 ? contact.imageUrls : [contact.imageUrl];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentImageIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleNextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handlePrevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const handleCall = () => window.location.href = `tel:${contact.phone}`;

  const handleSocial = (url?: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsApp = () => {
    if (contact.whatsapp) {
      const cleanNumber = contact.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Determine special styling based on role
  const isAuthor = contact.role === 'author';
  const isCr = contact.role === 'cr';

  // Base Styles
  let containerStyle = "group relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-500 flex flex-col sm:flex-row h-full max-w-2xl mx-auto w-full hover:shadow-2xl";
  let borderClass = "border-border/40 hover:border-border/80";
  let bgClass = "bg-card/30 supports-[backdrop-filter]:bg-background/60"; // Glass-like
  let roleBadge = null;

  if (isAuthor) {
    // Author: Premium Gold/Amber Aesthetic - Subtle & Sophisticated
    borderClass = "border-amber-500/20 group-hover:border-amber-500/40";
    bgClass = "bg-gradient-to-br from-amber-500/5 via-background/80 to-background/40";
    roleBadge = (
      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
        <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
        Author
      </span>
    );
  } else if (isCr) {
    // CR: Premium Slate/Sky Aesthetic - Clean & Trustworthy
    borderClass = "border-sky-500/20 group-hover:border-sky-500/40";
    bgClass = "bg-gradient-to-br from-sky-500/5 via-background/80 to-background/40";
    roleBadge = (
      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
        <span className="w-1 h-1 rounded-full bg-sky-500" />
        CR
      </span>
    );
  }

  return (
    <div className={`${containerStyle} ${borderClass} ${bgClass}`}>

      {/* Decorative Gradient Background - Positioned at bottom on mobile (behind text) and top-right on desktop */}
      {isAuthor && <div className="absolute bottom-0 right-0 sm:top-0 sm:right-0 w-64 h-64 bg-amber-500/10 blur-[80px] -z-10 rounded-full pointer-events-none" />}
      {isCr && <div className="absolute bottom-0 right-0 sm:top-0 sm:right-0 w-64 h-64 bg-sky-500/10 blur-[80px] -z-10 rounded-full pointer-events-none" />}

      {/* --- LEFT SIDE: IMAGE CAROUSEL (40%) --- */}
      <div className="relative w-full sm:w-[40%] aspect-[4/5] sm:aspect-auto sm:h-auto shrink-0 overflow-hidden bg-black/40 group/slider">
        <div className="w-full h-full overflow-hidden" ref={emblaRef}>
          <div className="flex w-full h-full">
            {images.length > 0 ? (
              images.map((imgSrc, idx) => (
                <div className="flex-[0_0_100%] min-w-0 relative w-full h-full mr-2" key={idx}>
                  <Image
                    src={imgSrc || "/placeholder.svg"}
                    alt={`${contact.name} - ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 300px"
                  />
                </div>
              ))
            ) : (
              <div className="flex-[0_0_100%] min-w-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                <span className="text-4xl font-bold text-white/20 select-none">
                  {contact.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Slider Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all opacity-0 group-hover/slider:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all opacity-0 group-hover/slider:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- RIGHT SIDE: DETAILS (60%) --- */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 relative">

        {/* Name & Role */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground leading-tight flex flex-wrap items-center gap-1">
            {contact.name}
            {roleBadge}
          </h3>
        </div>

        {/* Info Grid with Divider */}
        <div className="flex flex-col sm:flex-row gap-4 mb-5 text-sm">
          {/* Col 1: Contact Info */}
          <div className="flex-1 space-y-2.5 min-w-0">
            <div className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors group/item">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <span className="truncate text-xs sm:text-sm">{contact.email}</span>
            </div>

            <div className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors group/item">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <span className="truncate text-xs sm:text-sm">{contact.phone}</span>
            </div>

            {contact.bloodGroup && (
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                </div>
                <span className="font-semibold text-red-400 text-xs sm:text-sm">Blood Group: {contact.bloodGroup}</span>
              </div>
            )}
          </div>

          {/* Conditionally render dividers if there is additional info */}
          {(contact.designation || contact.company || contact.city) && (
            <>
              {/* Vertical Divider (Hidden on mobile) */}
              <div className="hidden sm:block w-px bg-gradient-to-b from-transparent via-border to-transparent" />

              {/* Horizontal Divider (Visible on mobile) */}
              <div className="block sm:hidden h-px bg-gradient-to-r from-transparent via-border to-transparent w-full" />
            </>
          )}

          {/* Col 2: Additional Info (Mocked if missing in interface, but trying to be realistic) */}
          <div className="flex-1 space-y-3 min-w-0">
            {/* Using static or generic info since interface might not have everything, 
                 but checking what's available or showing placeholder like design */}
            <div className="flex flex-col gap-1">
              {(contact.designation || contact.company) && (
                <div>
                  <span className="text-xs text-muted-foreground/60 uppercase tracking-widest font-semibold block mb-0.5">Profession</span>
                  <p className="text-sm font-medium leading-tight">{contact.designation}</p>
                  <p className="text-xs text-muted-foreground">{contact.company}</p>
                </div>
              )}

              {contact.city && (
                <div className="mt-2">
                  <span className="text-xs text-muted-foreground/60 uppercase tracking-widest font-semibold block mb-0.5">Current City</span>
                  <span className="text-sm font-medium">{contact.city}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-auto">
          <Button variant="outline" size="sm" onClick={handleCall} className="w-full text-xs h-9 bg-transparent border-foreground/10 hover:bg-foreground hover:text-background hover:border-transparent transition-all">
            <Phone className="w-3.5 h-3.5 mr-2" /> Call
          </Button>

          <Button variant="outline" size="sm" onClick={() => handleSocial(contact.linkedin)} disabled={!contact.linkedin} className="w-full text-xs h-9 bg-transparent border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-transparent transition-all">
            <Linkedin className="w-3.5 h-3.5 mr-2" /> LinkedIn
          </Button>

          <Button variant="outline" size="sm" onClick={() => handleSocial(contact.facebook)} disabled={!contact.facebook} className="w-full text-xs h-9 bg-transparent border-blue-600/20 text-blue-500 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all">
            <Facebook className="w-3.5 h-3.5 mr-2" /> Facebook
          </Button>

          <Button variant="outline" size="sm" onClick={handleWhatsApp} disabled={!contact.whatsapp} className="w-full text-xs h-9 bg-transparent border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white hover:border-transparent transition-all">
            <WhatsAppIcon className="w-3.5 h-3.5 mr-2" /> WhatsApp
          </Button>
        </div>

      </div>
    </div>
  );
}
