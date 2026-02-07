'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ContactCard } from './contact-card';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

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
  designation?: string;
  company?: string;
  role?: 'author' | 'cr';
}

interface ContactDirectoryProps {
  contacts: Contact[];
  showCount?: boolean;
}

export function ContactDirectory({ contacts, showCount = true }: ContactDirectoryProps) {
  const sortedContacts = React.useMemo(() => {
    // Separate special contacts
    const author = contacts.find(c => c.name === "MD. Sujon Sarder");
    const cr = contacts.find(c => c.name === "Shariful Islam");

    // Filter out special contacts from the rest
    let otherContacts = contacts.filter(c =>
      c.name !== "MD. Sujon Sarder" && c.name !== "Shariful Islam"
    );

    // Fisher-Yates shuffle for the rest
    // Create a copy to sort/shuffle
    const shuffled = [...otherContacts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Assign roles and combine
    const processed: Contact[] = [];

    if (author) processed.push({ ...author, role: 'author' });
    if (cr) processed.push({ ...cr, role: 'cr' });
    processed.push(...shuffled);

    return processed;
  }, [contacts]);

  return (
    <div className="w-full">
      {/* Results Count */}
      {showCount && (
        <div className="mb-6 text-sm text-muted-foreground">
          {contacts.length === 0
            ? 'No contacts found'
            : `${contacts.length} contact${contacts.length !== 1 ? 's' : ''} found`}
        </div>
      )}

      {/* Contacts Grid */}
      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No contacts match your search</p>
          <p className="text-sm text-muted-foreground">Try searching with different keywords</p>
        </div>
      ) : sortedContacts.length === 0 ? (
        // Loading state while sorting/shuffling happens client-side
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0">
          {contacts.map((contact) => (
            <div key={contact.id} className="h-64" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {sortedContacts.map((contact) => (
            <motion.div key={contact.id} variants={itemVariants}>
              <ContactCard contact={contact} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
