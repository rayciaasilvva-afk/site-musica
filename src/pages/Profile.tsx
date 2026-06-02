import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import Player from '@/components/Player';
import toast from 'react-hot-toast';
import type { Musica } from '@/types';
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineMusicNote,
  HiArrowLeft,
  HiHeart,
  HiClock,
} from 'react-icons/hi';

export default function Profile() {
  const { user, perfil, updatePerfil, updatePassword } = useAuth();
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [favoritos, setFavoritos] = useState<Musica[]>([]);
  const [historico, setHistorico] = useState<(Musica & { tocada_em: string })[]>([]);
  const [activeTab, setActiveTab] = useState<'perfil' | 'favoritos' | 'historico'>('perfil');

  useEffect(() => {
    if (perfil) {
      setNomeCompleto(perfil.nome_completo || '');
    }
  }, [perfil]);

  const fetchFavoritos = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favoritos')
      .select('musica_id, musicas(*)')
      .eq('usuario_id', user.id);
    if (data) {
      setFavoritos(data.map((f: Record<string, unknown>) => f.musicas as Musica).filter(Boolean));
    }
  }, [user]);

  const fetchHistorico = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('historico')
      .select('tocada_em, musica_id, musicas(*)')
      .eq('usuario_id', user.id)
      .order('tocada_em', { ascending: false })
      .limit(20);
    if (data) {
      setHistorico(
        data.map((h: Record<string, unknown>) => ({
          ...(h.musicas as Musica),
          tocada_em: h.tocada_em as string,
        })).filter(Boolean)
      );
    }
  }, [user]);

  useEffect(() => {
    fetchFavoritos();
    fetchHistorico();
  }, [fetchFavoritos, fetchHistorico]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCompleto.trim()) {
      toast.error('Nome não pode estar vazio');
      return;
    }
    setSavingName(true);
    const { error } = await updatePerfil({ nome_completo: nomeCompleto.trim() });
    setSavingName(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Nome atualizado com sucesso!');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmNewPassword) {
      toast.error('Preencha todos os campos');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    setSavingPassword(true);
    const { error } = await updatePassword(newPassword);
    setSavingPassword(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Senha atualizada com sucesso!');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] pb-28">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-b from-purple-900/20 via-pink-900/10 to-[#0a0a0a] pb-12 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white hover:scale-105 transition-all mb-8 font-medium"
          >
            <HiArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-purple-500/40 ring-4 ring-purple-500/20">
              {perfil?.nome_completo?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {perfil?.nome_completo || 'Usuário'}
              </h1>
              <p className="text-gray-400 text-lg">{perfil?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 bg-gradient-to-r from-[#1e1e1e] to-[#1a1a1a] rounded-2xl p-2 mb-10 border border-white/5 shadow-lg">
          {[
            { key: 'perfil' as const, label: 'Perfil', icon: HiOutlineUser },
            { key: 'favoritos' as const, label: 'Favoritos', icon: HiHeart },
            { key: 'historico' as const, label: 'Histórico', icon: HiClock },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/40 scale-105'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Perfil Tab */}
        {activeTab === 'perfil' && (
          <div className="space-y-8 animate-fade-in">
            {/* Personal Info Card */}
            <div className="section-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <HiOutlineUser className="w-5 h-5 text-white" />
                </div>
                Informações Pessoais
              </h3>
              <form onSubmit={handleUpdateName} className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all group-hover:border-white/20"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={perfil?.email || ''}
                    disabled
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3.5 px-4 text-gray-600 cursor-not-allowed opacity-60"
                  />
                  <p className="text-xs text-gray-500 mt-2">Email não pode ser alterado</p>
                </div>
                <button
                  type="submit"
                  disabled={savingName}
                  className="mt-2 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 uppercase tracking-wide"
                >
                  {savingName ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </form>
            </div>

            {/* Password Change Card */}
            <div className="section-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <HiOutlineLockClosed className="w-5 h-5 text-white" />
                </div>
                Alterar Senha
              </h3>
              <form onSubmit={handleUpdatePassword} className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Nova Senha</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all group-hover:border-white/20"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all group-hover:border-white/20"
                    placeholder="Repita a nova senha"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="mt-2 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 uppercase tracking-wide"
                >
                  {savingPassword ? 'Atualizando...' : 'Alterar Senha'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Favoritos Tab */}
        {activeTab === 'favoritos' && (
          <div className="animate-fade-in">
            {favoritos.length === 0 ? (
              <div className="section-card p-12 text-center">
                <div className="w-20 h-20 mx-auto bg-pink-500/20 rounded-full flex items-center justify-center mb-4 border border-pink-500/30">
                  <HiHeart className="w-10 h-10 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum Favorito Ainda</h3>
                <p className="text-gray-400">Toque no coração das músicas para adicioná-las aos favoritos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoritos.map((musica, idx) => (
                  <div
                    key={musica.id}
                    className="section-card p-4 group hover:scale-105 transition-transform animate-fade-in flex items-center gap-4"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <img
                      src={musica.capa_url}
                      alt={musica.titulo}
                      className="w-16 h-16 rounded-lg object-cover shadow-lg group-hover:shadow-pink-500/20"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                        {musica.titulo}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">{musica.artista}</p>
                      <p className="text-xs text-gray-600 mt-1">{musica.duracao}</p>
                    </div>
                    <HiHeart className="w-6 h-6 text-pink-500 shrink-0 animate-pulse" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Historico Tab */}
        {activeTab === 'historico' && (
          <div className="animate-fade-in">
            {historico.length === 0 ? (
              <div className="section-card p-12 text-center">
                <div className="w-20 h-20 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                  <HiClock className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhuma Música Ouvida</h3>
                <p className="text-gray-400">Comece a ouvir para ver seu histórico aqui</p>
              </div>
            ) : (
              <div className="space-y-2">
                {historico.map((item, idx) => (
                  <div
                    key={`${item.id}-${item.tocada_em}`}
                    className="section-card p-4 group hover:border-purple-500/50 transition-all animate-fade-in flex items-center gap-4"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <img
                      src={item.capa_url}
                      alt={item.titulo}
                      className="w-14 h-14 rounded-lg object-cover shadow-lg group-hover:shadow-purple-500/20"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.titulo}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{item.artista}</p>
                    </div>
                    <div className="text-right shrink-0 text-xs">
                      <p className="font-mono text-gray-500">{item.duracao}</p>
                      <p className="text-gray-600 mt-0.5">
                        {new Date(item.tocada_em).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Player />
    </div>
  );
}
