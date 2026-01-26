# Deploying to Vercel

This guide outlines the steps to deploy your Next.js application to Vercel. The recommended approach is using the GitHub integration for automatic deployments.

## Prerequisites

1.  **Vercel Account:** [Sign up here](https://vercel.com/signup).
2.  **GitHub Repository:** Ensure your project is pushed to a GitHub repository.

## Option 1: Deploy via GitHub (Recommended)

1.  **Push your code to GitHub:**
    If you haven't already, push your local code to a new repository on GitHub.

2.  **Import Project in Vercel:**
    *   Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **"Add New..."** -> **"Project"**.
    *   Select "Import" next to your GitHub repository.

3.  **Configure Project:**
    *   **Framework Preset:** Next.js (should be auto-detected).
    *   **Root Directory:** `./` (default).

4.  **Environment Variables:**
    *   Expand the **"Environment Variables"** section.
    *   Add the following variables based on your `.env.example` file:

    | Key | Value |
    | :--- | :--- |
    | `NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID` | `Your Drive Folder ID` |
    | `GOOGLE_API_KEY` | `Your Google API Key` |

    > [!IMPORTANT]
    > You must provide valid values for these variables. The values in `.env.example` might be placeholders or specific to a dev environment. Ensure you use the correct production keys.

5.  **Deploy:**
    *   Click **"Deploy"**.
    *   Wait for the build to complete.
    *   Once finished, you will get a production URL (e.g., `https://your-project.vercel.app`).

## Option 2: Deploy via CLI

1.  **Install Vercel CLI:**
    ```bash
    npm i -g vercel
    ```

2.  **Login:**
    ```bash
    vercel login
    ```

3.  **Deploy:**
    Run the following command in your project root:
    ```bash
    vercel
    ```
    *   Follow the interactive prompts.
    *   When asked about settings, you can mostly accept defaults.
    *   You will be asked to set up environment variables in the CLI or dashboard.

## Verification

After deployment, open your Vercel URL and check:
1.  **Public Access:** Is the site loading?
2.  **Photo Loading:** Are photos loading from Google Drive? (This verifies `GOOGLE_API_KEY` and `NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID`).
3.  **Console Errors:** Check the browser console (F12) for any specific errors if things aren't working.
