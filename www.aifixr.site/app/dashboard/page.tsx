"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/oauthservice";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, FileText, Edit3, BarChart3, Clock, CheckCircle2, Award, Newspaper, Megaphone, Network } from "lucide-react";
import DataSharingModal from "@/components/DataSharingModal";
import Level1Survey from "@/components/supply/level1-survey";
import Level2Dashboard from "@/components/supply/level2-dashboard";
import Level3Reporting from "@/components/supply/level3-reporting";

type TabType = "level1" | "level2" | "level3";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDataSharingModalOpen, setIsDataSharingModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<{ name: string; date: string } | null>(null);
  const [sharedCompanies, setSharedCompanies] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<TabType>("level1");

  // SME tabs navigation
  const tabs = [
    { id: "level1" as TabType, name: "Level 1", subtitle: "공급망 제출", color: "#5B3BFA" },
    { id: "level2" as TabType, name: "Level 2", subtitle: "내부 관리", color: "#00A3B5" },
    { id: "level3" as TabType, name: "Level 3", subtitle: "지속가능경영", color: "#6B23C0" },
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

      {/* Main Content */}
      <main className="pt-[72px] pb-20">
        <div className="max-w-[1440px] mx-auto px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0D4ABB] to-[#00D4FF] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#1a2332] mb-2">
                  환영합니다, {user.nickname || user.name || '사용자'}님! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  AIFix로 ESG 경영을 시작하세요
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Cards - 얇은 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* 기업 ESG 등급 */}
            <div
              onClick={() => router.push('/rating')}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer group border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D4ABB] to-[#00D4FF] flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1a2332] text-sm">기업 ESG 등급</h3>
                  <p className="text-xs text-gray-500 mt-0.5">기업 ESG 평가 확인</p>
                </div>
              </div>
            </div>

            {/* ESG 소식 */}
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Newspaper className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1a2332] text-sm">ESG 소식</h3>
                  <p className="text-xs text-gray-500 mt-0.5">준비 중입니다</p>
                </div>
              </div>
            </div>

            {/* 공지사항 */}
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1a2332] text-sm">공지사항</h3>
                  <p className="text-xs text-gray-500 mt-0.5">준비 중입니다</p>
                </div>
              </div>
            </div>
          </div>

          {/* Supply Tabs Navigation */}
          <div className="bg-white border-b-2 border-gray-200 sticky top-[72px] z-40 shadow-sm mb-6">
            <div className="max-w-[1440px] mx-auto px-8 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">AIFIXR</h2>
                  <span className="px-3 py-1 bg-[#F6F8FB] rounded-full text-sm text-gray-600">
                    중소기업 모드
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <nav className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <div className="text-center">
                      <p className={activeTab === tab.id ? "text-white" : "text-gray-900"}>
                        {tab.name}
                      </p>
                      <p
                        className={`text-sm ${
                          activeTab === tab.id ? "text-white text-opacity-90" : "text-gray-600"
                        }`}
                      >
                        {tab.subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Supply Content */}
          <div className="-mx-8">
            {activeTab === "level1" && <Level1Survey />}
            {activeTab === "level2" && <Level2Dashboard />}
            {activeTab === "level3" && <Level3Reporting />}
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

