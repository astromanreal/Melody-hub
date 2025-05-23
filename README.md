# 🎵 Melody Hub – Personal Music Streamer

**Melody Hub** is a modern, local-first music streaming app built with Next.js. It allows users to browse, play, and organize their own MP3/M4A music library directly from the browser — complete with metadata extraction, artist pages, album views, and persistent audio playback.

---

## ✨ Features

- 🎧 **Local Music Playback**: Stream `.mp3` and `.m4a` files stored on your local server.
- 👨‍🎤 **Artist Pages**: Dynamically generated from folder names, with profile cards and song lists.
- 💿 **Album View**: Browse albums defined in `albums.json`, with external streaming links.
- 📃 **All Songs View**: View and play all detected songs in your collection.
- 🔥 **Trending Songs**: Daily shuffled list showing up to 3 random songs per artist.
- ▶️ **Mini Audio Player**: Sticky bottom-right audio player that expands on hover with full controls.
- 🎶 **Playlists & Queues**: Auto-queue all songs in a view when one is played.
- 🔀 **Play All Button**: Available from the homepage, artists, or trending sections to shuffle and play all.
- 🖼️ **Metadata Extraction**: Uses `music-metadata` to extract title, artist, album, cover art, and duration.
- 🌙 **Dark/Light Theme**: Auto-detected system theme with user override via navbar.
- 📱 **Responsive UI**: Clean mobile-first design using Tailwind and Shadcn UI.
- ⚙️ **Settings Page**: Basic settings view + social links.

---

## 🛠 Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Audio Metadata**: [music-metadata](https://github.com/Borewit/music-metadata-browser)
- **State Management**: React Context API
- **Theme Toggling**: [next-themes](https://github.com/pacocoursey/next-themes)

---
