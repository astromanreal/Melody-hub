

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSongs } from '@/lib/songs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image'; // Import Image for background

interface Artist {
  name: string;
  songCount: number;
  thumbnail?: string; // Embedded thumbnail (Data URI)
}

// This is now a Server Component
export default async function ArtistsPage() {

  // Fetch songs and process artist data on the server
  let artists: Artist[] = [];
  let loadingError = false;
  let allSongs = [];

  try {
    allSongs = await getSongs();
    const artistMap = new Map<string, { count: number, thumbnail?: string }>();
    allSongs.forEach((song) => {
      // Ensure artist name is treated consistently (e.g., trim whitespace)
      const artistKey = song.artist.trim();
      const current = artistMap.get(artistKey) || { count: 0 };
      // Prioritize existing thumbnail (already found embedded one),
      // then check current song's embedded thumbnail, otherwise keep undefined
      const thumbnailToUse = current.thumbnail || song.thumbnail;
      artistMap.set(artistKey, {
        count: current.count + 1,
        thumbnail: thumbnailToUse,
      });
    });

    artists = Array.from(artistMap.entries()).map(
      ([name, data]) => ({
        name,
        songCount: data.count,
        thumbnail: data.thumbnail, // Will be Data URI if found, otherwise undefined
      })
    ).sort((a, b) => a.name.localeCompare(b.name)); // Sort artists alphabetically

  } catch (error) {
    console.error('Error loading artists:', error);
    loadingError = true;
    // Handle error state if needed - maybe show an error message
  }

  // No loading state needed as data is fetched before rendering

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Artists</h1>
      {loadingError ? (
        <p className="text-destructive-foreground bg-destructive p-4 rounded-md">Could not load artists. Please try again later.</p>
      ) : artists.length === 0 ? (
         <p>
            {allSongs.length > 0
                ? "No artists found for the loaded songs."
                : "No artists found. Make sure songs are placed in `public/songs/`."
            }
         </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artists.map((artist) => {
            // Construct the path for the specific artist image (assuming .jpeg)
            // IMPORTANT: Ensure the artist name in the filename matches exactly (lowercase recommended)
            const specificArtistImagePath = `/images/artists/${artist.name.toLowerCase()}.jpeg`;
            const fallbackInitials = artist.name.charAt(0).toUpperCase();
            const avatarSrc = artist.thumbnail || specificArtistImagePath; // Determine avatar source (embedded first)

            return (
                <Link key={artist.name} href={`/artists/${encodeURIComponent(artist.name)}`} passHref>
                 {/* Apply hover effects directly to the Card */}
                 <Card className="relative shadow-md hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg overflow-hidden cursor-pointer group h-full bg-card text-card-foreground hover:scale-[1.03]">
                    {/* Background Image: Fills the card, blurred, slightly darker on hover */}
                    <Image
                         src={specificArtistImagePath} // Use the specific artist image path for the background
                         alt={`${artist.name} background`}
                         fill
                         sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 23vw"
                         className="object-cover transition-all duration-300 ease-in-out group-hover:scale-110 opacity-20 group-hover:opacity-30 blur-sm" // Subtle background
                         // Don't show fallback for background, let it fail gracefully if no image exists
                         // Removed onError handler as it's not allowed in Server Components
                         data-ai-hint="artist background genre"
                     />
                    {/* Content Overlay: Positioned above the background */}
                    <div className="relative z-10 flex flex-col items-center text-center p-4 h-full backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-300 ease-in-out bg-card/50 group-hover:bg-card/70 rounded-lg">
                         {/* Avatar remains prominent */}
                        <CardHeader className="p-0 mb-3"> {/* Reduced padding, added margin bottom */}
                        <Avatar className="h-24 w-24 border-2 border-border shadow-lg">
                             <AvatarImage
                                src={avatarSrc} // Use embedded or specific path for avatar
                                alt={artist.name}
                            />
                            <AvatarFallback>{fallbackInitials}</AvatarFallback>
                         </Avatar>
                        </CardHeader>
                        {/* Text content */}
                        <CardContent className="p-0 flex-grow flex flex-col justify-center">
                            <CardTitle className="text-xl font-semibold text-foreground">{artist.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{artist.songCount} song{artist.songCount !== 1 ? 's' : ''}</p>
                        </CardContent>
                     </div>
                 </Card>
                </Link>
            );
           })}
        </div>
      )}
    </div>
  );
}
