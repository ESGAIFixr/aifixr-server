export interface Company {
  name: string;
  industry: string;
  size: 'large' | 'sme';
  overallGrade: string;
  environmental: string;
  social: string;
  governance: string;
  overallTrend: 'up' | 'down' | 'stable';
  environmentalTrend: 'up' | 'down' | 'stable';
  socialTrend: 'up' | 'down' | 'stable';
  governanceTrend: 'up' | 'down' | 'stable';
}

export function getAvailableMonths(): string[] {
  const months = [
    '2025년 12월',
    '2025년 11월',
    '2025년 10월',
    '2025년 9월',
    '2025년 8월',
    '2025년 7월'
  ];
  return months;
}

export function generateMockData(
  month: string, 
  companySize: 'all' | 'large' | 'sme' = 'all',
  standard: 'K-ESG' | 'ESRS' = 'K-ESG'
): Company[] {
  // Base companies data
  const companies = [
    {
      name: '테크코프 솔루션',
      industry: '정보기술',
      size: 'large' as const,
      base: { overall: 85, env: 88, social: 82, gov: 86 }
    },
    {
      name: '그린에너지',
      industry: '재생에너지',
      size: 'large' as const,
      base: { overall: 92, env: 95, social: 89, gov: 91 }
    },
    {
      name: '글로벌 파이낸스 그룹',
      industry: '금융서비스',
      size: 'large' as const,
      base: { overall: 78, env: 72, social: 81, gov: 82 }
    },
    {
      name: '메디케어 헬스케어',
      industry: '헬스케어 및 제약',
      size: 'large' as const,
      base: { overall: 88, env: 84, social: 91, gov: 89 }
    },
    {
      name: '오토드라이브 모터스',
      industry: '자동차 제조',
      size: 'large' as const,
      base: { overall: 75, env: 78, social: 73, gov: 74 }
    },
    {
      name: '프레시푸드',
      industry: '식품 및 음료',
      size: 'sme' as const,
      base: { overall: 81, env: 79, social: 85, gov: 79 }
    },
    {
      name: '빌드라이트 건설',
      industry: '건설 및 엔지니어링',
      size: 'sme' as const,
      base: { overall: 70, env: 68, social: 72, gov: 71 }
    },
    {
      name: '리테일맥스',
      industry: '유통 및 소비재',
      size: 'large' as const,
      base: { overall: 76, env: 74, social: 78, gov: 76 }
    },
    {
      name: '켐테크 인더스트리',
      industry: '화학 및 소재',
      size: 'sme' as const,
      base: { overall: 72, env: 70, social: 71, gov: 75 }
    },
    {
      name: '데이터클라우드 시스템',
      industry: '클라우드 컴퓨팅',
      size: 'large' as const,
      base: { overall: 86, env: 83, social: 88, gov: 87 }
    },
    {
      name: '에코텍스타일',
      industry: '섬유 및 의류',
      size: 'sme' as const,
      base: { overall: 79, env: 82, social: 76, gov: 78 }
    },
    {
      name: '파워그리드 유틸리티',
      industry: '유틸리티 및 에너지',
      size: 'large' as const,
      base: { overall: 74, env: 71, social: 75, gov: 76 }
    },
    {
      name: '스마트솔루션',
      industry: '정보기술',
      size: 'sme' as const,
      base: { overall: 77, env: 75, social: 78, gov: 78 }
    },
    {
      name: '바이오팜',
      industry: '헬스케어 및 제약',
      size: 'sme' as const,
      base: { overall: 83, env: 80, social: 85, gov: 84 }
    }
  ];

  // Filter by company size
  let filteredCompanies = companies;
  if (companySize !== 'all') {
    filteredCompanies = companies.filter(c => c.size === companySize);
  }

  // Add variation based on month
  const monthIndex = getAvailableMonths().indexOf(month);
  const variance = monthIndex * 2; // Older months have slightly different scores

  // Adjust scores based on standard (ESRS tends to be slightly stricter)
  const standardAdjustment = standard === 'ESRS' ? -3 : 0;

  return filteredCompanies.map(company => {
    const adjust = (score: number) => {
      const adjusted = score + (Math.random() * variance - variance / 2) + standardAdjustment;
      return Math.max(65, Math.min(100, Math.round(adjusted)));
    };

    const overall = adjust(company.base.overall);
    const env = adjust(company.base.env);
    const social = adjust(company.base.social);
    const gov = adjust(company.base.gov);

    // Generate random trends
    const generateTrend = (): 'up' | 'down' | 'stable' => {
      const rand = Math.random();
      if (rand < 0.35) return 'up';
      if (rand < 0.65) return 'down';
      return 'stable';
    };

    return {
      name: company.name,
      industry: company.industry,
      size: company.size,
      overallGrade: scoreToGrade(overall),
      environmental: scoreToGrade(env),
      social: scoreToGrade(social),
      governance: scoreToGrade(gov),
      overallTrend: generateTrend(),
      environmentalTrend: generateTrend(),
      socialTrend: generateTrend(),
      governanceTrend: generateTrend()
    };
  });
}

function scoreToGrade(score: number): string {
  if (score >= 95) return 'S';
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'C+';
  if (score >= 65) return 'C';
  return 'D';
}

