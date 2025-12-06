'use client';

import { useState } from 'react';
import Header from '@/components/sme/Header';
import MainNavigation from '@/components/sme/MainNavigation';
import HeroSection from '@/components/sme/HeroSection';
import FeatureSection from '@/components/sme/FeatureSection';
import BenefitsSection from '@/components/sme/BenefitsSection';
import Footer from '@/components/Footer';

export default function SMEHomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Navigation */}
      <MainNavigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Feature Section */}
      <div id="features">
        <FeatureSection />
      </div>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
