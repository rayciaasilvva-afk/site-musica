-- ============================================================
-- SoundWave - Script de configuração do banco de dados Supabase
-- Execute este SQL no editor SQL do seu projeto Supabase
-- (Dashboard > SQL Editor > New Query)
-- ============================================================

-- 1. Tabela de perfis (vinculada ao auth.users)
CREATE TABLE IF NOT EXISTS perfis (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de músicas
CREATE TABLE IF NOT EXISTS musicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  artista TEXT NOT NULL,
  categoria TEXT NOT NULL,
  capa_url TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  plays INTEGER DEFAULT 0,
  duracao TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  musica_id UUID NOT NULL REFERENCES musicas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (usuario_id, musica_id)
);

-- 4. Tabela de histórico
CREATE TABLE IF NOT EXISTS historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  musica_id UUID NOT NULL REFERENCES musicas(id) ON DELETE CASCADE,
  tocada_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Habilitar Row Level Security (RLS)
-- ============================================================

ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE musicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico ENABLE ROW LEVEL SECURITY;

-- Policies para perfis
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON perfis FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON perfis FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON perfis FOR UPDATE
  USING (auth.uid() = id);

-- Policies para musicas (todos podem ler, autenticados podem atualizar plays)
CREATE POLICY "Qualquer um pode ver músicas"
  ON musicas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Autenticados podem atualizar plays"
  ON musicas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies para favoritos
CREATE POLICY "Usuários podem ver seus favoritos"
  ON favoritos FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem inserir favoritos"
  ON favoritos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem deletar seus favoritos"
  ON favoritos FOR DELETE
  USING (auth.uid() = usuario_id);

-- Policies para historico
CREATE POLICY "Usuários podem ver seu histórico"
  ON historico FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem inserir no histórico"
  ON historico FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- ============================================================
-- Inserir 20 músicas de exemplo com URLs de áudio públicas
-- (Usando áudios livres de direitos autorais)
-- ============================================================

INSERT INTO musicas (titulo, artista, categoria, capa_url, audio_url, plays, duracao) VALUES
-- ROCK (3 músicas)
('Trovão Elétrico', 'Banda Voltage', 'Rock',
  'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  15420, '3:45'),

('Noite de Rock', 'Os Rebeldes', 'Rock',
  'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  12300, '4:12'),

('Guitarra Selvagem', 'Fúria Rock', 'Rock',
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  9850, '3:58'),

-- SERTANEJO (3 músicas)
('Coração de Vaqueiro', 'João & Pedro', 'Sertanejo',
  'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  25600, '3:22'),

('Estrada de Terra', 'Maria Sertaneja', 'Sertanejo',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  18700, '3:55'),

('Lua no Campo', 'Duo Raízes', 'Sertanejo',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  14200, '4:05'),

-- POP (3 músicas)
('Brilho Neon', 'Luna Star', 'Pop',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  32100, '3:30'),

('Dança no Telhado', 'Pop Nation', 'Pop',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  28400, '3:15'),

('Verão Infinito', 'Sol & Mar', 'Pop',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  21500, '3:48'),

-- ELETRÔNICA (3 músicas)
('Frequência Alta', 'DJ Pulse', 'Eletrônica',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  19800, '5:20'),

('Sintetizador Cósmico', 'Neon Waves', 'Eletrônica',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
  16500, '4:45'),

('Bass Drop', 'Electric Mind', 'Eletrônica',
  'https://images.unsplash.com/photo-1571266028243-3716f02d2d3e?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
  13200, '5:10'),

-- HIP-HOP (3 músicas)
('Rimas da Rua', 'MC Flow', 'Hip-Hop',
  'https://images.unsplash.com/photo-1571609860754-01e2f3609368?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  22300, '3:40'),

('Beats Urbanos', 'Crew 77', 'Hip-Hop',
  'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
  17800, '4:00'),

('Freestyle Noturno', 'Rapper Soul', 'Hip-Hop',
  'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  11600, '3:25'),

-- MPB (2 músicas)
('Bossa do Coração', 'Ana Melodia', 'MPB',
  'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
  20100, '4:30'),

('Samba de Uma Nota Só', 'Trio Harmonia', 'MPB',
  'https://images.unsplash.com/photo-1446057032654-9d8885f4a814?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
  16900, '3:55'),

-- FORRÓ (3 músicas)
('Sanfona na Lua', 'Forró das Estrelas', 'Forró',
  'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  23400, '3:35'),

('Xote do Amor', 'Banda Nordestina', 'Forró',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  19200, '3:20'),

('Arrasta-pé Digital', 'DJ Baião', 'Forró',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=400&fit=crop',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  15700, '4:15');

-- ============================================================
-- PRONTO! Seu banco de dados está configurado.
-- Agora configure o .env com suas credenciais do Supabase.
-- ============================================================
