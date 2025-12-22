'use client';

import { useState } from 'react';
import { X, Lock, Mail, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface EnterpriseLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function EnterpriseLoginModal({ isOpen, onClose, onLogin }: EnterpriseLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFA, setTwoFA] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 p-8 rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Logo & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20" />
          </div>
          <h1 className="text-[#0F172A] text-xl font-bold mb-1">AIFIX Enterprise Portal</h1>
          <p className="text-[#8C8C8C] text-sm">ESG 관계사 조회 시스템</p>
        </div>

        <h2 className="text-[#0F172A] text-2xl font-bold mb-2 text-center">로그인</h2>
        <p className="text-[#8C8C8C] mb-6 text-center">Enterprise 계정으로 로그인하세요</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-[#0F172A] mb-2 font-medium">이메일</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C8C8C]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@company.com"
                  className="pl-10 h-12 rounded-xl border-gray-200"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[#0F172A] mb-2 font-medium">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C8C8C]" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 h-12 rounded-xl border-gray-200"
                  required
                />
              </div>
            </div>

            {/* 2FA Input (Optional) */}
            <div>
              <label className="block text-[#0F172A] mb-2 font-medium">
                2FA 코드 <span className="text-[#8C8C8C] font-normal">(선택사항)</span>
              </label>
              <Input
                type="text"
                value={twoFA}
                onChange={(e) => setTwoFA(e.target.value)}
                placeholder="000000"
                className="h-12 rounded-xl border-gray-200"
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] hover:shadow-[0_4px_20px_rgba(91,59,250,0.4)] transition-all duration-300 text-white"
            >
              로그인
            </Button>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-[#8C8C8C]">또는</span>
              </span>
            </div>

            {/* SSO Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-2 border-gray-200 hover:border-[#5B3BFA] transition-all"
              onClick={onLogin}
            >
              <Building2 className="w-5 h-5 mr-2" />
              SSO로 로그인
            </Button>

            {/* Google OAuth */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-2 border-gray-200 hover:border-[#5B3BFA] transition-all"
              onClick={onLogin}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-[#5B3BFA] hover:underline text-sm">
            비밀번호를 잊으셨나요?
          </a>
        </div>
      </div>
    </div>
  );
}

