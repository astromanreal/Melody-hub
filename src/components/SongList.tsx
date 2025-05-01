'use client';

import type { Song } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlayIcon, PauseIcon, MusicIcon } from 'lucide-react'; // Added MusicIcon
import Image from 'next/image';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';


interface SongListProps {
  songs: Song[];
  // Update onPlaySong to accept index and the list itself
  onPlaySong: (song: Song, context: { list: Song[], index: number }) => void;
  currentSongId?: string | null;
  isPlaying?: boolean;
}

export default function SongList({ songs, onPlaySong, currentSongId, isPlaying }: SongListProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px] text-center">#</TableHead>
                    <TableHead className="w-[70px]"></TableHead> {/* Thumbnail */}
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="w-[80px] text-center">Play</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {songs.map((song, index) => {
                    const isActive = song.id === currentSongId;
                    return (
                        <TableRow
                            key={song.id}
                            className={cn("hover:bg-muted/50 transition-colors", isActive && "bg-accent/10")}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <TableCell className="font-medium text-center text-muted-foreground">{index + 1}</TableCell>
                            <TableCell>
                                <div className="relative h-10 w-10 rounded overflow-hidden bg-secondary flex items-center justify-center">
                                     {song.thumbnail ? (
                                        <Image
                                            // Use embedded thumbnail (Data URI)
                                            src={song.thumbnail}
                                            alt={`${song.title} thumbnail`}
                                            fill
                                            sizes="40px"
                                            className="object-cover"
                                         />
                                     ) : (
                                         // Fallback icon if no thumbnail
                                        <MusicIcon className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className={cn("font-medium", isActive ? "text-accent" : "text-foreground")}>{song.title}</TableCell>
                            <TableCell className="text-muted-foreground">{song.artist}</TableCell>
                             <TableCell className="text-right text-muted-foreground tabular-nums">
                                {/* Handle potentially invalid duration */}
                                {song.duration && song.duration !== Infinity ? formatTime(song.duration) : '--:--'}
                             </TableCell>
                             <TableCell className="text-center">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    // Pass the list and index to the handler
                                    onClick={() => onPlaySong(song, { list: songs, index })}
                                    className={cn(
                                        "rounded-full hover:bg-accent/20",
                                        isActive ? "text-accent" : "text-foreground/70"
                                    )}
                                    aria-label={isActive && isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
                                >
                                    {isActive && isPlaying ? (
                                        <PauseIcon className="h-5 w-5" />
                                    ) : (
                                        <PlayIcon className="h-5 w-5" />
                                    )}
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </div>
  );
}
