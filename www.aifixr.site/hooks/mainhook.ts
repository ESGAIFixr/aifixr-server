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
  const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEnterpriseLoginModalOpen, setIsEnterpriseLoginModalOpen] = useState(false);
  const [allowHomeView, setAllowHomeView] = useState(false);

  // 토큰이 있으면 자동으로 대시보드로 리다이렉트
  // 단, allowHomeView가 true인 경우는 제외
  useEffect(() => {
    if (allowHomeView) {
      return; // 홈으로 가기 버튼을 통해 온 경우 리다이렉트하지 않음
    }
    
    if (AuthService.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router, allowHomeView]);

  // 컴포넌트 마운트 시 sessionStorage 확인
  useEffect(() => {
    const fromHomeButton = sessionStorage.getItem('fromHomeButton');
    if (fromHomeButton === 'true') {
      setAllowHomeView(true);
      sessionStorage.removeItem('fromHomeButton');
    }
  }, []);

  // 핸들러 생성
  const handlers = createMainHandlers(setIsLoginModalOpen, router);

  // 사용자 타입 선택 모달 열기 (로그인 버튼 클릭 시)
  const handleLoginClick = () => {
    setIsUserTypeModalOpen(true);
  };

  // 인증 필요 액션 핸들러 (사용자 타입 선택 모달 열기)
  const handleLoginRequired = () => {
    setIsUserTypeModalOpen(true);
  };

  // 중소기업 사용자 시작하기
  const handleSMEStart = () => {
    setIsUserTypeModalOpen(false);
    setIsLoginModalOpen(true);
  };

  // 대기업 관리자 시작하기
  const handleEnterpriseStart = () => {
    setIsUserTypeModalOpen(false);
    setIsEnterpriseLoginModalOpen(true);
  };

  // Enterprise 로그인 성공 핸들러 (3003번 포트로 리다이렉트)
  const handleEnterpriseLogin = () => {
    setIsEnterpriseLoginModalOpen(false);
    window.location.href = 'http://localhost:3003';
  };

  return {
    activeMainTab,
    setActiveMainTab,
    isUserTypeModalOpen,
    setIsUserTypeModalOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isEnterpriseLoginModalOpen,
    setIsEnterpriseLoginModalOpen,
    handleLoginClick,
    handleLoginRequired,
    handleSMEStart,
    handleEnterpriseStart,
    handleEnterpriseLogin,
    // handlers에서 handleLoginClick과 handleLoginRequired를 제외하고 나머지만 사용
    handleExplore: handlers.handleExplore,
    handleLogin: handlers.handleLogin,
    handleStartDiagnosis: handlers.handleStartDiagnosis,
    handleWatchDemo: handlers.handleWatchDemo,
  };
}
