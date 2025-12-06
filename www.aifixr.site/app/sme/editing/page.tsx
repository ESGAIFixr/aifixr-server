'use client';

import Header from '@/components/sme/Header';
import MainNavigation from '@/components/sme/MainNavigation';
import { EditingView } from '@/components/sme/EditingView';

export default function EditingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Navigation */}
      <MainNavigation />

      {/* 윤문 AI 뷰 */}
      <div className="pt-[140px]">
        <EditingView />
      </div>
    </div>
  );
}
