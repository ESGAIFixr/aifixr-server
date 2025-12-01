# 🔗 프론트엔드 Store와 백엔드 서버 연결 전략

## 📋 목차
1. [아키텍처 개요](#아키텍처-개요)
2. [핵심 정책](#핵심-정책)
3. [Eureka vs Discovery 연결 전략](#eureka-vs-discovery-연결-전략)
4. [미들웨어 계층 설계](#미들웨어-계층-설계)
5. [React Query 통합](#react-query-통합)
6. [Redis 캐시 전략](#redis-캐시-전략)
7. [Store Slice별 연결 전략](#store-slice별-연결-전략)
8. [구현 가이드](#구현-가이드)

---

## 🏗️ 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                  🌐 FRONTEND (React + Next.js)                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Pages / Components                          │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                       │
│                         ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Zustand Store (상태 관리)                    │  │
│  │  ┌──────┬──────┬──────┬──────┬──────┬──────┐            │  │
│  │  │ kESG │ ESRS │ GRI  │Rewrite│Chatbot│Realtime│         │  │
│  │  └──────┴──────┴──────┴──────┴──────┴──────┘            │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                       │
│                         ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        React Query (TanStack Query) Middleware           │  │
│  │  - 서버 상태 관리 (캐싱, 동기화, 업데이트)                │  │
│  │  - Automatic Background Refetching                       │  │
│  │  - Query Invalidation & Optimistic Updates               │  │
│  │  - Stale-While-Revalidate 전략                           │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                       │
│                         ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            API Client Layer (lib/api/)                   │  │
│  │  - ApiClient (axios instance)                            │  │
│  │  - Request/Response Interceptors                         │  │
│  │  - Error Handling & Retry Logic                          │  │
│  │  - Token Management                                      │  │
│  └──────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │ HTTP Request
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│              Docker Network: spring-network                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           🔵 AI GATEWAY (신규 - 선택적)                   │  │
│  │  - AI 모델 호출 (OpenAI, Claude 등)                       │  │
│  │  - Prompt/Response 전처리                                │  │
│  │  - API Gateway로 전달                                    │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                       │
│                         ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │      🟦 API GATEWAY (Spring Cloud Gateway) :8080         │  │
│  │  ⭐ 프론트엔드가 연결해야 하는 단일 진입점                  │  │
│  │                                                          │  │
│  │  Routes (권한 기반 분기):                                 │  │
│  │  ├─ /api/public/**     → 비로그인 접근 (공개 보고서)     │  │
│  │  ├─ /api/client/**     → 고객사 전용 (자가진단, 대시보드)│  │
│  │  ├─ /api/admin/**      → 관리자 전용 (전체 데이터)       │  │
│  │  ├─ /api/auth/**       → 인증/인가                       │  │
│  │  ├─ /api/diagnosis/**  → 자가진단 서비스                 │  │
│  │  ├─ /api/report/**     → 보고서 서비스                   │  │
│  │  └─ /api/dashboard/**  → 대시보드 서비스                 │  │
│  │                                                          │  │
│  │  기능:                                                    │  │
│  │  - Routing & Load Balancing                              │  │
│  │  - 인증/인가 (JWT Token 검증)                            │  │
│  │  - CORS 정책 관리                                        │  │
│  │  - Rate Limiting                                         │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                       │
│                         ↓ Eureka 서비스 검색                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Eureka Server :8761                                     │  │
│  │  🔍 서비스 레지스트리 (내부 전용)                          │  │
│  │                                                          │  │
│  │  등록된 서비스:                                           │  │
│  │  ├─ AUTH-SERVICE                                         │  │
│  │  ├─ DIAGNOSIS-SERVICE                                    │  │
│  │  ├─ REPORT-SERVICE                                       │  │
│  │  ├─ DASHBOARD-SERVICE                                    │  │
│  │  └─ ADMIN-SERVICE                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│                         ↓ Load Balancing                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │       🟩 MICROSERVICES (Spring WebFlux)                  │  │
│  │                                                          │  │
│  │  [ Auth Service ]                                        │  │
│  │    - 로그인/토큰 관리                                     │  │
│  │    - 권한: guest / client / admin                        │  │
│  │    - Consent 관리 (민감데이터 승인)                       │  │
│  │                                                          │  │
│  │  [ Diagnosis Service ]                                   │  │
│  │    - 자가진단 실시간 점수                                 │  │
│  │    - 고객사 1년 기간 데이터                               │  │
│  │    - Redis 캐시: client:{clientId}:diagnosis:summary    │  │
│  │                                                          │  │
│  │  [ Report Service ]                                      │  │
│  │    - 지속가능경영보고서 생성                              │  │
│  │    - 최종 ESG 등급 계산                                  │  │
│  │    - 공개 캐시: public:{clientId}:finalReport:{year}    │  │
│  │                                                          │  │
│  │  [ Dashboard Service ]                                   │  │
│  │    - 고객사 KPI / 그래프                                 │  │
│  │    - 실시간 요약 조회 (Redis)                            │  │
│  │    - 민감 데이터 조회 (Postgres/MongoDB)                 │  │
│  │                                                          │  │
│  │  [ Admin Service ]                                       │  │
│  │    - 모든 고객사 데이터 접근                              │  │
│  │    - Consent 승인 후 민감정보 조회                        │  │
│  │    - 관리자 통계 캐시: admin:*                           │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                       │
│                         ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           🧰 REDIS (Cache Layer) :6379                   │  │
│  │                                                          │  │
│  │  public:*                                                │  │
│  │    - 비로그인 접근 가능 공개 보고서 캐시                  │  │
│  │    - 최종 ESG 등급 (1년 기준, 매달 갱신)                 │  │
│  │    - TTL: 30일                                           │  │
│  │                                                          │  │
│  │  client:{clientId}:*                                     │  │
│  │    - 고객사별 대시보드 실시간 요약 캐시                   │  │
│  │    - 자가진단 실시간 점수                                │  │
│  │    - TTL: 5분~1시간 (실시간 반영)                        │  │
│  │                                                          │  │
│  │  admin:*                                                 │  │
│  │    - 관리자용 통계/요약 캐시                             │  │
│  │    - TTL: 1시간                                          │  │
│  │                                                          │  │
│  │  token:*                                                 │  │
│  │    - JWT Refresh Token                                   │  │
│  │    - Token Blacklist                                     │  │
│  │    - TTL: 선택 가능 (1개월~6개월)                        │  │
│  │                                                          │  │
│  │  ❌ 민감정보는 절대 Redis에 저장하지 않음                 │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                       │
│                         ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        🗄️ POSTGRESQL :5432 / MongoDB :27017             │  │
│  │                                                          │  │
│  │  Postgres:                                               │  │
│  │    - 고객사 민감정보 (최종 자가진단 원본)                 │  │
│  │    - 1년치 자가진단 히스토리                             │  │
│  │    - Consent 테이블                                      │  │
│  │    - 고객사 계정/권한                                     │  │
│  │    - 관리자 데이터 접근 로그                              │  │
│  │                                                          │  │
│  │  MongoDB:                                                │  │
│  │    - JSON 보고서                                         │  │
│  │    - ESG 항목별 점수                                     │  │
│  │    - 비정형 데이터                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔹 핵심 정책

### 1. 실시간 자가진단 점수

**접근 권한**: 고객사 내부만 접근 가능

**저장 전략**:
- **Redis**: 요약 캐시 (빠른 조회용)
- **Postgres/MongoDB**: 원본 데이터 (영구 저장)

**캐시 정책**:
- **만료 시간**: 5분~1시간 (빠른 업데이트 필요)
- **Key 패턴**: `client:{clientId}:diagnosis:summary`
- **갱신 전략**: Write-Through (DB 저장 후 즉시 캐시 업데이트)

**예시**:
```
Key: client:company123:diagnosis:summary
Value: { score: 85, lastUpdated: "2024-11-21T10:30:00Z", categories: {...} }
TTL: 300 seconds (5분)
```

### 2. 1년 기준 최종 평가 / 보고서

**접근 권한**: 로그인 없이도 접근 가능 (공개용)

**저장 전략**:
- **Redis**: 공개용 캐시 (빠른 조회)
- **MongoDB**: 최종 보고서 원본 (JSON 형태)
- **Postgres**: 회계연도별 메타데이터

**캐시 정책**:
- **만료 시간**: 30일 (매달 1회 갱신)
- **Key 패턴**: `public:{clientId}:finalReport:{fiscalYear}`
- **갱신 전략**: Cache-Aside (조회 시 캐시 없으면 DB에서 로드)

**예시**:
```
Key: public:company123:finalReport:2024
Value: { grade: "A+", totalScore: 92, publishedAt: "2024-12-31", ... }
TTL: 2592000 seconds (30일)
```

### 3. DB 역할 분리

| Database | 용도 | 데이터 타입 |
|----------|------|------------|
| **Postgres** | 구조화된 데이터 | 고객사 정보, 민감정보, 히스토리, Consent 테이블 |
| **MongoDB** | 비정형 데이터 | JSON 보고서, ESG 항목별 점수, 대용량 문서 |
| **Redis** | 캐시 | 권한/기간 기반 임시 데이터 |

### 4. Redis 캐시 Key 전략

```
📂 Redis Key Namespace

├─ public:*                          (공개 데이터)
│  ├─ public:{clientId}:finalReport:{fiscalYear}
│  └─ public:esg:rankings            (전체 순위)
│
├─ client:{clientId}:*               (고객사 전용)
│  ├─ client:{clientId}:diagnosis:summary
│  ├─ client:{clientId}:dashboard:kpi
│  └─ client:{clientId}:realtime:score
│
├─ admin:*                           (관리자 전용)
│  ├─ admin:statistics:monthly
│  ├─ admin:clients:summary
│  └─ admin:audit:logs
│
└─ token:*                           (인증 토큰)
   ├─ token:refresh:{userId}
   └─ token:blacklist:{tokenId}
```

### 5. 관리자/회원사 자동 로그인

**Redis Token 캐시 활용**:
- **Refresh Token**: Redis에 저장, TTL 옵션 선택 가능
- **TTL 옵션**: 1개월, 3개월, 6개월
- **자동 갱신**: Access Token 만료 시 Refresh Token으로 자동 갱신

**예시**:
```
Key: token:refresh:user123
Value: { refreshToken: "eyJhbGc...", expiresAt: "2025-05-21", role: "client" }
TTL: 7776000 seconds (3개월)
```

### 6. 민감정보 보호 정책

**❌ Redis에 절대 저장하지 않는 데이터**:
- 개인정보 (이름, 주민번호, 연락처)
- 재무 상세 정보 (매출, 비용 상세)
- 내부 감사 원본 데이터
- 비승인 민감 데이터

**✅ Postgres/MongoDB에만 저장**:
- Consent 승인 후에만 조회 가능
- 접근 로그 기록 (audit_log 테이블)
- 암호화 저장 (AES-256)

---

## 🎯 Eureka vs Discovery 연결 전략

### ❌ Eureka에 직접 연결하지 않는 이유

```javascript
// ❌ 잘못된 방법 - Eureka에 직접 연결
const response = await axios.get('http://localhost:8761/eureka/apps/SOCCER');
```

**문제점:**
1. **역할 위반**: Eureka는 서비스 레지스트리로, 마이크로서비스 간 통신용
2. **보안 취약**: 프론트엔드에 내부 서비스 구조 노출
3. **복잡성 증가**: 프론트엔드가 서비스 검색, 로드 밸런싱 직접 처리
4. **확장성 제한**: 서비스 추가/변경 시 프론트엔드 수정 필요
5. **CORS 문제**: Eureka는 브라우저 요청을 고려하지 않음

### ✅ Discovery Server (API Gateway)에 연결하는 이유

```javascript
// ✅ 올바른 방법 - Discovery Server (Gateway)에 연결
const response = await axios.get('http://localhost:8080/api/soccer/search', {
  params: { keyword: '손흥민' }
});
```

**장점:**
1. **단일 진입점**: 모든 API 요청을 하나의 엔드포인트로 통합
2. **자동 라우팅**: Gateway가 Eureka를 통해 서비스 자동 검색
3. **보안 강화**: 인증, 인가, Rate Limiting 중앙 관리
4. **CORS 처리**: Gateway에서 CORS 정책 통합 관리
5. **모니터링**: 모든 요청을 Gateway에서 추적 가능
6. **서비스 추상화**: 백엔드 구조 변경 시 프론트엔드 영향 최소화

---

## 🔧 미들웨어 계층 설계

### 1. API Client 계층 (`frontend/src/lib/api/`)

```typescript
// frontend/src/lib/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * API 클라이언트 싱글톤
 * Discovery Server (Gateway)와 통신
 */
class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;

  private constructor() {
    // Discovery Server 주소 (Gateway)
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // 쿠키 전송 허용
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors() {
    // 요청 인터셉터
    this.client.interceptors.request.use(
      (config) => {
        // 인증 토큰 추가
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 요청 로깅
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // 401 Unauthorized - 토큰 갱신
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // 토큰 갱신 로직
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // 로그아웃 처리
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // 503 Service Unavailable - 서비스 다운
        if (error.response?.status === 503) {
          console.error('[Service Unavailable]', error.config.url);
          throw new Error('서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.');
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string> {
    // 토큰 갱신 API 호출
    const response = await this.client.post('/api/auth/refresh');
    const newToken = response.data.token;
    localStorage.setItem('auth_token', newToken);
    return newToken;
  }

  // HTTP 메서드
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = ApiClient.getInstance();
```

### 2. Service 계층 (`frontend/src/lib/api/services/`)

각 백엔드 서비스별로 API 호출 함수 정의

```typescript
// frontend/src/lib/api/services/soccer.service.ts
import { apiClient } from '../client';

export interface SearchPlayerRequest {
  keyword : string;
}

export interface SearchPlayerResponse {
  code: number;
  message ?: string;
  data?: any[];
}

export const soccerService = {
  /**
   * 선수 검색
   * Gateway: /api/soccer/search → Soccer Service: /search
   */
  searchPlayer: async (keyword: string): Promise<SearchPlayerResponse> => {
    return apiClient.get('/api/soccer/search', {
      params: { keyword }
    });
  },

  /**
   * 선수 목록 조회
   */
  getPlayers: async (): Promise<SearchPlayerResponse> => {
    return apiClient.get('/api/soccer/players/all');
  },

  /**
   * 선수 상세 조회
   */
  getPlayerById: async (playerId: string): Promise<SearchPlayerResponse> => {
    return apiClient.get(`/api/soccer/players/playerId/${playerId}`);
  },
};
```

```typescript
// frontend/src/lib/api/services/user.service.ts
import { apiClient } from '../client';

export const userService = {
  /**
   * 사용자 로그인
   */
  login: async (username: string, password: string) => {
    return apiClient.post('/api/user/auth/login', { username, password });
  },

  /**
   * 사용자 정보 조회
   */
  getUserProfile: async () => {
    return apiClient.get('/api/user/profile');
  },
};
```

```typescript
// frontend/src/lib/api/services/index.ts
export * from './soccer.service';
export * from './user.service';
export * from './common.service';
export * from './environment.service';
```

---

## 🔄 React Query 통합

### 1. React Query 설정

```typescript
// frontend/src/lib/react-query/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale Time: 데이터가 "신선"하다고 간주되는 시간
      staleTime: 1000 * 60 * 5, // 5분
      
      // Cache Time: 캐시에 데이터를 보관하는 시간
      gcTime: 1000 * 60 * 30, // 30분 (구 cacheTime)
      
      // 자동 재요청 설정
      refetchOnWindowFocus: true,  // 윈도우 포커스 시 재요청
      refetchOnReconnect: true,    // 재연결 시 재요청
      refetchOnMount: true,        // 마운트 시 재요청
      
      // 재시도 설정
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});
```

```typescript
// frontend/src/app/providers.tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/react-query/queryClient';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

### 2. Query Keys 전략

```typescript
// frontend/src/lib/react-query/queryKeys.ts

/**
 * Query Key Factory
 * 일관된 Query Key 생성 및 관리
 */
export const queryKeys = {
  // Public (비로그인 접근)
  public: {
    all: ['public'] as const,
    finalReports: () => [...queryKeys.public.all, 'finalReports'] as const,
    finalReport: (clientId: string, fiscalYear: string) =>
      [...queryKeys.public.finalReports(), clientId, fiscalYear] as const,
    esgRankings: () => [...queryKeys.public.all, 'esgRankings'] as const,
  },

  // Client (고객사 전용)
  client: {
    all: (clientId: string) => ['client', clientId] as const,
    diagnosis: (clientId: string) =>
      [...queryKeys.client.all(clientId), 'diagnosis'] as const,
    diagnosisSummary: (clientId: string) =>
      [...queryKeys.client.diagnosis(clientId), 'summary'] as const,
    dashboard: (clientId: string) =>
      [...queryKeys.client.all(clientId), 'dashboard'] as const,
    dashboardKpi: (clientId: string) =>
      [...queryKeys.client.dashboard(clientId), 'kpi'] as const,
    realtimeScore: (clientId: string) =>
      [...queryKeys.client.all(clientId), 'realtime', 'score'] as const,
  },

  // Admin (관리자 전용)
  admin: {
    all: ['admin'] as const,
    statistics: () => [...queryKeys.admin.all, 'statistics'] as const,
    monthlyStats: () => [...queryKeys.admin.statistics(), 'monthly'] as const,
    clientsSummary: () => [...queryKeys.admin.all, 'clients', 'summary'] as const,
    auditLogs: (filters?: any) =>
      [...queryKeys.admin.all, 'audit', 'logs', filters] as const,
  },

  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    profile: () => [...queryKeys.auth.user(), 'profile'] as const,
  },
};
```

### 3. Custom Hooks (Query)

```typescript
// frontend/src/lib/react-query/hooks/usePublicReport.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { reportService } from '@/lib/api/services';

/**
 * 공개 최종 보고서 조회 (비로그인 가능)
 * Redis: public:{clientId}:finalReport:{fiscalYear}
 * TTL: 30일
 */
export function usePublicReport(clientId: string, fiscalYear: string) {
  return useQuery({
    queryKey: queryKeys.public.finalReport(clientId, fiscalYear),
    queryFn: () => reportService.getPublicReport(clientId, fiscalYear),
    staleTime: 1000 * 60 * 60 * 24, // 24시간 (공개 보고서는 자주 변경되지 않음)
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7일
    enabled: !!clientId && !!fiscalYear,
  });
}
```

```typescript
// frontend/src/lib/react-query/hooks/useClientDiagnosis.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { diagnosisService } from '@/lib/api/services';

/**
 * 고객사 실시간 자가진단 점수 조회
 * Redis: client:{clientId}:diagnosis:summary
 * TTL: 5분
 */
export function useClientDiagnosisSummary(clientId: string) {
  return useQuery({
    queryKey: queryKeys.client.diagnosisSummary(clientId),
    queryFn: () => diagnosisService.getSummary(clientId),
    staleTime: 1000 * 60 * 5, // 5분 (실시간 데이터)
    gcTime: 1000 * 60 * 10, // 10분
    refetchInterval: 1000 * 60 * 5, // 5분마다 자동 갱신
    enabled: !!clientId,
  });
}
```

```typescript
// frontend/src/lib/react-query/hooks/useAdminStatistics.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { adminService } from '@/lib/api/services';

/**
 * 관리자 월간 통계 조회
 * Redis: admin:statistics:monthly
 * TTL: 1시간
 */
export function useAdminMonthlyStats() {
  return useQuery({
    queryKey: queryKeys.admin.monthlyStats(),
    queryFn: () => adminService.getMonthlyStatistics(),
    staleTime: 1000 * 60 * 60, // 1시간
    gcTime: 1000 * 60 * 60 * 2, // 2시간
  });
}
```

### 4. Custom Hooks (Mutation)

```typescript
// frontend/src/lib/react-query/hooks/useDiagnosisMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { diagnosisService } from '@/lib/api/services';

/**
 * 자가진단 점수 업데이트
 * Optimistic Update + Cache Invalidation
 */
export function useUpdateDiagnosis(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => diagnosisService.updateDiagnosis(clientId, data),
    
    // Optimistic Update: 서버 응답 전에 UI 먼저 업데이트
    onMutate: async (newData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: queryKeys.client.diagnosisSummary(clientId),
      });

      // 이전 데이터 백업
      const previousData = queryClient.getQueryData(
        queryKeys.client.diagnosisSummary(clientId)
      );

      // 낙관적 업데이트
      queryClient.setQueryData(
        queryKeys.client.diagnosisSummary(clientId),
        (old: any) => ({
          ...old,
          ...newData,
          lastUpdated: new Date().toISOString(),
        })
      );

      return { previousData };
    },

    // 성공 시: 관련 쿼리 무효화
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.client.diagnosis(clientId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.client.dashboard(clientId),
      });
    },

    // 실패 시: 이전 데이터로 롤백
    onError: (err, newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          queryKeys.client.diagnosisSummary(clientId),
          context.previousData
        );
      }
    },
  });
}
```

### 5. Prefetching 전략

```typescript
// frontend/src/lib/react-query/prefetch.ts
import { queryClient } from './queryClient';
import { queryKeys } from './queryKeys';
import { reportService, diagnosisService } from '@/lib/api/services';

/**
 * 페이지 이동 전 데이터 미리 로드
 */
export const prefetchStrategies = {
  // 공개 보고서 페이지 진입 전
  publicReport: async (clientId: string, fiscalYear: string) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.public.finalReport(clientId, fiscalYear),
      queryFn: () => reportService.getPublicReport(clientId, fiscalYear),
      staleTime: 1000 * 60 * 60 * 24, // 24시간
    });
  },

  // 고객사 대시보드 진입 전
  clientDashboard: async (clientId: string) => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.client.diagnosisSummary(clientId),
        queryFn: () => diagnosisService.getSummary(clientId),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.client.dashboardKpi(clientId),
        queryFn: () => diagnosisService.getKpi(clientId),
      }),
    ]);
  },
};
```

### 6. React Query + Zustand 통합

```typescript
// frontend/src/store/slices/chatbot.ts (수정)
import { StateCreator } from 'zustand';
import { StoreState, ChatbotSlice } from '../types';
import { useQuery, useMutation } from '@tanstack/react-query';
import { soccerService } from '@/lib/api/services';

export const createChatbotSlice: StateCreator<
  StoreState,
  [],
  [],
  ChatbotSlice
> = (set, get) => ({
  // ... 기존 상태 ...

  // React Query는 컴포넌트에서 사용
  // Zustand는 UI 상태만 관리
  sendMessage: async (message: string) => {
    set((state) => ({
      chatbot: {
        ...state.chatbot,
        isLoading: true,
        error: null,
        input: '',
      },
    }));

    get().chatbot.addMessage('user', message);

    try {
      // ✅ React Query의 mutate 함수를 컴포넌트에서 호출
      // 여기서는 직접 API 호출 대신 상태만 관리
      const response = await soccerService.searchPlayer(message);
      
      get().chatbot.addMessage('assistant', response.message);

      set((state) => ({
        chatbot: {
          ...state.chatbot,
          lastResponse: response,
          isLoading: false,
        },
      }));
    } catch (error: any) {
      const errorMessage = error.message || '요청 처리 중 오류가 발생했습니다.';
      get().chatbot.addMessage('assistant', errorMessage);

      set((state) => ({
        chatbot: {
          ...state.chatbot,
          error: errorMessage,
          isLoading: false,
        },
      }));
    }
  },
});
```

### 7. 컴포넌트에서 사용 예시

```typescript
// frontend/src/components/PublicReportView.tsx
'use client';

import { usePublicReport } from '@/lib/react-query/hooks/usePublicReport';

export function PublicReportView({ clientId, fiscalYear }: Props) {
  const { data, isLoading, error, refetch } = usePublicReport(clientId, fiscalYear);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error.message}</div>;

  return (
    <div>
      <h1>{data.companyName} ESG 보고서</h1>
      <p>등급: {data.grade}</p>
      <p>점수: {data.totalScore}</p>
      <button onClick={() => refetch()}>새로고침</button>
    </div>
  );
}
```

```typescript
// frontend/src/components/ClientDashboard.tsx
'use client';

import { useClientDiagnosisSummary } from '@/lib/react-query/hooks/useClientDiagnosis';
import { useUpdateDiagnosis } from '@/lib/react-query/hooks/useDiagnosisMutation';

export function ClientDashboard({ clientId }: Props) {
  const { data, isLoading } = useClientDiagnosisSummary(clientId);
  const updateMutation = useUpdateDiagnosis(clientId);

  const handleUpdate = () => {
    updateMutation.mutate({
      score: 90,
      category: 'environment',
    });
  };

  return (
    <div>
      <h2>실시간 자가진단 점수</h2>
      <p>점수: {data?.score}</p>
      <p>마지막 업데이트: {data?.lastUpdated}</p>
      <button onClick={handleUpdate} disabled={updateMutation.isPending}>
        {updateMutation.isPending ? '업데이트 중...' : '점수 업데이트'}
      </button>
    </div>
  );
}
```

---

## 💾 Redis 캐시 전략

### 1. 캐시 계층 구조

```typescript
// backend/src/main/java/site/aifixr/api/config/RedisConfig.java
@Configuration
@EnableCaching
public class RedisConfig {
    
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();

        // Public 캐시: 30일
        cacheConfigurations.put("public", defaultConfig
            .entryTtl(Duration.ofDays(30)));

        // Client 캐시: 5분
        cacheConfigurations.put("client", defaultConfig
            .entryTtl(Duration.ofMinutes(5)));

        // Admin 캐시: 1시간
        cacheConfigurations.put("admin", defaultConfig
            .entryTtl(Duration.ofHours(1)));

        // Token 캐시: 3개월
        cacheConfigurations.put("token", defaultConfig
            .entryTtl(Duration.ofDays(90)));

        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(defaultConfig)
            .withInitialCacheConfigurations(cacheConfigurations)
            .build();
    }
}
```

### 2. 서비스별 캐시 전략

```java
// backend/src/main/java/site/aifixr/api/report/ReportService.java
@Service
@Slf4j
public class ReportService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 공개 최종 보고서 조회
     * Cache-Aside 패턴
     */
    @Cacheable(value = "public", key = "'public:' + #clientId + ':finalReport:' + #fiscalYear")
    public FinalReport getPublicReport(String clientId, String fiscalYear) {
        log.info("🔍 공개 보고서 조회 - clientId: {}, fiscalYear: {}", clientId, fiscalYear);
        
        // Redis 캐시 확인
        String cacheKey = String.format("public:%s:finalReport:%s", clientId, fiscalYear);
        FinalReport cachedReport = (FinalReport) redisTemplate.opsForValue().get(cacheKey);
        
        if (cachedReport != null) {
            log.info("✅ Redis 캐시 Hit: {}", cacheKey);
            return cachedReport;
        }
        
        // 캐시 미스 - MongoDB에서 조회
        log.info("❌ Redis 캐시 Miss - MongoDB 조회");
        FinalReport report = mongoTemplate.findOne(
            Query.query(Criteria.where("clientId").is(clientId)
                .and("fiscalYear").is(fiscalYear)),
            FinalReport.class
        );
        
        // Redis에 캐시 저장 (30일)
        if (report != null) {
            redisTemplate.opsForValue().set(cacheKey, report, 30, TimeUnit.DAYS);
            log.info("💾 Redis 캐시 저장: {}", cacheKey);
        }
        
        return report;
    }

    /**
     * 자가진단 요약 조회
     * Write-Through 패턴
     */
    @Cacheable(value = "client", key = "'client:' + #clientId + ':diagnosis:summary'")
    public DiagnosisSummary getDiagnosisSummary(String clientId) {
        log.info("🔍 자가진단 요약 조회 - clientId: {}", clientId);
        
        String cacheKey = String.format("client:%s:diagnosis:summary", clientId);
        DiagnosisSummary cached = (DiagnosisSummary) redisTemplate.opsForValue().get(cacheKey);
        
        if (cached != null) {
            log.info("✅ Redis 캐시 Hit: {}", cacheKey);
            return cached;
        }
        
        // Postgres에서 조회
        DiagnosisSummary summary = diagnosisRepository.findSummaryByClientId(clientId);
        
        // Redis에 캐시 저장 (5분)
        if (summary != null) {
            redisTemplate.opsForValue().set(cacheKey, summary, 5, TimeUnit.MINUTES);
            log.info("💾 Redis 캐시 저장: {}", cacheKey);
        }
        
        return summary;
    }

    /**
     * 자가진단 업데이트
     * Write-Through: DB 저장 후 즉시 캐시 업데이트
     */
    @CacheEvict(value = "client", key = "'client:' + #clientId + ':diagnosis:summary'")
    public DiagnosisSummary updateDiagnosis(String clientId, DiagnosisRequest request) {
        log.info("📝 자가진단 업데이트 - clientId: {}", clientId);
        
        // 1. Postgres에 저장
        DiagnosisSummary updated = diagnosisRepository.save(request);
        
        // 2. Redis 캐시 즉시 업데이트
        String cacheKey = String.format("client:%s:diagnosis:summary", clientId);
        redisTemplate.opsForValue().set(cacheKey, updated, 5, TimeUnit.MINUTES);
        log.info("💾 Redis 캐시 업데이트: {}", cacheKey);
        
        // 3. 관련 캐시 무효화
        invalidateRelatedCaches(clientId);
        
        return updated;
    }

    /**
     * 관련 캐시 무효화
     */
    private void invalidateRelatedCaches(String clientId) {
        String dashboardKey = String.format("client:%s:dashboard:*", clientId);
        Set<String> keys = redisTemplate.keys(dashboardKey);
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
            log.info("🗑️ 관련 캐시 무효화: {} keys", keys.size());
        }
    }
}
```

### 3. 민감정보 필터링

```java
// backend/src/main/java/site/aifixr/api/common/SensitiveDataFilter.java
@Component
public class SensitiveDataFilter {

    /**
     * Redis 저장 전 민감정보 제거
     */
    public <T> T filterSensitiveData(T data) {
        if (data == null) return null;
        
        // 민감정보 필드 제거
        ObjectMapper mapper = new ObjectMapper();
        JsonNode node = mapper.valueToTree(data);
        
        // 제거할 필드 목록
        List<String> sensitiveFields = Arrays.asList(
            "personalInfo", "ssn", "bankAccount", "detailedFinancials", 
            "internalAudit", "password", "privateKey"
        );
        
        sensitiveFields.forEach(field -> {
            if (node.has(field)) {
                ((ObjectNode) node).remove(field);
            }
        });
        
        return mapper.convertValue(node, (Class<T>) data.getClass());
    }
}
```

---

## 📦 Store Slice별 연결 전략

### 1. Chatbot Slice → Soccer Service

```typescript
// frontend/src/store/slices/chatbot.ts
import { StateCreator } from 'zustand';
import { StoreState, ChatbotSlice } from '../types';
import { soccerService } from '@/lib/api/services';

export const createChatbotSlice: StateCreator<
  StoreState,
  [],
  [],
  ChatbotSlice
> = (set, get) => ({
  // ... 기존 상태 ...

  sendMessage: async (message: string) => {
    set((state) => ({
      chatbot: {
        ...state.chatbot,
        isLoading: true,
        error: null,
        input: '',
      },
    }));

    // 사용자 메시지 추가
    get().chatbot.addMessage('user', message);

    try {
      // ✅ Service 계층을 통한 API 호출
      const response = await soccerService.searchPlayer(message);

      // 응답 메시지 추가
      const assistantMessage = response.message || '검색 완료';
      get().chatbot.addMessage('assistant', assistantMessage);

      set((state) => ({
        chatbot: {
          ...state.chatbot,
          lastResponse: response,
          isLoading: false,
        },
      }));
    } catch (error: any) {
      console.error('API 호출 오류:', error);

      const errorMessage = error.message || '요청 처리 중 오류가 발생했습니다.';
      get().chatbot.addMessage('assistant', errorMessage);

      set((state) => ({
        chatbot: {
          ...state.chatbot,
          error: errorMessage,
          isLoading: false,
        },
      }));
    }
  },
});
```

### 2. K-ESG Slice → Environment Service

```typescript
// frontend/src/store/slices/kESG.ts
import { StateCreator } from 'zustand';
import { StoreState, KESGSlice } from '../types';
import { environmentService } from '@/lib/api/services';

export const createKESGSlice: StateCreator<
  StoreState,
  [],
  [],
  KESGSlice
> = (set, get) => ({
  // ... 기존 상태 ...

  processKESGData: async (data: any) => {
    set((state) => ({
      kESG: { ...state.kESG, isLoading: true, error: null },
    }));

    try {
      // ✅ Environment Service API 호출
      const response = await environmentService.processKESG(data);

      set((state) => ({
        kESG: {
          ...state.kESG,
          currentReport: response.data,
          lastResponse: response,
          isLoading: false,
        },
      }));
    } catch (error: any) {
      set((state) => ({
        kESG: {
          ...state.kESG,
          error: error.message,
          isLoading: false,
        },
      }));
    }
  },
});
```

### 3. Realtime Slice → WebSocket 연결

```typescript
// frontend/src/store/slices/realtime.ts
import { StateCreator } from 'zustand';
import { StoreState, RealtimeSlice } from '../types';

export const createRealtimeSlice: StateCreator<
  StoreState,
  [],
  [],
  RealtimeSlice
> = (set, get) => {
  let ws: WebSocket | null = null;

  return {
    // ... 기존 상태 ...

    subscribe: (channel: string) => {
      // ✅ Discovery Server의 WebSocket 엔드포인트
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';
      
      ws = new WebSocket(`${wsUrl}/${channel}`);

      ws.onopen = () => {
        console.log(`[WebSocket] Connected to ${channel}`);
        set((state) => ({
          realtime: {
            ...state.realtime,
            connectionStatus: 'connected',
          },
        }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        get().realtime.addMessage('system', message.content);
        
        set((state) => ({
          realtime: {
            ...state.realtime,
            lastUpdate: Date.now(),
          },
        }));
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        set((state) => ({
          realtime: {
            ...state.realtime,
            error: 'WebSocket 연결 오류',
            connectionStatus: 'disconnected',
          },
        }));
      };

      ws.onclose = () => {
        console.log('[WebSocket] Disconnected');
        set((state) => ({
          realtime: {
            ...state.realtime,
            connectionStatus: 'disconnected',
          },
        }));
      };
    },

    unsubscribe: () => {
      if (ws) {
        ws.close();
        ws = null;
      }
    },
  };
};
```

---

## 🚀 구현 가이드

### Step 1: 패키지 설치

```bash
cd frontend

# React Query 설치
pnpm install @tanstack/react-query @tanstack/react-query-devtools

# Axios 설치 (이미 설치되어 있다면 생략)
pnpm install axios

# 타입 정의
pnpm install -D @types/node
```

### Step 2: 디렉토리 구조 생성

```bash
# API 관련 디렉토리
mkdir -p frontend/src/lib/api/services
mkdir -p frontend/src/lib/react-query/hooks

# 파일 생성
touch frontend/src/lib/api/client.ts
touch frontend/src/lib/api/errors.ts
touch frontend/src/lib/api/services/auth.service.ts
touch frontend/src/lib/api/services/diagnosis.service.ts
touch frontend/src/lib/api/services/report.service.ts
touch frontend/src/lib/api/services/dashboard.service.ts
touch frontend/src/lib/api/services/admin.service.ts
touch frontend/src/lib/api/services/index.ts

# React Query 파일
touch frontend/src/lib/react-query/queryClient.ts
touch frontend/src/lib/react-query/queryKeys.ts
touch frontend/src/lib/react-query/prefetch.ts
touch frontend/src/lib/react-query/hooks/usePublicReport.ts
touch frontend/src/lib/react-query/hooks/useClientDiagnosis.ts
touch frontend/src/lib/react-query/hooks/useAdminStatistics.ts
touch frontend/src/lib/react-query/hooks/useDiagnosisMutation.ts

# Provider
touch frontend/src/app/providers.tsx
```

**최종 디렉토리 구조**:
```
frontend/src/
├── app/
│   ├── providers.tsx              # React Query Provider
│   └── layout.tsx                 # Root Layout
├── lib/
│   ├── api/
│   │   ├── client.ts              # Axios 인스턴스
│   │   ├── errors.ts              # 에러 처리
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── diagnosis.service.ts
│   │       ├── report.service.ts
│   │       ├── dashboard.service.ts
│   │       ├── admin.service.ts
│   │       └── index.ts
│   └── react-query/
│       ├── queryClient.ts         # Query Client 설정
│       ├── queryKeys.ts           # Query Key Factory
│       ├── prefetch.ts            # Prefetch 전략
│       └── hooks/
│           ├── usePublicReport.ts
│           ├── useClientDiagnosis.ts
│           ├── useAdminStatistics.ts
│           └── useDiagnosisMutation.ts
└── store/
    ├── index.ts                   # Zustand Store
    ├── types.ts
    └── slices/
        ├── chatbot.ts
        ├── kESG.ts
        └── ...
```

### Step 3: 환경 변수 설정

```bash
# frontend/.env.local (개발 환경)
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
NODE_ENV=development
```

```bash
# frontend/.env.production (프로덕션 환경)
NEXT_PUBLIC_API_URL=http://discovery:8080
NEXT_PUBLIC_WS_URL=ws://discovery:8080/ws
NODE_ENV=production
```

### Step 4: Service 계층 구현

```typescript
// frontend/src/lib/api/services/diagnosis.service.ts
import { apiClient } from '../client';

export interface DiagnosisSummary {
  score: number;
  lastUpdated: string;
  categories: Record<string, number>;
}

export const diagnosisService = {
  /**
   * 자가진단 요약 조회
   * GET /api/client/diagnosis/summary
   * Redis: client:{clientId}:diagnosis:summary
   */
  getSummary: async (clientId: string): Promise<DiagnosisSummary> => {
    return apiClient.get(`/api/client/${clientId}/diagnosis/summary`);
  },

  /**
   * 자가진단 KPI 조회
   * GET /api/client/dashboard/kpi
   */
  getKpi: async (clientId: string) => {
    return apiClient.get(`/api/client/${clientId}/dashboard/kpi`);
  },

  /**
   * 자가진단 업데이트
   * POST /api/client/diagnosis/update
   */
  updateDiagnosis: async (clientId: string, data: any) => {
    return apiClient.post(`/api/client/${clientId}/diagnosis/update`, data);
  },
};
```

```typescript
// frontend/src/lib/api/services/report.service.ts
import { apiClient } from '../client';

export const reportService = {
  /**
   * 공개 최종 보고서 조회 (비로그인 가능)
   * GET /api/public/report/{clientId}/{fiscalYear}
   * Redis: public:{clientId}:finalReport:{fiscalYear}
   */
  getPublicReport: async (clientId: string, fiscalYear: string) => {
    return apiClient.get(`/api/public/report/${clientId}/${fiscalYear}`);
  },

  /**
   * ESG 순위 조회
   * GET /api/public/esg/rankings
   */
  getEsgRankings: async () => {
    return apiClient.get('/api/public/esg/rankings');
  },
};
```

```typescript
// frontend/src/lib/api/services/admin.service.ts
import { apiClient } from '../client';

export const adminService = {
  /**
   * 월간 통계 조회
   * GET /api/admin/statistics/monthly
   * Redis: admin:statistics:monthly
   */
  getMonthlyStatistics: async () => {
    return apiClient.get('/api/admin/statistics/monthly');
  },

  /**
   * 고객사 요약 조회
   * GET /api/admin/clients/summary
   */
  getClientsSummary: async () => {
    return apiClient.get('/api/admin/clients/summary');
  },

  /**
   * 감사 로그 조회
   * GET /api/admin/audit/logs
   */
  getAuditLogs: async (filters?: any) => {
    return apiClient.get('/api/admin/audit/logs', { params: filters });
  },
};
```

### Step 5: React Query Provider 설정

```typescript
// frontend/src/app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Step 6: Store Slice 수정

기존 Slice에서 직접 axios 호출하는 부분을 Service 계층 호출로 변경

```typescript
// Before (❌)
const response = await axios.get(`${API_BASE_URL}/api/soccer/search`, {
  params: { keyword: message }
});

// After (✅)
import { soccerService } from '@/lib/api/services';
const response = await soccerService.searchPlayer(message);
```

### Step 7: 컴포넌트에서 React Query 사용

```typescript
// frontend/src/app/report/[clientId]/[year]/page.tsx
'use client';

import { usePublicReport } from '@/lib/react-query/hooks/usePublicReport';
import { prefetchStrategies } from '@/lib/react-query/prefetch';
import { useEffect } from 'react';

export default function PublicReportPage({ 
  params 
}: { 
  params: { clientId: string; year: string } 
}) {
  const { data, isLoading, error, refetch } = usePublicReport(
    params.clientId, 
    params.year
  );

  // Prefetch 다음 연도 보고서
  useEffect(() => {
    const nextYear = (parseInt(params.year) + 1).toString();
    prefetchStrategies.publicReport(params.clientId, nextYear);
  }, [params.clientId, params.year]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error.message}</div>;
  if (!data) return <div>데이터 없음</div>;

  return (
    <div>
      <h1>{data.companyName} ESG 보고서 ({params.year})</h1>
      <div>등급: {data.grade}</div>
      <div>총점: {data.totalScore}</div>
      <button onClick={() => refetch()}>새로고침</button>
    </div>
  );
}
```

### Step 8: 에러 처리 개선

```typescript
// frontend/src/lib/api/errors.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): string => {
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 400:
        return '잘못된 요청입니다.';
      case 401:
        return '인증이 필요합니다.';
      case 403:
        return '접근 권한이 없습니다.';
      case 404:
        return '요청한 리소스를 찾을 수 없습니다.';
      case 503:
        return '서비스가 일시적으로 사용할 수 없습니다.';
      default:
        return '서버 오류가 발생했습니다.';
    }
  } else if (error.request) {
    return '서버에 연결할 수 없습니다.';
  } else {
    return error.message || '알 수 없는 오류가 발생했습니다.';
  }
};
```

---

## 📊 요청 흐름 예시

### 예시 1: 선수 검색

```
1. 사용자가 검색창에 "손흥민" 입력
   ↓
2. Chatbot Slice의 sendMessage() 호출
   ↓
3. soccerService.searchPlayer("손흥민") 호출
   ↓
4. ApiClient가 HTTP GET 요청 생성
   URL: http://localhost:8080/api/soccer/search?keyword=손흥민
   ↓
5. Discovery Server (Gateway)가 요청 수신
   - Path 매칭: /api/soccer/** ✅
   - StripPrefix=2 적용: /search?keyword=손흥민
   - Eureka에서 SOCCER 서비스 검색
   - Load Balancing: soccer:8080 선택
   ↓
6. Soccer Service의 SearchController.search() 실행
   - 로그 출력: "🔍 검색 요청 받음 - 키워드: 손흥민"
   - DB 조회 또는 비즈니스 로직 실행
   - 응답 생성: { code: 200, message: "선수 검색 성공: 손흥민" }
   ↓
7. Discovery Server가 응답 전달
   ↓
8. ApiClient가 응답 수신
   - Response Interceptor 실행
   - 로깅: "[API Response] 200 /api/soccer/search"
   ↓
9. Chatbot Slice가 응답 처리
   - 상태 업데이트: lastResponse, isLoading: false
   - 메시지 추가: addMessage('assistant', response.message)
   ↓
10. UI 업데이트 (React 컴포넌트 리렌더링)
```

---

## 🔒 보안 고려사항

### 1. 인증 토큰 관리

```typescript
// JWT 토큰을 localStorage에 저장
localStorage.setItem('auth_token', token);

// API 요청 시 자동으로 헤더에 추가 (Interceptor)
config.headers.Authorization = `Bearer ${token}`;
```

### 2. CORS 설정 (Discovery Server)

```java
// server/discovery/src/main/java/site/aifixr/api/discovery/CorsConfig.java
@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOriginPatterns(List.of("http://localhost:3000", "http://ui-server:3000"));
        corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        corsConfig.setAllowedHeaders(List.of("*"));
        corsConfig.setAllowCredentials(true);
        // ...
    }
}
```

### 3. Rate Limiting (Gateway)

```yaml
# server/discovery/src/main/resources/application.yaml
spring:
  cloud:
    gateway:
      routes:
        - id: soccer-service
          uri: lb://SOCCER
          predicates:
            - Path=/api/soccer/**
          filters:
            - StripPrefix=2
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
```

---

## 📈 모니터링 및 로깅

### 1. 프론트엔드 로깅

```typescript
// API 요청/응답 로깅
console.log(`[API Request] ${method} ${url}`);
console.log(`[API Response] ${status} ${url}`);
```

### 2. Gateway 로깅

```yaml
logging:
  level:
    org.springframework.cloud.gateway: DEBUG
```

### 3. 서비스 로깅

```java
@Slf4j
@RestController
public class SearchController {
    @GetMapping("/search")
    public Messenger search(@RequestParam String keyword) {
        log.info("🔍 [SOCCER-SERVICE] 검색 요청: {}", keyword);
        // ...
        log.info("✅ [SOCCER-SERVICE] 응답 반환: {}", result);
        return result;
    }
}
```

---

## 🎯 결론

### ✅ 핵심 전략

1. **프론트엔드는 Discovery Server (Gateway)에만 연결**
   - URL: `http://localhost:8080` (개발) / `http://discovery:8080` (프로덕션)
   - Eureka는 백엔드 내부에서만 사용

2. **미들웨어 계층 구조**
   ```
   Components
      ↓
   Zustand Store (UI 상태)
      ↓
   React Query (서버 상태)
      ↓
   Service Layer (API 추상화)
      ↓
   API Client (HTTP 통신)
      ↓
   Discovery Server (Gateway)
      ↓
   Microservices (WebFlux)
      ↓
   Redis (캐시) + Postgres/MongoDB (영구 저장)
   ```

3. **각 계층의 역할**
   - **Components**: UI 렌더링, 사용자 인터랙션
   - **Zustand Store**: UI 상태 관리 (입력값, 모달 상태 등)
   - **React Query**: 서버 상태 관리 (캐싱, 동기화, 업데이트)
   - **Service Layer**: API 호출 추상화, 비즈니스 로직
   - **API Client**: HTTP 통신, 인터셉터, 에러 처리, 토큰 관리
   - **Discovery Server**: 라우팅, 로드 밸런싱, 인증/인가, CORS
   - **Eureka**: 서비스 레지스트리 (내부 전용)
   - **Redis**: 권한/기간 기반 캐시 (public, client, admin, token)
   - **Postgres**: 구조화된 민감 데이터, 히스토리
   - **MongoDB**: 비정형 데이터, JSON 보고서

4. **React Query 사용 이유**
   - **자동 캐싱**: 서버 데이터를 자동으로 캐시하여 불필요한 API 호출 감소
   - **백그라운드 동기화**: 데이터가 오래되면 자동으로 재요청
   - **Optimistic Updates**: 서버 응답 전에 UI 먼저 업데이트하여 UX 개선
   - **Query Invalidation**: 데이터 변경 시 관련 쿼리 자동 무효화
   - **Stale-While-Revalidate**: 오래된 데이터를 보여주면서 백그라운드에서 갱신
   - **개발자 도구**: React Query Devtools로 쉬운 디버깅

5. **Redis 캐시 전략**
   - **public:*** - 비로그인 공개 데이터 (TTL: 30일)
   - **client:{clientId}:*** - 고객사 실시간 데이터 (TTL: 5분~1시간)
   - **admin:*** - 관리자 통계 (TTL: 1시간)
   - **token:*** - 인증 토큰 (TTL: 1~6개월)
   - **민감정보는 절대 Redis에 저장하지 않음**

6. **장점**
   - **단일 진입점**: 모든 API 요청을 Gateway로 통합
   - **자동 캐싱**: React Query + Redis 이중 캐싱으로 성능 최적화
   - **실시간 동기화**: 5분~1시간 단위 자동 갱신
   - **보안 강화**: 민감정보는 Postgres/MongoDB에만 저장, Consent 기반 접근
   - **확장성**: 마이크로서비스 아키텍처로 독립적 확장 가능
   - **유지보수성**: 계층 분리로 변경 영향 최소화
   - **개발 경험**: React Query Devtools, Redux DevTools로 쉬운 디버깅

### 📊 성능 최적화 전략

| 데이터 타입 | 캐시 위치 | TTL | 갱신 전략 |
|------------|----------|-----|----------|
| 공개 보고서 | Redis + React Query | 30일 | Cache-Aside |
| 실시간 자가진단 | Redis + React Query | 5분 | Write-Through |
| 대시보드 KPI | Redis + React Query | 1시간 | Stale-While-Revalidate |
| 관리자 통계 | Redis + React Query | 1시간 | Background Refetch |
| 민감정보 | Postgres/MongoDB | - | Direct Query (No Cache) |

### 🔐 보안 체크리스트

- ✅ JWT 토큰 기반 인증
- ✅ Refresh Token Redis 저장 (TTL 설정)
- ✅ 민감정보 Postgres/MongoDB에만 저장
- ✅ Consent 기반 민감정보 접근 제어
- ✅ 관리자 접근 로그 기록
- ✅ CORS 정책 Gateway에서 관리
- ✅ Rate Limiting 적용
- ✅ 데이터 암호화 (AES-256)

### 🚀 다음 단계

1. **Discovery Server 재시작**
   ```bash
   docker restart discovery
   docker logs -f discovery
   ```

2. **React Query 설치 및 설정**
   ```bash
   cd frontend
   pnpm install @tanstack/react-query @tanstack/react-query-devtools
   ```

3. **Service 계층 구현**
   - `diagnosis.service.ts`
   - `report.service.ts`
   - `admin.service.ts`

4. **React Query Hooks 작성**
   - `usePublicReport`
   - `useClientDiagnosis`
   - `useAdminStatistics`

5. **Redis 캐시 설정 (백엔드)**
   - `RedisConfig.java`
   - `@Cacheable` 어노테이션 적용

6. **테스트**
   - 공개 보고서 조회 (비로그인)
   - 고객사 대시보드 (실시간 갱신)
   - 관리자 통계 (캐시 확인)

---

## 📚 참고 자료

- [Spring Cloud Gateway 공식 문서](https://spring.io/projects/spring-cloud-gateway)
- [Netflix Eureka 공식 문서](https://github.com/Netflix/eureka/wiki)
- [Zustand 공식 문서](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Axios 공식 문서](https://axios-http.com/docs/intro)

