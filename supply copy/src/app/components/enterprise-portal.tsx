"use client";

import { useState } from "react";
import { Search, Filter, AlertTriangle, TrendingUp, FileDown, Building2 } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  industry: string;
  region: string;
  revenue: string;
  eRisk: "high" | "medium" | "low";
  sRisk: "high" | "medium" | "low";
  gRisk: "high" | "medium" | "low";
  overallRisk: number;
  level1Score: number;
  improvementCount: number;
}

const suppliers: Supplier[] = [
  {
    id: "1",
    name: "A전자",
    industry: "전자부품",
    region: "경기",
    revenue: "120억",
    eRisk: "medium",
    sRisk: "high",
    gRisk: "low",
    overallRisk: 65,
    level1Score: 45,
    improvementCount: 3,
  },
  {
    id: "2",
    name: "B소재",
    industry: "화학",
    region: "충남",
    revenue: "85억",
    eRisk: "high",
    sRisk: "medium",
    gRisk: "medium",
    overallRisk: 72,
    level1Score: 38,
    improvementCount: 5,
  },
  {
    id: "3",
    name: "C금속",
    industry: "금속가공",
    region: "경북",
    revenue: "95억",
    eRisk: "high",
    sRisk: "high",
    gRisk: "medium",
    overallRisk: 78,
    level1Score: 32,
    improvementCount: 7,
  },
  {
    id: "4",
    name: "D플라스틱",
    industry: "플라스틱",
    region: "충북",
    revenue: "65억",
    eRisk: "medium",
    sRisk: "medium",
    gRisk: "low",
    overallRisk: 55,
    level1Score: 52,
    improvementCount: 2,
  },
  {
    id: "5",
    name: "E테크",
    industry: "IT서비스",
    region: "서울",
    revenue: "150억",
    eRisk: "low",
    sRisk: "low",
    gRisk: "low",
    overallRisk: 35,
    level1Score: 68,
    improvementCount: 1,
  },
];

const heatmapData = [
  { category: "E", high: 35, medium: 45, low: 20 },
  { category: "S", high: 28, medium: 52, low: 20 },
  { category: "G", high: 22, medium: 48, low: 30 },
];

export default function EnterprisePortal() {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "#E30074"; // Courage
      case "medium":
        return "#F59E0B"; // Orange
      case "low":
        return "#4CAF50"; // Integrity
      default:
        return "#gray";
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case "high":
        return "높음";
      case "medium":
        return "중간";
      case "low":
        return "낮음";
      default:
        return "";
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === "all" || s.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const highRiskSuppliers = suppliers
    .filter((s) => s.overallRisk >= 70)
    .sort((a, b) => b.overallRisk - a.overallRisk)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-[#F6F8FB] pb-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">전체 협력사</p>
              <Building2 className="w-5 h-5 text-[#0B2562]" />
            </div>
            <h2 className="text-[#0B2562]">{suppliers.length}개</h2>
            <p className="text-sm text-gray-500 mt-1">Level 1 제출 완료</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm p-6 border-2 border-red-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-red-700">고위험 협력사</p>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-red-700">{highRiskSuppliers.length}개</h2>
            <p className="text-sm text-red-600 mt-1">즉시 관리 필요</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border-2 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-green-700">개선 진행 중</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-green-700">
              {suppliers.reduce((sum, s) => sum + s.improvementCount, 0)}건
            </h2>
            <p className="text-sm text-green-600 mt-1">Level 2 활동</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-700">평균 리스크 점수</p>
              <div className="w-5 h-5 rounded-full bg-[#00A3B5]" />
            </div>
            <h2 className="text-blue-700">
              {Math.round(suppliers.reduce((sum, s) => sum + s.overallRisk, 0) / suppliers.length)}점
            </h2>
            <p className="text-sm text-blue-600 mt-1">100점 만점</p>
          </div>
        </div>

        {/* Section 1: 공급망 리스크 히트맵 */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="mb-6">공급망 리스크 히트맵</h2>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {heatmapData.map((item) => (
              <div key={item.category} className="border-2 border-gray-200 rounded-xl p-6">
                <h4 className="mb-4 text-center">
                  {item.category === "E" ? "환경" : item.category === "S" ? "사회" : "지배구조"}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded" style={{ backgroundColor: "#E30074" }} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">높음</span>
                        <span className="text-sm text-gray-600">{item.high}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${item.high}%`, backgroundColor: "#E30074" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded" style={{ backgroundColor: "#F59E0B" }} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">중간</span>
                        <span className="text-sm text-gray-600">{item.medium}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${item.medium}%`, backgroundColor: "#F59E0B" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded" style={{ backgroundColor: "#4CAF50" }} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">낮음</span>
                        <span className="text-sm text-gray-600">{item.low}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${item.low}%`, backgroundColor: "#4CAF50" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="협력사명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0B2562] focus:outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0B2562] focus:outline-none appearance-none"
              >
                <option value="all">전체 산업</option>
                <option value="전자부품">전자부품</option>
                <option value="화학">화학</option>
                <option value="금속가공">금속가공</option>
                <option value="플라스틱">플라스틱</option>
                <option value="IT서비스">IT서비스</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: 개선 시급 협력사 목록 */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="mb-6">개선 시급 협력사 목록 (Top 10)</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-4">순위</th>
                  <th className="text-left p-4">협력사명</th>
                  <th className="text-left p-4">산업</th>
                  <th className="text-left p-4">지역</th>
                  <th className="text-center p-4">E 리스크</th>
                  <th className="text-center p-4">S 리스크</th>
                  <th className="text-center p-4">G 리스크</th>
                  <th className="text-center p-4">종합 점수</th>
                  <th className="text-center p-4">액션</th>
                </tr>
              </thead>
              <tbody>
                {highRiskSuppliers.map((supplier, idx) => (
                  <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                        {idx + 1}
                      </span>
                    </td>
                    <td className="p-4">
                      <p>{supplier.name}</p>
                      <p className="text-sm text-gray-500">{supplier.revenue}</p>
                    </td>
                    <td className="p-4 text-sm">{supplier.industry}</td>
                    <td className="p-4 text-sm">{supplier.region}</td>
                    <td className="p-4 text-center">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-white text-sm"
                        style={{ backgroundColor: getRiskColor(supplier.eRisk) }}
                      >
                        {getRiskText(supplier.eRisk)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-white text-sm"
                        style={{ backgroundColor: getRiskColor(supplier.sRisk) }}
                      >
                        {getRiskText(supplier.sRisk)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-white text-sm"
                        style={{ backgroundColor: getRiskColor(supplier.gRisk) }}
                      >
                        {getRiskText(supplier.gRisk)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-lg" style={{ color: getRiskColor(supplier.overallRisk >= 70 ? "high" : supplier.overallRisk >= 50 ? "medium" : "low") }}>
                        {supplier.overallRisk}점
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedSupplier(supplier)}
                        className="px-4 py-2 rounded-lg bg-[#0B2562] text-white hover:bg-opacity-90 transition-colors"
                      >
                        상세 보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance Report Section */}
        <div className="bg-gradient-to-br from-[#0B2562] to-[#5B3BFA] rounded-xl shadow-sm p-8 text-white">
          <h2 className="mb-4 text-white">규제 대응 증빙 보고서 자동 생성</h2>
          <p className="mb-6 text-white text-opacity-90">
            CSRD/CSDDD 등 EU 공급망 실사 규제에 대응하기 위한 증빙 자료를 자동으로 생성합니다.
          </p>
          <button className="flex items-center gap-3 px-6 py-3 bg-white text-[#0B2562] rounded-lg hover:shadow-lg transition-all">
            <FileDown className="w-5 h-5" />
            <span>공급망 리스크 관리 현황 보고서 생성</span>
          </button>
        </div>
      </div>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="mb-2">{selectedSupplier.name} 상세 리스크 정보</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>산업: {selectedSupplier.industry}</span>
                    <span>지역: {selectedSupplier.region}</span>
                    <span>매출: {selectedSupplier.revenue}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Level 1 Snapshot */}
              <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                <h4 className="mb-4">Level 1 스냅샷 (원청사 방어 논리용)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">환경 (E)</p>
                    <p className="text-2xl" style={{ color: getRiskColor(selectedSupplier.eRisk) }}>
                      {getRiskText(selectedSupplier.eRisk)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">5개 항목 중 2개 미흡</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">사회 (S)</p>
                    <p className="text-2xl" style={{ color: getRiskColor(selectedSupplier.sRisk) }}>
                      {getRiskText(selectedSupplier.sRisk)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">6개 항목 중 4개 미흡</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">지배구조 (G)</p>
                    <p className="text-2xl" style={{ color: getRiskColor(selectedSupplier.gRisk) }}>
                      {getRiskText(selectedSupplier.gRisk)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">5개 항목 중 1개 미흡</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💼 원청사 방어 논리: "{selectedSupplier.name}는 Level 1 설문을 통해 현황을 투명하게 
                    공개하였으며, 당사는 이를 기반으로 리스크를 파악하고 개선을 요청하였습니다."
                  </p>
                </div>
              </div>

              {/* Level 2 Improvement Log */}
              <div className="mb-6">
                <h4 className="mb-4">Level 2 개선 이력 로그 (합리적 노력 증빙)</h4>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                        ✓
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="mb-1">안전보건 관리 체계 구축 완료</p>
                      <p className="text-sm text-gray-600">
                        2024.11.20 - Level 2 템플릿 제공 및 개선 완료
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        당사의 지원을 통해 개선 완료
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        ⋯
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="mb-1">에너지 관리 프로세스 구축 중</p>
                      <p className="text-sm text-gray-600">
                        2024.12.01 - 측정 시스템 도입 진행 중
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        당사가 권장 솔루션 제공 및 모니터링 중
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                        !
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="mb-1">내부통제 절차 수립 필요</p>
                      <p className="text-sm text-gray-600">
                        2024.12.15 - 개선 요청 발송
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        당사가 가이드라인 제공 및 대응 요청
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white rounded-lg hover:shadow-lg transition-all">
                  개선 요청 이메일 발송
                </button>
                <button className="flex-1 px-6 py-3 border-2 border-[#0B2562] text-[#0B2562] rounded-lg hover:bg-gray-50 transition-all">
                  협력사 지원 프로그램 안내
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
