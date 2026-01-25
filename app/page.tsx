'use client';

import React, { useState, useEffect } from 'react';
import { PhotoGallery } from '@/components/photo-gallery';
import { ContactDirectory } from '@/components/contact-directory';
import type { Contact } from '@/components/contact-directory';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Images, Users, Search, X, Video } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { BackToTop } from '@/components/back-to-top';

// ... (keep lines 19-204 same roughly, just targeting imports and the specific render block)

// Re-targeting the replace for the render part specifically
// Imports line 9


// Sample contact data - replace with actual data source
const SAMPLE_CONTACTS: Contact[] = [
  // First contact - Always Fixed
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1-555-0101',
    whatsapp: '+15550101',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    facebook: 'https://facebook.com/sarahjohnson',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    imageUrls: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', // Self
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop', // Friend 1
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop'  // Friend 2 (Group)
    ],
    bloodGroup: 'A+',
  },
  // Rest - Randomized
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1-555-0102',
    whatsapp: '+15550102',
    linkedin: 'https://linkedin.com/in/michaelchen',
    facebook: 'https://facebook.com/michaelchen',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    imageUrls: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop',
    ],
    bloodGroup: 'O+',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    phone: '+1-555-0103',
    facebook: 'https://facebook.com/emilyrodriguez',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bloodGroup: 'B+',
  },
  {
    id: '4',
    name: 'James Morrison',
    email: 'james.morrison@example.com',
    phone: '+1-555-0104',
    whatsapp: '+15550104',
    linkedin: 'https://linkedin.com/in/jamesmorrison',
    facebook: 'https://facebook.com/jamesmorrison',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    imageUrls: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    ],
    bloodGroup: 'AB-',
  },
  {
    id: '5',
    name: 'Jessica Taylor',
    email: 'jessica.taylor@example.com',
    phone: '+1-555-0105',
    whatsapp: '+15550105',
    facebook: 'https://facebook.com/jessicataylor',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    bloodGroup: 'A-',
  },
  {
    id: '6',
    name: 'David Park',
    email: 'david.park@example.com',
    phone: '+1-555-0106',
    facebook: 'https://facebook.com/davidpark',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bloodGroup: 'O-',
  },
  {
    id: '7',
    name: 'Amanda White',
    email: 'amanda.white@example.com',
    phone: '+1-555-0107',
    whatsapp: '+15550107',
    facebook: 'https://facebook.com/amandawhite',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bloodGroup: 'B-',
  },
  {
    id: '8',
    name: 'Chris Anderson',
    email: 'chris.anderson@example.com',
    phone: '+1-555-0108',
    whatsapp: '+15550108',
    facebook: 'https://facebook.com/chrisanderson',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bloodGroup: 'AB+',
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('photos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  // State for contacts to handle shuffling
  const [displayedContacts, setDisplayedContacts] = useState<Contact[]>(SAMPLE_CONTACTS);

  // Randomize contacts on mount (except first one)
  useEffect(() => {
    // Keep first contact
    const firstContact = SAMPLE_CONTACTS[0];
    // Copy the rest
    const restContacts = [...SAMPLE_CONTACTS.slice(1)];

    // Fisher-Yates shuffle for the rest
    for (let i = restContacts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [restContacts[i], restContacts[j]] = [restContacts[j], restContacts[i]];
    }

    // Combine
    setDisplayedContacts([firstContact, ...restContacts]);
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
      (contact.bloodGroup && contact.bloodGroup.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="photos" value={activeTab} onValueChange={setActiveTab} className="w-full min-h-screen flex flex-col">
        {/* Search Dialog (Global) */}
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogContent className="sm:max-w-md top-[20%] translate-y-0">
            <DialogHeader>
              <DialogTitle>Search Memories</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input
                  placeholder="Search memories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="col-span-3"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs text-muted-foreground mr-1">Search by:</span>
              {['Name', 'Email', 'Phone', 'C_Whatsapp', 'Blood Group'].map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-full border border-border">
                  {tag.replace('C_Whatsapp', 'Whatsapp')} {/* Hack to allow display text but keeping key clean if needed */}
                </span>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Header */}
        <header className={`border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${isScrollingDown ? '-translate-y-full' : 'translate-y-0'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 text-center sm:text-center">
                <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-1 text-balance">
                  Bangladesh University Memories
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Cherished moments and connections with friends
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
          {/* Mobile-hidden top tabs */}
          <div className="flex items-center justify-center mb-8 hidden sm:flex">
            <div className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground gap-1">
              <TabsList className="bg-transparent p-0 h-auto">
                <TabsTrigger value="photos" className="flex items-center gap-2 px-4 shadow-none data-[state=active]:shadow-sm data-[state=active]:bg-background">
                  <Images className="w-4 h-4" />
                  Photos
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2 px-4 shadow-none data-[state=active]:shadow-sm data-[state=active]:bg-background">
                  <Video className="w-4 h-4" />
                  Videos
                </TabsTrigger>
                <TabsTrigger value="contacts" className="flex items-center gap-2 px-4 shadow-none data-[state=active]:shadow-sm data-[state=active]:bg-background">
                  <Users className="w-4 h-4" />
                  Contacts
                </TabsTrigger>
              </TabsList>

              <div className="w-px h-5 bg-border/20 mx-1" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="h-8 px-3 text-sm hover:bg-background/50 hover:text-foreground rounded-md gap-2"
                title="Search"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </div>


          <TabsContent value="photos" className="outline-none">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Photo Gallery</h2>
                <p className="text-muted-foreground">Browse our collection of cherished memories with university friends</p>
              </div>
              <PhotoGallery lockedType="photo" searchQuery={searchQuery} />
            </div>
          </TabsContent>

          <TabsContent value="videos" className="outline-none">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Video Gallery</h2>
                <p className="text-muted-foreground">Watch memorable moments and events</p>
              </div>
              <PhotoGallery lockedType="video" searchQuery={searchQuery} />
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="outline-none">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Friend Directory</h2>
                <p className="text-muted-foreground">Stay connected with your university batchmates</p>
              </div>
              <ContactDirectory contacts={filteredContacts} />
            </div>
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
            <TabsList className="bg-transparent h-auto p-0 flex-1 flex justify-around gap-1">
              <TabsTrigger
                value="photos"
                className="flex-col gap-1 h-auto py-2 px-3 rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all"
              >
                <Images className="w-5 h-5" />
                <span className="text-[10px] font-medium">Photos</span>
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="flex-col gap-1 h-auto py-2 px-3 rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all"
              >
                <Video className="w-5 h-5" />
                <span className="text-[10px] font-medium">Videos</span>
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="flex-col gap-1 h-auto py-2 px-3 rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all"
              >
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-medium">Contacts</span>
              </TabsTrigger>
            </TabsList>

            <div className="w-px h-8 bg-border/50 mx-1" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
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
