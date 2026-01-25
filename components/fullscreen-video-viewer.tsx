'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Info } from 'lucide-react';

interface Video {
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

interface FullscreenVideoViewerProps {
  videos: Video[];
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

export function FullscreenVideoViewer({
  videos,
  initialIndex,
  onClose,
}: FullscreenVideoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showInfo, setShowInfo] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const currentVideo = videos[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  // Swipe gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStart - touchEnd > 50) {
      handleNext();
    }
    if (touchEnd - touchStart > 50) {
      handlePrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent scrolling when viewer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-2xl flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors md:top-4 md:right-4"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Video Container - Respects Original Aspect Ratio */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
        {currentVideo && (
          <div
            className="w-full max-w-6xl relative rounded-lg overflow-hidden shadow-2xl bg-black border border-white/10 max-h-full"
            style={{
              aspectRatio: currentVideo.width && currentVideo.height
                ? `${currentVideo.width} / ${currentVideo.height}`
                : '16 / 9'
            }}
          >
            {/* Click Blocker for Google Drive Pop-out Button */}
            <div className="absolute top-0 right-0 w-24 h-24 z-10 bg-transparent" />

            <iframe
              key={currentVideo.id}
              src={currentVideo.webContentLink}
              className="absolute inset-0 w-full h-full"
              allow="autoplay"
              allowFullScreen
              title={currentVideo.name}
            />
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={handlePrevious}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          aria-label="Previous video"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={handleNext}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          aria-label="Next video"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Info Button - Bottom Right Overlay */}
      <div className="absolute bottom-11 right-6 z-50">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className={`p-2 rounded-full transition-colors border border-white/10 ${showInfo ? 'bg-white text-black' : 'bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm'}`}
          aria-label="Show info"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Navigation - Absolute Positioned */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent pt-12 pb-6 px-4 pointer-events-none z-40">
        <div className="max-w-2xl mx-auto flex items-end justify-center pointer-events-auto">
          {/* Progress Bar */}
          <div className="flex-1 mx-4 h-1 bg-white/20 rounded-full overflow-hidden self-center max-w-md">
            <div
              className="h-full bg-white/80 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / videos.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Metadata Overlay */}
      {showInfo && (
        <div className="absolute bottom-20 right-6 w-72 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 text-white animate-in fade-in slide-in-from-bottom-4 shadow-2xl z-[60]">
          <h2 className="text-lg font-semibold truncate mb-3 text-balance">{currentVideo.name}</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-white/10">
              <span className="text-white/50">Created</span>
              <FormatDate dateString={currentVideo.createdTime} />
            </div>

            {currentVideo.width && currentVideo.height && (
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-white/50">Resolution</span>
                <span className="font-medium">{currentVideo.width} x {currentVideo.height}</span>
              </div>
            )}

            {currentVideo.size && (
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-white/50">Size</span>
                <span className="font-medium">{formatBytes(currentVideo.size)}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-1">
              <span className="text-white/50">Type</span>
              <span className="font-medium uppercase text-xs bg-white/10 px-2 py-0.5 rounded">{currentVideo.mimeType.split('/').pop()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
