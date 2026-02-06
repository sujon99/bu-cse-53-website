'use client';

import React, { useState, useEffect } from 'react';
import { PhotoGallery } from '@/components/photo-gallery';
import { ContactDirectory } from '@/components/contact-directory';
import type { Contact } from '@/components/contact-directory';
import { HeroSection } from '@/components/hero-section';
import { MemoriesShowcase } from '@/components/memories-showcase';
import { FriendQuotes } from '@/components/friend-quotes';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Images, Users, Search, X, Video, Loader2, Home as HomeIcon, PenTool } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { BackToTop } from '@/components/back-to-top';
import { FloatingDecorations } from '@/components/floating-decorations';
import { PolaroidStack } from '@/components/polaroid-stack';
import { YearsCounter } from '@/components/years-counter';
import { MemoryTimeline } from '@/components/memory-timeline';
import { BatchStatsFooter } from '@/components/batch-stats-footer';
import { ScrollAnimation } from '@/components/scroll-animation';
import { AuthorTab } from '@/components/author-tab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  // State for contacts with loading and error states
  const [displayedContacts, setDisplayedContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);

  // Fetch contacts from API on mount
  useEffect(() => {
    async function fetchContacts() {
      try {
        setIsLoadingContacts(true);
        setContactsError(null);

        const response = await fetch('/api/contacts');
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch contacts');
        }

        const contacts: Contact[] = data.contacts || [];

        // Keep first contact, shuffle the rest
        if (contacts.length > 1) {
          const firstContact = contacts[0];
          const restContacts = [...contacts.slice(1)];

          // Fisher-Yates shuffle for the rest
          for (let i = restContacts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [restContacts[i], restContacts[j]] = [restContacts[j], restContacts[i]];
          }

          setDisplayedContacts([firstContact, ...restContacts]);
        } else {
          setDisplayedContacts(contacts);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setContactsError(error instanceof Error ? error.message : 'Failed to load contacts');
        setDisplayedContacts([]);
      } finally {
        setIsLoadingContacts(false);
      }
    }

    fetchContacts();
  }, []);

  React.useEffect(() => {
    let lastScrollY = window.scrollY;
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== (isScrollingDown ? 'down' : 'up') && Math.abs(scrollY - lastScrollY) > 10) {
        setIsScrollingDown(direction === 'down');
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, [isScrollingDown]);

  // Filter contacts based on search
  const filteredContacts = displayedContacts.filter(contact => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.phone.includes(query) ||
      (contact.whatsapp && contact.whatsapp.includes(query)) ||
      (contact.bloodGroup && contact.bloodGroup.toLowerCase().includes(query)) ||
      (contact.city && contact.city.toLowerCase().includes(query)) ||
      (contact.designation && contact.designation.toLowerCase().includes(query)) ||
      (contact.company && contact.company.toLowerCase().includes(query))
    );
  });

  const [tempSearchQuery, setTempSearchQuery] = useState('');

  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
    setActiveTab('search');
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab} className="w-full min-h-screen flex flex-col">
        {/* Search Dialog (Global) */}
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogContent className="sm:max-w-md top-[20%] translate-y-0">
            <DialogHeader>
              <DialogTitle>Search Memories</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input
                  placeholder="Search by Name, City, Blood Group..."
                  value={tempSearchQuery}
                  onChange={(e) => setTempSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="col-span-3"
                  autoFocus
                />
              </div>
              <Button onClick={handleSearch} size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs text-muted-foreground mr-1">Search by:</span>
              {['Name', 'Email', 'Phone', 'Whatsapp', 'Blood Group', 'City', 'Designation', 'Company'].map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-full border border-border">
                  {tag}
                </span>
              ))}
            </div>
          </DialogContent>
        </Dialog>



        <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
          {/* Mobile-hidden top tabs - Always fixed and glass effect */}
          <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center mb-8 hidden sm:flex transition-transform duration-300 ${isScrollingDown ? '-translate-y-24' : 'translate-y-0'}`}>
            <div className="inline-flex h-10 items-center justify-center rounded-full p-1 gap-1 transition-all bg-white/60 backdrop-blur-xl text-neutral-900 border border-white/40 shadow-xl shadow-black/10">
              <TabsList className="bg-transparent p-0 h-auto">
                <TabsTrigger value="home" className="flex items-center gap-2 px-4 rounded-full shadow-none transition-all text-neutral-700 data-[state=active]:bg-neutral-900/10 data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm">
                  <HomeIcon className="w-4 h-4" />
                  Home
                </TabsTrigger>
                <TabsTrigger value="photos" className="flex items-center gap-2 px-4 rounded-full shadow-none transition-all text-neutral-700 data-[state=active]:bg-neutral-900/10 data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm">
                  <Images className="w-4 h-4" />
                  Photos
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2 px-4 rounded-full shadow-none transition-all text-neutral-700 data-[state=active]:bg-neutral-900/10 data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm">
                  <Video className="w-4 h-4" />
                  Videos
                </TabsTrigger>
                <TabsTrigger value="contacts" className="flex items-center gap-2 px-4 rounded-full shadow-none transition-all text-neutral-700 data-[state=active]:bg-neutral-900/10 data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm">
                  <Users className="w-4 h-4" />
                  Contacts
                </TabsTrigger>
                <TabsTrigger value="author" className="flex items-center gap-2 px-4 rounded-full shadow-none transition-all text-neutral-700 data-[state=active]:bg-neutral-900/10 data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm">
                  <PenTool className="w-4 h-4" />
                  Author
                </TabsTrigger>
                {/* Hidden Search Tab Trigger for state management */}
                <TabsTrigger value="search" className="hidden">Search</TabsTrigger>
              </TabsList>

              <div className="w-px h-5 mx-1 bg-neutral-300" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTempSearchQuery(''); // Clear input for fresh search
                  setIsSearchOpen(true);
                }}
                className="h-8 px-3 text-sm rounded-full gap-2 text-neutral-700 hover:bg-neutral-900/10 hover:text-neutral-900"
                title="Search"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </div>


          <TabsContent value="home" className="outline-none">
            <FloatingDecorations />
            <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
              <HeroSection onExploreClick={() => setActiveTab('photos')} onContactsClick={() => setActiveTab('contacts')} />
              <MemoriesShowcase onViewAllClick={() => setActiveTab('photos')} />

              {/* Photo Stack Interactive Section */}
              <ScrollAnimation>
                <section className="relative py-10 sm:py-16 px-4 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-background via-stone-100/30 to-background dark:via-stone-900/20" />

                  <div className="relative max-w-4xl mx-auto">
                    <div className="text-center mb-8 sm:mb-10">
                      <span className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium">✧ Interactive Memory ✧</span>
                      <h3 className="text-xl sm:text-2xl font-serif text-foreground mt-2">
                        <span className="hidden sm:inline">Hover</span>
                        <span className="sm:hidden">Tap</span>
                        {' '}to Explore
                      </h3>
                    </div>

                    {/* Desktop: Two stacks with center quote */}
                    <div className="hidden sm:flex justify-center items-center gap-16">
                      <PolaroidStack className="transform -rotate-3 hover:rotate-0 transition-transform duration-500" />
                      <div className="text-center px-6">
                        <div className="text-6xl mb-3">📸</div>
                        <p className="text-sm text-muted-foreground font-handwriting italic">
                          &ldquo;Every photo tells<br />a story of friendship&rdquo;
                        </p>
                      </div>
                      <PolaroidStack className="transform rotate-3 hover:rotate-0 transition-transform duration-500" />
                    </div>

                    {/* Mobile: Single centered stack */}
                    <div className="flex sm:hidden flex-col items-center gap-6">
                      <PolaroidStack />
                      <p className="text-xs text-muted-foreground font-handwriting italic text-center">
                        &ldquo;Every photo tells a story of friendship&rdquo;
                      </p>
                    </div>
                  </div>
                </section>
              </ScrollAnimation>

              <YearsCounter />

              <MemoryTimeline />
              <FriendQuotes />
              <BatchStatsFooter />
            </div>
          </TabsContent>

          <TabsContent value="photos" className="outline-none pt-20">
            <div className="space-y-6">
              <div className="text-center space-y-3 mb-12">
                <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Memories</span>
                <h2 className="text-4xl md:text-5xl font-serif font-normal tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 italic">
                  Photo Gallery
                </h2>
                <p className="text-muted-foreground/80 font-light text-lg tracking-wide mx-auto leading-relaxed">
                  Capturing the timeless moments of our journey together
                </p>
              </div>
              {/* Only pass global searchQuery if we are NOT in search specific tab (this is photos tab) - actually here we can just pass '' or handle search globally. 
                  But user wants dedicated page. So 'Photos' tab should probably show ALL photos unless filtered?
                  Actually, usually 'Photos' tab has its own search or uses global. 
                  Let's keep Photos tab showing ALL (searchQuery='') to differentiate.
              */}
              <PhotoGallery lockedType="photo" searchQuery="" />
            </div>
          </TabsContent>

          <TabsContent value="videos" className="outline-none pt-20">
            <div className="space-y-6">
              <div className="text-center space-y-3 mb-12">
                <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Motion</span>
                <h2 className="text-4xl md:text-5xl font-serif font-normal tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 italic">
                  Video Gallery
                </h2>
                <p className="text-muted-foreground/80 font-light text-lg tracking-wide max-w-md mx-auto leading-relaxed">
                  Watch memorable moments and events unfold
                </p>
              </div>
              <PhotoGallery lockedType="video" searchQuery="" />
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="outline-none pt-20">
            <div className="space-y-6">
              <div className="text-center space-y-3 mb-12">
                <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Directory</span>
                <h2 className="text-4xl md:text-5xl font-serif font-normal tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 italic">
                  Faces of Our Journey
                </h2>
                <p className="text-muted-foreground/80 font-light text-lg tracking-wide mx-auto leading-relaxed">
                  The friends who turned moments into memories and strangers into family
                </p>
              </div>

              {/* Loading State */}
              {isLoadingContacts && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading contacts...</p>
                </div>
              )}

              {/* Error State */}
              {!isLoadingContacts && contactsError && (
                <div className="text-center py-12">
                  <p className="text-destructive mb-2">Failed to load contacts</p>
                  <p className="text-sm text-muted-foreground mb-4">{contactsError}</p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Contacts List - Show ALL here, search is separate now */}
              {!isLoadingContacts && !contactsError && (
                <ContactDirectory contacts={displayedContacts} />
              )}
            </div>
          </TabsContent>

          {/* NEW SEARCH RESULTS TAB */}
          <TabsContent value="search" className="outline-none pt-20">
            <div className="space-y-12">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Search Results</h2>
                <p className="text-muted-foreground">
                  found matching "{searchQuery}"
                </p>
              </div>

              {/* 1. Contact Results */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Friends ({filteredContacts.length})</h3>
                {!isLoadingContacts && (
                  <ContactDirectory
                    key={searchQuery} // Force remount on search change to ensure UI updates
                    contacts={filteredContacts}
                    showCount={false}
                  />
                )}
              </div>

              {/* 2. Media Results */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Photos & Videos</h3>
                {/* Pass the global searchQuery here to filter the PhotoGallery */}
                <PhotoGallery searchQuery={searchQuery} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="author" className="outline-none pt-20">
            <AuthorTab />
          </TabsContent>
        </main>

        <BackToTop />

        {/* Floating Mobile Bottom Navigation Dock */}
        <div
          className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 sm:hidden max-w-md flex justify-center 
            ${isScrollingDown
              ? 'bottom-0 w-full rounded-none'
              : 'bottom-6 w-[90%] rounded-[18px]'
            }`}
        >
          <div
            className={`bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border/50 shadow-2xl p-1 flex items-center justify-between gap-1 w-full
              ${isScrollingDown
                ? 'rounded-none border-x-0 border-b-0'
                : 'rounded-[18px]'
              }`}
          >
            <TabsList className="bg-transparent h-auto p-0 flex-1 flex w-full justify-start overflow-x-auto gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <TabsTrigger
                value="home"
                className="flex-col gap-1 h-auto py-2 px-3 min-w-[60px] rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all"
              >
                <HomeIcon className="w-5 h-5" />
                <span className="text-[10px] font-medium">Home</span>
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className="flex-col gap-1 h-auto py-2 px-3 min-w-[60px] rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all"
              >
                <Images className="w-5 h-5" />
                <span className="text-[10px] font-medium">Photos</span>
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="flex-col gap-1 h-auto py-2 px-3 min-w-[60px] rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all"
              >
                <Video className="w-5 h-5" />
                <span className="text-[10px] font-medium">Videos</span>
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="flex-col gap-1 h-auto py-2 px-3 min-w-[60px] rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all"
              >
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-medium">Contacts</span>
              </TabsTrigger>
              {/* If active tab is search, show it as selected, otherwise Author. Or just keep Author. 
                  Maybe replace Author with Search if Search is active? 
                  For now let's keep Author and access Search via the floating button. */}
              <TabsTrigger
                value="author"
                className="flex-col gap-1 h-auto py-2 px-3 min-w-[60px] rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all"
              >
                <PenTool className="w-5 h-5" />
                <span className="text-[10px] font-medium">Author</span>
              </TabsTrigger>
            </TabsList>

            <div className="w-px h-8 bg-border/50 mx-1" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setTempSearchQuery('');
                setIsSearchOpen(true);
              }}
              className="flex-col gap-1 h-auto py-2 px-3 rounded-2xl hover:bg-muted text-muted-foreground w-auto"
            >
              <Search className="w-5 h-5" />
              <span className="text-[10px] font-medium">Search</span>
            </Button>
          </div>
        </div>
      </Tabs>


    </div>
  );
}
