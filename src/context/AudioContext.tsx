'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string; // Optional album title
  url: string;
  thumbnail?: string; // Optional thumbnail Data URI
  duration?: number; // Optional duration in seconds
}

interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playlist: Song[]; // List of songs for next/prev
  currentSongIndex: number | null; // Index of current song in the playlist
  playSong: (song: Song, playlistContext?: { list: Song[], index: number }) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // Volume between 0 and 1
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();


   const handleAudioError = useCallback((event: Event) => {
       let error = (event.target as HTMLAudioElement)?.error;
       // Attempt to get more specific error details
       let message = "An error occurred during playback.";
      if (error) {
           switch (error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                    message = 'Playback aborted by the user.';
                    break;
                case MediaError.MEDIA_ERR_NETWORK:
                    message = 'A network error caused the audio download to fail.';
                    break;
                case MediaError.MEDIA_ERR_DECODE:
                    message = 'The audio playback was aborted due to a corruption problem or because the audio used features your browser did not support.';
                    break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    message = 'The audio could not be loaded, either because the server or network failed or because the format is not supported.';
                    break;
                default:
                    message = `An unknown error occurred (Code: ${error.code}).`;
            }
            console.error("Audio Playback Error:", message, error);
       } else {
            // Handle cases where the event doesn't have a standard error object
           console.error("Audio Playback Error: Unknown error event", event);
           message = "An unexpected error occurred during playback.";
       }


       setIsPlaying(false); // Ensure state reflects reality


      toast({
          title: "Playback Error",
          description: message,
          variant: "destructive",
      });
   }, [toast]); // Include toast in dependency array


  const playSong = useCallback((song: Song, playlistContext?: { list: Song[], index: number }) => {
      if (audioRef.current) {
          // If it's the same song and paused, just play
          if (currentSong?.id === song.id && !isPlaying) {
               audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
                   console.error("Error resuming playback:", err);
                   handleAudioError({target: audioRef.current} as unknown as Event); // Simulate error event
               });
               return;
           }

           // Set new song and context
           setCurrentSong(song);
           if (playlistContext) {
               setPlaylist(playlistContext.list);
               setCurrentSongIndex(playlistContext.index);
           } else {
                // Clear playlist context if playing a single song not from a list
                setPlaylist([]);
                setCurrentSongIndex(null);
           }

          // Load and play
           audioRef.current.src = song.url;
           audioRef.current.load(); // Ensure the new source is loaded
           audioRef.current.play()
              .then(() => setIsPlaying(true))
              .catch((err) => {
                  console.error("Error starting playback:", err);
                  handleAudioError({target: audioRef.current} as unknown as Event); // Simulate error event
              });
       }
  }, [currentSong, isPlaying, handleAudioError]); // Added handleAudioError

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
          console.error("Error toggling playback:", err);
          handleAudioError({target: audioRef.current} as unknown as Event); // Simulate error event
      });
    }
  }, [isPlaying, currentSong, handleAudioError]); // Added handleAudioError

  const seek = useCallback((time: number) => {
    if (audioRef.current && isFinite(time)) { // Check if time is finite
      audioRef.current.currentTime = time;
      setCurrentTime(time); // Update immediately for better UX
    }
  }, []);


  const playNext = useCallback(() => {
    if (playlist.length > 0 && currentSongIndex !== null) {
        const nextIndex = (currentSongIndex + 1) % playlist.length; // Wrap around
        const nextSong = playlist[nextIndex];
        playSong(nextSong, { list: playlist, index: nextIndex });
    } else if (playlist.length === 1 && currentSongIndex === 0) {
        // If only one song, replay it
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => handleAudioError(e as unknown as Event));
        }
    } else {
        console.log("Play next skipped: No valid playlist context or only one song.");
        setIsPlaying(false); // Stop playback if no next song logic applies
    }
  }, [playlist, currentSongIndex, playSong, handleAudioError]); // Added handleAudioError


  const playPrevious = useCallback(() => {
     if (playlist.length > 0 && currentSongIndex !== null) {
         const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length; // Wrap around
         const prevSong = playlist[prevIndex];
         playSong(prevSong, { list: playlist, index: prevIndex });
     } else {
         console.log("Play previous skipped: No playlist context.");
     }
  }, [playlist, currentSongIndex, playSong]);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
        if (isFinite(audio.currentTime)) { // Only update if currentTime is valid
           setCurrentTime(audio.currentTime);
        }
    }
    const updateDuration = () => {
        // Only update if duration is a valid finite number
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
            setDuration(audio.duration);
        } else if (duration !== 0) {
             // Reset duration if it becomes invalid (e.g., during loading or for streams)
             // Avoid resetting if it was already 0 to prevent flicker on initial load
            setDuration(0);
        }
    }
    // Define handleEnded separately to ensure the correct 'playNext' is captured in the closure
    const handleEnded = () => {
        // Automatically play next song when current one ends
        playNext();
    };


    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration); // Handles cases where duration changes
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleAudioError); // Add generic error listener


    // Set initial duration if metadata is already loaded and valid
    if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
       setDuration(audio.duration);
    } else {
        setDuration(0); // Ensure duration is 0 if initially invalid
    }


    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded); // Use the stable handleEnded reference
      audio.removeEventListener('error', handleAudioError);
    };
    // Add playNext and handleAudioError to the dependency array as they are used in event handlers
  }, [currentSong, playNext, handleAudioError, duration]); // Ensure duration is included if it influences resetting

   // Effect to control audio volume
   useEffect(() => {
       if (audioRef.current) {
           audioRef.current.volume = volume;
       }
   }, [volume]);


  const contextValue: AudioContextType = {
    currentSong,
    playlist,
    currentSongIndex,
    isPlaying,
    currentTime,
    duration,
    playSong,
    togglePlayPause,
    seek,
    volume,
    setVolume,
    playNext,
    playPrevious,
    audioRef,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
      {/* Added crossOrigin="anonymous" which might help with some CORS/tainting issues if loading from external sources, though likely not needed for /public files */}
      <audio ref={audioRef} crossOrigin="anonymous" />
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
