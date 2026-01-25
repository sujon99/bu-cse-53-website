'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, X, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";

interface Photo {
  id: string;
  name: string;
  webContentLink: string;
  thumbnailLink?: string;
  type: 'photo' | 'video';
  mimeType: string;
  createdTime: string;
  size?: number;
  width?: number;
  height?: number;
  videoDuration?: string;
}

interface FullscreenPhotoViewerProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return 'Unknown Size';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// 2-line date format helper (returns JSX)
function FormatDate({ dateString }: { dateString: string }) {
  const date = new Date(dateString);
  const datePart = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timePart = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex flex-col items-end leading-tight">
      <span>{datePart}</span>
      <span className="text-xs text-white/50">{timePart}</span>
    </div>
  );
}

// Zoom Controls Component (must be inside TransformWrapper)
function ZoomControls({ currentZoom, isZoomed }: { currentZoom: number; isZoomed: boolean }) {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full p-1 border border-white/10">
      <button
        onClick={() => zoomOut()}
        disabled={currentZoom <= 1}
        className="p-2 text-white hover:bg-white/20 rounded-full disabled:opacity-30 transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <span className="px-2 py-1 text-white text-xs font-medium tabular-nums min-w-[3rem] text-center">
        {Math.round(currentZoom * 100)}%
      </span>

      {/* Reset Button - Visible when zoomed */}
      {isZoomed && (
        <button
          onClick={() => resetTransform()}
          className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={() => zoomIn()}
        disabled={currentZoom >= 4}
        className="p-2 text-white hover:bg-white/20 rounded-full disabled:opacity-30 transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
    </div>
  );
}

export function FullscreenPhotoViewer({
  photos,
  initialIndex,
  onClose,
}: FullscreenPhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showInfo, setShowInfo] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: currentIndex,
    loop: true,
    duration: 25,
    watchDrag: !isZoomed,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
    // Reset zoom state on slide change
    setCurrentZoom(1);
    setIsZoomed(false);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomed) {
        if (e.key === 'ArrowLeft') scrollPrev();
        if (e.key === 'ArrowRight') scrollNext();
      }

      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollPrev, scrollNext, onClose, isZoomed]);

  // Prevent scrolling when viewer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const currentPhoto = photos[currentIndex];

  return (
    // GLASS BLUR BACKGROUND (changed from bg-black/95)
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-2xl flex flex-col">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors md:top-4 md:right-4"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Embla Carousel Container */}
      <div className="flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {photos.map((photo, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={photo.id}
                className="flex-[0_0_100%] min-w-0 relative h-full flex items-center justify-center p-4"
              >
                {isActive ? (
                  <div
                    // Event capture wrapper - prevents double-click/tap from reaching Embla
                    className="w-full h-full"
                    onDoubleClick={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => {
                      // Detect double-tap by checking time between touches
                      const now = Date.now();
                      const DOUBLE_TAP_DELAY = 300;
                      const lastTap = (e.currentTarget as HTMLElement).dataset.lastTap;
                      if (lastTap && now - parseInt(lastTap) < DOUBLE_TAP_DELAY) {
                        e.stopPropagation();
                      }
                      (e.currentTarget as HTMLElement).dataset.lastTap = String(now);
                    }}
                  >
                    <TransformWrapper
                      initialScale={1}
                      minScale={1}
                      maxScale={4}
                      centerOnInit
                      smooth={true}
                      velocityAnimation={{
                        sensitivity: 1,
                        animationTime: 200,
                        animationType: "easeOut",
                      }}
                      alignmentAnimation={{
                        sizeX: 100,
                        sizeY: 100,
                        animationTime: 200,
                        animationType: "easeOut",
                      }}
                      onTransformed={(ref) => {
                        setCurrentZoom(ref.state.scale);
                        setIsZoomed(ref.state.scale > 1.01);
                      }}
                      wheel={{ step: 0.1, smoothStep: 0.005 }}
                      doubleClick={{ mode: "zoomIn", step: 0.7, animationTime: 200, animationType: "easeOut" }}
                      pinch={{ step: 5 }}
                      panning={{ disabled: !isZoomed, velocityDisabled: false }}
                    >
                      <>
                        <TransformComponent
                          wrapperClass="!w-full !h-full flex items-center justify-center"
                          contentClass="!w-full !h-full flex items-center justify-center"
                        >
                          <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center">
                            <Image
                              src={photo.webContentLink || "/placeholder.svg"}
                              alt={photo.name}
                              fill
                              className="object-contain"
                              priority
                              quality={100}
                            />
                          </div>
                        </TransformComponent>

                        {/* Zoom Controls - Inside TransformWrapper for context access */}
                        <div className="absolute bottom-11 right-6 z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
                          <ZoomControls currentZoom={currentZoom} isZoomed={isZoomed} />

                          {/* Info Button */}
                          <button
                            onClick={() => setShowInfo(!showInfo)}
                            className={`p-2 rounded-full transition-colors border border-white/10 ${showInfo ? 'bg-white text-black' : 'bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm'}`}
                            aria-label="Show info"
                          >
                            <Info className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    </TransformWrapper>
                  </div>
                ) : (
                  // Inactive Slides: Transition Effect
                  <div className={`relative w-full h-full max-w-7xl mx-auto flex items-center justify-center transition-all duration-500 ease-out scale-90 opacity-40 blur-sm`}>
                    <Image
                      src={photo.webContentLink || "/placeholder.svg"}
                      alt={photo.name}
                      fill
                      className="object-contain select-none pointer-events-none"
                      quality={50}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls (Always visible) */}
      <>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40">
          <button
            onClick={scrollPrev}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40">
          <button
            onClick={scrollNext}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </>

      {/* Progress Bar */}
      {
        !isZoomed && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent pt-12 pb-6 px-4 pointer-events-none z-40">
            <div className="max-w-2xl mx-auto flex items-end justify-center pointer-events-auto">
              <div className="flex-1 mx-4 h-1 bg-white/20 rounded-full overflow-hidden self-center max-w-md">
                <div
                  className="h-full bg-white/80 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / photos.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )
      }

      {/* Metadata Overlay */}
      {
        showInfo && currentPhoto && (
          <div className="absolute bottom-28 right-6 w-72 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 text-white animate-in fade-in slide-in-from-bottom-4 z-[120] shadow-2xl">
            <h2 className="text-lg font-semibold truncate mb-3 text-balance">{currentPhoto.name}</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-white/50">Created</span>
                <FormatDate dateString={currentPhoto.createdTime} />
              </div>

              {currentPhoto.width && currentPhoto.height && (
                <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-white/50">Dimensions</span>
                  <span className="font-medium">{currentPhoto.width} x {currentPhoto.height}</span>
                </div>
              )}

              {currentPhoto.size && (
                <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-white/50">Size</span>
                  <span className="font-medium">{formatBytes(currentPhoto.size)}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-1">
                <span className="text-white/50">Type</span>
                <span className="font-medium uppercase text-xs bg-white/10 px-2 py-0.5 rounded">{currentPhoto.mimeType.split('/').pop()}</span>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
