'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, ArrowRight, AlertCircle, Wrench, FileText, Shield, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import { createMainHandlers } from '@/services/mainservice';
import { AuthService } from '@/lib/oauthservice';

interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: '중요' | '시스템/업데이트' | 'ESG 기준·데이터' | '정책·보안';
  tag: '중요' | '점검' | '업데이트' | '정책';
  date: string;
  isImportant: boolean;
  link?: string;
}

const mockNoticeData: NoticeItem[] = [
  {
    id: '1',
    title: '2025년 K-ESG 개정 기준 반영 일정 안내',
    content: '2025년 1월부터 적용되는 K-ESG 가이드라인 개정 사항을 반영합니다. 평가 지표 가중치 변경 및 새로운 공시 항목이 추가되었으니, 보고서 생성 시 최신 기준을 확인해주시기 바랍니다.',
    category: 'ESG 기준·데이터',
    tag: '중요',
    date: '2025-01-15',
    isImportant: true,
  },
  {
    id: '2',
    title: 'AI 보고서 생성 기능 개선 안내',
    content: 'AI 보고서 생성 정확도가 개선되었습니다. ESG 데이터 분석 로직을 고도화하여 더욱 정확한 평가 결과를 제공합니다. 기존 보고서는 영향 없으며, 새로 생성되는 보고서부터 개선된 기능이 적용됩니다.',
    category: '시스템/업데이트',
    tag: '업데이트',
    date: '2025-01-12',
    isImportant: false,
  },
  {
    id: '3',
    title: '12월 20일 시스템 정기 점검 안내',
    content: '2024년 12월 20일 오전 2시부터 오전 4시까지 정기 시스템 점검이 진행됩니다. 점검 시간 동안 서비스 이용이 일시 중단되며, 보고서 생성 기능은 영향 없습니다. ESG 뉴스 수집은 2시간 지연될 수 있습니다.',
    category: '시스템/업데이트',
    tag: '점검',
    date: '2024-12-20',
    isImportant: false,
  },
  {
    id: '4',
    title: '개인정보 처리방침 개정 안내',
    content: '개인정보 보호법 개정에 따라 개인정보 처리방침이 변경되었습니다. 주요 변경 사항은 데이터 보관 기간 연장 및 보안 강화 조치입니다. 자세한 내용은 개인정보 처리방침 페이지에서 확인하실 수 있습니다.',
    category: '정책·보안',
    tag: '정책',
    date: '2024-12-18',
    isImportant: false,
  },
  {
    id: '5',
    title: 'EU CSRD 기준 반영 및 평가 시스템 업데이트',
    content: 'EU의 기업 지속가능성 보고 지침(CSRD) 기준을 평가 시스템에 반영했습니다. EU 진출 기업의 ESG 평가 시 CSRD 요구사항이 자동으로 반영되며, 보고서 템플릿도 업데이트되었습니다.',
    category: 'ESG 기준·데이터',
    tag: '업데이트',
    date: '2024-12-15',
    isImportant: true,
  },
  {
    id: '6',
    title: '새로운 보고서 템플릿 추가',
    content: '기업 규모별 맞춤형 보고서 템플릿 3종이 추가되었습니다. 하청사용 간소화 템플릿, 원청사용 상세 템플릿, 공공기관용 템플릿을 선택하여 활용하실 수 있습니다.',
    category: '시스템/업데이트',
    tag: '업데이트',
    date: '2024-12-10',
    isImportant: false,
  },
  {
    id: '7',
    title: '데이터 출처 추가 및 신뢰도 개선',
    content: 'ESG 데이터 수집 출처가 확대되었습니다. 국내외 공신력 있는 ESG 평가 기관 데이터를 추가로 연동하여 평가 정확도가 향상되었습니다.',
    category: 'ESG 기준·데이터',
    tag: '업데이트',
    date: '2024-12-08',
    isImportant: false,
  },
  {
    id: '8',
    title: '뉴스 분류 로직 개편 안내',
    content: 'ESG 뉴스 자동 분류 로직이 개선되었습니다. AI 기반 카테고리 분류 정확도가 향상되어 더욱 정확한 뉴스 분류가 가능합니다.',
    category: '시스템/업데이트',
    tag: '업데이트',
    date: '2024-12-05',
    isImportant: false,
  },
  {
    id: '9',
    title: '보안 점검 완료 및 보안 정책 강화',
    content: '2024년 4분기 보안 점검이 완료되었습니다. 외부 보안 감사 결과를 바탕으로 데이터 암호화 및 접근 제어 정책을 강화했습니다.',
    category: '정책·보안',
    tag: '정책',
    date: '2024-12-01',
    isImportant: false,
  },
  {
    id: '10',
    title: '회계연도 기준 변경 반영 일정',
    content: '2025년 회계연도 기준 변경 사항을 반영합니다. 기업별 회계연도에 맞춰 ESG 평가 시점이 자동 조정되며, 보고서 생성 시 회계연도 정보가 명확히 표시됩니다.',
    category: 'ESG 기준·데이터',
    tag: '업데이트',
    date: '2024-11-28',
    isImportant: false,
  },
  {
    id: '11',
    title: 'API 연동 상태 변경 안내',
    content: '외부 ESG 데이터 제공 API의 연동 방식이 변경되었습니다. 기존 API를 사용 중인 고객사는 2025년 2월까지 새로운 연동 방식으로 전환해주시기 바랍니다.',
    category: '시스템/업데이트',
    tag: '중요',
    date: '2024-11-25',
    isImportant: true,
  },
  {
    id: '12',
    title: '요약·윤문 기능 고도화',
    content: 'AI 기반 보고서 요약 및 윤문 기능이 개선되었습니다. 더욱 자연스러운 문장 생성과 전문 용어 정확도가 향상되었습니다.',
    category: '시스템/업데이트',
    tag: '업데이트',
    date: '2024-11-20',
    isImportant: false,
  },
];

const categories = ['전체', '중요 공지', '시스템/업데이트', 'ESG 기준·데이터', '정책·보안'];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case '중요 공지':
      return <AlertCircle className="w-4 h-4" />;
    case '시스템/업데이트':
      return <Wrench className="w-4 h-4" />;
    case 'ESG 기준·데이터':
      return <TrendingUp className="w-4 h-4" />;
    case '정책·보안':
      return <Shield className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getTagColor = (tag: string) => {
  const colors: Record<string, string> = {
    '중요': 'bg-red-100 text-red-800 border-red-200',
    '점검': 'bg-orange-100 text-orange-800 border-orange-200',
    '업데이트': 'bg-blue-100 text-blue-800 border-blue-200',
    '정책': 'bg-purple-100 text-purple-800 border-purple-200',
  };
  return colors[tag] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export default function NoticePage() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState('notice');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const { handleLoginClick, handleLoginRequired, handleLogin } =
    createMainHandlers(setIsLoginModalOpen, router);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredData = mockNoticeData.filter((notice) => {
    const matchesCategory = 
      selectedCategory === '전체' ||
      (selectedCategory === '중요 공지' && notice.isImportant) ||
      notice.category === selectedCategory;
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={handleLoginClick} />
      <MainNavigation
        activeTab={activeMainTab}
        setActiveTab={setActiveMainTab}
        onLoginRequired={handleLoginRequired}
      />

      <div className="pt-[180px] pb-20 px-8">
        <div className="max-w-[1440px] mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#1a2332] mb-2">공지사항</h1>
            <p className="text-gray-600">서비스 운영 및 업데이트 소식을 확인하세요</p>
          </div>

          {/* Filters Section */}
          <div className="mb-4">
            {/* First Row: Search Bar */}
            <div className="flex items-center gap-4 mb-3 flex-wrap justify-center">
              {/* Search Bar */}
              <div className="flex items-center gap-3 flex-1 min-w-[300px] max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="공지사항 검색"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4ABB] focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 py-2.5 bg-[#0D4ABB] text-white rounded-lg hover:bg-[#0a3a9b] transition-colors font-medium whitespace-nowrap"
                >
                  조회
                </button>
              </div>
            </div>

            {/* Second Row: Category Filter */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    selectedCategory === category
                      ? 'bg-[#0D4ABB] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryIcon(category)}
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Notice List */}
          <div className="space-y-3">
            {filteredData.length > 0 ? (
              filteredData.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all cursor-pointer"
                  onClick={() => notice.link && window.open(notice.link, '_blank')}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 text-xs rounded border font-medium ${getTagColor(notice.tag)}`}
                        >
                          [{notice.tag}]
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded border ${
                            notice.category === '시스템/업데이트'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : notice.category === 'ESG 기준·데이터'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : notice.category === '정책·보안'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {notice.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(notice.date)}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-[#1a2332] mb-2 hover:text-[#0D4ABB] transition-colors">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{notice.content}</p>
                      <div className="flex items-center justify-end">
                        <div className="flex items-center gap-2 text-[#0D4ABB] text-sm font-medium">
                          <span>자세히 보기</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onKakaoLogin={AuthService.handleKakaoLogin}
      />
    </div>
  );
}

