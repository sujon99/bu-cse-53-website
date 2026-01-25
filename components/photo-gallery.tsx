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
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]); // Pagination state
  // const [searchQuery, setSearchQuery] = useState(''); // Removed internal state
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

  // Update active tab and filter when lockedType changes
  useEffect(() => {
    if (lockedType) {
      setActiveTab(`${lockedType}s` as 'photos' | 'videos');
    }
  }, [lockedType]);

  // Update filters when searchQuery changes
  useEffect(() => {
    filterMediaByTabAndSearch(activeTab, searchQuery);
  }, [searchQuery, photos]); // Add searchQuery to dependency array logic

  // Infinite Scroll Observer
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
  }, [hasMore, filteredPhotos, page]); // Re-run when dependencies change

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

      console.log('[v0] Fetching photos from API route');
      const response = await fetch('/api/photos');

      if (!response.ok) {
        let errorMsg = 'Failed to load photos';
        try {
          const errorData = await response.json();
          console.error('[v0] API error JSON:', errorData);
          errorMsg = errorData.error || `API Error: ${response.status} ${response.statusText}`;
        } catch (e) {
          console.error('[v0] API error (non-JSON):', response.status, response.statusText);
          errorMsg = `API Error: ${response.status} ${response.statusText}`;
        }

        setError(`❌ ${errorMsg}`);
        return;
      }

      const data = await response.json();
      console.log('[v0] Successfully loaded', data.files?.length || 0, 'photos');

      if (!data.files || data.files.length === 0) {
        setError('❌ No images found in the shared folder. Make sure the folder contains image files and they are not in subfolders.');
        return;
      }

      // Shuffle logic (Fisher-Yates) to randomize images on refresh
      const shuffledFiles = [...data.files];
      for (let i = shuffledFiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledFiles[i], shuffledFiles[j]] = [shuffledFiles[j], shuffledFiles[i]];
      }

      setPhotos(shuffledFiles);

      // Apply initial filter based on lockedType
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
      console.error('[v0] Error fetching photos:', err);
      setError(`Failed to load photos from Google Drive: ${err instanceof Error ? err.message : 'Unknown error'}`);
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

    // Filter by type (force lockedType if present)
    if (lockedType) {
      if (lockedType === 'photo') {
        filtered = filtered.filter((item) => item.type === 'photo');
      } else if (lockedType === 'video') {
        filtered = filtered.filter((item) => item.type === 'video');
      }
    } else {
      // Normal tab filtering
      if (tab === 'photos') {
        filtered = filtered.filter((item) => item.type === 'photo');
      } else if (tab === 'videos') {
        filtered = filtered.filter((item) => item.type === 'video');
      }
    }

    // Filter by search query
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
      {/* Tab Navigation - Only show if not locked to a specific type */}
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

      {/* Gallery Stats */}
      <div className="mb-6 text-sm text-muted-foreground">
        {!isLoading && (
          <>
            Showing {displayedPhotos.length} of {filteredPhotos.length} memories
          </>
        )}
      </div>

      {/* Masonry Grid */}
      <div className={`${isLoading ? 'flex justify-center items-center h-64' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
        {isLoading ? (
          <Preloader />
        ) : filteredPhotos.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No items found. Try a different search.
          </div>
        ) : (
          <>
            {displayedPhotos.map((item, index) => {
              const itemIndex = photos.findIndex((p) => p.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.type === 'photo') {
                      setFullscreenPhotoIndex(itemIndex);
                    } else {
                      setFullscreenVideoIndex(itemIndex);
                    }
                  }}
                  className="cursor-pointer group w-full relative"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-square bg-muted">
                    <Image
                      src={item.thumbnailLink || item.webContentLink}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Sentinel for Infinite Scroll */}
            {hasMore && (
              <div
                ref={loaderRef}
                className="col-span-full py-8 text-center text-muted-foreground flex justify-center w-full"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Fullscreen Photo Viewer */}
      {fullscreenPhotoIndex !== null && (
        <FullscreenPhotoViewer
          photos={photos.filter((p) => p.type === 'photo')}
          initialIndex={photos.filter((p) => p.type === 'photo').findIndex(
            (p) => p.id === photos[fullscreenPhotoIndex]?.id
          )}
          onClose={() => setFullscreenPhotoIndex(null)}
        />
      )}

      {/* Fullscreen Video Viewer */}
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
