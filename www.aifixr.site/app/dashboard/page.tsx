"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authservice";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, FileText, Edit3, BarChart3, Clock, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
                  환영합니다, {user.name}님! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  AIFix로 ESG 경영을 시작하세요
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-[#0D4ABB]">0</span>
              </div>
              <h3 className="text-gray-600 font-medium">진행 중인 진단</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-3xl font-bold text-green-600">0</span>
              </div>
              <h3 className="text-gray-600 font-medium">완료된 보고서</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Edit3 className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-3xl font-bold text-purple-600">0</span>
              </div>
              <h3 className="text-gray-600 font-medium">AI 윤문 횟수</h3>
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
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group hover:scale-[1.02]"
            >
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
              <div className="space-y-4">
                <div className="text-center py-12 text-gray-500">
                  <p>아직 활동 내역이 없습니다.</p>
                  <p className="text-sm mt-2">위의 기능들을 사용해보세요!</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-gradient-to-r from-[#0D4ABB] to-[#00D4FF] rounded-2xl p-8 shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-6">내 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                {user.picture && (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-20 h-20 rounded-full border-4 border-white/30"
                  />
                )}
                <div>
                  <p className="text-sm opacity-90 mb-1">이름</p>
                  <p className="text-xl font-semibold">{user.name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">이메일</p>
                <p className="text-xl font-semibold">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

