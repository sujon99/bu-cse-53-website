# University Friend Photos

A digital memory gallery for university friends, featuring a premium UI, mobile-optimized navigation, and Google Drive integration.

## Prerequisites
- Node.js (v18 or newer recommended)
- npm or pnpm or yarn

## Installation

1. Clone the repository (if applicable) or navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

## Configuration

Before running the app, you must set up your environment variables (Google Drive API).
Please refer to [SETUP.md](./SETUP.md) for detailed instructions on obtaining your API Key and Folder ID.

Create a `.env.local` file in the root directory and add:
```env
GOOGLE_API_KEY=your_api_key_here
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
```

## Running the App

To start the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) to view the application.

## Building for Production

To create a production build:
```bash
npm run build
npm start
```
