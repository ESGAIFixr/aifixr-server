"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, User, ChevronDown, ChevronLeft, ChevronRight, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import EnterprisePortal from "./components/EnterprisePortal";
import { LeftEnterprisePanel } from "./components/LeftEnterprisePanel";
import { EnterpriseDashboard } from "./components/EnterpriseDashboard";
import { SMEList } from "./components/SMEList";
import { NotificationCenter } from "./components/NotificationCenter";
import { ProfilePage } from "./components/ProfilePage";
import { CompanyDetail } from "./components/CompanyDetail";
import { ReportViewer } from "./components/ReportViewer";
import AIFIXRPanel from "./components/AIFIXRPanel";

type Screen = "portal" | "dashboard" | "sme-list" | "company-detail" | "report-viewer" | "notifications" | "profile";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("portal");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(undefined);
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(undefined);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // 로그인 정보 (실제로는 인증 상태에서 가져와야 함)
  const [user, setUser] = useState<any>(null);

  const handleNavigate = (screen: Screen, companyId?: string, reportId?: string) => {
    setCurrentScreen(screen);
    if (companyId) setSelectedCompanyId(companyId);
    else setSelectedCompanyId(undefined);
    if (reportId) setSelectedReportId(reportId);
    else setSelectedReportId(undefined);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    // 로그아웃 로직 (필요시 구현)
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const renderContent = () => {
    switch (currentScreen) {
      case "portal":
        return <EnterprisePortal onNavigate={handleNavigate} />;
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
          <ReportViewer reportId={selectedReportId} companyId={selectedCompanyId} onNavigate={handleNavigate} onLogout={handleLogout} hideSidebar={true} />
        ) : (
          <EnterprisePortal onNavigate={handleNavigate} />
        );
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
            <button
              onClick={() => handleNavigate('portal')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-[#0F172A] font-semibold text-xl">AIFIX</h3>
                <span className="text-[#8C8C8C] text-sm">대기업 포털</span>
              </div>
            </button>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>AIFIXR Assistant</span>
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0D4ABB] to-[#00D4FF] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-medium">내 계정</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[100] transition-all">
                    {/* 사용자 정보 섹션 - 로그인 정보가 있을 때만 표시 */}
                    {user && (
                      <>
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-[#1a2332]">{user.name || 'Enterprise Admin'}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{user.email || 'admin@company.com'}</p>
                        </div>
                        <Link
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-[#1a2332] hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-5 h-5 text-gray-500" />
                          <span>프로필</span>
                        </Link>
                      </>
                    )}
                    {/* 설정 메뉴 - 항상 표시 */}
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-[#1a2332] hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-gray-500" />
                      <span>설정</span>
                    </Link>
                    {/* 로그아웃 버튼 - 항상 표시 */}
                    <div className="border-t border-gray-200 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 본문: 왼쪽은 3006 스타일의 사이드바/요약, 오른쪽은 기존 포털 화면 */}
      <main className="w-full flex gap-0 relative" style={{ height: 'calc(100vh - 73px)' }}>
        {/* 왼쪽 패널 (3006 대시보드/관계사 목록 사이드바 + 요약) */}
        <div className="flex-shrink-0" style={{ height: 'calc(100vh - 73px)' }}>
          <LeftEnterprisePanel
            currentPage={currentScreen}
            onNavigate={handleNavigate}
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* 오른쪽: 현재 선택된 화면 */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>

        {/* AIFIXR Assistant Panel */}
        {isAIPanelOpen && (
          <div className="flex-shrink-0" style={{ height: 'calc(100vh - 73px)' }}>
            <AIFIXRPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />
          </div>
        )}
      </main>
    </div>
  );
}
