import { getSongs } from '@/lib/songs';
import AllSongsList from '@/components/AllSongsList'; // Import the new client component
import type { Song } from '@/context/AudioContext';

// This is now a Server Component
export default async function SongsPage() {
  // Fetch songs directly on the server
  let allSongs: Song[] = [];
  let loadingError = false;

   try {
    allSongs = await getSongs();
   } catch (error) {
       console.error("Error loading songs:", error);
       loadingError = true;
   }

   // No loading state needed in the component itself

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">All Songs</h1>
       {loadingError ? (
           <p className="text-destructive-foreground bg-destructive p-4 rounded-md">Could not load songs. Please try again later.</p>
       ) : allSongs.length === 0 ? (
          <p>No songs found. Make sure songs are placed in `public/songs/`.</p>
      ) : (
         // Render the client component for the song list interactions
         <AllSongsList songs={allSongs} />
      )}
    </div>
  );
}
