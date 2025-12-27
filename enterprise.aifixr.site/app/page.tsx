"use client";

import { useState } from "react";
import { Sparkles, User, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import EnterprisePortal from "./components/EnterprisePortal";
import { LeftEnterprisePanel } from "./components/LeftEnterprisePanel";
import { EnterpriseDashboard } from "./components/EnterpriseDashboard";
import { SMEList } from "./components/SMEList";
import { ReportCenter } from "./components/ReportCenter";
import { NotificationCenter } from "./components/NotificationCenter";
import { ProfilePage } from "./components/ProfilePage";
import { CompanyDetail } from "./components/CompanyDetail";
import { ReportViewer } from "./components/ReportViewer";
import AIFIXRPanel from "./components/AIFIXRPanel";

type Screen = "portal" | "dashboard" | "sme-list" | "sme-diagnosis" | "company-detail" | "report-viewer" | "report-center" | "notifications" | "profile";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("portal");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(undefined);
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(undefined);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
        return <EnterprisePortal onNavigate={handleNavigate} />;
      case "dashboard":
        return <EnterpriseDashboard onNavigate={handleNavigate} onLogout={handleLogout} hideSidebar={true} />;
      case "sme-list":
        return <SMEList onNavigate={handleNavigate} onLogout={handleLogout} hideSidebar={true} />;
      case "sme-diagnosis":
        return <SMEList onNavigate={handleNavigate} onLogout={handleLogout} hideSidebar={true} cardOnly={true} />;
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
      {/* 상단 헤더 */}
      <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-gray-200">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-[#0F172A] font-semibold text-xl">AIFIX</h3>
                <span className="text-[#8C8C8C] text-sm">대기업 포털</span>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>AIFIXR Assistant</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white rounded-lg hover:shadow-lg transition-all">
                <User className="w-4 h-4" />
                <span>내 계정</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 본문: 왼쪽은 3006 스타일의 사이드바/요약, 오른쪽은 기존 포털 화면 */}
      <main className="w-full flex gap-0 relative">
        {/* 왼쪽 패널 (3006 대시보드/관계사 목록 사이드바 + 요약) */}
        <LeftEnterprisePanel 
          currentPage={currentScreen} 
          onNavigate={handleNavigate} 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Toggle Button - 사이드바 바깥쪽 */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute left-[280px] top-20 z-10 w-6 h-6 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
          style={{ left: isSidebarCollapsed ? '72px' : '304px' }}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* 오른쪽: 현재 선택된 화면 */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </main>

      {/* AIFIXR Assistant Panel */}
      <AIFIXRPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />
    </div>
  );
}
