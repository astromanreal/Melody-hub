import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Library, Youtube } from 'lucide-react'; // Import Library and Youtube icons
import albumsData from '@/data/albums.json'; // Import the static JSON data

interface Album {
  name: string;
  artist: string;
  youtubeMusicLink: string;
  thumbnailPlaceholderSeed?: string; // Optional: For unique placeholder images
}

interface AlbumsCategory {
    [category: string]: Album[];
}

// This is a Server Component
export default function AlbumsPage() {
  const albumsByCategory: AlbumsCategory = albumsData as AlbumsCategory; // Explicitly type albumsData


  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Library className="h-8 w-8 text-accent" />
        <h1 className="text-3xl font-bold text-foreground">Albums</h1>
      </div>

      {Object.entries(albumsByCategory).map(([category, albums]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-2xl font-semibold text-muted-foreground">{category}</h2>
          {albums.length === 0 ? (
            <p>No albums found in this category.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {albums.map((album, index) => (
                <Card
                  key={`${album.artist}-${album.name}-${index}`}
                  className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden flex flex-col h-full bg-card text-card-foreground group text-sm" // Smoother rounded corners
                >
                  <CardHeader className="p-0 relative aspect-square overflow-hidden">
                    {/* Use a placeholder image */}
                    <div className="relative w-full h-full overflow-hidden rounded-full">
                      <Image
                        src={`https://picsum.photos/seed/${encodeURIComponent(album.thumbnailPlaceholderSeed || album.name)}/150/150`} // Smaller placeholder
                        alt={`${album.name} cover`}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, (max-width: 1280px) 18vw, 15vw" // Adjusted sizes
                        className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-full"
                        data-ai-hint="album cover music"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 flex-grow flex flex-col justify-between"> {/* Reduced padding */}
                    <div>
                      <CardTitle className="text-sm font-semibold text-foreground truncate mb-1">{album.name}</CardTitle> {/* Smaller title */}
                      <p className="text-xs text-muted-foreground truncate">{album.artist}</p> {/* Smaller artist text */}
                    </div>
                    <Button variant="outline" size="sm" asChild className="mt-2 w-full">
                      <a href={album.youtubeMusicLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
                        <Youtube className="h-3.5 w-3.5" /> {/* Smaller icon */}
                        Listen
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
