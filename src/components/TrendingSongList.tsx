'use client';

import type { Song } from '@/context/AudioContext';
import { useAudio } from '@/context/AudioContext';
import SongList from '@/components/SongList'; // Reuse the existing SongList component
import { Button } from '@/components/ui/button'; // Import Button component
import { PlayIcon } from 'lucide-react'; // Import PlayIcon

interface TrendingSongListProps {
    songs: Song[];
}

export default function TrendingSongList({ songs }: TrendingSongListProps) {
    const { playSong, currentSong, isPlaying } = useAudio();

    // Handler for the Play All button
    const handlePlayAll = () => {
        if (songs.length > 0) {
            // Play the first song and provide the full list as context
            playSong(songs[0], { list: songs, index: 0 });
        }
    };


    return (
         <div className="space-y-4"> {/* Add spacing */}
             {/* Play All Button */}
             <Button
                onClick={handlePlayAll}
                disabled={songs.length === 0}
                className="mb-4 flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                aria-label={`Play all trending songs`}
             >
                 <PlayIcon className="h-5 w-5" />
                 Play All Trending
             </Button>

            {/* Existing Song List */}
             <SongList
                songs={songs}
                onPlaySong={playSong} // AudioContext's playSong expects context now
                currentSongId={currentSong?.id}
                isPlaying={isPlaying}
             />
         </div>
    );
}
