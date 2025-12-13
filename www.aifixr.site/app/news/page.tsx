'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, ArrowRight, ExternalLink, Sparkles, Lock } from 'lucide-react';
import Header from '@/components/Header';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import { createMainHandlers } from '@/services/mainservice';
import { AuthService } from '@/lib/oauthservice';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  region: '국내' | 'EU' | '미국' | '독일' | string;
  date: string;
  source: string;
  link: string;
  imageUrl?: string;
}

const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: '2025년 ESG 규제 강화, 기업 대응 전략은?',
    summary: '정부가 발표한 새로운 ESG 공시 의무화에 따라 기업들의 대응 전략이 주목받고 있습니다.',
    category: '규제/정책',
    region: '국내',
    date: '2025-01-15',
    source: 'ESG 투데이',
    link: '#',
  },
  {
    id: '2',
    title: '탄소중립 실현을 위한 기업의 역할',
    summary: '2050 탄소중립 목표 달성을 위해 기업들이 추진 중인 구체적인 실행 계획을 살펴봅니다.',
    category: '환경',
    region: 'EU',
    date: '2025-01-12',
    source: '그린비즈',
    link: '#',
  },
  {
    id: '3',
    title: '사회적 가치 창출, ESG 경영의 핵심',
    summary: '기업의 지속가능한 성장을 위한 사회적 책임과 가치 창출 사례를 소개합니다.',
    category: '사회',
    region: '국내',
    date: '2025-01-10',
    source: 'ESG 리뷰',
    link: '#',
  },
  {
    id: '4',
    title: 'ESG 투자 트렌드, 2025년 전망',
    summary: '글로벌 ESG 투자 시장의 최신 동향과 향후 전망을 분석합니다.',
    category: '투자',
    region: '미국',
    date: '2025-01-08',
    source: '파이낸셜 타임스',
    link: '#',
  },
  {
    id: '5',
    title: '지배구조 개선, 기업 가치 향상의 열쇠',
    summary: '투명한 지배구조가 기업의 장기적 가치 창출에 미치는 영향에 대해 다룹니다.',
    category: '지배구조',
    region: '독일',
    date: '2025-01-05',
    source: '경영 리뷰',
    link: '#',
  },
  {
    id: '6',
    title: '공급망 ESG 관리의 중요성',
    summary: '기업이 공급망 전반에 걸쳐 ESG 기준을 적용하는 방법과 사례를 소개합니다.',
    category: '공급망',
    region: 'EU',
    date: '2025-01-03',
    source: 'SCM 월드',
    link: '#',
  },
  {
    id: '7',
    title: 'CSRD 도입, EU 기업들의 준비 현황',
    summary: 'EU의 기업 지속가능성 보고 지침(CSRD) 도입에 따른 기업들의 대응 현황을 분석합니다.',
    category: '규제/정책',
    region: 'EU',
    date: '2025-01-02',
    source: 'EU 비즈니스',
    link: '#',
  },
  {
    id: '8',
    title: '재생에너지 전환 가속화, 투자 기회는?',
    summary: '글로벌 재생에너지 시장의 성장과 ESG 투자 관점에서의 기회를 살펴봅니다.',
    category: '환경',
    region: '미국',
    date: '2025-01-01',
    source: '에너지 리뷰',
    link: '#',
  },
  {
    id: '9',
    title: '다양성과 포용성, 기업 경쟁력의 핵심',
    summary: 'DEI(Diversity, Equity, Inclusion) 정책이 기업 성과에 미치는 긍정적 영향을 검토합니다.',
    category: '사회',
    region: '국내',
    date: '2024-12-30',
    source: 'HR 인사이트',
    link: '#',
  },
  {
    id: '10',
    title: '독일 기업의 ESG 리더십 사례',
    summary: '독일 주요 기업들의 ESG 경영 모범 사례와 글로벌 영향력을 분석합니다.',
    category: '지배구조',
    region: '독일',
    date: '2024-12-28',
    source: '독일 경영지',
    link: '#',
  },
  {
    id: '11',
    title: 'ESG 채권 시장, 2025년 성장 전망',
    summary: '지속가능 채권 시장의 확대와 기업 자금 조달 전략 변화를 다룹니다.',
    category: '투자',
    region: 'EU',
    date: '2024-12-27',
    source: '파이낸셜 타임스',
    link: '#',
  },
  {
    id: '12',
    title: '공급망 투명성 확보, 디지털 솔루션',
    summary: '블록체인과 AI를 활용한 공급망 ESG 관리 혁신 사례를 소개합니다.',
    category: '공급망',
    region: '국내',
    date: '2024-12-25',
    source: '테크 리뷰',
    link: '#',
  },
  {
    id: '13',
    title: '기후 리스크 관리, 금융권의 새로운 과제',
    summary: 'TCFD 권고안에 따른 기후 리스크 공시 의무화와 금융기관의 대응을 살펴봅니다.',
    category: '규제/정책',
    region: '국내',
    date: '2024-12-23',
    source: '금융 투데이',
    link: '#',
  },
  {
    id: '14',
    title: '순환경제 모델, 기업의 새로운 기회',
    summary: '순환경제 전환을 통한 비즈니스 모델 혁신과 수익 창출 사례를 분석합니다.',
    category: '환경',
    region: 'EU',
    date: '2024-12-21',
    source: '그린 이코노미',
    link: '#',
  },
  {
    id: '15',
    title: '사회적 기업 인증, ESG 경영의 인정',
    summary: '사회적 기업 인증 제도와 ESG 경영 평가의 연계성에 대해 다룹니다.',
    category: '사회',
    region: '국내',
    date: '2024-12-20',
    source: '사회적 경제',
    link: '#',
  },
];

const categories = ['전체', '규제/정책', '환경', '사회', '지배구조', '투자', '공급망'];

export default function NewsPage() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState('news');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [regionFilter, setRegionFilter] = useState<'국내' | '국외'>('국내');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { handleLoginClick, handleLoginRequired, handleLogin } =
    createMainHandlers(setIsLoginModalOpen, router);

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
    };

    // 초기 체크
    checkAuthStatus();

    // storage 이벤트 리스너
    window.addEventListener('storage', checkAuthStatus);

    // 커스텀 이벤트 리스너
    window.addEventListener('authStateChanged', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authStateChanged', checkAuthStatus);
    };
  }, []);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAISummary = (newsId: string) => {
    // 추후 AI 요약 API 연동 예정
    console.log('AI 요약 요청:', newsId);
  };

  const handleAISummaryClick = (newsId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    
    if (!isAuthenticated) {
      handleLoginRequired();
      return;
    }
    
    handleAISummary(newsId);
  };

  const filteredData = mockNewsData.filter((news) => {
    const matchesCategory = selectedCategory === '전체' || news.category === selectedCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = 
      (regionFilter === '국내' && news.region === '국내') ||
      (regionFilter === '국외' && news.region !== '국내');
    return matchesCategory && matchesSearch && matchesRegion;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '규제/정책': 'bg-blue-100 text-blue-800 border-blue-200',
      '환경': 'bg-green-100 text-green-800 border-green-200',
      '사회': 'bg-purple-100 text-purple-800 border-purple-200',
      '지배구조': 'bg-orange-100 text-orange-800 border-orange-200',
      '투자': 'bg-pink-100 text-pink-800 border-pink-200',
      '공급망': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRegionColor = (region: string) => {
    const styles: Record<string, string> = {
      '국내': 'bg-gray-100 text-gray-800 border-gray-200',
      'EU': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      '독일': 'bg-red-100 text-red-800 border-red-200',
      '미국': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return styles[region] || 'bg-gray-100 text-gray-700 border-gray-200';
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
            <h1 className="text-3xl font-bold text-[#1a2332] mb-2">ESG 소식</h1>
            <p className="text-gray-600">최신 ESG 뉴스와 트렌드를 한눈에</p>
          </div>

          {/* Filters Section */}
          <div className="mb-6">
            {/* First Row: Region Toggle, Search Bar */}
            <div className="flex items-center gap-4 mb-4 flex-wrap justify-center">
              {/* Region Toggle Switch */}
              <div 
                className="relative inline-flex items-center h-11 rounded-lg cursor-pointer transition-colors duration-300 overflow-hidden bg-gray-100"
                style={{
                  width: '120px',
                  padding: '4px',
                }}
                onClick={() => setRegionFilter(regionFilter === '국내' ? '국외' : '국내')}
              >
                {/* Background Labels Container */}
                <div className="absolute inset-0 flex items-center" style={{ zIndex: 1 }}>
                  <span
                    className={`flex-1 text-center text-sm font-medium transition-opacity duration-300 ${
                      regionFilter === '국내' ? 'text-gray-600 opacity-0' : 'text-gray-600'
                    }`}
                  >
                    국내
                  </span>
                  <span
                    className={`flex-1 text-center text-sm font-medium transition-opacity duration-300 ${
                      regionFilter === '국외' ? 'text-gray-600 opacity-0' : 'text-gray-600'
                    }`}
                  >
                    국외
                  </span>
                </div>
                {/* Sliding Handle */}
                <div
                  className="absolute top-[4px] bottom-[4px] w-[56px] bg-white rounded-md shadow-sm transition-all duration-300 ease-in-out flex items-center justify-center"
                  style={{
                    left: regionFilter === '국내' ? '4px' : 'auto',
                    right: regionFilter === '국외' ? '4px' : 'auto',
                    zIndex: 2,
                  }}
                >
                  {/* Selected Label on Handle */}
                  <span className="text-sm font-medium text-[#0D4ABB] whitespace-nowrap">
                    {regionFilter === '국내' ? '국내' : '국외'}
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-3 flex-1 min-w-[300px] max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="뉴스 검색"
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
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === category
                      ? 'bg-[#0D4ABB] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* News List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredData.length > 0 ? (
              filteredData.map((news) => (
                <div
                  key={news.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-all cursor-pointer"
                  onClick={() => news.link !== '#' && window.open(news.link, '_blank')}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        {news.region !== '국내' && (
                          <span
                            className={`px-2 py-0.5 text-xs rounded border ${getRegionColor(news.region)}`}
                          >
                            {news.region}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 text-xs rounded border ${getCategoryColor(
                            news.category
                          )}`}
                        >
                          {news.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(news.date)}</span>
                        </div>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500">{news.source}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#1a2332] mb-1 hover:text-[#0D4ABB] transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1.5 line-clamp-1">{news.summary}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <button
                          onClick={(e) => handleAISummaryClick(news.id, e)}
                          className={`text-xs flex items-center gap-1 transition-colors ${
                            isAuthenticated
                              ? 'text-gray-500 hover:text-[#0D4ABB]'
                              : 'text-gray-400 opacity-60'
                          }`}
                        >
                          {isAuthenticated ? (
                            <Sparkles className="w-3 h-3" />
                          ) : (
                            <Lock className="w-3 h-3" />
                          )}
                          AI 요약
                        </button>
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

