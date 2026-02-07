import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const API_KEY = process.env.GOOGLE_API_KEY;
        const FOLDER_ID = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID || process.env.GOOGLE_DRIVE_FOLDER_ID;

        const maskedKey = API_KEY ? `${API_KEY.substring(0, 5)}...` : 'MISSING';
        console.log(`[API] Configuration - Key: ${maskedKey}, Folder: ${FOLDER_ID}`);

        if (!API_KEY || !FOLDER_ID) {
            console.error('[API] Error: Missing Google Drive credentials');
            return NextResponse.json(
                { error: 'Server configuration error: Missing Google Drive credentials' },
                { status: 500 }
            );
        }

        // Prepare fields to fetch
        const fields = 'nextPageToken, files(id, name, mimeType, webContentLink, webViewLink, thumbnailLink, appProperties, createdTime, size, imageMediaMetadata, videoMediaMetadata)';
        const query = `'${FOLDER_ID}' in parents and trashed = false`;

        // Added supportsAllDrives & includeItemsFromAllDrives just in case it's a shared/team drive
        const baseUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&key=${API_KEY}&pageSize=100&orderBy=createdTime desc&supportsAllDrives=true&includeItemsFromAllDrives=true`;

        console.log(`[API] Fetching photos from Drive folder: ${FOLDER_ID}`);

        let allFiles: any[] = [];
        let pageToken = '';

        do {
            const url = `${baseUrl}${pageToken ? `&pageToken=${pageToken}` : ''}`;

            const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[API] Google Drive API Error (${response.status}):`, errorText);
                return NextResponse.json(
                    { error: `Google Drive API Error: ${response.status} ${response.statusText}` },
                    { status: response.status }
                );
            }

            const data = await response.json();
            if (data.error) {
                console.error('[API] JSON Data Error:', data.error);
                throw new Error(data.error.message);
            }

            if (data.files) {
                console.log(`[API] Page fetched. Found ${data.files.length} files.`);
                allFiles = [...allFiles, ...data.files];
            } else {
                console.log('[API] No files found in this page response.');
            }

            pageToken = data.nextPageToken || '';
        } while (pageToken);

        console.log(`[API] Total files fetched successfully: ${allFiles.length}`);

        if (allFiles.length === 0) {
            return NextResponse.json({ files: [] });
        }

        const data = { files: allFiles }; // Shim for compatibility with rest of the code

        if (!data.files) {
            return NextResponse.json({ files: [] });
        }

        // Transform to our Photo interface
        const files = data.files
            // Filter primarily for images and videos just in case
            // (Though client side filtering also exists, good to be clean here)
            .filter((file: any) => file.mimeType.startsWith('image/') || file.mimeType.startsWith('video/'))
            .map((file: any) => {
                const isVideo = file.mimeType.startsWith('video/');

                // High-res thumbnail hack: replace =s220 (default) with larger size if thumbnailLink exists
                // Google Drive thumbnail links often end with something like "=s220"
                let fullResThumbnail = file.thumbnailLink;
                if (fullResThumbnail && fullResThumbnail.includes('=s')) {
                    // Request a larger size, e.g., 1200px
                    fullResThumbnail = fullResThumbnail.replace(/=s\d+/, '=s1200');
                }

                return {
                    id: file.id,
                    name: file.name,
                    webContentLink: file.webContentLink,
                    thumbnailLink: fullResThumbnail || file.webContentLink,
                    type: isVideo ? 'video' : 'photo',
                    mimeType: file.mimeType,
                    createdTime: file.createdTime,
                    size: file.size ? parseInt(file.size) : 0,
                    width: isVideo ? file.videoMediaMetadata?.width : file.imageMediaMetadata?.width,
                    height: isVideo ? file.videoMediaMetadata?.height : file.imageMediaMetadata?.height,
                    videoDuration: file.videoMediaMetadata?.durationMillis
                        ? `${Math.round(parseInt(file.videoMediaMetadata.durationMillis) / 1000)}s`
                        : undefined
                };
            });

        return NextResponse.json({ files });

    } catch (error) {
        console.error('[API] Unexpected error fetching photos:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
