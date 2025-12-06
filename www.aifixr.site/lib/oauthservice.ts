/**
 * OAuth 인증 서비스
 * 
 * OAuth 소셜 로그인 (Google, Naver, Kakao)
 * JWT 토큰 및 사용자 정보 관리
 */

// API 기본 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// ===== localStorage 유틸리티 함수 =====

/**
 * Access Token 가져오기
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

/**
 * Refresh Token 가져오기
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

/**
 * 사용자 정보 가져오기
 */
export function getUserInfo(): any | null {
  if (typeof window === 'undefined') return null;
  const userInfo = localStorage.getItem('user_info');
  return userInfo ? JSON.parse(userInfo) : null;
}

/**
 * 인증 상태 확인
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * 토큰 및 사용자 정보 저장
 */
export function setAuth(accessToken: string, refreshToken: string, userInfo: any): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem('user_info', JSON.stringify(userInfo));
}

/**
 * 인증 정보 삭제 (로그아웃)
 */
export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_info');
}

// ===== OAuth 로그인 핸들러 =====

/**
 * 구글 로그인 시작
 */
export async function handleGoogleLogin() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/oauth/google/login`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    if (data.authUrl) {
      window.location.href = data.authUrl;
    } else {
      throw new Error("구글 인증 URL을 받지 못했습니다.");
    }
  } catch (error) {
    console.error("구글 로그인 URL 요청 실패:", error);
    alert("구글 로그인을 시작할 수 없습니다.");
  }
}

/**
 * 네이버 로그인 시작
 */
export async function handleNaverLogin() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/oauth/naver/login`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data.error || data.message || `HTTP error! status: ${res.status}`;
      console.error("네이버 로그인 URL 요청 실패:", errorMsg);
      alert(`네이버 로그인을 시작할 수 없습니다.\n\n${errorMsg}`);
      return;
    }

    if (data.authUrl) {
      window.location.href = data.authUrl;
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      throw new Error("네이버 인증 URL을 받지 못했습니다.");
    }
  } catch (error) {
    console.error("네이버 로그인 URL 요청 실패:", error);
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
    alert(`네이버 로그인을 시작할 수 없습니다.\n\n${errorMessage}\n\n서버가 실행 중인지 확인해주세요.`);
  }
}

/**
 * 카카오 로그인 시작
 */
export async function handleKakaoLogin() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/oauth/kakao/login`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    if (data.authUrl) {
      window.location.href = data.authUrl;
    } else {
      throw new Error("카카오 인증 URL을 받지 못했습니다.");
    }
  } catch (error) {
    console.error("카카오 로그인 URL 요청 실패:", error);
    alert("카카오 로그인을 시작할 수 없습니다.");
  }
}

/**
 * 로그아웃
 */
export function logout() {
  clearAuth();
}

// ===== AuthService (기존 호환성 유지) =====

/**
 * @deprecated AuthService 대신 개별 함수 사용을 권장합니다.
 * 기존 코드 호환성을 위해 유지됩니다.
 */
export const AuthService = {
  handleGoogleLogin,
  handleNaverLogin,
  handleKakaoLogin,
  logout,
  isAuthenticated,
  getCurrentUser: getUserInfo,
};
