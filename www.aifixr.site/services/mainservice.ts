/**
 * 메인 페이지 핸들러
 * 
 * 메인 랜딩 페이지의 UI 인터랙션 처리
 * - 로그인 모달 제어
 * - 페이지 내 네비게이션 (스크롤)
 * - 진단 시작 및 데모 시연
 */

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * 메인 페이지 핸들러 생성 (클로저 구조)
 * @param setIsLoginModalOpen 로그인 모달 상태 설정 함수
 * @param router Next.js 라우터 인스턴스
 */
export function createMainHandlers(
  setIsLoginModalOpen: (value: boolean) => void,
  router: AppRouterInstance
) {
  /**
   * 로그인 버튼 클릭 핸들러
   * 로그인 모달 표시
   */
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  /**
   * 인증 필요 액션 핸들러
   * 로그인 모달 표시
   */
  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };

  /**
   * 기능 탐색 핸들러
   * features 섹션으로 스무스 스크롤
   */
  const handleExplore = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * 로그인 모달 닫기 핸들러
   * (실제 로그인은 OAuth 핸들러에서 처리)
   */
  const handleLogin = () => {
    console.log('Login action triggered');
    setIsLoginModalOpen(false);
  };

  /**
   * 진단 시작 핸들러
   * SME 진단 페이지로 이동
   */
  const handleStartDiagnosis = () => {
    router.push('/intro');
  };

  /**
   * 데모 영상 보기 핸들러
   * 데모 영상 모달은 HeroSection 내부에서 처리
   */
  const handleWatchDemo = () => {
    console.log('데모 영상 보기');
  };

  return {
    handleLoginClick,
    handleLoginRequired,
    handleExplore,
    handleLogin,
    handleStartDiagnosis,
    handleWatchDemo,
  };
}
