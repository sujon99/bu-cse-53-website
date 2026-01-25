'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Facebook, Linkedin, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import type { Contact } from './contact-directory';

interface ContactCardProps {
  contact: Contact;
}

// Custom WhatsApp Icon to match Lucide style
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

export function ContactCard({ contact }: ContactCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = contact.imageUrls && contact.imageUrls.length > 0 ? contact.imageUrls : [contact.imageUrl];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleCall = () => window.location.href = `tel:${contact.phone}`;
  const handleEmail = () => window.location.href = `mailto:${contact.email}`;

  const handleSocial = (url?: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsApp = () => {
    if (contact.whatsapp) {
      const cleanNumber = contact.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-2xl hover:bg-muted/50 transition-all duration-300 group border-white/10 backdrop-blur-sm bg-card/80">
      <CardContent className="!p-0 h-full">
        <div className="flex flex-col sm:flex-row h-full">

          {/* Profile Image Section with Slider */}
          <div className="relative w-full sm:w-60 aspect-square sm:aspect-auto sm:h-full shrink-0 overflow-hidden bg-muted group/slider">
            {images.length > 0 && images[0] ? (
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={contact.name}
                fill
                className="object-cover transition-all duration-500"
                sizes="(max-width: 640px) 100vw, 200px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                <span className="text-4xl font-bold text-primary/30 select-none">
                  {contact.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Slider Controls (Only if multiple images) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors opacity-0 group-hover/slider:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors opacity-0 group-hover/slider:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* Dots Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Gradient Overlay for Name (Mobile only) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden pointer-events-none" />
            <div className="absolute bottom-3 left-3 sm:hidden text-white font-bold text-xl drop-shadow-md z-10">
              {contact.name}
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="flex-1 p-5 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-foreground mb-1 hidden sm:block">
              {contact.name}
            </h3>

            <div className="space-y-2 mb-4 mt-2">
              {/* Email */}
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                <Mail className="w-4 h-4" />
                <span className="truncate">{contact.email}</span>
              </a>

              {/* Phone */}
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                <Phone className="w-4 h-4" />
                <span>{contact.phone}</span>
              </a>

              {/* Blood Group */}
              {contact.bloodGroup && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  </div>
                  <span className="font-medium text-red-500/80">Blood Group: {contact.bloodGroup}</span>
                </div>
              )}
            </div>

            {/* Action Buttons Grid (4 Buttons) */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
              {/* Call */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-foreground hover:text-background border-primary/20"
                onClick={handleCall}
              >
                <Phone className="w-4 h-4" />
                Call
              </Button>

              {/* LinkedIn */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-[#0077b5]/10 hover:text-[#0077b5] border-[#0077b5]/20"
                onClick={() => handleSocial(contact.linkedin)}
                disabled={!contact.linkedin}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Button>

              {/* Facebook */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-[#1877F2]/10 hover:text-[#1877F2] border-[#1877F2]/20"
                onClick={() => handleSocial(contact.facebook)}
                disabled={!contact.facebook}
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </Button>

              {/* WhatsApp */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-green-500/10 hover:text-green-600 border-green-500/20"
                onClick={handleWhatsApp}
                disabled={!contact.whatsapp}
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
