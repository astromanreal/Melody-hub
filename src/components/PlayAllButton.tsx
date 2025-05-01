
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2 } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { getSongs } from '@/lib/songs'; // Import the server action (if using) or fetch function
import { useToast } from '@/hooks/use-toast';
import type { Song } from '@/context/AudioContext';
import { shuffleArray } from '@/lib/utils'; // Import shuffle utility

export default function PlayAllButton() {
    const { playSong } = useAudio();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handlePlayAll = async () => {
        setIsLoading(true);
        try {
            // Assuming getSongs() is adjusted to work client-side or is a Server Action
            // For now, we'll treat it as if it fetches client-side compatible data
            // Note: Direct filesystem access (`fs`, `path`) won't work here.
            // `getSongs` needs refactoring if it relies on Node.js APIs directly
            // OR needs to be called via a Server Action or API route.
            // *** Assuming getSongs is adapted or replaced with a client-fetch/Server Action ***
            let allSongs = await getSongs(); // Fetch all songs

            if (allSongs && allSongs.length > 0) {
                // Shuffle the songs before playing
                const shuffledSongs = shuffleArray(allSongs);
                playSong(shuffledSongs[0], { list: shuffledSongs, index: 0 }); // Play the first shuffled song
            } else {
                 toast({
                     title: "No Songs Found",
                     description: "Could not find any songs to play.",
                     variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error fetching or playing songs:", error);
             toast({
                 title: "Error Playing Songs",
                 description: "Failed to load or play the songs. Please ensure songs are available.",
                 variant: "destructive",
             });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handlePlayAll}
            size="lg" // Make it slightly larger
            className="w-full max-w-xs mt-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-200 ease-in-out hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center gap-2 shadow-md" // Added styles
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading Songs...
                </>
            ) : (
                <>
                    <Play className="h-5 w-5" />
                    Play All Songs (Shuffled)
                </>
            )}
        </Button>
    );
}
