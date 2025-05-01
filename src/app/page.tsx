
import Link from 'next/link';
import Image from 'next/image'; // Import the Image component
import { Button } from '@/components/ui/button';
import { Music, Radio, Users, Play } from 'lucide-react'; // Added icons
import PlayAllButton from '@/components/PlayAllButton'; // Import the new button component

export default function Home() {
  return (
    <div className="space-y-8 text-center mt-16 relative overflow-hidden py-10 rounded-lg bg-card/50 border border-border/50 shadow-sm">
       {/* Subtle background elements */}
      <Music className="absolute top-10 left-10 h-16 w-16 text-primary/10 opacity-50 -rotate-12" />
      <Radio className="absolute bottom-10 right-10 h-20 w-20 text-accent/10 opacity-50 rotate-6" />
      <Users className="absolute top-1/2 left-1/4 h-12 w-12 text-secondary/10 opacity-40 -translate-y-1/2" />

      <div className="relative z-10"> {/* Ensure content is above background elements */}
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
              <Music className="h-8 w-8 text-accent" /> {/* Icon next to title */}
             Welcome to Melody Hub!
           </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-4 mb-8"> {/* Added margins */}
            Your personal music streaming experience. Explore trending tracks, browse artists, and enjoy your favorite songs.
           </p>
          <div className="flex flex-col items-center gap-4"> {/* Changed to flex-col and added gap */}
            <div className="flex justify-center gap-4">
                {/* Ensure no whitespace between Button and Link tags when using asChild */}
                <Button asChild size="lg"><Link href="/trending">View Trending Songs</Link></Button>
                <Button variant="outline" asChild size="lg"><Link href="/artists">Browse Artists</Link></Button>
            </div>
            {/* Add the Play All Button component */}
            <PlayAllButton />
          </div>
      </div>

       {/* Hero Image Section */}
      <div className="mt-16 px-4"> {/* Add margin top and padding */}
        <Image
          src="/images/lata_hero_img.jpeg" // Path relative to the public directory
          alt="Lata Mangeshkar performing"
          width={800} // Specify desired width
          height={450} // Specify desired height (adjust aspect ratio as needed)
          className="rounded-lg shadow-lg mx-auto" // Style the image
          priority // Optional: Prioritize loading if it's above the fold
          data-ai-hint="singer performance stage"
        />
      </div>
    </div>
  );
}
