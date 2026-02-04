import { NextResponse } from 'next/server';
import { fetchContactsFromSheet } from '@/lib/google-sheets';

interface StatsResponse {
    success: boolean;
    stats: {
        totalFriends: number;
        totalPhotos: number;
        totalVideos: number;
        cities: string[];
        uniqueCitiesCount: number;
    };
    error?: string;
}

export async function GET() {
    try {
        // Fetch contacts for friend count and cities
        const contacts = await fetchContactsFromSheet();

        // Extract unique cities (filter out empty values)
        const cities = contacts
            .map(c => c.city)
            .filter((city): city is string => !!city && city.trim() !== '')
            .map(city => city.trim());

        const uniqueCities = [...new Set(cities)];

        // Fetch photos API to get counts
        // We use internal fetch with absolute URL construction
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';

        let totalPhotos = 0;
        let totalVideos = 0;

        try {
            const photosResponse = await fetch(`${baseUrl}/api/photos`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (photosResponse.ok) {
                const photosData = await photosResponse.json();
                const files = photosData.files || [];
                totalPhotos = files.filter((f: { type: string }) => f.type === 'photo').length;
                totalVideos = files.filter((f: { type: string }) => f.type === 'video').length;
            }
        } catch (photoError) {
            console.error('Error fetching photos for stats:', photoError);
            // Continue with 0 counts if photos API fails
        }

        const response: StatsResponse = {
            success: true,
            stats: {
                totalFriends: contacts.length,
                totalPhotos,
                totalVideos,
                cities: uniqueCities,
                uniqueCitiesCount: uniqueCities.length,
            },
        };

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, max-age=120, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Stats API Error:', error);

        return NextResponse.json(
            {
                success: false,
                stats: {
                    totalFriends: 0,
                    totalPhotos: 0,
                    totalVideos: 0,
                    cities: [],
                    uniqueCitiesCount: 0,
                },
                error: 'Failed to fetch stats',
            },
            { status: 500 }
        );
    }
}

// Enable caching for 2 minutes
export const revalidate = 120;
