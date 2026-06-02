import { usePlayer } from '@/contexts/PlayerContext';
import {
  HiPlay,
  HiPause,
  HiRewind,
  HiFastForward,
} from 'react-icons/hi';
import {
  HiSpeakerWave,
  HiSpeakerXMark,
} from 'react-icons/hi2';

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
  } = usePlayer();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#0a0a0a] via-[#121212]/98 to-[#1a1a1a]/95 backdrop-blur-2xl border-t border-white/10 shadow-2xl shadow-purple-500/10">
      {/* Enhanced Progress bar */}
      <div className="relative w-full h-1.5 bg-gradient-to-r from-white/5 to-white/5 cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          seekTo(percent * duration);
        }}
      >
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 transition-all duration-100 rounded-full"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg shadow-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-125"
          style={{ left: `${progress}%`, marginLeft: '-8px' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Track info */}
        <div className="flex items-center gap-4 min-w-0 flex-1 sm:flex-initial sm:w-[280px]">
          <div className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-2xl transition-all duration-300 ${
            isPlaying ? 'shadow-purple-500/40 ring-2 ring-purple-500/30' : 'shadow-black/50'
          }`}>
            <img
              src={currentTrack.capa_url}
              alt={currentTrack.titulo}
              className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
              style={{ borderRadius: isPlaying ? '50%' : '12px', transition: 'border-radius 0.3s' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop';
              }}
            />
            {isPlaying && (
              <div className="absolute inset-0 rounded-xl border border-purple-400/50 animate-pulse" />
            )}
          </div>
          
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text transition-all">
              {currentTrack.titulo}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{currentTrack.artista}</p>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={prevTrack}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 hover:scale-110 active:scale-95"
              title="Anterior"
            >
              <HiRewind className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="w-13 h-13 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all hover:scale-110 active:scale-95"
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? (
                <HiPause className="w-6 h-6" />
              ) : (
                <HiPlay className="w-6 h-6 ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 hover:scale-110 active:scale-95"
              title="Próxima"
            >
              <HiFastForward className="w-5 h-5" />
            </button>
          </div>

          {/* Time display (mobile hidden) */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400">
            <span className="w-9 text-right font-mono">{formatTime(currentTime)}</span>
            <div className="w-32 md:w-40 lg:w-52 h-1.5 bg-white/10 rounded-full relative cursor-pointer group hover:h-2 transition-all"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                seekTo(percent * duration);
              }}
            >
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                style={{ left: `${progress}%`, marginLeft: '-6px' }}
              />
            </div>
            <span className="w-9 font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control (desktop only) */}
        <div className="hidden lg:flex items-center gap-3 w-48 justify-end">
          <button
            onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            className="text-gray-400 hover:text-white transition-colors hover:scale-110 active:scale-90"
            title={volume === 0 ? 'Desmuteado' : 'Mudo'}
          >
            {volume === 0 ? (
              <HiSpeakerXMark className="w-5 h-5" />
            ) : (
              <HiSpeakerWave className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 cursor-pointer"
            title={`Volume: ${Math.round(volume * 100)}%`}
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`,
            }}
          />
          <span className="text-xs text-gray-500 w-8 text-right">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
