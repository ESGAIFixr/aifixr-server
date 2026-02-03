'use client';

import { Sparkles, User, LogOut, ChevronDown, Settings, Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/oauthservice';
import AIFIXRPanel from '@/components/AIFIXRPanel';

interface HeaderProps {
  onLoginClick: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        setUser(AuthService.getCurrentUser());
      }
    };

    // 초기 체크
    checkAuthStatus();

    // storage 이벤트 리스너 (다른 탭에서 로그인/로그아웃 시)
    window.addEventListener('storage', checkAuthStatus);

    // 커스텀 이벤트 리스너 (같은 탭에서 로그인/로그아웃 시)
    window.addEventListener('authStateChanged', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authStateChanged', checkAuthStatus);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setIsProfileOpen(false);

    // 로그아웃 상태 변경 이벤트 발생
    window.dispatchEvent(new Event('authStateChanged'));

    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] backdrop-blur-[20px] bg-white/85 border-b border-gray-200/50">
      <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D4ABB] to-[#00D4FF] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#1a2332] whitespace-nowrap" style={{ fontFamily: 'Inter Tight, Arial, sans-serif' }}>
            AIFIX
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4 flex-shrink-0 ml-auto relative" ref={dropdownRef}>
          {isAuthenticated && user ? (
            // 로그인 후 - 드롭다운 메뉴
            <>
              {/* AIFIXR Assistant Button */}
              <button
                onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${isAIPanelOpen
                    ? 'bg-[#0D4ABB] text-white'
                    : 'bg-gradient-to-r from-[#00D4FF] to-[#0D4ABB] text-white hover:shadow-lg hover:scale-105'
                  }`}
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">AIFIXR Assistant</span>
              </button>

              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0D4ABB] to-[#00D4FF] text-white hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <span className="font-medium">내 계정</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-[#1a2332]">{user.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      sessionStorage.setItem('fromHomeButton', 'true');
                      router.push('/');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[#1a2332] hover:bg-gray-50 transition-colors"
                  >
                    <Home className="w-5 h-5 text-gray-500" />
                    <span>홈으로 가기</span>
                  </button>
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[#1a2332] hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-500" />
                    <span>프로필</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[#1a2332] hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span>설정</span>
                  </Link>
                  <div className="border-t border-gray-200 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>로그아웃</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            // 로그인 전
            <button
              onClick={onLoginClick}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E91E8C] to-[#8B5CF6] text-white hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
            >
              로그인
            </button>
          )}
        </div>
      </div>

      {/* AIFIXR Panel - 로그인 후에만 표시 */}
      {isAuthenticated && user && (
        <AIFIXRPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />
      )}
    </header>
  );
}