import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { usePlayer } from '@/contexts/PlayerContext';
import Header from '@/components/Header';
import MusicCard from '@/components/MusicCard';
import Player from '@/components/Player';
import toast from 'react-hot-toast';
import type { Musica, MusicaComFavorito } from '@/types';
import { HiFire, HiMusicNote } from 'react-icons/hi';

const CATEGORIAS = ['Todas', 'Rock', 'Sertanejo', 'Pop', 'Eletrônica', 'Hip-Hop', 'MPB', 'Forró'];

const categoriaCores: Record<string, string> = {
  'Todas': 'from-purple-500 to-pink-500',
  'Rock': 'from-red-500 to-orange-500',
  'Sertanejo': 'from-yellow-500 to-amber-600',
  'Pop': 'from-pink-500 to-rose-500',
  'Eletrônica': 'from-cyan-500 to-blue-500',
  'Hip-Hop': 'from-green-500 to-emerald-600',
  'MPB': 'from-indigo-500 to-violet-500',
  'Forró': 'from-orange-500 to-red-500',
};

const categoriaEmojis: Record<string, string> = {
  'Todas': '🎵',
  'Rock': '🎸',
  'Sertanejo': '🤠',
  'Pop': '⭐',
  'Eletrônica': '🎧',
  'Hip-Hop': '🎤',
  'MPB': '🇧🇷',
  'Forró': '🪗',
};

export default function Dashboard() {
  const { user } = useAuth();
  const { setPlaylist, playTrack, togglePlay, currentTrack } = usePlayer();
  const [musicas, setMusicas] = useState<MusicaComFavorito[]>([]);
  const [topMusicas, setTopMusicas] = useState<MusicaComFavorito[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todas');
  const [favoritoIds, setFavoritoIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch favoritos
  const fetchFavoritos = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favoritos')
      .select('musica_id')
      .eq('usuario_id', user.id);
    if (data) {
      setFavoritoIds(new Set(data.map((f: { musica_id: string }) => f.musica_id)));
    }
  }, [user]);

  // Fetch all musicas
  const fetchMusicas = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('musicas').select('*');

    if (selectedCategoria !== 'Todas') {
      query = query.eq('categoria', selectedCategoria);
    }

    if (debouncedQuery.trim()) {
      query = query.or(`titulo.ilike.%${debouncedQuery}%,artista.ilike.%${debouncedQuery}%`);
    }

    const { data, error } = await query.order('titulo');
    if (error) {
      toast.error('Erro ao carregar músicas');
    }
    if (data) {
      const musicasComFav = data.map((m: Musica) => ({
        ...m,
        is_favorito: favoritoIds.has(m.id),
      }));
      setMusicas(musicasComFav);
      setPlaylist(musicasComFav);
    }
    setLoading(false);
  }, [selectedCategoria, debouncedQuery, favoritoIds, setPlaylist]);

  // Fetch top musicas
  const fetchTopMusicas = useCallback(async () => {
    const { data } = await supabase
      .from('musicas')
      .select('*')
      .order('plays', { ascending: false })
      .limit(6);
    if (data) {
      setTopMusicas(data.map((m: Musica) => ({
        ...m,
        is_favorito: favoritoIds.has(m.id),
      })));
    }
  }, [favoritoIds]);

  useEffect(() => {
    fetchFavoritos();
  }, [fetchFavoritos]);

  useEffect(() => {
    fetchMusicas();
    fetchTopMusicas();
  }, [fetchMusicas, fetchTopMusicas]);

  const handleToggleFavorito = async (musicaId: string) => {
    if (!user) return;
    const isFav = favoritoIds.has(musicaId);

    if (isFav) {
      await supabase
        .from('favoritos')
        .delete()
        .eq('usuario_id', user.id)
        .eq('musica_id', musicaId);
      setFavoritoIds(prev => {
        const next = new Set(prev);
        next.delete(musicaId);
        return next;
      });
      toast.success('Removido dos favoritos');
    } else {
      await supabase
        .from('favoritos')
        .insert({ usuario_id: user.id, musica_id: musicaId });
      setFavoritoIds(prev => new Set(prev).add(musicaId));
      toast.success('Adicionado aos favoritos ❤️');
    }
  };

  const handlePlayTrack = (musica: MusicaComFavorito) => {
    if (currentTrack?.id === musica.id) {
      togglePlay();
    } else {
      playTrack(musica, user?.id);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] pb-28">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {selectedCategoria === 'Todas' && !searchQuery.trim() && (
          <section className="mb-12 animate-slide-up">
            <div className="section-card p-8 lg:p-12 overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-3xl opacity-20" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-15" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <HiMusicNote className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-purple-400 uppercase tracking-wide">Bem-vindo de volta</p>
                    <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                      Descubra sua <br />
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                        próxima música favorita
                      </span>
                    </h1>
                  </div>
                </div>
                <p className="text-gray-400 mt-4 max-w-2xl text-lg">
                  Explore gêneros incríveis e encontre suas músicas favoritas em nossa vasta biblioteca.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section className="mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-lg font-bold text-white">Categorias</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-purple-500/30 to-transparent" />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap sm:gap-3">
            {CATEGORIAS.map((cat, idx) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoria(cat)}
                className={`shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 animate-fade-in ${
                  selectedCategoria === cat
                    ? `bg-gradient-to-r ${categoriaCores[cat]} text-white shadow-lg shadow-purple-500/30 scale-105`
                    : 'bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] hover:text-white border border-white/5 hover:border-purple-500/20'
                }`}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <span className="text-lg">{categoriaEmojis[cat]}</span>
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Trending Section */}
        {selectedCategoria === 'Todas' && !searchQuery.trim() && topMusicas.length > 0 && (
          <section className="mb-14 animate-slide-up" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <HiFire className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Tendências</h2>
                <p className="text-xs text-gray-500 mt-0.5">As músicas mais ouvidas agora</p>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-orange-500/30 to-transparent hidden sm:block" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {topMusicas.map((musica, idx) => (
                <div key={musica.id} className="animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
                  <MusicCard
                    musica={musica}
                    onToggleFavorito={handleToggleFavorito}
                    onPlay={handlePlayTrack}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Library Section */}
        <section className="animate-slide-up" style={{ animationDelay: '250ms' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {searchQuery.trim()
                  ? `🔍 Resultados para "${searchQuery}"`
                  : selectedCategoria === 'Todas'
                  ? '🎵 Biblioteca Completa'
                  : `${categoriaEmojis[selectedCategoria]} ${selectedCategoria}`}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {musicas.length} {musicas.length === 1 ? 'música' : 'músicas'} encontrada{musicas.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-[#1e1e1e] rounded-2xl overflow-hidden border border-white/5 animate-pulse">
                  <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5 animate-shimmer" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                    <div className="h-2 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : musicas.length === 0 ? (
            <div className="section-card p-12 text-center animate-fade-in">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-5 border border-purple-500/20">
                <HiMusicNote className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Nenhuma música encontrada</h3>
              <p className="text-gray-400 mb-6">Tente outra busca ou explore outras categorias</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoria('Todas');
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:scale-105 transition-transform"
              >
                Explorar Tudo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {musicas.map((musica, idx) => (
                <div key={musica.id} className="animate-fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
                  <MusicCard
                    musica={musica}
                    onToggleFavorito={handleToggleFavorito}
                    onPlay={handlePlayTrack}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Player />
    </div>
  );
}
