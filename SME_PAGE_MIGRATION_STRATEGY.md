# SME 페이지 마이그레이션 전략

## 개요
`sme.aifixr.site` (3002 포트)에 구현된 모든 페이지를 `www.aifixr.site/app/sme` (3000 포트) 폴더로 이동하여 단일 애플리케이션으로 통합

## 현재 구조

### www.aifixr.site (3000 포트)
- **홈/랜딩 페이지** (1번 이미지): `www.aifixr.site/app/page.tsx`
  - 로그인 전 페이지
  - 로그인 버튼 클릭 시 카카오 OAuth 진행
  - 로그인 성공 시 → `/sme`로 리다이렉트

### sme.aifixr.site (3002 포트) - 마이그레이션 대상
- **로그인 후 홈** (2번 이미지): `sme.aifixr.site/app/page.tsx` (intro 컨텐츠)
- **자가진단** (3번 이미지): `sme.aifixr.site/app/page.tsx` (AutomatedReportView 컴포넌트)
  - 사이드바 있음
  - Total, Environment, Social, Governance 서브 페이지
- **자동화 보고서** (4번 이미지): `sme.aifixr.site/app/page.tsx` (ReportTemplateView 컴포넌트)
- **윤문 AI** (5번 이미지): `sme.aifixr.site/app/page.tsx` (EditingView 컴포넌트)

## 마이그레이션 계획

### Phase 1: 폴더 구조 설정
```
www.aifixr.site/
├── app/
│   ├── page.tsx                    # 1번 이미지 (홈/랜딩)
│   ├── layout.tsx
│   └── sme/                        # 새로 생성
│       ├── layout.tsx              # SME 전용 레이아웃
│       ├── page.tsx                # 2번 이미지 (로그인 후 홈/intro)
│       ├── self-diagnosis/         # 3번 이미지 (자가진단)
│       │   ├── layout.tsx          # 사이드바 레이아웃
│       │   └── page.tsx
│       ├── auto-report/            # 4번 이미지 (자동화 보고서)
│       │   └── page.tsx
│       └── editing/                # 5번 이미지 (윤문 AI)
│           └── page.tsx
├── components/
│   └── sme/                        # SME 관련 컴포넌트 이동
│       ├── AutomatedReportView.tsx
│       ├── ReportTemplateView.tsx
│       ├── EditingView.tsx
│       ├── AppSidebar.tsx
│       ├── TotalResultsView.tsx
│       ├── CompanyInfoInput.tsx
│       ├── DisclosureTable.tsx
│       ├── ESGRatingCards.tsx
│       ├── MonthYearPicker.tsx
│       └── types/
│           ├── index.ts
│           └── navigation.ts
```

### Phase 2: 인증 흐름 구현

#### 2.1 로그인 처리
1. **카카오 로그인 콜백 처리** (`www.aifixr.site`)
   - `LoginModal.tsx` 또는 별도 콜백 페이지에서 JWT 토큰 수신
   - localStorage에 토큰 저장
   ```typescript
   localStorage.setItem('aifix_access_token', accessToken);
   localStorage.setItem('aifix_refresh_token', refreshToken);
   localStorage.setItem('aifix_user_info', JSON.stringify(userInfo));
   ```
   - `/sme`로 리다이렉트

#### 2.2 인증 상태 확인
1. **토큰 검증 유틸리티 생성**
   - 파일: `www.aifixr.site/lib/auth.ts`
   ```typescript
   export function getAccessToken(): string | null {
     return localStorage.getItem('aifix_access_token');
   }
   
   export function isAuthenticated(): boolean {
     return !!getAccessToken();
   }
   
   export function clearAuth(): void {
     localStorage.removeItem('aifix_access_token');
     localStorage.removeItem('aifix_refresh_token');
     localStorage.removeItem('aifix_user_info');
   }
   ```

2. **Protected Route 미들웨어**
   - 파일: `www.aifixr.site/app/sme/layout.tsx`
   ```typescript
   'use client';
   
   useEffect(() => {
     if (!isAuthenticated()) {
       router.push('/'); // 로그인 페이지로 리다이렉트
     }
   }, []);
   ```

#### 2.3 홈 페이지 자동 리다이렉트
1. **www.aifixr.site/app/page.tsx 수정**
   ```typescript
   'use client';
   
   useEffect(() => {
     if (isAuthenticated()) {
       router.push('/sme'); // 토큰이 있으면 자동 이동
     }
   }, []);
   ```

### Phase 3: 컴포넌트 마이그레이션

#### 3.1 이동할 컴포넌트 목록
**From: `sme.aifixr.site/components/`**
**To: `www.aifixr.site/components/sme/`**

핵심 컴포넌트:
- [x] `AutomatedReportView.tsx` (자가진단)
- [x] `ReportTemplateView.tsx` (자동화 보고서)
- [x] `EditingView.tsx` (윤문 AI)
- [x] `AppSidebar.tsx` (사이드바)
- [x] `TotalResultsView.tsx` (총합 결과)
- [x] `CompanyInfoInput.tsx` (회사 정보 입력)
- [x] `DisclosureTable.tsx` (공시 테이블)
- [x] `ESGRatingCards.tsx` (ESG 등급 카드)
- [x] `MonthYearPicker.tsx` (월/년 선택기)

타입 정의:
- [x] `types/navigation.ts`
- [x] `types/index.ts`

#### 3.2 Import 경로 수정
모든 import 경로를 새 위치에 맞게 수정:
```typescript
// Before (sme.aifixr.site)
import { AutomatedReportView } from '@/components/AutomatedReportView';

// After (www.aifixr.site)
import { AutomatedReportView } from '@/components/sme/AutomatedReportView';
```

#### 3.3 UI 컴포넌트 공유
`sme.aifixr.site/components/ui/`는 이미 `www.aifixr.site/components/ui/`와 동일하므로 별도 복사 불필요

### Phase 4: 페이지 구현

#### 4.1 SME 레이아웃 (공통)
**파일: `www.aifixr.site/app/sme/layout.tsx`**
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Header from '@/components/sme/Header'; // SME 전용 헤더
import MainNavigation from '@/components/sme/MainNavigation';

export default function SMELayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <MainNavigation />
      {children}
    </div>
  );
}
```

#### 4.2 로그인 후 홈 (2번 이미지)
**파일: `www.aifixr.site/app/sme/page.tsx`**
```typescript
'use client';

import HeroSection from '@/components/sme/HeroSection';
import FeatureSection from '@/components/sme/FeatureSection';
import BenefitsSection from '@/components/sme/BenefitsSection';

export default function SMEHomePage() {
  return (
    <div className="pt-[140px]">
      <HeroSection />
      <FeatureSection />
      <BenefitsSection />
    </div>
  );
}
```

#### 4.3 자가진단 (3번 이미지)
**파일: `www.aifixr.site/app/sme/self-diagnosis/layout.tsx`**
```typescript
'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sme/AppSidebar';
// 사이드바 레이아웃 구현
```

**파일: `www.aifixr.site/app/sme/self-diagnosis/page.tsx`**
```typescript
'use client';

import { AutomatedReportView } from '@/components/sme/AutomatedReportView';

export default function SelfDiagnosisPage() {
  return <AutomatedReportView />;
}
```

#### 4.4 자동화 보고서 (4번 이미지)
**파일: `www.aifixr.site/app/sme/auto-report/page.tsx`**
```typescript
'use client';

import { ReportTemplateView } from '@/components/sme/ReportTemplateView';

export default function AutoReportPage() {
  return (
    <div className="pt-[140px]">
      <ReportTemplateView />
    </div>
  );
}
```

#### 4.5 윤문 AI (5번 이미지)
**파일: `www.aifixr.site/app/sme/editing/page.tsx`**
```typescript
'use client';

import { EditingView } from '@/components/sme/EditingView';

export default function EditingPage() {
  return (
    <div className="pt-[140px]">
      <EditingView />
    </div>
  );
}
```

### Phase 5: 네비게이션 연동

#### 5.1 MainNavigation 수정
**파일: `www.aifixr.site/components/sme/MainNavigation.tsx`**
```typescript
'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function MainNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: 'intro', label: 'AIFIX 소개', path: '/sme' },
    { id: 'self-diagnosis', label: '자가진단', path: '/sme/self-diagnosis' },
    { id: 'auto-report', label: '자동화 보고서', path: '/sme/auto-report' },
    { id: 'editing', label: '윤문 AI', path: '/sme/editing' },
  ];

  return (
    <nav>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => router.push(tab.path)}
          className={pathname === tab.path ? 'active' : ''}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
```

### Phase 6: 로그아웃 구현

**파일: `www.aifixr.site/components/sme/Header.tsx`**
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { clearAuth } from '@/lib/auth';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <header>
      {/* ... */}
      <button onClick={handleLogout}>로그아웃</button>
    </header>
  );
}
```

## 구현 순서

### Step 1: 기본 구조 설정 (1-2시간)
1. ✅ `www.aifixr.site/app/sme/` 폴더 생성
2. ✅ `www.aifixr.site/components/sme/` 폴더 생성
3. ✅ `www.aifixr.site/lib/auth.ts` 생성

### Step 2: 컴포넌트 복사 (1시간)
1. ✅ `sme.aifixr.site/components/` → `www.aifixr.site/components/sme/` 복사
2. ✅ Import 경로 일괄 수정

### Step 3: 페이지 구현 (2-3시간)
1. ✅ `/sme/layout.tsx` 구현 (인증 체크)
2. ✅ `/sme/page.tsx` 구현 (2번 이미지)
3. ✅ `/sme/self-diagnosis/layout.tsx` + `page.tsx` 구현 (3번 이미지)
4. ✅ `/sme/auto-report/page.tsx` 구현 (4번 이미지)
5. ✅ `/sme/editing/page.tsx` 구현 (5번 이미지)

### Step 4: 인증 흐름 연결 (1-2시간)
1. ✅ 홈 페이지에 자동 리다이렉트 추가
2. ✅ 로그인 콜백에서 토큰 저장 및 리다이렉트
3. ✅ 로그아웃 기능 구현

### Step 5: 네비게이션 연동 (1시간)
1. ✅ MainNavigation을 Next.js 라우팅으로 전환
2. ✅ 활성 탭 표시 (usePathname 사용)

### Step 6: 테스트 및 정리 (1-2시간)
1. ✅ 로그인 → 리다이렉트 → 각 페이지 이동 테스트
2. ✅ 로그아웃 → 홈 리다이렉트 테스트
3. ✅ `sme.aifixr.site` 폴더 삭제 또는 아카이브

## 주의사항

### 1. 페이지 누락 방지 체크리스트
- [x] 2번 이미지: 로그인 후 홈 (intro)
- [x] 3번 이미지: 자가진단 (AutomatedReportView + 사이드바)
  - [x] Total 서브페이지
  - [x] Environment 서브페이지
  - [x] Social 서브페이지
  - [x] Governance 서브페이지
  - [x] ESG 데이터 입력 섹션
- [x] 4번 이미지: 자동화 보고서 (ReportTemplateView)
- [x] 5번 이미지: 윤문 AI (EditingView)

### 2. 상태 관리
- `sme.aifixr.site/app/page.tsx`는 SPA 구조로 `activeMainTab` state로 뷰 전환
- 마이그레이션 후에는 Next.js 라우팅으로 전환하여 URL 기반 네비게이션 사용

### 3. 스타일 일관성
- Tailwind CSS 설정 확인: `www.aifixr.site/tailwind.config.ts`에 AIFIX 커스텀 색상 포함 여부 확인
- 필요시 `sme.aifixr.site/tailwind.config.ts`의 커스텀 설정 병합

### 4. API 호출
- 카카오 로그인 API: `http://localhost:8080/api/oauth/kakao/*`
- 추후 SME 전용 API 호출 시 Authorization 헤더에 토큰 포함 필요

## 완료 기준

1. ✅ 로그인 전: `www.aifixr.site/` (1번 이미지) 표시
2. ✅ 로그인 성공 후: `www.aifixr.site/sme` (2번 이미지)로 자동 리다이렉트
3. ✅ 토큰 있을 때: 홈 접속 시 자동으로 `/sme`로 이동
4. ✅ 자가진단 버튼 클릭: `/sme/self-diagnosis` (3번 이미지) 표시
5. ✅ 자동화 보고서 버튼 클릭: `/sme/auto-report` (4번 이미지) 표시
6. ✅ 윤문 AI 버튼 클릭: `/sme/editing` (5번 이미지) 표시
7. ✅ 로그아웃 후: 토큰 삭제 및 홈(`/`)으로 리다이렉트
8. ✅ 인증 없이 `/sme/*` 접근 시: 홈(`/`)으로 자동 리다이렉트

## 추가 고려사항

### 성능 최적화
- 각 페이지에 동적 import 적용 고려
- 이미지 최적화 (Next.js Image 컴포넌트 사용)

### SEO (선택사항)
- 로그인 후 페이지는 인증 필요하므로 SEO 불필요
- 단, 홈/랜딩 페이지는 메타데이터 최적화

### 에러 처리
- 토큰 만료 시 자동 로그아웃 및 홈 리다이렉트
- API 에러 발생 시 사용자 친화적 에러 메시지 표시

## 롤백 계획
마이그레이션 실패 시:
1. `sme.aifixr.site` 폴더 유지 (삭제하지 않음)
2. `www.aifixr.site/app/sme` 폴더 제거
3. 원래 구조로 복원
