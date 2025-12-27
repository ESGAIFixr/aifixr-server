import { useState } from 'react';
import { Building2, Search, Filter, RotateCcw, AlertCircle } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface SMEListProps {
  onNavigate: (screen: any, companyId?: string, reportId?: string) => void;
  onLogout: () => void;
  hideSidebar?: boolean;
  cardOnly?: boolean; // 카드형만 보여주는 모드
}

const companies = [
  { id: '1', name: '테크솔루션 주식회사', industry: 'IT/소프트웨어', grade: 'A', score: 87, date: '2024.11.28', logo: '🏢' },
  { id: '2', name: '그린에너지 코퍼레이션', industry: '에너지', grade: 'B', score: 78, date: '2024.11.25', logo: '⚡' },
  { id: '3', name: '스마트제조 산업', industry: '제조', grade: 'A', score: 85, date: '2024.11.22', logo: '🏭' },
  { id: '4', name: '친환경 패키징', industry: '제조', grade: 'B', score: 76, date: '2024.11.20', logo: '📦' },
  { id: '5', name: '디지털 솔루션즈', industry: 'IT/소프트웨어', grade: 'A', score: 89, date: '2024.11.18', logo: '💻' },
  { id: '6', name: '바이오텍 연구소', industry: '바이오/헬스케어', grade: 'B', score: 79, date: '2024.11.15', logo: '🧬' },
  { id: '7', name: '청정수자원', industry: '환경', grade: 'A', score: 86, date: '2024.11.12', logo: '💧' },
  { id: '8', name: '스마트 물류', industry: '물류', grade: 'C', score: 68, date: '2024.11.10', logo: '🚚' },
];

type RequestStatus = 'none' | 'pending' | 'approved' | 'rejected';

interface CompanyRequestStatus {
  status: RequestStatus;
  rejectionReason?: string;
}

export function SMEList({ onNavigate, onLogout, hideSidebar = false, cardOnly = false }: SMEListProps) {
  const [viewMode, setViewMode] = useState<'table' | 'card'>(cardOnly ? 'card' : 'table');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [completionFilter, setCompletionFilter] = useState<string>('all');
  const [requestStatuses, setRequestStatuses] = useState<Record<string, CompanyRequestStatus>>({});

  const handleResetFilters = () => {
    setSearchQuery('');
    setGradeFilter('all');
    setIndustryFilter('all');
    setRiskFilter('all');
    setCompletionFilter('all');
  };

  const handleRequestAll = () => {
    const next: Record<string, CompanyRequestStatus> = {};
    companies.forEach((c, idx) => {
      if (c.id === '1') {
        next[c.id] = {
          status: 'rejected',
          rejectionReason:
            '요청하신 데이터는 현재 보안상의 이유로 제공이 제한되어 있습니다. 데이터 접근 권한이 필요한 경우 관리자에게 별도로 문의해주시기 바랍니다.',
        };
      } else if (c.id === '2') {
        next[c.id] = {
          status: 'rejected',
          rejectionReason:
            '해당 기업의 ESG 데이터는 아직 검토 단계에 있어 제공할 수 없습니다. 검토가 완료되는 대로 알려드리겠습니다.',
        };
      } else {
        next[c.id] = { status: 'pending' };
      }
    });
    setRequestStatuses(next);
  };

  const handleRequestData = (companyId: string) => {
    setRequestStatuses(prev => {
      const nextStatus: CompanyRequestStatus =
        companyId === '1'
          ? {
            status: 'rejected',
            rejectionReason:
              '요청하신 데이터는 현재 보안상의 이유로 제공이 제한되어 있습니다. 데이터 접근 권한이 필요한 경우 관리자에게 별도로 문의해주시기 바랍니다.',
          }
          : companyId === '2'
            ? {
              status: 'rejected',
              rejectionReason:
                '해당 기업의 ESG 데이터는 아직 검토 단계에 있어 제공할 수 없습니다. 검토가 완료되는 대로 알려드리겠습니다.',
            }
            : { status: 'pending' };

      return {
        ...prev,
        [companyId]: nextStatus,
      };
    });
  };


  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || company.grade === gradeFilter;
    const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter;
    return matchesSearch && matchesGrade && matchesIndustry;
  });

  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">
      {!hideSidebar && <Sidebar currentPage="sme-list" onNavigate={onNavigate} onLogout={onLogout} />}

      <div className={`flex-1 ${!hideSidebar ? 'ml-64' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[#0F172A] mb-2">{cardOnly ? "관계사 진단 관리" : "관계사 목록"}</h1>
            <div className="flex items-center justify-between">
              <p className="text-[#8C8C8C]">{cardOnly ? "관계사 진단 관리를 위한 화면입니다" : "ESG 평가가 완료된 중소기업 관계사 목록입니다"}</p>
              {!cardOnly && (
                <Button
                  onClick={handleRequestAll}
                  className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] rounded-xl px-5 hover:shadow-[0_4px_20px_rgba(91,59,250,0.4)] transition-all"
                >
                  전체 관계사 데이터 요청
                </Button>
              )}
            </div>
          </div>


          {/* Filters */}
          <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] mb-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C8C8C]" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="기업명 또는 업종 검색..."
                    className="pl-10 h-12 rounded-xl border-gray-200"
                  />
                </div>
              </div>

              {/* Industry Filter */}
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="h-12 rounded-xl border-2">
                  <SelectValue placeholder="업종" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 업종</SelectItem>
                  <SelectItem value="IT/소프트웨어">IT/소프트웨어</SelectItem>
                  <SelectItem value="제조">제조</SelectItem>
                  <SelectItem value="에너지">에너지</SelectItem>
                  <SelectItem value="환경">환경</SelectItem>
                  <SelectItem value="물류">물류</SelectItem>
                  <SelectItem value="바이오/헬스케어">바이오/헬스케어</SelectItem>
                </SelectContent>
              </Select>

              {/* Grade Filter */}
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="h-12 rounded-xl border-2">
                  <SelectValue placeholder="ESG 등급" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 등급</SelectItem>
                  <SelectItem value="A">A등급</SelectItem>
                  <SelectItem value="B">B등급</SelectItem>
                  <SelectItem value="C">C등급</SelectItem>
                  <SelectItem value="D">D등급</SelectItem>
                </SelectContent>
              </Select>

              {/* Risk Level Filter */}
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="h-12 rounded-xl border-2">
                  <SelectValue placeholder="위험도" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 위험도</SelectItem>
                  <SelectItem value="low">낮음</SelectItem>
                  <SelectItem value="medium">중간</SelectItem>
                  <SelectItem value="high">높음</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Button */}
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="h-12 rounded-xl border-2"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                필터 초기화
              </Button>
            </div>
          </Card>

          {/* View Mode Toggle */}
          {cardOnly ? (
            // 카드형만 보여주는 모드 (관계사 진단 관리)
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#8C8C8C]">총 {filteredCompanies.length}개 기업</p>
            </div>
          ) : (
            // 일반 모드 (관계사 목록)
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#8C8C8C]">총 {filteredCompanies.length}개 기업</p>
            </div>
          )}

          {/* Table View - Only for table mode, not for cardOnly mode */}
          {!cardOnly && viewMode === 'table' && (
            <Card className="rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F6F8FB]">
                    <tr>
                      <th className="text-left p-4 text-[#0F172A]">관계사명</th>
                      <th className="text-left p-4 text-[#0F172A]">업종</th>
                      <th className="text-center p-4 text-[#0F172A]">ESG 등급</th>
                      <th className="text-center p-4 text-[#0F172A]">위험도</th>
                      <th className="text-center p-4 text-[#0F172A]">데이터 완료율</th>
                      <th className="text-center p-4 text-[#0F172A]">최근 업데이트</th>
                      <th className="text-center p-4 text-[#0F172A]">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((company, idx) => {
                      const riskLevel = idx % 3 === 0 ? 'high' : idx % 3 === 1 ? 'medium' : 'low';
                      const completion = idx % 2 === 0 ? 100 : 85;
                      const requestStatus = requestStatuses[company.id]?.status || 'none';
                      const isPending = requestStatus === 'pending';
                      const isRejected = requestStatus === 'rejected';
                      const isApproved = requestStatus === 'approved';
                      const rejectionReason = requestStatuses[company.id]?.rejectionReason;
                      const isDetailReveal = ['6', '7', '8'].includes(company.id) && requestStatus !== 'none';

                      return (
                        <tr
                          key={company.id}
                          className="border-t border-gray-100 hover:bg-[#F6F8FB] transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center text-xl">
                                {company.logo}
                              </div>
                              <span className="text-[#0F172A]">{company.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-[#8C8C8C]">{company.industry}</td>
                          <td className="p-4" colSpan={5}>
                            <div className="relative flex items-center justify-center gap-2">
                              {requestStatus === 'none' ? (
                                <Button
                                  variant="outline"
                                  onClick={() => handleRequestData(company.id)}
                                  className="rounded-xl border-[#5B3BFA] text-[#5B3BFA] hover:bg-[#5B3BFA]/10"
                                >
                                  데이터 요청
                                </Button>
                              ) : isDetailReveal ? (
                                <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
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
                                  <span
                                    className={`px-3 py-1 rounded-full ${riskLevel === 'high'
                                      ? 'bg-[#E30074]/10 text-[#E30074]'
                                      : riskLevel === 'medium'
                                        ? 'bg-[#A58DFF]/10 text-[#A58DFF]'
                                        : 'bg-[#00B4FF]/10 text-[#00B4FF]'
                                      }`}
                                  >
                                    위험도 {riskLevel === 'high' ? '높음' : riskLevel === 'medium' ? '중간' : '낮음'}
                                  </span>
                                  <span className="text-[#0F172A]">데이터 완료율 {completion}%</span>
                                  <span className="text-[#8C8C8C]">최근 업데이트 {company.date}</span>
                                  {/* 상태 아이콘 제거 */}
                                </div>
                              ) : (
                                <>
                                  {isPending && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/80 rounded-xl z-10 cursor-pointer">
                                          <AlertCircle className="w-5 h-5 text-[#5B3BFA]" />
                                          <span className="text-[#5B3BFA] font-medium">요청 대기 중</span>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-white text-[#0F172A] border border-gray-200 shadow-lg px-4 py-3 rounded-lg max-w-xs">
                                        <p className="text-sm leading-relaxed">데이터 요청이 접수되었습니다. 확인 후 승인/거절이 처리됩니다.</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  {isRejected && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/80 rounded-xl z-10 cursor-pointer">
                                          <AlertCircle className="w-5 h-5 text-[#E30074]" />
                                          <span className="text-[#E30074] font-medium">요청 거절</span>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-white text-[#0F172A] border border-gray-200 shadow-lg px-4 py-3 rounded-lg max-w-xs">
                                        <p className="text-sm leading-relaxed">
                                          {rejectionReason ||
                                            '요청하신 데이터는 현재 보안상의 이유로 제공이 제한되어 있습니다. 데이터 접근 권한이 필요한 경우 관리자에게 별도로 문의해주시기 바랍니다.'}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Card View - Show for cardOnly mode OR card mode */}
          {(cardOnly || viewMode === 'card') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <Card
                  key={company.id}
                  className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] hover:shadow-[0_6px_30px_rgba(91,59,250,0.2)] transition-all cursor-pointer"
                  onClick={() => onNavigate('company-detail', company.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center text-2xl">
                        {company.logo}
                      </div>
                      <div>
                        <h3 className="text-[#0F172A]">{company.name}</h3>
                        <p className="text-[#8C8C8C]">{company.industry}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8C8C8C]">ESG 등급</span>
                      <span className={`px-4 py-1 rounded-full ${company.grade === 'A' ? 'bg-[#00B4FF]/10 text-[#00B4FF]' :
                        company.grade === 'B' ? 'bg-[#5B3BFA]/10 text-[#5B3BFA]' :
                          'bg-[#8C8C8C]/10 text-[#8C8C8C]'
                        }`}>
                        {company.grade}등급
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#8C8C8C]">종합 점수</span>
                      <span className="text-[#0F172A]">{company.score}점</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#8C8C8C]">최근 평가일</span>
                      <span className="text-[#0F172A]">{company.date}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => onNavigate('company-detail', company.id)}
                    className="w-full mt-4 bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] rounded-xl hover:shadow-[0_4px_20px_rgba(91,59,250,0.4)] transition-all"
                  >
                    상세보기 →
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}