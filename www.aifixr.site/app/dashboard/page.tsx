"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/oauthservice";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, FileText, Edit3, BarChart3, Clock, CheckCircle2, Award, Newspaper, Megaphone, Network } from "lucide-react";
import DataSharingModal from "@/components/DataSharingModal";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDataSharingModalOpen, setIsDataSharingModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<{ name: string; date: string } | null>(null);
  const [sharedCompanies, setSharedCompanies] = useState<Set<string>>(new Set());

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
    <div className="min-h-screen bg-gradient-to-br from-[#F6F8FB] to-[#E8F0FE]">
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

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Self Diagnosis */}
            <div
              onClick={() => router.push('/diagnosis')}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group hover:scale-[1.02]"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#1a2332] mb-3">자가진단</h2>
              <p className="text-gray-600 mb-4">
                기업의 ESG 수준을 빠르게 진단하고 개선 방향을 제시받으세요.
              </p>
              <div className="flex items-center text-[#0D4ABB] font-medium group-hover:gap-3 gap-2 transition-all">
                시작하기
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Automated Reports */}
            <div
              onClick={() => router.push('/reports')}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group hover:scale-[1.02]"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#1a2332] mb-3">자동화 보고서</h2>
              <p className="text-gray-600 mb-4">
                AI가 자동으로 ESG 보고서를 생성하고 관리해드립니다.
              </p>
              <div className="flex items-center text-green-600 font-medium group-hover:gap-3 gap-2 transition-all">
                시작하기
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* AI Editing */}
            <div
              onClick={() => router.push('/editing')}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group hover:scale-[1.02] relative"
            >
              {/* 윤문 횟수 - 우측 상단 */}
              <div className="absolute top-6 right-6 text-gray-600 text-sm opacity-70">
                윤문 횟수 : 0
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Edit3 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#1a2332] mb-3">윤문 AI</h2>
              <p className="text-gray-600 mb-4">
                AI가 보고서의 문장을 전문적으로 다듬어드립니다.
              </p>
              <div className="flex items-center text-purple-600 font-medium group-hover:gap-3 gap-2 transition-all">
                시작하기
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-[#1a2332]">최근 활동</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 진행 중인 진단 박스 */}
                <div className="flex flex-col border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                  <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-[#1a2332] text-sm">진행 중인 진단</h3>
                  </div>
                  <div className="overflow-y-auto space-y-2" style={{ maxHeight: '90px' }}>
                    {/* 예시 데이터 - 추후 API로 대체 */}
                    {[
                      { id: '1', title: '2025년 상반기 ESG 진단', date: '2025-01-15' },
                      { id: '2', title: '지속가능경영 전략 수립', date: '2025-01-10' },
                      { id: '3', title: '환경 경영 시스템 구축', date: '2025-01-08' },
                      { id: '4', title: '사회책임경영 실천 계획', date: '2025-01-05' },
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => router.push(`/diagnosis?id=${item.id}`)}
                        className="p-2.5 rounded-lg border border-gray-200 bg-white hover:border-[#0D4ABB] hover:bg-blue-50/50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium text-[#1a2332] group-hover:text-[#0D4ABB] transition-colors text-xs truncate">
                                {item.title}
                              </h4>
                              <span className="text-xs text-gray-500 whitespace-nowrap">{item.date}</span>
                            </div>
                          </div>
                          <span className="text-[#0D4ABB] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-xs">→</span>
                        </div>
                      </div>
                    ))}
                    {[
                      { id: '1', title: '2025년 상반기 ESG 진단', date: '2025-01-15' },
                      { id: '2', title: '지속가능경영 전략 수립', date: '2025-01-10' },
                      { id: '3', title: '환경 경영 시스템 구축', date: '2025-01-08' },
                      { id: '4', title: '사회책임경영 실천 계획', date: '2025-01-05' },
                    ].length === 0 && (
                        <div className="text-center py-4 text-gray-400 text-xs">
                          진행 중인 진단이 없습니다
                        </div>
                      )}
                  </div>
                </div>

                {/* 완료된 보고서 박스 */}
                <div className="flex flex-col border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                  <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-[#1a2332] text-sm">완료된 보고서</h3>
                  </div>
                  <div className="overflow-y-auto space-y-2" style={{ maxHeight: '90px' }}>
                    {/* 예시 데이터 - 추후 API로 대체 */}
                    {[
                      { id: '1', title: '2024년 ESG 지속가능경영 보고서', date: '2025-01-12' },
                      { id: '2', title: '탄소중립 실행 계획 보고서', date: '2025-01-08' },
                      { id: '3', title: '사회공헌 활동 보고서', date: '2025-01-05' },
                      { id: '4', title: '2024년 하반기 ESG 평가 보고서', date: '2024-12-28' },
                      { id: '5', title: '지속가능경영 우수사례 보고서', date: '2024-12-20' },
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => router.push(`/reports?id=${item.id}`)}
                        className="p-2.5 rounded-lg border border-gray-200 bg-white hover:border-green-600 hover:bg-green-50/50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium text-[#1a2332] group-hover:text-green-600 transition-colors text-xs truncate">
                                {item.title}
                              </h4>
                              <span className="text-xs text-gray-500 whitespace-nowrap">{item.date}</span>
                            </div>
                          </div>
                          <span className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-xs">→</span>
                        </div>
                      </div>
                    ))}
                    {[
                      { id: '1', title: '2024년 ESG 지속가능경영 보고서', date: '2025-01-12' },
                      { id: '2', title: '탄소중립 실행 계획 보고서', date: '2025-01-08' },
                      { id: '3', title: '사회공헌 활동 보고서', date: '2025-01-05' },
                      { id: '4', title: '2024년 하반기 ESG 평가 보고서', date: '2024-12-28' },
                      { id: '5', title: '지속가능경영 우수사례 보고서', date: '2024-12-20' },
                    ].length === 0 && (
                        <div className="text-center py-4 text-gray-400 text-xs">
                          완료된 보고서가 없습니다
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supply Chain Monitoring */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Network className="w-6 h-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-[#1a2332]">공급망 모니터링</h2>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <div className="overflow-y-auto space-y-2" style={{ maxHeight: '90px' }}>
                {supplierCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="p-2.5 rounded-lg border border-gray-200 bg-white hover:border-purple-600 hover:bg-purple-50/50 transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-[#1a2332] group-hover:text-purple-600 transition-colors text-xs truncate">
                            {company.name}
                          </h4>
                          <span className="text-xs text-gray-500 whitespace-nowrap">{company.date}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCompany({ name: company.name, date: company.date });
                          setIsDataSharingModalOpen(true);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${sharedCompanies.has(company.id)
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gradient-to-r from-[#0D4ABB] to-[#00D4FF] text-white hover:shadow-md'
                          }`}
                      >
                        {sharedCompanies.has(company.id) ? '데이터 공유 완료' : '데이터 공유요청'}
                      </button>
                    </div>
                  </div>
                ))}
                {supplierCompanies.length === 0 && (
                  <div className="text-center py-4 text-gray-400 text-xs">
                    공급망 모니터링 항목이 없습니다
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-gradient-to-r from-[#0D4ABB] to-[#00D4FF] rounded-2xl p-8 shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-6">내 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                {(user.profileImage || user.picture) && (
                  <img
                    src={user.profileImage || user.picture}
                    alt={user.nickname || user.name || '사용자'}
                    className="w-20 h-20 rounded-full border-4 border-white/30"
                  />
                )}
                <div>
                  <p className="text-sm opacity-90 mb-1">이름</p>
                  <p className="text-xl font-semibold">{user.nickname || user.name || '사용자'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">이메일</p>
                <p className="text-xl font-semibold">{user.email || '이메일 없음'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

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

