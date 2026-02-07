# University Memories Gallery

A nostalgic, interactive web application designed to showcase and cherish university memories. This project serves as a digital scrapbook, featuring a photo and video gallery, a searchable contact directory of friends, a timeline of key events, and a collection of funny conversation moments.

## Features

### 📸 Interactive Photo & Video Gallery
- **Unified Media Grid**: Seamlessly view photos and videos in a responsive masonry layout that adapts to mobile (1 col), tablet (2 cols), and desktop (3 cols).
- **Smart Filtering**: Filter memories by type (Photos only, Videos only) or view all at once.
- **Search Integration**: Real-time search to find specific memories by name or event.
- **Immersive Lightbox**:
    - **Photos**: Full-screen viewer with zoom, pan, and smooth navigation controls.
    - **Videos**: Dedicated video player with playback controls and distraction-free viewing.
- **Lazy Loading**: Optimized performance with progressive image loading and skeleton states.

### 👥 Searchable Contact Directory
- **Comprehensive Profiles**: Detailed contact cards displaying name, photo, blood group, contact info, and social links.
- **Advanced Search**: Instantly find batchmates by:
    - Name
    - City / Hometown
    - Blood Group
    - Company / Designation
- **Special Roles**: Distinct visual indicators for special roles like "CR" (Class Representative) and "Author".
- **Interactive UI**: Smooth card animations and hover effects using Framer Motion.

### ⏳ Memory Timeline
- **Chronological Journey**: A vertical, interactive timeline capturing milestones from 2019 to 2026.
- **Visual Storytelling**: Each timeline event features a rotating polaroid-style card with a description and date.
- **Image Carousels**: Swipeable (touch-enabled) image sliders within timeline cards to view multiple photos per event.
- **Aesthetic Design**: Vintage paper textures, tape effects, and smooth scroll-triggered animations.

### 💬 Conversation Moments
- **Chat Highlights**: curated collection of funny and memorable group chat snippets.
- **Message Playback**: Animated message bubbles that mimic a real chat interface.
- **Random Discovery**: "Shuffle" button to discover random funny moments from the archives.
- **Auto-Theme**: Dynamic coloring for user avatars and message bubbles based on sender names.

### ✨ Dynamic User Experience
- **Interactive Home Page**: Draggable polaroid stacks and floating decorations.
- **Glassmorphism**: Modern UI with frosted glass effects, blurred backdrops, and subtle gradients.
- **Smooth Transitions**: shared layout animations (AnimatePresence) for seamless tab switching.
- **Responsive Navigation**: Mobile-friendly bottom dock and desktop top-bar navigation.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Primitives**: [Radix UI](https://www.radix-ui.com/) (Dialogs, Tabs, ScrollArea)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Source**: JSON-based static data for fast, reliable content delivery.

## Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open your browser**:
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## Project Structure

- **`/app`**: Next.js App Router pages and layouts.
- **`/components`**: Reusable UI components.
    - `photo-gallery.tsx`: Main gallery logic.
    - `contact-directory.tsx`: Friend search and list.
    - `memory-timeline.tsx`: Event visualization.
    - `conversations/`: Chat viewer components.
- **`/data`**: JSON files containing static data (conversations, contacts).
- **`/public`**: Static assets like images and icons.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Runs the built production application.
- `npm run lint`: Runs ESLint to check for code quality issues.
