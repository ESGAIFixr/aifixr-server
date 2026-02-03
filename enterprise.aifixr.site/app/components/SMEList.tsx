import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { SearchAndFilter, FilterValues } from './SearchAndFilter';
import { mockCompanies } from '../data/mockCompanies';
import { Textarea } from './ui/textarea';

interface SMEListProps {
  onNavigate: (screen: any, companyId?: string, reportId?: string) => void;
  onLogout: () => void;
  hideSidebar?: boolean;
  cardOnly?: boolean; // 카드형만 보여주는 모드
}

const companies = mockCompanies;

// 진행 단계 타입 정의
type ProgressStage = 'none' | 'level1-completed' | 'level1-in-progress' | 'level2-in-progress' | 'level2-completed' | 'level3-in-progress' | 'level3-completed';

// 각 회사별 진행 단계 매핑 (임시 데이터, 나중에 실제 데이터로 교체 가능)
const companyProgressStages: Record<string, ProgressStage> = {
  '1': 'level1-completed',    // Level 1 완료
  '2': 'none',                 // 미진행
  '3': 'level2-in-progress',   // Level 2 진행 중
  '4': 'level3-in-progress',   // Level 3 진행 중
  '5': 'level1-completed',     // Level 1 완료
  '6': 'level2-completed',     // Level 2 완료 (바이오텍 연구소)
  '7': 'level1-in-progress',   // Level 1 진행 중 (청정수자원)
  '8': 'level3-completed',     // Level 3 완료 (스마트 물류)
};

// 진행 단계 텍스트 변환 함수
const getProgressStageText = (stage: ProgressStage): string => {
  switch (stage) {
    case 'level1-completed':
      return 'Level 1 완료';
    case 'level1-in-progress':
      return 'Level 1 진행 중';
    case 'level2-in-progress':
      return 'Level 2 진행 중';
    case 'level2-completed':
      return 'Level 2 완료';
    case 'level3-in-progress':
      return 'Level 3 진행 중';
    case 'level3-completed':
      return 'Level 3 완료';
    case 'none':
    default:
      return '미진행';
  }
};

export function SMEList({ onNavigate, onLogout, hideSidebar = false, cardOnly = false }: SMEListProps) {
  const [viewMode, setViewMode] = useState<'table' | 'card'>(cardOnly ? 'card' : 'table');
  const [filters, setFilters] = useState<FilterValues>({
    searchQuery: '',
    industryFilter: 'all',
    gradeFilter: 'all',
    riskFilter: 'all',
    completionFilter: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [isLevel2ModalOpen, setIsLevel2ModalOpen] = useState(false);
  const [selectedCompanyForLevel2, setSelectedCompanyForLevel2] = useState<string | null>(null);
  const [selectedDataItems, setSelectedDataItems] = useState<Record<string, boolean>>({});
  const [dataItemDescriptions, setDataItemDescriptions] = useState<Record<string, string>>({});

  // 데이터 항목 정의
  const dataItems = {
    total: [
      { id: 'total-esg-grade', label: 'ESG 등급' },
      { id: 'total-risk-level', label: '위험도' },
      { id: 'total-completion-rate', label: '데이터 완료율' },
      { id: 'total-recent-updates', label: '최근업데이트' },
    ],
    environment: [
      { id: 'env-carbon', label: '탄소 배출량' },
      { id: 'env-energy', label: '에너지 사용량' },
      { id: 'env-waste', label: '폐기물 관리' },
    ],
    social: [
      { id: 'social-welfare', label: '직원 복지' },
      { id: 'social-safety', label: '안전 관리' },
      { id: 'social-contribution', label: '사회공헌 활동' },
    ],
    governance: [
      { id: 'gov-board', label: '이사회 구성' },
      { id: 'gov-ethics', label: '윤리 경영' },
      { id: 'gov-transparency', label: '투명성 보고' },
    ],
  };

  // 버튼 핸들러 함수들
  const handleViewLevel1Results = (companyId: string) => {
    // Level 1 결과 보기: CompanyDetail 페이지로 이동
    onNavigate('company-detail', companyId);
  };

  const handleRequestLevel1 = (companyId: string) => {
    // TODO: Level 1 요청 기능 구현
    console.log('Request Level 1 for company:', companyId);
  };

  const handleRequestLevel2 = (companyId: string) => {
    setSelectedCompanyForLevel2(companyId);
    setSelectedDataItems({});
    setDataItemDescriptions({});
    setIsLevel2ModalOpen(true);
  };

  const handleCloseLevel2Modal = () => {
    setIsLevel2ModalOpen(false);
    setSelectedCompanyForLevel2(null);
    setSelectedDataItems({});
    setDataItemDescriptions({});
  };

  const handleToggleDataItem = (itemId: string) => {
    setSelectedDataItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
    if (!selectedDataItems[itemId]) {
      // 체크박스가 체크되면 설명 필드 초기화
      setDataItemDescriptions(prev => ({
        ...prev,
        [itemId]: '',
      }));
    } else {
      // 체크박스가 해제되면 설명 필드 제거
      setDataItemDescriptions(prev => {
        const newDesc = { ...prev };
        delete newDesc[itemId];
        return newDesc;
      });
    }
  };

  const handleSubmitLevel2Request = () => {
    // TODO: Level 2 요청 제출 로직 구현
    console.log('Level 2 Request for company:', selectedCompanyForLevel2);
    console.log('Selected items:', selectedDataItems);
    console.log('Descriptions:', dataItemDescriptions);
    handleCloseLevel2Modal();
  };

  const getCompanyName = (companyId: string | null) => {
    if (!companyId) return '';
    const company = companies.find(c => c.id === companyId);
    return company?.name || '';
  };

  const handleRequestLevel3 = (companyId: string) => {
    // TODO: Level 3 요청 기능 구현
    console.log('Request Level 3 for company:', companyId);
  };

  const handleViewReport = (companyId: string) => {
    // 보고서 보기: ReportViewer 페이지로 이동 (임시로 reportId는 'r1' 사용)
    onNavigate('report-viewer', companyId, 'r1');
  };

  // cardOnly prop이 변경될 때 viewMode 업데이트
  useEffect(() => {
    setViewMode(cardOnly ? 'card' : 'table');
  }, [cardOnly]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(filters.searchQuery?.toLowerCase() || '') ||
      company.industry.toLowerCase().includes(filters.searchQuery?.toLowerCase() || '');
    const matchesGrade = !filters.gradeFilter || filters.gradeFilter === 'all' || company.grade === filters.gradeFilter;
    const matchesIndustry = !filters.industryFilter || filters.industryFilter === 'all' || company.industry === filters.industryFilter;
    return matchesSearch && matchesGrade && matchesIndustry;
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

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCompanies = sortedCompanies.slice(startIndex, endIndex);

  // 필터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchQuery, filters.gradeFilter, filters.industryFilter, filters.riskFilter]);

  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">
      {!hideSidebar && <Sidebar currentPage="sme-list" onNavigate={onNavigate} onLogout={onLogout} />}

      <div className={`flex-1 ${!hideSidebar ? 'ml-64' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[#0F172A] mb-2">{cardOnly ? "관계사 진단 관리" : "협력사 요청"}</h1>
            <p className="text-[#8C8C8C]">{cardOnly ? "관계사 진단 관리를 위한 화면입니다" : "관계사 및 협력사 목록입니다."}</p>
          </div>


          {/* Search and Filter */}
          <SearchAndFilter
            onFilterChange={handleFilterChange}
            showCompletionFilter={false}
          />

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
                      <th className="text-left p-4 text-[#0F172A] whitespace-nowrap">날짜</th>
                      <th className="text-left p-4 text-[#0F172A]">협력사 이름</th>
                      <th className="text-left p-4 text-[#0F172A]">업종</th>
                      <th className="text-center p-4 text-[#0F172A]">진행 단계</th>
                      <th className="text-center p-4 text-[#0F172A]">요청하기</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCompanies.map((company, idx) => {
                      const progressStage = companyProgressStages[company.id] || 'none';
                      const progressStageText = getProgressStageText(progressStage);

                      return (
                        <tr
                          key={company.id}
                          className="border-t border-gray-100 hover:bg-[#F6F8FB] transition-colors"
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
                            <span className="text-[#0F172A]">{progressStageText}</span>
                          </td>
                          <td className="p-4 text-center">
                            {progressStage === 'none' ? (
                              // 미진행: 레벨 1 요청 버튼
                              <Button
                                variant="outline"
                                onClick={() => handleRequestLevel1(company.id)}
                                className="rounded-xl border-[#5B3BFA] text-[#5B3BFA] hover:bg-[#5B3BFA]/10 bg-yellow-50 border-yellow-300 hover:border-[#5B3BFA]"
                              >
                                레벨 1 요청
                              </Button>
                            ) : progressStage === 'level1-in-progress' ? (
                              // Level 1 진행 중: 텍스트만 표시
                              <span className="text-[#0F172A]">Level 1 진행 중</span>
                            ) : progressStage === 'level1-completed' || progressStage === 'level2-in-progress' ? (
                              // Level 1 완료 또는 Level 2 진행 중: 레벨 1 결과보기 / 레벨 2 요청하기
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleViewLevel1Results(company.id)}
                                  className="rounded-xl border-[#5B3BFA] text-[#5B3BFA] hover:bg-[#5B3BFA]/10 bg-yellow-50 border-yellow-300 hover:border-[#5B3BFA] text-sm"
                                >
                                  레벨 1 결과보기
                                </Button>
                                <span className="text-[#8C8C8C]">/</span>
                                <Button
                                  variant="outline"
                                  onClick={() => handleRequestLevel2(company.id)}
                                  className="rounded-xl border-[#5B3BFA] text-[#5B3BFA] hover:bg-[#5B3BFA]/10 bg-yellow-50 border-yellow-300 hover:border-[#5B3BFA] text-sm"
                                >
                                  레벨 2 요청하기
                                </Button>
                              </div>
                            ) : progressStage === 'level2-completed' ? (
                              // Level 2 완료: 레벨 1 결과보기 / 레벨 3 요청
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleViewLevel1Results(company.id)}
                                  className="rounded-xl border-[#5B3BFA] text-[#5B3BFA] hover:bg-[#5B3BFA]/10 bg-yellow-50 border-yellow-300 hover:border-[#5B3BFA] text-sm"
                                >
                                  레벨 1 결과보기
                                </Button>
                                <span className="text-[#8C8C8C]">/</span>
                                <Button
                                  variant="outline"
                                  onClick={() => handleRequestLevel3(company.id)}
                                  className="rounded-xl border-[#5B3BFA] text-[#5B3BFA] hover:bg-[#5B3BFA]/10 bg-yellow-50 border-yellow-300 hover:border-[#5B3BFA] text-sm"
                                >
                                  레벨 3 요청
                                </Button>
                              </div>
                            ) : progressStage === 'level3-in-progress' ? (
                              // Level 3 진행 중: 레벨 1 결과보기 버튼만
                              <Button
                                variant="outline"
                                onClick={() => handleViewLevel1Results(company.id)}
                                className="rounded-xl border-[#5B3BFA] text-[#5B3BFA] hover:bg-[#5B3BFA]/10 bg-yellow-50 border-yellow-300 hover:border-[#5B3BFA]"
                              >
                                레벨 1 결과보기
                              </Button>
                            ) : progressStage === 'level3-completed' ? (
                              // Level 3 완료: 레벨 1 결과보기 / 보고서 보기
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleViewLevel1Results(company.id)}
                                  className="rounded-xl border-[#5B3BFA] text-[#5B3BFA] hover:bg-[#5B3BFA]/10 bg-yellow-50 border-yellow-300 hover:border-[#5B3BFA] text-sm"
                                >
                                  레벨 1 결과보기
                                </Button>
                                <span className="text-[#8C8C8C]">/</span>
                                <Button
                                  variant="outline"
                                  onClick={() => handleViewReport(company.id)}
                                  className="rounded-xl border-[#5B3BFA] text-[#5B3BFA] hover:bg-[#5B3BFA]/10 bg-yellow-50 border-yellow-300 hover:border-[#5B3BFA] text-sm"
                                >
                                  보고서 보기
                                </Button>
                              </div>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-9 px-3"
                  >
                    이전
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`h-9 w-9 ${currentPage === page
                          ? 'bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white border-0'
                          : ''}`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="h-9 px-3"
                  >
                    다음
                  </Button>
                </div>
              )}
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

      {/* Level 2 요청 모달 */}
      {isLevel2ModalOpen && selectedCompanyForLevel2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="relative flex items-center justify-center mb-6">
                <h2 className="text-2xl font-bold text-[#0F172A] text-center">
                  {getCompanyName(selectedCompanyForLevel2)} 레벨 2 요청
                </h2>
                <button
                  onClick={handleCloseLevel2Modal}
                  className="absolute right-0 text-gray-400 hover:text-gray-600 text-3xl leading-none w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Total 섹션 */}
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Total</h3>
                  <div className="space-y-4">
                    {dataItems.total.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedDataItems[item.id] || false}
                            onChange={() => handleToggleDataItem(item.id)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA] focus:ring-offset-2 cursor-pointer appearance-none checked:bg-[#5B3BFA] checked:border-[#5B3BFA] relative after:content-['✓'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                          />
                          <span className="text-[#0F172A] text-base">{item.label}</span>
                        </label>
                        {selectedDataItems[item.id] && (
                          <div className="ml-8 mt-2">
                            <Textarea
                              placeholder="부가 설명을 입력하세요..."
                              value={dataItemDescriptions[item.id] || ''}
                              onChange={(e) => setDataItemDescriptions(prev => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))}
                              className="min-h-[80px] rounded-xl border-2 border-gray-200 focus:border-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA]/20"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Environment 섹션 */}
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Environment</h3>
                  <div className="space-y-4">
                    {dataItems.environment.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedDataItems[item.id] || false}
                            onChange={() => handleToggleDataItem(item.id)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA] focus:ring-offset-2 cursor-pointer appearance-none checked:bg-[#5B3BFA] checked:border-[#5B3BFA] relative after:content-['✓'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                          />
                          <span className="text-[#0F172A] text-base">{item.label}</span>
                        </label>
                        {selectedDataItems[item.id] && (
                          <div className="ml-8 mt-2">
                            <Textarea
                              placeholder="부가 설명을 입력하세요..."
                              value={dataItemDescriptions[item.id] || ''}
                              onChange={(e) => setDataItemDescriptions(prev => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))}
                              className="min-h-[80px] rounded-xl border-2 border-gray-200 focus:border-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA]/20"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social 섹션 */}
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Social</h3>
                  <div className="space-y-4">
                    {dataItems.social.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedDataItems[item.id] || false}
                            onChange={() => handleToggleDataItem(item.id)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA] focus:ring-offset-2 cursor-pointer appearance-none checked:bg-[#5B3BFA] checked:border-[#5B3BFA] relative after:content-['✓'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                          />
                          <span className="text-[#0F172A] text-base">{item.label}</span>
                        </label>
                        {selectedDataItems[item.id] && (
                          <div className="ml-8 mt-2">
                            <Textarea
                              placeholder="부가 설명을 입력하세요..."
                              value={dataItemDescriptions[item.id] || ''}
                              onChange={(e) => setDataItemDescriptions(prev => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))}
                              className="min-h-[80px] rounded-xl border-2 border-gray-200 focus:border-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA]/20"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Governance 섹션 */}
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Governance</h3>
                  <div className="space-y-4">
                    {dataItems.governance.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedDataItems[item.id] || false}
                            onChange={() => handleToggleDataItem(item.id)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA] focus:ring-offset-2 cursor-pointer appearance-none checked:bg-[#5B3BFA] checked:border-[#5B3BFA] relative after:content-['✓'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                          />
                          <span className="text-[#0F172A] text-base">{item.label}</span>
                        </label>
                        {selectedDataItems[item.id] && (
                          <div className="ml-8 mt-2">
                            <Textarea
                              placeholder="부가 설명을 입력하세요..."
                              value={dataItemDescriptions[item.id] || ''}
                              onChange={(e) => setDataItemDescriptions(prev => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))}
                              className="min-h-[80px] rounded-xl border-2 border-gray-200 focus:border-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA]/20"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCloseLevel2Modal}
                  className="rounded-xl px-6 h-10 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  취소
                </Button>
                <Button
                  onClick={handleSubmitLevel2Request}
                  className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] rounded-xl px-6 h-10 text-white hover:opacity-90 shadow-lg"
                >
                  수락
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}