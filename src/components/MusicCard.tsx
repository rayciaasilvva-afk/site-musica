import { HiHeart, HiOutlineHeart, HiPlay, HiPause } from 'react-icons/hi';
import type { MusicaComFavorito } from '@/types';
import { usePlayer } from '@/contexts/PlayerContext';

interface MusicCardProps {
  musica: MusicaComFavorito;
  onToggleFavorito: (musicaId: string) => void;
  onPlay: (musica: MusicaComFavorito) => void;
}

export default function MusicCard({ musica, onToggleFavorito, onPlay }: MusicCardProps) {
  const { currentTrack, isPlaying } = usePlayer();
  const isCurrentlyPlaying = currentTrack?.id === musica.id && isPlaying;
  const isCurrentTrack = currentTrack?.id === musica.id;

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer h-full flex flex-col ${
        isCurrentTrack
          ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20'
          : 'bg-gradient-to-br from-[#1e1e1e] to-[#1a1a1a] border border-white/10 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10'
      }`}
    >
      {/* Cover Image */}
      <div className="relative aspect-square overflow-hidden w-full">
        <img
          src={musica.capa_url}
          alt={musica.titulo}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

        {/* Play Button Overlay */}
        <button
          onClick={() => onPlay(musica)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-sm"
        >
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/40 transition-all transform group-hover:scale-110 active:scale-95 ${
            isCurrentlyPlaying ? 'animate-pulse-glow' : ''
          }`}>
            {isCurrentlyPlaying ? (
              <HiPause className="w-7 h-7 text-white" />
            ) : (
              <HiPlay className="w-7 h-7 text-white ml-0.5" />
            )}
          </div>
        </button>

        {/* Playing Indicator */}
        {isCurrentlyPlaying && (
          <div className="absolute top-3 left-3 animate-slide-in-left">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-3 py-1.5 shadow-lg shadow-purple-500/30">
              <div className="flex gap-0.5 items-end h-3">
                <div className="w-0.5 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-0.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-0.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <div className="w-0.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
              </div>
              <span className="text-[11px] font-bold text-white ml-1">TOCANDO</span>
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorito(musica.id);
          }}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center transition-all hover:scale-125 active:scale-90 border border-white/20 hover:border-pink-500/50"
        >
          {musica.is_favorito ? (
            <HiHeart className="w-5 h-5 text-pink-500 animate-pulse" />
          ) : (
            <HiOutlineHeart className="w-5 h-5 text-white/70 hover:text-pink-400" />
          )}
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full border border-white/20">
            {musica.categoria}
          </span>
          {musica.plays && (
            <span className="text-[10px] text-white/70 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
              {(musica.plays / 1000).toFixed(0)}K plays
            </span>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
            {musica.titulo}
          </h3>
          <p className="text-xs text-gray-400 mt-1.5 truncate group-hover:text-gray-300 transition-colors">
            {musica.artista}
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <span className="text-xs text-gray-500 font-medium">{musica.duracao}</span>
          <div className="flex items-center gap-1.5">
            {isCurrentTrack && (
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
            )}
            <span className="text-xs text-gray-500">
              {isCurrentTrack ? (isPlaying ? 'Tocando' : 'Pausado') : 'Adicionar'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
