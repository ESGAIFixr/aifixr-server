import { useState, useRef } from 'react';
import { Building2, TrendingUp, Award, AlertTriangle, FileText, Share2 } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { SearchAndFilter, FilterValues } from './SearchAndFilter';
import { mockCompanies } from '../data/mockCompanies';
import { useMultipleClickOutside } from '../hooks/useClickOutside';

interface EnterpriseDashboardProps {
  onNavigate: (screen: any, companyId?: string, reportId?: string) => void;
  onLogout: () => void;
  hideSidebar?: boolean;
}

const companies = mockCompanies;

export function EnterpriseDashboard({ onNavigate, onLogout, hideSidebar = false }: EnterpriseDashboardProps) {
  const [filters, setFilters] = useState<FilterValues>({
    searchQuery: '',
    industryFilter: 'all',
    gradeFilter: 'all',
    riskFilter: 'all',
  });
  const [shareOpenId, setShareOpenId] = useState<string | null>(null);
  const [reportShareOpenId, setReportShareOpenId] = useState<string | null>(null);
  const shareDropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const reportShareDropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useMultipleClickOutside(shareDropdownRefs, shareOpenId, () => setShareOpenId(null));
  useMultipleClickOutside(reportShareDropdownRefs, reportShareOpenId, () => setReportShareOpenId(null));

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(filters.searchQuery?.toLowerCase() || '');
    const matchesGrade = !filters.gradeFilter || filters.gradeFilter === 'all' || company.grade === filters.gradeFilter;
    const matchesIndustry = !filters.industryFilter || filters.industryFilter === 'all' || company.industry === filters.industryFilter;
    const matchesRisk = !filters.riskFilter || filters.riskFilter === 'all' || true; // riskFilter는 현재 company 데이터에 없으므로 일단 true로 설정
    return matchesSearch && matchesGrade && matchesIndustry && matchesRisk;
  });

  // 정렬 로직
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    const sortBy = filters.sortBy || 'name';
    const sortOrder = filters.sortOrder || 'asc';

    if (sortBy === 'name') {
      // 이름 기준 정렬
      const comparison = a.name.localeCompare(b.name, 'ko');
      return sortOrder === 'asc' ? comparison : -comparison;
    } else if (sortBy === 'date') {
      // 날짜 기준 정렬 (YYYY.MM.DD 형식)
      const parseDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('.').map(Number);
        return new Date(year, month - 1, day).getTime();
      };
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      const comparison = dateA - dateB;
      return sortOrder === 'asc' ? comparison : -comparison;
    }
    return 0;
  });
  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">
      {!hideSidebar && <Sidebar currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout} />}

      <div className={`flex-1 ${!hideSidebar ? 'ml-64' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[#0F172A] mb-2">관계사 문서관리</h1>
            <p className="text-[#8C8C8C]">관계사 ESG 현황을 한눈에 확인하세요</p>
          </div>

          {/* Section A — KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] hover:shadow-[0_6px_30px_rgba(91,59,250,0.15)] transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-[#0F172A]">60</h2>
              <p className="text-[#8C8C8C]">총 관계사 수</p>
            </Card>

            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] hover:shadow-[0_6px_30px_rgba(91,59,250,0.15)] transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00B4FF] to-[#5B3BFA] flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-[#0F172A]">B+</h2>
              <p className="text-[#8C8C8C]">평균 ESG 등급</p>
            </Card>

            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] hover:shadow-[0_6px_30px_rgba(91,59,250,0.15)] transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E30074] to-[#FF6B9D] flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-[#0F172A]">7</h2>
              <p className="text-[#8C8C8C]">고위험 관계사</p>
            </Card>

            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] hover:shadow-[0_6px_30px_rgba(91,59,250,0.15)] transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00B4FF] to-[#A58DFF] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-[#0F172A]">+8.2%</h2>
              <p className="text-[#8C8C8C]">등급 상승률 (30일)</p>
            </Card>
          </div>

          {/* Search and Filter */}
          <SearchAndFilter
            onFilterChange={handleFilterChange}
            showCompletionFilter={false}
          />

          {/* Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[#8C8C8C]">총 {sortedCompanies.length}개 기업</p>
          </div>

          {/* Table */}
          <Card className="rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F6F8FB]">
                  <tr>
                    <th className="text-left p-4 text-[#0F172A] whitespace-nowrap">날짜</th>
                    <th className="text-left p-4 text-[#0F172A]">관계사명</th>
                    <th className="text-left p-4 text-[#0F172A]">업종</th>
                    <th className="text-center p-4 text-[#0F172A]">위험도(level 1)</th>
                    <th className="text-center p-4 text-[#0F172A]">ESG대응확인서</th>
                    <th className="text-center p-4 text-[#0F172A]">ESG등급(level 3)</th>
                    <th className="text-center p-4 text-[#0F172A]">지속가능경영보고서</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCompanies.map((company, idx) => {
                    const riskLevel = idx % 3 === 0 ? 'high' : idx % 3 === 1 ? 'medium' : 'low';
                    const riskLabel = riskLevel === 'high' ? '높음' : riskLevel === 'medium' ? '중간' : '낮음';

                    return (
                      <tr
                        key={company.id}
                        className="border-t border-gray-100 hover:bg-[#F6F8FB] transition-colors cursor-pointer"
                        onClick={() => onNavigate('company-detail', company.id)}
                      >
                        <td className="p-4 text-[#8C8C8C] whitespace-nowrap">{company.date.replace('2024.', '24.').replace('2025.', '25.').replace('2023.', '23.')}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center text-xl">
                              {company.logo}
                            </div>
                            <span className="text-[#0F172A]">{company.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-[#8C8C8C]">{company.industry}</td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full ${riskLevel === 'high'
                              ? 'bg-[#E30074]/10 text-[#E30074]'
                              : riskLevel === 'medium'
                                ? 'bg-[#A58DFF]/10 text-[#A58DFF]'
                                : 'bg-[#00B4FF]/10 text-[#00B4FF]'
                              }`}
                          >
                            {riskLabel}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {idx % 3 === 2 ? (
                            <span className="text-[#0F172A]">미제출</span>
                          ) : (
                            <div className="flex items-center justify-center gap-2 relative">
                              <div 
                                className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center cursor-pointer hover:border-red-700 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigate('company-detail', company.id);
                                }}
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#DC2626" stroke="#DC2626" strokeWidth="1.5" />
                                  <path d="M14 2V8H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M7 10H13M7 14H17M7 18H15" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                                  <circle cx="8" cy="11" r="1" fill="white" />
                                </svg>
                              </div>
                              <div className="relative" ref={(el) => { shareDropdownRefs.current[company.id] = el; }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShareOpenId(shareOpenId === company.id ? null : company.id);
                                  }}
                                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition-colors"
                                  title="공유"
                                >
                                  <Share2 className="w-5 h-5 text-[#8C8C8C]" />
                                </button>

                                {/* Share Dropdown */}
                                {shareOpenId === company.id && (
                                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="text-sm font-semibold text-[#0F172A]">공유하기</h4>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShareOpenId(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                                      >
                                        ×
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      {/* Slack */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Slack 공유 로직
                                          setShareOpenId(null);
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                      >
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200 overflow-hidden">
                                          <img
                                            src="https://cdn.simpleicons.org/slack/4A154B"
                                            alt="Slack"
                                            className="w-7 h-7 object-contain"
                                          />
                                        </div>
                                        <span className="text-xs text-[#0F172A]">Slack</span>
                                      </button>

                                      {/* Teams */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Teams 공유 로직
                                          setShareOpenId(null);
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                      >
                                        <div className="w-12 h-12 rounded-full bg-[#6264A7] flex items-center justify-center shadow-sm">
                                          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white">
                                            <path d="M19.5 4.5h-15A1.5 1.5 0 0 0 3 6v12a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5zm-8.25 9.75a.75.75 0 1 1-1.5 0v-4.5a.75.75 0 0 1 1.5 0v4.5zm4.5 0a.75.75 0 1 1-1.5 0v-4.5a.75.75 0 0 1 1.5 0v4.5z" />
                                            <circle cx="12" cy="8.25" r="1.5" fill="white" />
                                          </svg>
                                        </div>
                                        <span className="text-xs text-[#0F172A]">Teams</span>
                                      </button>

                                      {/* Kakao */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Kakao 공유 로직
                                          setShareOpenId(null);
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                      >
                                        <div className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center shadow-sm">
                                          <img
                                            src="https://cdn.simpleicons.org/kakaotalk/3C1E1E"
                                            alt="Kakao"
                                            className="w-7 h-7 object-contain"
                                          />
                                        </div>
                                        <span className="text-xs text-[#0F172A]">카카오</span>
                                      </button>

                                      {/* URL 복사 */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigator.clipboard.writeText(window.location.href);
                                          setShareOpenId(null);
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                      >
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                          </svg>
                                        </div>
                                        <span className="text-xs text-[#0F172A]">URL 복사</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full ${company.grade === 'A'
                              ? 'bg-[#00B4FF]/10 text-[#00B4FF]'
                              : company.grade === 'B'
                                ? 'bg-[#5B3BFA]/10 text-[#5B3BFA]'
                                : 'bg-[#8C8C8C]/10 text-[#8C8C8C]'
                              }`}
                          >
                            ESG {company.grade}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {idx % 2 === 0 ? (
                            <div className="flex items-center justify-center gap-2 relative">
                              <div 
                                className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center cursor-pointer hover:border-red-700 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigate('report-viewer', company.id, 'r1');
                                }}
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#DC2626" stroke="#DC2626" strokeWidth="1.5" />
                                  <path d="M14 2V8H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M7 10H13M7 14H17M7 18H15" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                                  <circle cx="8" cy="11" r="1" fill="white" />
                                </svg>
                              </div>
                              <div className="relative" ref={(el) => { reportShareDropdownRefs.current[company.id] = el; }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setReportShareOpenId(reportShareOpenId === company.id ? null : company.id);
                                  }}
                                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition-colors"
                                  title="공유"
                                >
                                  <Share2 className="w-5 h-5 text-[#8C8C8C]" />
                                </button>

                                {/* Share Dropdown */}
                                {reportShareOpenId === company.id && (
                                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="text-sm font-semibold text-[#0F172A]">공유하기</h4>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setReportShareOpenId(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                                      >
                                        ×
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      {/* Slack */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Slack 공유 로직
                                          setReportShareOpenId(null);
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                      >
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200 overflow-hidden">
                                          <img
                                            src="https://cdn.simpleicons.org/slack/4A154B"
                                            alt="Slack"
                                            className="w-7 h-7 object-contain"
                                          />
                                        </div>
                                        <span className="text-xs text-[#0F172A]">Slack</span>
                                      </button>

                                      {/* Teams */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Teams 공유 로직
                                          setReportShareOpenId(null);
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                      >
                                        <div className="w-12 h-12 rounded-full bg-[#6264A7] flex items-center justify-center shadow-sm">
                                          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white">
                                            <path d="M19.5 4.5h-15A1.5 1.5 0 0 0 3 6v12a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5zm-8.25 9.75a.75.75 0 1 1-1.5 0v-4.5a.75.75 0 0 1 1.5 0v4.5zm4.5 0a.75.75 0 1 1-1.5 0v-4.5a.75.75 0 0 1 1.5 0v4.5z" />
                                            <circle cx="12" cy="8.25" r="1.5" fill="white" />
                                          </svg>
                                        </div>
                                        <span className="text-xs text-[#0F172A]">Teams</span>
                                      </button>

                                      {/* Kakao */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Kakao 공유 로직
                                          setReportShareOpenId(null);
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                      >
                                        <div className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center shadow-sm">
                                          <img
                                            src="https://cdn.simpleicons.org/kakaotalk/3C1E1E"
                                            alt="Kakao"
                                            className="w-7 h-7 object-contain"
                                          />
                                        </div>
                                        <span className="text-xs text-[#0F172A]">카카오</span>
                                      </button>

                                      {/* URL 복사 */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigator.clipboard.writeText(window.location.href);
                                          setReportShareOpenId(null);
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                      >
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                          </svg>
                                        </div>
                                        <span className="text-xs text-[#0F172A]">URL 복사</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[#0F172A]">미발간</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}