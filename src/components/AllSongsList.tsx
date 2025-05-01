'use client';

import type { Song } from '@/context/AudioContext';
import { useAudio } from '@/context/AudioContext';
import SongList from '@/components/SongList'; // Reuse the existing SongList component

interface AllSongsListProps {
    songs: Song[];
}

export default function AllSongsList({ songs }: AllSongsListProps) {
    const { playSong, currentSong, isPlaying } = useAudio();

    // Pass the playSong handler directly, SongList will provide context
    return (
        <SongList
            songs={songs}
            onPlaySong={playSong} // AudioContext's playSong expects context now
            currentSongId={currentSong?.id}
            isPlaying={isPlaying}
        />
    );
}
