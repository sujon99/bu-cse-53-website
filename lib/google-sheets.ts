import type { Contact } from '@/components/contact-directory';

const GOOGLE_SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;

/**
 * Fetches contacts from Google Sheets public JSON endpoint
 * The sheet must be shared with "Anyone with the link can view"
 */
export async function fetchContactsFromSheet(): Promise<Contact[]> {
    if (!GOOGLE_SHEET_ID) {
        console.error('NEXT_PUBLIC_GOOGLE_SHEET_ID is not configured');
        return [];
    }

    // Google Sheets public query endpoint
    const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json`;

    try {
        const response = await fetch(url, {
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch sheet: ${response.status}`);
        }

        const text = await response.text();

        // Google returns JSONP-like format: google.visualization.Query.setResponse({...})
        // We need to extract the JSON part
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?$/);

        if (!jsonMatch || !jsonMatch[1]) {
            throw new Error('Invalid response format from Google Sheets');
        }

        const data = JSON.parse(jsonMatch[1]);
        return parseSheetData(data);
    } catch (error) {
        console.error('Error fetching contacts from Google Sheets:', error);
        throw error;
    }
}

/**
 * Parses Google Sheets data and transforms it to Contact array
 * 
 * Expected columns:
 * A - Name
 * B - Phone
 * C - Email
 * D - Image URL (multiple URLs separated by |)
 * E - Blood Group
 * F - Facebook Profile
 * G - LinkedIn Profile
 * H - WhatsApp Number
 * I - City (current location)
 */
function parseSheetData(data: GoogleSheetsResponse): Contact[] {
    const rows = data.table?.rows || [];
    const contacts: Contact[] = [];

    rows.forEach((row, index) => {
        const cells = row.c || [];

        // Get cell value safely
        const getValue = (cellIndex: number): string => {
            const cell = cells[cellIndex];
            return cell?.v?.toString()?.trim() || '';
        };

        const name = getValue(0);
        const phone = getValue(1);
        const email = getValue(2);
        const imageUrlRaw = getValue(3);
        const bloodGroup = getValue(4);
        const facebook = getValue(5);
        const linkedin = getValue(6);
        const whatsapp = getValue(7);
        const city = getValue(8);

        // Skip rows without a name (likely empty or header row)
        if (!name) return;

        // Parse image URLs - split by | for multiple images
        const imageUrls = imageUrlRaw
            ? imageUrlRaw.split('|').map(url => url.trim()).filter(url => url.length > 0)
            : [];

        const contact: Contact = {
            id: `contact-${index + 1}`,
            name,
            email: email || '',
            phone: phone || '',
            imageUrl: imageUrls[0] || undefined,
            imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
            bloodGroup: bloodGroup || undefined,
            facebook: facebook || undefined,
            linkedin: linkedin || undefined,
            whatsapp: whatsapp || undefined,
            city: city || undefined,
        };

        contacts.push(contact);
    });

    return contacts;
}

// Type definitions for Google Sheets response
interface GoogleSheetsResponse {
    table?: {
        cols?: Array<{ label: string; type: string }>;
        rows?: Array<{
            c?: Array<{ v?: string | number | null; f?: string } | null>;
        }>;
    };
}
