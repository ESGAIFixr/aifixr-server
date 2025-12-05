'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/authservice';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function EditingPage() {
  const router = useRouter();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={() => {}} />
      
      <main className="pt-[144px] px-8">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-4xl font-bold text-[#1a2332] mb-4">윤문 AI</h1>
          <p className="text-gray-600 mb-8">
            AI 기반 문서 윤문 서비스 페이지입니다.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-center text-gray-500">
              윤문 AI 기능이 곧 제공될 예정입니다.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

