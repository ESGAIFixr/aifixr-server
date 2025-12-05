'use client';

import Header from '@/components/sme/Header';
import MainNavigation from '@/components/sme/MainNavigation';
import { AutomatedReportView } from '@/components/sme/AutomatedReportView';

export default function SelfDiagnosisPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Navigation */}
      <MainNavigation />

      {/* 자가진단 뷰 */}
      <div className="pt-[140px]">
        <AutomatedReportView />
      </div>
    </div>
  );
}
