"use client";

import { useState } from "react";
import EnterprisePortal from "./components/EnterprisePortal";
import { LeftEnterprisePanel } from "./components/LeftEnterprisePanel";
import { EnterpriseDashboard } from "./components/EnterpriseDashboard";
import { SMEList } from "./components/SMEList";
import { ReportCenter } from "./components/ReportCenter";
import { NotificationCenter } from "./components/NotificationCenter";
import { ProfilePage } from "./components/ProfilePage";
import { CompanyDetail } from "./components/CompanyDetail";
import { ReportViewer } from "./components/ReportViewer";

type Screen = "portal" | "dashboard" | "sme-list" | "company-detail" | "report-viewer" | "report-center" | "notifications" | "profile";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("portal");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(undefined);
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(undefined);

  const handleNavigate = (screen: Screen, companyId?: string, reportId?: string) => {
    setCurrentScreen(screen);
    if (companyId) setSelectedCompanyId(companyId);
    else setSelectedCompanyId(undefined);
    if (reportId) setSelectedReportId(reportId);
    else setSelectedReportId(undefined);
  };

  const handleLogout = () => {
    // 로그아웃 로직 (필요시 구현)
  };

  const renderContent = () => {
    switch (currentScreen) {
      case "portal":
        return <EnterprisePortal />;
      case "dashboard":
        return <EnterpriseDashboard onNavigate={handleNavigate} onLogout={handleLogout} hideSidebar={true} />;
      case "sme-list":
        return <SMEList onNavigate={handleNavigate} onLogout={handleLogout} hideSidebar={true} />;
      case "company-detail":
        return selectedCompanyId ? (
          <CompanyDetail companyId={selectedCompanyId} onNavigate={handleNavigate} onLogout={handleLogout} hideSidebar={true} />
        ) : (
          <SMEList onNavigate={handleNavigate} onLogout={handleLogout} hideSidebar={true} />
        );
      case "report-viewer":
        return selectedReportId ? (
          <ReportViewer reportId={selectedReportId} onNavigate={handleNavigate} onLogout={handleLogout} hideSidebar={true} />
        ) : (
          <ReportCenter onNavigate={handleNavigate} onLogout={handleLogout} hideSidebar={true} />
        );
      case "report-center":
        return <ReportCenter onNavigate={handleNavigate} onLogout={handleLogout} hideSidebar={true} />;
      case "notifications":
        return <NotificationCenter onNavigate={handleNavigate} onLogout={handleLogout} hideSidebar={true} />;
      case "profile":
        return <ProfilePage onNavigate={handleNavigate} onLogout={handleLogout} hideSidebar={true} />;
      default:
        return <EnterprisePortal />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {/* 상단 헤더는 그대로 유지 */}
      <header className="bg-gradient-to-r from-[#0B2562] to-[#5B3BFA] text-white sticky top-0 z-40 shadow-lg">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-white">AIFIXR</h2>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                대기업 포털
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 본문: 왼쪽은 3006 스타일의 사이드바/요약, 오른쪽은 기존 포털 화면 */}
      <main className="w-full flex gap-0">
        {/* 왼쪽 패널 (3006 대시보드/관계사 목록 사이드바 + 요약) */}
        <LeftEnterprisePanel currentPage={currentScreen} onNavigate={handleNavigate} />

        {/* 오른쪽: 현재 선택된 화면 */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
