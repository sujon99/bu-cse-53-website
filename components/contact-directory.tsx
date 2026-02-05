'use client';

import React from 'react';
import { ContactCard } from './contact-card';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  facebook?: string;
  imageUrl?: string;
  bloodGroup?: string;
  whatsapp?: string;
  linkedin?: string;
  imageUrls?: string[];
  city?: string;
}

interface ContactDirectoryProps {
  contacts: Contact[];
}

export function ContactDirectory({ contacts }: ContactDirectoryProps) {
  return (
    <div className="w-full">
      {/* Results Count */}
      <div className="mb-6 text-sm text-muted-foreground">
        {contacts.length === 0
          ? 'No contacts found'
          : `${contacts.length} contact${contacts.length !== 1 ? 's' : ''} found`}
      </div>

      {/* Contacts Grid */}
      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No contacts match your search</p>
          <p className="text-sm text-muted-foreground">Try searching with different keywords</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
}
