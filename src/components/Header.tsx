import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { HiOutlineSearch, HiOutlineMusicNote, HiOutlineUser, HiOutlineLogout, HiOutlineCog } from 'react-icons/hi';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const { perfil, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-purple-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 group-hover:scale-110 transition-all duration-300">
              <HiOutlineMusicNote className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                SoundWave
              </span>
              <p className="text-xs text-gray-500 mt-0.5">Streaming de Música</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden sm:block">
            <div className="relative group">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-gradient-to-r from-[#1e1e1e] to-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 group-hover:border-white/20"
                placeholder="🔍 Buscar músicas, artistas, gêneros..."
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search - Simplified */}
          <div className="sm:hidden flex-1">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/5 rounded-lg py-2 pl-9 pr-3 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20"
                placeholder="Buscar..."
              />
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 bg-gradient-to-r from-[#1e1e1e] to-[#1a1a1a] hover:from-[#2a2a2a] hover:to-[#252525] rounded-xl px-3 py-2.5 transition-all duration-300 border border-white/10 hover:border-purple-500/30 group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 group-hover:scale-110 transition-all duration-300">
                {perfil?.nome_completo?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-300 hidden md:block max-w-[100px] truncate group-hover:text-white transition-colors">
                {perfil?.nome_completo?.split(' ')[0] || 'Usuário'}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-gradient-to-br from-[#1e1e1e] to-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-purple-500/20 overflow-hidden animate-fade-in backdrop-blur-xl">
                {/* User Info */}
                <div className="px-5 py-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/5">
                  <p className="text-sm font-bold text-white">{perfil?.nome_completo}</p>
                  <p className="text-xs text-gray-400 mt-1">{perfil?.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <HiOutlineUser className="w-5 h-5" />
                    <span>Meu Perfil</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <HiOutlineCog className="w-5 h-5" />
                    <span>Configurações</span>
                  </Link>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                {/* Logout */}
                <div className="py-2">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full"
                  >
                    <HiOutlineLogout className="w-5 h-5" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
