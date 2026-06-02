export interface Perfil {
  id: string;
  nome_completo: string;
  email: string;
  avatar_url: string | null;
}

export interface Musica {
  id: string;
  titulo: string;
  artista: string;
  categoria: string;
  capa_url: string;
  audio_url: string;
  plays: number;
  duracao: string;
}

export interface Favorito {
  usuario_id: string;
  musica_id: string;
}

export interface Historico {
  id?: string;
  usuario_id: string;
  musica_id: string;
  tocada_em: string;
}

export interface MusicaComFavorito extends Musica {
  is_favorito?: boolean;
}
