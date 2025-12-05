'use client';

import Header from '@/components/sme/Header';
import MainNavigation from '@/components/sme/MainNavigation';
import { ReportTemplateView } from '@/components/sme/ReportTemplateView';

export default function AutoReportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Navigation */}
      <MainNavigation />

      {/* 자동화 보고서 뷰 */}
      <div className="pt-[140px]">
        <ReportTemplateView />
      </div>
    </div>
  );
}
