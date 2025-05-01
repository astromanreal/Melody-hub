import { getSongs } from '@/lib/songs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ArtistSongList from '@/components/ArtistSongList'; // Import the new client component
import type { Song } from '@/context/AudioContext'; // Import Song type

// Define props for the server component
interface ArtistDetailPageProps {
  params: {
    artistName: string;
  };
}

// This is now a Server Component
export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const artistName = params.artistName ? decodeURIComponent(params.artistName) : 'Unknown Artist';
  const artistNameLower = artistName.toLowerCase(); // For image path

  // Fetch songs and filter on the server
  let artistSongs: Song[] = [];
  let embeddedArtistThumbnail: string | undefined = undefined; // Specifically for embedded thumbnail
  let loadingError = false;
  let allSongs = [];


  try {
    allSongs = await getSongs();
    artistSongs = allSongs.filter(song => song.artist === artistName);

    if (artistSongs.length > 0) {
       // Find the first song with an embedded thumbnail
       const songWithThumbnail = artistSongs.find(song => song.thumbnail);
       embeddedArtistThumbnail = songWithThumbnail?.thumbnail;
    }

     // Construct potential specific image path AFTER finding embedded one
     // No need for picsum fallback assignment here

  } catch (error) {
    console.error(`Error loading songs for artist ${artistName}:`, error);
    loadingError = true;
     // No need for picsum fallback assignment here either
  }

  // Determine the final source for the AvatarImage
  const specificArtistImagePath = `/images/artists/${artistNameLower}.jpeg`;
  const avatarSrc = embeddedArtistThumbnail || specificArtistImagePath;
  const fallbackInitials = artistName.charAt(0).toUpperCase();


  // No loading state needed in the component itself

  return (
    <div className="space-y-8">
        <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20 border-2 border-border">
                 {/* Use the determined source (embedded or specific path) */}
                <AvatarImage
                    src={avatarSrc}
                    alt={artistName}
                />
                 {/* Fallback shows initials if src fails */}
                <AvatarFallback>{fallbackInitials}</AvatarFallback>
            </Avatar>
            <h1 className="text-4xl font-bold text-foreground">{artistName}</h1>
      </div>

      {loadingError ? (
         <p className="text-destructive-foreground bg-destructive p-4 rounded-md">Could not load songs for {artistName}.</p>
      ) : artistSongs.length === 0 ? (
          <p>
            {allSongs.length > 0
                ? `No songs found for this artist (${artistName}).`
                : `No songs found at all. Make sure songs are placed in \`public/songs/\`.`
            }
          </p>
      ) : (
        // Render the client component for the song list interactions, passing the songs
        <ArtistSongList songs={artistSongs} />
      )}
    </div>
  );
}
