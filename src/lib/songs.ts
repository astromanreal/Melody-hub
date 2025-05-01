'use server';

import type { Song } from '@/context/AudioContext';
import fs from 'fs/promises'; // Use static import for server-only module
import path from 'path'; // Use static import for server-only module
// Keep music-metadata dynamic for now, though static might also work in server context
// import * as mm from 'music-metadata';

// This function is now a Server Action and will only run on the server.
export async function getSongs(): Promise<Song[]> {
  // Dynamically import music-metadata as it might be large or have specific dependencies
  const mm = await import('music-metadata');

  console.log("Fetching songs from filesystem (server-side)..."); // Log when fetching
  const songsDirectory = path.join(process.cwd(), 'public', 'songs');
  let artists: string[] = [];

  try {
    // Check if the base songs directory exists
    await fs.access(songsDirectory);
    const entries = await fs.readdir(songsDirectory, { withFileTypes: true });
    artists = entries
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.warn(`Songs directory not found at ${songsDirectory}. Create 'public/songs/' and artist subdirectories with audio files. Returning empty list.`);
      return []; // Return empty array if the directory doesn't exist
    }
    console.error(`Error reading artists directory at ${songsDirectory}:`, error);
    return []; // Return empty list on other errors reading the base directory
  }

   if (artists.length === 0) {
     console.log(`No artist subdirectories found in ${songsDirectory}. Returning empty list.`);
     return [];
   }

  const allSongs: Song[] = [];
  const supportedExtensions = ['.mp3', '.m4a']; // Add .m4a

  for (const artist of artists) {
    const artistDirectory = path.join(songsDirectory, artist);
    let songFiles: import('fs').Dirent[] = []; // Use Dirent type

    try {
      songFiles = await fs.readdir(artistDirectory, { withFileTypes: true });
    } catch (error: any) {
        if (error.code === 'ENOENT') {
             console.warn(`Artist directory not found: ${artistDirectory}. Skipping.`);
        } else if (error.code === 'ENOTDIR'){
             console.warn(`Expected directory but found file: ${artistDirectory}. Skipping.`);
        } else {
            console.error(`Error reading songs directory for artist ${artist} (${artistDirectory}):`, error);
        }
      continue; // Skip this artist if reading its directory fails
    }

    for (const dirent of songFiles) {
      const fileExtension = path.extname(dirent.name).toLowerCase();
      // Process only files with supported extensions
      if (dirent.isFile() && supportedExtensions.includes(fileExtension)) {
        const file = dirent.name;
        const filePath = path.join(artistDirectory, file);
        // Ensure consistent URL encoding for web paths
        const webPath = `/songs/${encodeURIComponent(artist)}/${encodeURIComponent(file)}`;

        let title = path.basename(file, fileExtension).replace(/_/g, ' '); // Simple title extraction
        title = title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        let album: string | undefined = undefined; // Initialize album
        let duration: number | undefined = undefined;
        let thumbnailDataUri: string | undefined = undefined;

        try {
          // Parse metadata using music-metadata
          const metadata = await mm.parseFile(filePath, { duration: true });
          duration = metadata.format.duration;

          // Extract title and artist from metadata if available, otherwise use filename/folder
          title = metadata.common.title || title;
          album = metadata.common.album; // Extract album from metadata
          // Keep using folder name for artist consistency
          const currentArtistName = artist.replace(/_/g, ' ');

          // Extract embedded picture
          if (metadata.common.picture && metadata.common.picture.length > 0) {
            const picture = metadata.common.picture[0];
            thumbnailDataUri = `data:${picture.format};base64,${picture.data.toString('base64')}`;
          }

        } catch (error) {
          console.warn(`Could not parse metadata for ${filePath}:`, error);
          // Continue with filename-based data if metadata parsing fails
        }

        const songData: Song = {
          id: webPath, // Use web path as a unique ID
          title: title,
          artist: artist.replace(/_/g, ' '), // Always use folder name for artist consistency across app
          album: album || 'Unknown Album', // Assign extracted album or fallback
          url: webPath,
          thumbnail: thumbnailDataUri, // Use embedded thumbnail Data URI if found
          duration: duration,
        };

        allSongs.push(songData);
      } else if (dirent.isFile()) { // Log skipped unsupported files
         console.log(`Skipping unsupported file type: ${path.join(artistDirectory, dirent.name)}`);
      }
    }
  }

  console.log(`Fetched ${allSongs.length} songs from filesystem.`);
  // Sort songs alphabetically by title within each artist group (as they are processed sequentially)
  // You could sort the final allSongs array if a global sort is needed.
  return allSongs;
}
