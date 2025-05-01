# **App Name**: Melody Hub

## Core Features:

- Trending Music Display: Display a grid of manually selected trending songs with thumbnails, artist names, and play buttons on the home page.
- Artist Listing and Navigation: List all artists with cards that navigate to a dedicated page showing only their songs.
- Global Audio Player with Song Details: Display all available songs from all artists with details (title, artist) and a play button in a global persistent audio player at the bottom.

## Style Guidelines:

- Primary color: Neutral background (e.g., #f9fafb) for a clean look.
- Secondary color: Dark gray (#374151) for text and important elements.
- Accent: Teal (#14b8a6) for play buttons, seek bar, and interactive elements.
- Use a grid layout for the Home page to display trending music.
- Employ a list layout for the Artists and Songs pages.
- Use simple, consistent icons for play/pause, navigation, and other controls.
- Subtle transitions and animations for a smooth user experience when navigating pages.

## Original User Request:
Build a React-based music player app with three main pages: Home, Artists, and Songs. The app should use local .mp3 audio files stored in src/app/songs/{artistName}/song.mp3. The navigation should include:

Home Page: Display a grid of trending music (manually selected songs with thumbnails, artist names, and play buttons).

Artists Page: Show a list of artists (e.g., Mitraz, Narci). Each artist card navigates to a page showing only their songs.

Songs Page: List all available songs from all artists with details (title, artist, duration if possible) and a play button.

Add a global persistent audio player at the bottom that displays the current track, play/pause, and seek bar. Use React Router for navigation and manage audio state using context or hooks. Style with Tailwind CSS. The project should dynamically read the audio files and associate them with their artist. Include dummy thumbnails or cover images.
  