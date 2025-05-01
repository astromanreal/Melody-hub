
import { getSongs } from '@/lib/songs';
import type { Song } from '@/context/AudioContext';
import TrendingSongList from '@/components/TrendingSongList'; // New component
import { seededShuffleArray, getCurrentDateSeed } from '@/lib/utils'; // Import seeded shuffle and date seed functions

export default async function TrendingPage() {
  let trendingSongs: Song[] = [];
  let loadingError = false;
  let allSongsFound = false;
  const dailySeed = getCurrentDateSeed(); // Get the seed for today

  try {
    const allSongs = await getSongs();
    allSongsFound = allSongs.length > 0; // Check if any songs were found at all

    if (allSongsFound) {
      const songsByArtist = allSongs.reduce((acc, song) => {
        // Ensure artist name is treated consistently (e.g., trim whitespace)
        const artistKey = song.artist.trim();
        (acc[artistKey] = acc[artistKey] || []).push(song);
        return acc;
      }, {} as Record<string, Song[]>);

      // Get artist names and sort them alphabetically for consistent order before shuffling
      const sortedArtists = Object.keys(songsByArtist).sort((a, b) => a.localeCompare(b));

      for (const artist of sortedArtists) {
        // Shuffle the artist's songs using the daily seed
        const shuffledArtistSongs = seededShuffleArray(songsByArtist[artist], dailySeed);

        // Take the first 3 songs from the shuffled list for this artist
        const artistTopSongs = shuffledArtistSongs.slice(0, 3);
        trendingSongs.push(...artistTopSongs);
      }

      // Shuffle the final combined trending songs list using the daily seed
      // Note: Pass the array itself to shuffle, not just the variable name
      trendingSongs = seededShuffleArray(trendingSongs, dailySeed);
    }
  } catch (error) {
    console.error("Error fetching or processing songs for trending page:", error);
    loadingError = true;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Trending Songs ({dailySeed})</h1> {/* Optionally display date */}
      {loadingError ? (
        <p className="text-destructive-foreground bg-destructive p-4 rounded-md">Could not load trending songs. Please try again later.</p>
      ) : trendingSongs.length === 0 ? (
         <p>
            {allSongsFound
                ? "No trending songs could be determined from the available music."
                : "No songs found. Make sure songs are placed in `public/songs/` with artist subdirectories."
            }
         </p>
      ) : (
        <TrendingSongList songs={trendingSongs} />
      )}
    </div>
  );
}
