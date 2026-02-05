
export interface Photo {
    id: string;
    name: string;
    webContentLink: string;
    thumbnailLink: string;
    type: 'photo' | 'video';
    mimeType: string;
    createdTime: string;
    size: number;
    width?: number;
    height?: number;
    videoDuration?: string;
}

export async function fetchPhotosFromDrive(): Promise<{ files: Photo[], error?: string }> {
    try {
        const API_KEY = process.env.GOOGLE_API_KEY;
        const FOLDER_ID = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID || process.env.GOOGLE_DRIVE_FOLDER_ID;

        if (!API_KEY || !FOLDER_ID) {
            console.error('Missing Google Drive configuration');
            return { error: 'Server configuration error: Missing Google Drive credentials', files: [] };
        }

        const fields = 'nextPageToken, files(id, name, mimeType, webContentLink, webViewLink, thumbnailLink, appProperties, createdTime, size, imageMediaMetadata, videoMediaMetadata)';
        const query = `'${FOLDER_ID}' in parents and trashed = false`;
        const baseUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&key=${API_KEY}&pageSize=100&orderBy=createdTime desc`;

        console.log(`[Lib] Fetching photos from Drive folder: ${FOLDER_ID}`);

        let allFiles: any[] = [];
        let pageToken = '';

        do {
            const url = `${baseUrl}${pageToken ? `&pageToken=${pageToken}` : ''}`;
            const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

            if (!response.ok) {
                const errorData = await response.json();
                console.error('[Lib] Google Drive API Error:', errorData);
                // Continue but just return what we have or error? 
                // Better to return error if the first page fails, but maybe partial if later pages fail?
                // For simplicity, let's treat any failure as critical if we have no files.
                if (allFiles.length === 0) {
                    return { error: `Google Drive API Error: ${errorData.error?.message || response.statusText}`, files: [] };
                }
                break;
            }

            const data = await response.json();
            if (data.files) {
                allFiles = [...allFiles, ...data.files];
            }

            pageToken = data.nextPageToken || '';
        } while (pageToken);

        console.log(`[Lib] Total files fetched: ${allFiles.length}`);

        // Transform to our Photo interface
        const photos: Photo[] = allFiles
            .filter((file: any) => file.mimeType.startsWith('image/') || file.mimeType.startsWith('video/'))
            .map((file: any) => {
                const isVideo = file.mimeType.startsWith('video/');

                // High-res thumbnail hack
                let fullResThumbnail = file.thumbnailLink;
                if (fullResThumbnail && fullResThumbnail.includes('=s')) {
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

        return { files: photos };

    } catch (error) {
        console.error('[Lib] Unexpected error fetching photos:', error);
        return { error: 'Internal Server Error', files: [] };
    }
}
