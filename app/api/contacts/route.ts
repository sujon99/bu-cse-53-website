import { NextResponse } from 'next/server';
import { fetchContactsFromSheet } from '@/lib/google-sheets';

export async function GET() {
    try {
        const contacts = await fetchContactsFromSheet();

        return NextResponse.json({
            success: true,
            contacts,
            count: contacts.length,
        });
    } catch (error) {
        console.error('API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch contacts from Google Sheets',
                contacts: [],
            },
            { status: 500 }
        );
    }
}

// Enable caching for 60 seconds
export const revalidate = 60;
