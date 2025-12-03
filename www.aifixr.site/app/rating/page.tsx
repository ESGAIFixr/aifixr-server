'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import { createMainHandlers } from '@/services/mainservice';
import { generateMockData, getAvailableMonths } from '@/services/esgRatingService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export default function RatingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [standard, setStandard] = useState<'K-ESG' | 'ESRS'>('K-ESG');
  const [selectedMonth, setSelectedMonth] = useState<string>(getAvailableMonths()[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');

  const { handleLoginClick, handleLoginRequired, handleLogin } =
    createMainHandlers(setIsLoginModalOpen);

  const companies = useMemo(() => {
    const allCompanies = generateMockData(selectedMonth, 'all', standard);
    if (!searchQuery.trim()) return allCompanies;

    const lower = searchQuery.trim().toLowerCase();
    return allCompanies.filter((company) =>
      company.name.toLowerCase().includes(lower),
    );
  }, [selectedMonth, standard, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header onLoginClick={handleLoginClick} />

      {/* Main Navigation */}
      <MainNavigation
        activeTab="rating"
        setActiveTab={() => { }}
        onLoginRequired={handleLoginRequired}
      />

      {/* Main Content */}
      <main className="pt-[160px] pb-16 px-8">
        <div className="max-w-[1440px] mx-auto">
          {/* Page Title */}
          <div className="mb-8 scroll-mt-[160px]">
            <h1 className="text-4xl font-bold text-[#1a2332] mb-2">
              기업 ESG 등급
            </h1>
            <p className="text-lg text-gray-600">
              매월 업데이트 · 독립적 지속가능성 평가
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            {/* 회사명 검색 */}
            <div className="flex items-center gap-2 flex-1 min-w-[260px]">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                회사명
              </label>
              <div className="flex items-center gap-2 max-w-md w-full">
                <Input
                  placeholder="회사명을 입력해주세요."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-4 py-2 rounded-md bg-[#0D4ABB] text-white text-sm font-medium hover:bg-[#0b3b95] transition-colors whitespace-nowrap"
                >
                  조회
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                평가 기준:
              </span>
              {/* 평가 기준 토글 */}
              <div className="relative inline-flex items-center rounded-full bg-gray-100 p-1">
                <span
                  className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-white shadow transition-transform duration-200 ${standard === 'K-ESG' ? 'translate-x-0' : 'translate-x-full'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setStandard('K-ESG')}
                  className={`relative z-10 px-4 py-1 text-sm font-medium rounded-full transition-colors ${standard === 'K-ESG'
                    ? 'text-[#0D4ABB]'
                    : 'text-gray-500'
                    }`}
                >
                  K-ESG
                </button>
                <button
                  type="button"
                  onClick={() => setStandard('ESRS')}
                  className={`relative z-10 px-4 py-1 text-sm font-medium rounded-full transition-colors ${standard === 'ESRS'
                    ? 'text-[#0D4ABB]'
                    : 'text-gray-500'
                    }`}
                >
                  ESRS
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                기준 날짜:
              </label>
              <Select
                value={selectedMonth}
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableMonths().map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 등급 기준표 */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="border border-gray-200 rounded-lg bg-white px-4 py-2 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">등급 기준:</span>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">S</span>
                      <span className="text-gray-600">95점 이상</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">A+</span>
                      <span className="text-gray-600">90점 이상</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">A</span>
                      <span className="text-gray-600">85점 이상</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">B+</span>
                      <span className="text-gray-600">80점 이상</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">B</span>
                      <span className="text-gray-600">75점 이상</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">C+</span>
                      <span className="text-gray-600">70점 이상</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">C</span>
                      <span className="text-gray-600">65점 이상</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">D</span>
                      <span className="text-gray-600">65점 미만</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden relative z-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">기업명</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">종합 ESG 등급</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">환경 (E)</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">사회 (S)</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">지배구조 (G)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">{company.industry}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold text-gray-900">{company.overallGrade}</span>
                        {getTrendIcon(company.overallTrend)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold text-gray-900">{company.environmental}</span>
                        {getTrendIcon(company.environmentalTrend)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold text-gray-900">{company.social}</span>
                        {getTrendIcon(company.socialTrend)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold text-gray-900">{company.governance}</span>
                        {getTrendIcon(company.governanceTrend)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 text-sm text-gray-500">
            등급은 환경, 사회, 지배구조 요인에 대한 종합적인 분석을 기반으로 평가됩니다. 현재 기준: {standard}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

