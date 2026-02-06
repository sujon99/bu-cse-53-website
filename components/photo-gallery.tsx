'use client';

import { DialogContent } from "@/components/ui/dialog"
import { DialogTrigger } from "@/components/ui/dialog"
import { Dialog } from "@/components/ui/dialog"
import { X } from 'lucide-react'; // Import X component
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { FullscreenPhotoViewer } from './fullscreen-photo-viewer';
import { FullscreenVideoViewer } from './fullscreen-video-viewer';
import { Preloader } from '@/components/ui/preloader';
import { motion } from 'framer-motion';

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

interface PhotoGalleryProps {
  lockedType?: 'photo' | 'video';
  searchQuery?: string;
}

export function PhotoGallery({ lockedType, searchQuery = '' }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'photos' | 'videos'>('all');
  const [fullscreenPhotoIndex, setFullscreenPhotoIndex] = useState<number | null>(null);
  const [fullscreenVideoIndex, setFullscreenVideoIndex] = useState<number | null>(null);

  // Pagination refs and constants
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = React.useRef<HTMLDivElement>(null);
  const PHOTOS_PER_PAGE = 24;

  useEffect(() => {
    fetchPhotosFromGoogleDrive();
  }, []);

  useEffect(() => {
    if (lockedType) {
      setActiveTab(`${lockedType}s` as 'photos' | 'videos');
    }
  }, [lockedType]);

  useEffect(() => {
    filterMediaByTabAndSearch(activeTab, searchQuery);
  }, [searchQuery, photos]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore) {
          loadMorePhotos();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, filteredPhotos, page]);

  const loadMorePhotos = () => {
    const nextBatch = filteredPhotos.slice(0, (page + 1) * PHOTOS_PER_PAGE);
    setDisplayedPhotos(nextBatch);
    setPage((prev) => prev + 1);

    if (nextBatch.length >= filteredPhotos.length) {
      setHasMore(false);
    }
  };

  const fetchPhotosFromGoogleDrive = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/photos');

      if (!response.ok) {
        let errorMsg = 'Failed to load photos';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || `API Error: ${response.status} ${response.statusText}`;
        } catch (e) {
          errorMsg = `API Error: ${response.status} ${response.statusText}`;
        }
        setError(`❌ ${errorMsg}`);
        return;
      }

      const data = await response.json();

      if (!data.files || data.files.length === 0) {
        setError('❌ No images found in the shared folder.');
        return;
      }

      const shuffledFiles = [...data.files];
      for (let i = shuffledFiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledFiles[i], shuffledFiles[j]] = [shuffledFiles[j], shuffledFiles[i]];
      }

      setPhotos(shuffledFiles);

      let filtered = shuffledFiles;
      if (lockedType) {
        if (lockedType === 'photo') {
          filtered = filtered.filter((item: Photo) => item.type === 'photo');
        } else if (lockedType === 'video') {
          filtered = filtered.filter((item: Photo) => item.type === 'video');
        }
      }

      setFilteredPhotos(filtered);
      setDisplayedPhotos(filtered.slice(0, PHOTOS_PER_PAGE));
      setPage(1);
      setHasMore(filtered.length > PHOTOS_PER_PAGE);
    } catch (err) {
      setError(`Failed to load photos: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: 'all' | 'photos' | 'videos') => {
    setActiveTab(tab);
    filterMediaByTabAndSearch(tab, searchQuery);
  };

  const filterMediaByTabAndSearch = (tab: 'all' | 'photos' | 'videos', query: string) => {
    let filtered = photos;

    if (lockedType) {
      if (lockedType === 'photo') {
        filtered = filtered.filter((item) => item.type === 'photo');
      } else if (lockedType === 'video') {
        filtered = filtered.filter((item) => item.type === 'video');
      }
    } else {
      if (tab === 'photos') {
        filtered = filtered.filter((item) => item.type === 'photo');
      } else if (tab === 'videos') {
        filtered = filtered.filter((item) => item.type === 'video');
      }
    }

    if (query) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredPhotos(filtered);
    setDisplayedPhotos(filtered.slice(0, PHOTOS_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > PHOTOS_PER_PAGE);
  };

  // Split photos into 4 columns for stable masonry layout
  const columns = [[], [], [], []] as { item: Photo; index: number }[][];
  displayedPhotos.forEach((item, index) => {
    columns[index % 4].push({ item, index });
  });

  if (error) {
    return (
      <div className="w-full py-12 text-center space-y-4">
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive inline-block max-w-md mx-auto">
          <p className="font-semibold">Unable to load memories</p>
          <p className="text-sm opacity-90">Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!lockedType && (
        <div className="mb-8 border-b border-border">
          <div className="flex gap-2 -mb-px">
            {[
              { id: 'all', label: 'All Media', count: photos.length },
              { id: 'photos', label: 'Photos', count: photos.filter((p) => p.type === 'photo').length },
              { id: 'videos', label: 'Videos', count: photos.filter((p) => p.type === 'video').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as 'all' | 'photos' | 'videos')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab.label}
                <span className="ml-2 text-xs opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 text-sm text-muted-foreground">
        {!isLoading && (
          <>
            Showing {displayedPhotos.length} of {filteredPhotos.length} memories
          </>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Preloader />
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          No items found. Try a different search.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mx-auto">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-3 md:gap-6">
              {col.map(({ item, index }) => {
                const globalIndex = index; // The original index in displayedPhotos
                const itemIndex = photos.findIndex((p) => p.id === item.id);

                // First 12 items must appear immediately, bypassing viewport check
                const isPriority = globalIndex < 12;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isPriority ? { opacity: 1, y: 0 } : undefined}
                    whileInView={isPriority ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px" }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: isPriority ? 0 : 0.1 // No delay for priority items to fix 'first image appearing with delay'
                    }}
                    onClick={() => {
                      if (item.type === 'photo') {
                        setFullscreenPhotoIndex(itemIndex);
                      } else {
                        setFullscreenVideoIndex(itemIndex);
                      }
                    }}
                    className="cursor-pointer group relative w-full block focus:outline-none"
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-muted shadow-sm hover:shadow-xl transition-all duration-500 ease-out border border-white/20 dark:border-white/5 min-h-[100px]">
                      <Image
                        src={item.thumbnailLink || item.webContentLink}
                        alt={item.name}
                        width={0}
                        height={0}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105 opacity-0"
                        priority={isPriority}
                        onLoad={(e) => {
                          e.currentTarget.classList.remove('opacity-0');
                        }}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                      </div>

                      {/* Video Icon */}
                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg transition-transform duration-300 group-hover:scale-110">
                            <svg className="w-6 h-6 text-white fill-current ml-1" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div
          ref={loaderRef}
          className="py-8 text-center text-muted-foreground flex justify-center w-full"
        >
          <Preloader />
        </div>
      )}

      {fullscreenPhotoIndex !== null && (
        <FullscreenPhotoViewer
          photos={photos.filter((p) => p.type === 'photo')}
          initialIndex={photos.filter((p) => p.type === 'photo').findIndex(
            (p) => p.id === photos[fullscreenPhotoIndex]?.id
          )}
          onClose={() => setFullscreenPhotoIndex(null)}
        />
      )}

      {fullscreenVideoIndex !== null && (
        <FullscreenVideoViewer
          videos={photos.filter((p) => p.type === 'video')}
          initialIndex={photos.filter((p) => p.type === 'video').findIndex(
            (p) => p.id === photos[fullscreenVideoIndex]?.id
          )}
          onClose={() => setFullscreenVideoIndex(null)}
        />
      )}
    </div>
  );
}
