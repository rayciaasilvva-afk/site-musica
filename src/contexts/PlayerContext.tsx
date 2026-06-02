import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Musica } from '@/types';

interface PlayerContextType {
  currentTrack: Musica | null;
  playlist: Musica[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  setPlaylist: (tracks: Musica[]) => void;
  playTrack: (track: Musica, userId?: string) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (vol: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Musica | null>(null);
  const [playlist, setPlaylist] = useState<Musica[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackIndexRef = useRef<number>(-1);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.7;
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    audio.addEventListener('ended', () => {
      handleNext();
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIndex = (trackIndexRef.current + 1) % playlist.length;
    const nextSong = playlist[nextIndex];
    if (nextSong) {
      trackIndexRef.current = nextIndex;
      setCurrentTrack(nextSong);
      if (audioRef.current) {
        audioRef.current.src = nextSong.audio_url;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  }, [playlist]);

  const recordPlay = async (track: Musica, userId?: string) => {
    // Increment play count
    await supabase
      .from('musicas')
      .update({ plays: (track.plays || 0) + 1 })
      .eq('id', track.id);

    // Record in history
    if (userId) {
      await supabase.from('historico').insert({
        usuario_id: userId,
        musica_id: track.id,
      });
    }
  };

  const playTrack = useCallback((track: Musica, userId?: string) => {
    const index = playlist.findIndex(t => t.id === track.id);
    trackIndexRef.current = index >= 0 ? index : 0;
    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.audio_url;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    recordPlay(track, userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack]);

  const nextTrack = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const prevTrack = useCallback(() => {
    if (playlist.length === 0) return;
    const prevIndex = (trackIndexRef.current - 1 + playlist.length) % playlist.length;
    const prevSong = playlist[prevIndex];
    if (prevSong) {
      trackIndexRef.current = prevIndex;
      setCurrentTrack(prevSong);
      if (audioRef.current) {
        audioRef.current.src = prevSong.audio_url;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  }, [playlist]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    setVolumeState(vol);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        playlist,
        isPlaying,
        currentTime,
        duration,
        volume,
        setPlaylist,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
