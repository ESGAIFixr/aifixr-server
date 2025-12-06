/**
 * 메인 페이지 커스텀 Hook
 * 
 * 메인 페이지의 상태 관리 및 로직 처리
 * - 탭 상태 관리
 * - 로그인 모달 상태 관리
 * - 인증 체크 및 리다이렉트
 * - 핸들러 생성
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createMainHandlers } from '@/services/mainservice';
import { AuthService } from '@/lib/oauthservice';

export function useMainPage() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState('intro');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 토큰이 있으면 자동으로 대시보드로 리다이렉트
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  // 핸들러 생성
  const handlers = createMainHandlers(setIsLoginModalOpen, router);

  return {
    activeMainTab,
    setActiveMainTab,
    isLoginModalOpen,
    setIsLoginModalOpen,
    ...handlers,
  };
}
