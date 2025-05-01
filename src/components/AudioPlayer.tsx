
'use client';

import { useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  PlayIcon,
  PauseIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Maximize2, // Icon for expanding
  Minimize2, // Icon for collapsing
  X, // Icon for closing completely (optional)
} from 'lucide-react';
import Image from 'next/image';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card'; // Import Card for styling

export default function AudioPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    playlist,
    currentSongIndex,
    togglePlayPause,
    seek,
    volume,
    setVolume,
    playNext,
    playPrevious,
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false); // State to control expanded view
  const [showPlayer, setShowPlayer] = useState(true); // State to control player visibility

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeXIcon className="h-4 w-4" />;
    if (volume < 0.5) return <Volume1Icon className="h-4 w-4" />;
    return <Volume2Icon className="h-4 w-4" />;
  };

  const canPlayPrevious = playlist.length > 0 && currentSongIndex !== null;
  const canPlayNext = playlist.length > 0 && currentSongIndex !== null;

  // Decide whether to render the player at all
  if (!currentSong || !showPlayer) {
    return null;
  }

  return (
    <Card
      className={cn(
        "fixed bottom-4 right-4 z-50 rounded-lg border bg-card shadow-xl transition-all duration-300 ease-in-out",
        isExpanded ? "w-[calc(100%-2rem)] max-w-md p-4" : "w-auto p-2" // Adjust size and padding based on state
      )}
      onMouseEnter={() => setIsExpanded(true)} // Expand on hover
      onMouseLeave={() => setIsExpanded(false)} // Collapse when mouse leaves
    >
      <CardContent className="flex items-center gap-3 p-0">
        {/* Thumbnail (always visible) */}
        <div className={cn(
          "relative rounded flex-shrink-0 overflow-hidden",
          isExpanded ? "h-16 w-16" : "h-10 w-10" // Smaller thumbnail when collapsed
        )}>
          <Image
            src={currentSong.thumbnail || `https://picsum.photos/seed/${encodeURIComponent(currentSong.id)}/80/80`}
            alt={`${currentSong.title} thumbnail`}
            fill
            sizes={isExpanded ? "64px" : "40px"}
            className="object-cover"
            data-ai-hint="song album art"
          />
        </div>

        {/* Collapsed View Content */}
        {!isExpanded && (
          <div className="flex items-center gap-2">
            <div className="flex-grow overflow-hidden mr-1">
              <p className="text-sm font-medium text-foreground truncate">{currentSong.title}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="rounded-full text-foreground hover:bg-accent/10 w-8 h-8 flex-shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            </Button>
             {/* Keep expand button for explicit control if needed, hover provides auto-expand */}
             <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(true)}
                className="rounded-full text-muted-foreground hover:bg-accent/10 w-8 h-8 flex-shrink-0"
                aria-label="Expand player"
            >
                 <Maximize2 className="h-4 w-4" />
             </Button>
          </div>
        )}

        {/* Expanded View Content */}
        {isExpanded && (
          <div className="flex flex-col flex-grow gap-2 overflow-hidden">
            {/* Song Info */}
            <div>
               <p className="text-sm font-medium text-foreground truncate">{currentSong.title}</p>
               <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
            </div>

            {/* Seek Bar */}
             <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-muted-foreground w-9 text-right tabular-nums">
                    {formatTime(currentTime)}
                </span>
                <Slider
                    value={[currentTime]}
                    max={duration || 0}
                    step={1}
                    onValueChange={handleSeek}
                    className="flex-grow cursor-pointer [&>[data-radix-slider-track]]:h-1.5 [&>span:first-child>span]:bg-accent [&>span:last-child]:bg-accent" // Slimmer track
                    aria-label="Seek bar"
                    disabled={!duration || duration === Infinity}
                />
                <span className="text-xs text-muted-foreground w-9 text-left tabular-nums">
                    {duration && duration !== Infinity ? formatTime(duration) : '00:00'}
                </span>
            </div>

            {/* Controls Row */}
            <div className="flex justify-between items-center gap-2">
              {/* Main Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playPrevious}
                  disabled={!canPlayPrevious}
                  className="rounded-full text-foreground hover:bg-accent/10 w-8 h-8 disabled:opacity-50"
                  aria-label="Previous song"
                >
                  <SkipBackIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlayPause}
                  className="rounded-full text-foreground hover:bg-accent/10 w-9 h-9" // Slightly larger play/pause
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playNext}
                  disabled={!canPlayNext}
                  className="rounded-full text-foreground hover:bg-accent/10 w-8 h-8 disabled:opacity-50"
                  aria-label="Next song"
                >
                  <SkipForwardIcon className="h-4 w-4" />
                </Button>
              </div>

               {/* Volume and Collapse Controls */}
               <div className="flex items-center gap-1">
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-accent hover:bg-accent/10">
                        <VolumeIcon />
                    </Button>
                    <Slider
                        value={[volume]}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="w-16 cursor-pointer [&>[data-radix-slider-track]]:h-1.5 [&>span:first-child>span]:bg-accent [&>span:last-child]:bg-accent"
                        aria-label="Volume control"
                    />
                     {/* Keep collapse button for explicit control */}
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(false)}
                         className="rounded-full text-muted-foreground hover:bg-accent/10 w-8 h-8"
                        aria-label="Collapse player"
                    >
                        <Minimize2 className="h-4 w-4" />
                    </Button>
                    {/* Optional: Close Button */}
                    {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPlayer(false)}
                        className="rounded-full text-destructive/70 hover:bg-destructive/10 hover:text-destructive w-8 h-8"
                        aria-label="Close player"
                    >
                        <X className="h-4 w-4" />
                    </Button> */}
               </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

