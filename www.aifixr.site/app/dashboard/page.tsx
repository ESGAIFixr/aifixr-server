"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/oauthservice";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";
import DataSharingModal from "@/components/DataSharingModal";
import Level1Survey from "@/components/supply/level1-survey";
import Level2Dashboard from "@/components/supply/level2-dashboard";
import Level3Reporting from "@/components/supply/level3-reporting";
import CustomerESGRequests from "@/components/supply/customer-esg-requests";

type TabType = "level1" | "level2" | "level3" | "customerRequests";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDataSharingModalOpen, setIsDataSharingModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<{ name: string; date: string } | null>(null);
  const [sharedCompanies, setSharedCompanies] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<TabType>("level1");
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCustomerESGRequests, setShowCustomerESGRequests] = useState(false);

  // sessionStorage에서 activeTab 읽기
  useEffect(() => {
    const savedTab = sessionStorage.getItem('activeTab') as TabType | null;
    if (savedTab && ['level1', 'level2', 'level3', 'customerRequests'].includes(savedTab)) {
      setActiveTab(savedTab);
      sessionStorage.removeItem('activeTab'); // 사용 후 제거
    }
  }, []);

  // SME tabs navigation
  const tabs = [
    { id: "level1" as TabType, name: "Level 1", subtitle: "공급망 제출", color: "#5B3BFA" },
    { id: "level2" as TabType, name: "Level 2", subtitle: "내부 관리", color: "#00A3B5" },
    { id: "level3" as TabType, name: "Level 3", subtitle: "지속가능경영", color: "#6B23C0" },
    { id: "customerRequests" as TabType, name: "Customer ESG Requests", subtitle: "", color: "#8B5CF6" },
  ];

  // 예시 데이터 - 추후 API로 대체
  const supplierCompanies = [
    { id: '1', name: 'ABC 기업', date: '2025-01-15' },
    { id: '2', name: 'XYZ 기업', date: '2025-01-12' },
    { id: '3', name: 'DEF 기업', date: '2025-01-10' },
    { id: '4', name: 'GHI 기업', date: '2025-01-08' },
  ];

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push("/");
      return;
    }
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    
    // 환영 메시지 표시 (페이지 로드 시마다)
    if (currentUser) {
      setShowWelcome(true);
      
      // 3초 후 자동으로 사라지기
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F6F8FB] to-[#E8F0FE]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0D4ABB]"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {/* Header */}
      <Header onLoginClick={() => setIsLoginModalOpen(true)} />

      {/* Welcome Popup */}
      <div className={`fixed top-20 left-4 z-50 transition-all duration-500 ease-in-out ${
        showWelcome ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
      }`}>
        <div className="bg-white rounded-xl shadow-2xl p-4 flex items-center gap-3 border border-gray-200 max-w-[320px]">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0D4ABB] to-[#00D4FF] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-[#1a2332] mb-0.5 leading-tight">
              환영합니다, {user?.nickname || user?.name || '사용자'}님! 👋
            </h1>
            <p className="text-gray-600 text-xs">
              AIFix로 ESG 경영을 시작하세요
            </p>
          </div>
          <button
            onClick={() => setShowWelcome(false)}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-[72px] pb-20">
        {/* Supply Tabs Navigation */}
        <div className="sticky top-[72px] z-40 mb-0">
          <div className="max-w-[1440px] mx-auto px-8 py-4">
            {/* Tabs */}
            <nav className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white shadow-lg"
                        : "bg-gray-200 hover:bg-gray-300 border-2 border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <p className={`font-bold ${
                        activeTab === tab.id ? "text-white text-xl" : "text-gray-900 text-xl"
                      }`}>
                        {tab.name}
                      </p>
                      {tab.subtitle && (
                        <p
                          className={`font-semibold ${
                            activeTab === tab.id ? "text-white text-opacity-90 text-base" : "text-gray-700 text-base"
                          }`}
                        >
                          {tab.subtitle}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
            </nav>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-8 pt-0 pb-12">
          {/* Supply Content */}
          <div className="-mx-8">
            {showCustomerESGRequests ? (
              <CustomerESGRequests 
                onTabChange={(tab) => {
                  setActiveTab(tab)
                  setShowCustomerESGRequests(false)
                }}
              />
            ) : (
              <>
                {activeTab === "level1" && <Level1Survey />}
                {activeTab === "level2" && <Level2Dashboard />}
                {activeTab === "level3" && <Level3Reporting />}
                {activeTab === "customerRequests" && (
                  <CustomerESGRequests 
                    onTabChange={(tab) => {
                      setActiveTab(tab)
                      setShowCustomerESGRequests(false)
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer - Removed for cleaner layout */}
      {/* <Footer /> */}

      {/* Data Sharing Modal */}
      {selectedCompany && (
        <DataSharingModal
          isOpen={isDataSharingModalOpen}
          onClose={() => {
            setIsDataSharingModalOpen(false);
            setSelectedCompany(null);
          }}
          companyName={selectedCompany.name}
          onAccept={() => {
            const companyId = supplierCompanies.find(c => c.name === selectedCompany.name)?.id;
            if (companyId) {
              setSharedCompanies(new Set([...sharedCompanies, companyId]));
            }
            setIsDataSharingModalOpen(false);
            setSelectedCompany(null);
          }}
        />
      )}
    </div>
  );
}

