import { NextRequest, NextResponse } from 'next/server';

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  createdTime: string;
  size?: string;
  imageMediaMetadata?: {
    width?: number;
    height?: number;
  };
  videoMediaMetadata?: {
    width?: number;
    height?: number;
    durationMillis?: string;
  };
}

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

// Rate limiting helper
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function GET(request: NextRequest) {
  try {
    // Security: Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Security: Validate origin (prevent CORS abuse)
    const origin = request.headers.get('origin');
    if (origin && !origin.includes(process.env.VERCEL_URL || 'localhost')) {
      console.warn('[v0] Unauthorized origin:', origin);
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    const googleDriveFolderId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!googleDriveFolderId) {
      return NextResponse.json(
        { error: 'Google Drive folder ID not configured.' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google API key not configured.' },
        { status: 400 }
      );
    }

    // Fetch both images and videos
    // Added fields: size, imageMediaMetadata, videoMediaMetadata
    const imageQuery = `'${googleDriveFolderId}' in parents and mimeType contains 'image/' and trashed=false`;
    const videoQuery = `'${googleDriveFolderId}' in parents and (mimeType contains 'video/' or mimeType='application/vnd.google-apps.video') and trashed=false`;

    const fields = 'files(id,name,mimeType,webContentLink,thumbnailLink,createdTime,size,imageMediaMetadata,videoMediaMetadata)';
    const imageUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(imageQuery)}&key=${apiKey}&fields=${fields}&pageSize=1000`;
    const videoUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(videoQuery)}&key=${apiKey}&fields=${fields}&pageSize=1000`;

    console.log('[v0] Fetching from Google Drive folder:', googleDriveFolderId);

    const [imageResponse, videoResponse] = await Promise.all([
      fetch(imageUrl),
      fetch(videoUrl),
    ]);

    if (!imageResponse.ok && !videoResponse.ok) {
      const errorData = await imageResponse.json();
      console.error('[v0] Google Drive API error:', errorData);

      if (imageResponse.status === 403) {
        return NextResponse.json(
          {
            error: 'Access Denied: Make sure (1) your folder is publicly shared, (2) your Google API key has "Google Drive API" enabled, and (3) the folder ID is correct.',
          },
          { status: 403 }
        );
      } else if (imageResponse.status === 404) {
        return NextResponse.json(
          { error: 'Folder Not Found: Please verify your NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID is correct.' },
          { status: 404 }
        );
      }
    }

    let allFiles: Photo[] = [];

    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      const fetchedPhotos: Photo[] = (imageData.files || []).map((file: GoogleDriveFile) => ({
        id: file.id,
        name: file.name,
        // Use high-resolution preview URL for viewer (3840px width = 4K)
        webContentLink: `https://lh3.googleusercontent.com/d/${file.id}=w3840`,
        // Use larger thumbnail (w720) for optimal performance/quality balance
        thumbnailLink: `https://lh3.googleusercontent.com/d/${file.id}=w720`,
        type: 'photo' as const,
        mimeType: file.mimeType,
        createdTime: file.createdTime,
        size: file.size ? parseInt(file.size, 10) : 0,
        width: file.imageMediaMetadata?.width,
        height: file.imageMediaMetadata?.height,
      }));
      allFiles = allFiles.concat(fetchedPhotos);
    }

    if (videoResponse.ok) {
      const videoData = await videoResponse.json();
      const fetchedVideos: Photo[] = (videoData.files || []).map((file: GoogleDriveFile) => ({
        id: file.id,
        name: file.name,
        // For videos, use embedded viewer URL
        webContentLink: `https://drive.google.com/file/d/${file.id}/preview`,
        // Larger thumbnail for videos too
        thumbnailLink: `https://lh3.googleusercontent.com/d/${file.id}=w720`,
        type: 'video' as const,
        mimeType: file.mimeType,
        createdTime: file.createdTime,
        size: file.size ? parseInt(file.size, 10) : 0,
        width: file.videoMediaMetadata?.width,
        height: file.videoMediaMetadata?.height,
        videoDuration: file.videoMediaMetadata?.durationMillis,
      }));
      allFiles = allFiles.concat(fetchedVideos);
    }

    if (allFiles.length === 0) {
      return NextResponse.json(
        { error: 'No images or videos found in the shared folder. Make sure the folder contains media files.' },
        { status: 400 }
      );
    }

    console.log('[v0] Google Drive response: Found', allFiles.length, 'files');
    return NextResponse.json(
      { files: allFiles },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('[v0] Unexpected error:', error);
    return NextResponse.json(
      { error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
