"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileDown, TrendingUp, TrendingDown, CheckCircle2, FileText, BarChart3, Edit3, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface KPICard {
  id: string;
  title: string;
  category: "E" | "S" | "G";
  value: number;
  unit: string;
  change: number;
  trend: "up" | "down";
}

const kpiCards: KPICard[] = [
  {
    id: "1",
    title: "안전보건 정책 보유율",
    category: "S",
    value: 100,
    unit: "%",
    change: 35,
    trend: "up",
  },
  {
    id: "2",
    title: "정기 점검 프로세스 구축률",
    category: "S",
    value: 85,
    unit: "%",
    change: 65,
    trend: "up",
  },
  {
    id: "3",
    title: "에너지 사용량 모니터링률",
    category: "E",
    value: 70,
    unit: "%",
    change: 70,
    trend: "up",
  },
  {
    id: "4",
    title: "폐기물 재활용률",
    category: "E",
    value: 62,
    unit: "%",
    change: 22,
    trend: "up",
  },
  {
    id: "5",
    title: "윤리경영 정책 문서화율",
    category: "G",
    value: 100,
    unit: "%",
    change: 48,
    trend: "up",
  },
  {
    id: "6",
    title: "정보보호 체계 구축률",
    category: "G",
    value: 75,
    unit: "%",
    change: 25,
    trend: "up",
  },
];

const complianceData = [
  { 항목: "환경", GRI: 78, ESRS: 72, 금융기관: 80 },
  { 항목: "사회", GRI: 85, ESRS: 80, 금융기관: 88 },
  { 항목: "지배구조", GRI: 82, ESRS: 78, 금융기관: 85 },
];

const mappingPreview = [
  {
    관리행동: "정기 안전보건 점검 실시",
    level: "Level 1/2",
    공시항목: "GRI 403-2: 위험도 평가, 사고 조사 및 시정 조치",
    매핑상태: "완료",
  },
  {
    관리행동: "에너지 사용량 측정",
    level: "Level 1/2",
    공시항목: "GRI 302-1: 조직 내 에너지 소비",
    매핑상태: "완료",
  },
  {
    관리행동: "윤리경영 정책 수립",
    level: "Level 1/2",
    공시항목: "GRI 205-2: 반부패 정책 및 절차에 관한 커뮤니케이션 및 교육",
    매핑상태: "완료",
  },
  {
    관리행동: "폐기물 재활용 관리",
    level: "Level 1/2",
    공시항목: "GRI 306-2: 폐기물 관련 중대한 영향 관리",
    매핑상태: "완료",
  },
];

export default function Level3Reporting() {
  const router = useRouter();
  const [selectedStandard, setSelectedStandard] = useState<string>("GRI");
  const [showMapping, setShowMapping] = useState<boolean>(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "E":
        return "#00A3B5";
      case "S":
        return "#5B3BFA";
      case "G":
        return "#6B23C0";
      default:
        return "#gray";
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] pb-12">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Dashboard Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          {/* Main Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Self Diagnosis */}
            <div 
              onClick={() => router.push('/diagnosis')}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group hover:scale-[1.02] border border-gray-100"
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
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group hover:scale-[1.02] border border-gray-100"
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
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group hover:scale-[1.02] relative border border-gray-100"
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
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
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
                    {[
                      { id: '1', title: '2025년 상반기 ESG 진단', date: '2025-01-15' },
                      { id: '2', title: '지속가능경영 전략 수립', date: '2025-01-10' },
                      { id: '3', title: '환경 경영 시스템 구축', date: '2025-01-08' },
                      { id: '4', title: '사회책임경영 실천 계획', date: '2025-01-05' },
                    ].map((item) => (
                      <div
                        key={item.id}
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
                  </div>
                </div>

                {/* 완료된 보고서 박스 */}
                <div className="flex flex-col border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                  <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-[#1a2332] text-sm">완료된 보고서</h3>
                  </div>
                  <div className="overflow-y-auto space-y-2" style={{ maxHeight: '90px' }}>
                    {[
                      { id: '1', title: '2024년 ESG 지속가능경영 보고서', date: '2025-01-12' },
                      { id: '2', title: '탄소중립 실행 계획 보고서', date: '2025-01-08' },
                      { id: '3', title: '사회공헌 활동 보고서', date: '2025-01-05' },
                      { id: '4', title: '2024년 하반기 ESG 평가 보고서', date: '2024-12-28' },
                      { id: '5', title: '지속가능경영 우수사례 보고서', date: '2024-12-20' },
                    ].map((item) => (
                      <div
                        key={item.id}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: 보고서 생성 마법사 */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-[#6B23C0]" />
            <h2>지속가능경영 보고서 초안 자동 생성</h2>
          </div>

          {/* Step 1: 기준 선택 */}
          <div className="mb-8">
            <h4 className="mb-4">단계 1: 출력 기준 선택</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["GRI", "ESRS", "금융기관 제출 양식"].map((standard) => (
                <button
                  key={standard}
                  onClick={() => setSelectedStandard(standard)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedStandard === standard
                      ? "border-[#6B23C0] bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{standard}</span>
                    {selectedStandard === standard && (
                      <CheckCircle2 className="w-5 h-5 text-[#6B23C0]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: 데이터 매핑 미리보기 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4>단계 2: 데이터 매핑 미리보기</h4>
              <button
                onClick={() => setShowMapping(!showMapping)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {showMapping ? "숨기기" : "상세 보기"}
              </button>
            </div>

            <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-[#6B23C0] mb-4">
              <p className="text-center">
                <span className="text-lg" style={{ color: "#6B23C0" }}>
                  ✨ 새 사실 없음, 표현만 바뀜
                </span>
              </p>
              <p className="text-center text-sm text-gray-600 mt-2">
                Level 1/2에서 입력한 관리 행동 데이터가 {selectedStandard} 기준에 맞게 자동으로 변환됩니다.
              </p>
            </div>

            {showMapping && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left border">관리 행동 (Level 1/2)</th>
                      <th className="p-3 text-left border">공시 항목 ({selectedStandard})</th>
                      <th className="p-3 text-center border">매핑 상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappingPreview.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-3 border">
                          <p>{row.관리행동}</p>
                          <p className="text-sm text-gray-500">{row.level}</p>
                        </td>
                        <td className="p-3 border text-sm">{row.공시항목}</td>
                        <td className="p-3 border text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            {row.매핑상태}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Step 3: 산출물 다운로드 */}
          <div>
            <h4 className="mb-4">단계 3: 산출물 다운로드</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <FileDown className="w-6 h-6" />
                  <div className="text-left">
                    <p>보고서 초안 다운로드</p>
                    <p className="text-sm text-white text-opacity-90">
                      Word / PDF 형식
                    </p>
                  </div>
                </div>
              </button>

              <button className="flex items-center justify-between p-4 rounded-xl border-2 border-[#00B4FF] bg-white hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-3">
                  <FileDown className="w-6 h-6 text-[#00B4FF]" />
                  <div className="text-left">
                    <p className="text-gray-900">KPI 요약표 다운로드</p>
                    <p className="text-sm text-gray-600">Excel 형식</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Compliance Chart */}
          <div className="mt-8">
            <h4 className="mb-4">기준별 준수율 비교</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="항목" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="GRI" fill="#5B3BFA" radius={[8, 8, 0, 0]} />
                <Bar dataKey="ESRS" fill="#00A3B5" radius={[8, 8, 0, 0]} />
                <Bar dataKey="금융기관" fill="#6B23C0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 2: 경영진용 KPI 요약 대시보드 */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="mb-6">ESG 핵심 성과 지표 (KPI) 요약</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpiCards.map((kpi) => (
              <div
                key={kpi.id}
                className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-1 h-16 rounded-full"
                    style={{ backgroundColor: getCategoryColor(kpi.category) }}
                  />
                  <span
                    className="px-3 py-1 rounded-full text-sm text-white"
                    style={{ backgroundColor: getCategoryColor(kpi.category) }}
                  >
                    {kpi.category}
                  </span>
                </div>

                <h4 className="mb-4 min-h-[3rem]">{kpi.title}</h4>

                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-4xl" style={{ color: getCategoryColor(kpi.category) }}>
                      {kpi.value}
                      <span className="text-2xl">{kpi.unit}</span>
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    kpi.trend === "up" ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  {kpi.trend === "up" ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <span
                    className={`text-sm ${
                      kpi.trend === "up" ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Level 1 대비 +{kpi.change}%p
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Executive Summary */}
          <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-[#6B23C0]">
            <h4 className="mb-4" style={{ color: "#6B23C0" }}>
              경영진 요약
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">전체 ESG 성과</p>
                <h3 className="text-[#6B23C0]">77.5점</h3>
                <p className="text-sm text-gray-500">Level 1 대비 +32.8점</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">달성 KPI</p>
                <h3 className="text-[#6B23C0]">6/6개</h3>
                <p className="text-sm text-gray-500">목표 대비 100% 달성</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">공시 준비도</p>
                <h3 className="text-[#6B23C0]">82%</h3>
                <p className="text-sm text-gray-500">GRI 기준</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
