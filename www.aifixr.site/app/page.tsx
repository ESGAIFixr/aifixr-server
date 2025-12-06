'use client';

import Header from '@/components/Header';
import MainNavigation from '@/components/MainNavigation';
import HeroSection from '@/components/HeroSection';
import PainSolutionSection from '@/components/PainSolutionSection';
import PillarSection from '@/components/PillarSection';
import FeatureDemoSection from '@/components/FeatureDemoSection';
import TrustSection from '@/components/TrustSection';
import PricingSection from '@/components/PricingSection';
import FloatingAIButton from '@/components/FloatingAIButton';
import LoginModal from '@/components/LoginModal';
import Footer from '@/components/Footer';
import { useMainPage } from '@/hooks/mainhook';
import { AuthService } from '@/lib/oauthservice';

export default function Home() {
  const {
    activeMainTab,
    setActiveMainTab,
    isLoginModalOpen,
    setIsLoginModalOpen,
    handleLoginClick,
    handleLoginRequired,
    handleLogin,
    handleStartDiagnosis,
    handleWatchDemo,
  } = useMainPage();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header
        onLoginClick={handleLoginClick}
      />

      {/* Main Navigation */}
      <MainNavigation
        activeTab={activeMainTab}
        setActiveTab={setActiveMainTab}
        onLoginRequired={handleLoginRequired}
      />

      {/* ① Hero Section */}
      <HeroSection
        onStartDiagnosis={handleStartDiagnosis}
        onWatchDemo={handleWatchDemo}
      />

      {/* ② Pain → Solution Section (Key Features) */}
      <PainSolutionSection />

      {/* 구분선 */}
      <div className="border-t border-gray-200"></div>

      {/* ③ AIFix 3 Pillar 솔루션 Section */}
      <PillarSection />

      {/* ④ 핵심 기능 시연 Section */}
      <FeatureDemoSection />

      {/* ⑤ 신뢰/검증 Section */}
      <TrustSection />

      {/* ⑥ 요금제 & CTA Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onKakaoLogin={AuthService.handleKakaoLogin}
      />
    </div>
  );
}

