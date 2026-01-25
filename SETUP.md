# Setup Instructions

To display photos from Google Drive, you need to configure the Google Drive API.

1.  **Google Cloud Console**:
    *   Go to [Google Cloud Console](https://console.cloud.google.com).
    *   Create a new project or select an existing one.

2.  **Enable API**:
    *   Navigate to **APIs & Services > Library**.
    *   Search for **Google Drive API** and enable it.

3.  **Create Credentials**:
    *   Go to **APIs & Services > Credentials**.
    *   Click **Create Credentials** and select **API Key**.
    *   Copy the generated API Key.

4.  **Configure Environment**:
    *   Add the API Key to your `.env.local` file as `GOOGLE_API_KEY`.
    *   Add your Google Drive Folder ID as `GOOGLE_DRIVE_FOLDER_ID`.
        *   To get the Folder ID, open the folder in Google Drive and look at the URL: `https://drive.google.com/drive/folders/[FOLDER_ID]`.
    *   **Important**: Ensure the folder is shared publicly (Anyone with the link can view) so the API can access it.

## Troubleshooting
If you see a "Resource has been exhausted" error, you may have exceeded the daily quota for the Google Drive API. You can request a higher quota from the Google Cloud Console.
