/**
 * 인증 관련 유틸리티 함수
 * localStorage를 사용하여 JWT 토큰 및 사용자 정보 관리
 */

/**
 * Access Token 가져오기
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('aifix_access_token');
}

/**
 * Refresh Token 가져오기
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('aifix_refresh_token');
}

/**
 * 사용자 정보 가져오기
 */
export function getUserInfo(): any | null {
  if (typeof window === 'undefined') return null;
  const userInfo = localStorage.getItem('aifix_user_info');
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
  localStorage.setItem('aifix_access_token', accessToken);
  localStorage.setItem('aifix_refresh_token', refreshToken);
  localStorage.setItem('aifix_user_info', JSON.stringify(userInfo));
}

/**
 * 인증 정보 삭제 (로그아웃)
 */
export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('aifix_access_token');
  localStorage.removeItem('aifix_refresh_token');
  localStorage.removeItem('aifix_user_info');
}
