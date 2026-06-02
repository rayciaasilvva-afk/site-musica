# 🎵 SoundWave — Streaming de Música

Uma plataforma completa de streaming de música construída com React + Vite + Tailwind CSS + Supabase.

## 🚀 Como Configurar

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **"New Project"**
3. Escolha um nome, senha e região
4. Aguarde o projeto ser criado

### 2. Configurar o Banco de Dados

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **"New Query"**
3. Copie e cole todo o conteúdo do arquivo `SETUP_SUPABASE.sql`
4. Clique em **"Run"** para executar
5. Isso irá criar as tabelas e inserir 20 músicas de exemplo

### 3. Configurar Variáveis de Ambiente

1. No dashboard do Supabase, vá em **Settings > API**
2. Copie a **Project URL** e a **anon/public key**
3. Edite o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 4. Configurar Autenticação

1. No Supabase, vá em **Authentication > Providers**
2. Certifique-se que **Email** está habilitado
3. (Opcional) Desabilite "Confirm email" em **Authentication > Settings** para testes rápidos

### 5. Executar o Projeto

```bash
npm install
npm run dev
```

## 📱 Funcionalidades

- ✅ Autenticação completa (login, cadastro, recuperação de senha)
- ✅ Player de música com controles (play/pause, próximo, anterior, barra de progresso, volume)
- ✅ Busca em tempo real por título e artista
- ✅ Filtro por categorias (Rock, Sertanejo, Pop, Eletrônica, Hip-Hop, MPB, Forró)
- ✅ Sistema de favoritos com coração
- ✅ Histórico de reprodução
- ✅ Seção "Mais Ouvidas" com top 6
- ✅ Perfil do usuário com edição de nome e senha
- ✅ Design escuro responsivo com animações suaves
- ✅ Rotas protegidas
- ✅ Toast notifications

## 🛠 Tecnologias

- **React 19** + **Vite**
- **Tailwind CSS 4**
- **Supabase** (autenticação + banco de dados)
- **React Router DOM** (rotas)
- **React Hot Toast** (notificações)
- **React Icons** (ícones)
- **HTML5 Audio API** (player de música)

## 📁 Estrutura do Banco

| Tabela | Descrição |
|--------|-----------|
| `perfis` | Dados do usuário (nome, email, avatar) |
| `musicas` | Catálogo de músicas (título, artista, categoria, áudio, capa) |
| `favoritos` | Músicas favoritadas por cada usuário |
| `historico` | Registro de reprodução de cada usuário |
