'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuth } from '@/lib/auth';

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      // URL 파라미터에서 에러 확인
      const errorParam = searchParams.get('error');
      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        setTimeout(() => router.push('/'), 2000);
        return;
      }

      // URL 파라미터에서 토큰과 사용자 정보 받기 (백엔드에서 리다이렉트된 경우)
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');

      if (accessToken && refreshToken) {
        // 백엔드에서 리다이렉트된 경우 - URL 파라미터에서 직접 받기
        const userInfo = {
          id: searchParams.get('userId') || '',
          email: searchParams.get('email') || null,
          nickname: searchParams.get('nickname') || null,
          profileImage: searchParams.get('profileImage') || null,
          provider: searchParams.get('provider') || 'kakao',
        };

        // localStorage에 토큰 저장
        setAuth(
          decodeURIComponent(accessToken),
          decodeURIComponent(refreshToken),
          userInfo
        );

        // /sme로 리다이렉트
        router.push('/sme');
        return;
      }

      // 기존 방식: code를 받아서 백엔드 API 호출 (프론트엔드로 직접 콜백이 온 경우)
      const code = searchParams.get('code');
      if (!code) {
        setError('인증 코드가 없습니다.');
        setTimeout(() => router.push('/'), 2000);
        return;
      }

      try {
        // 백엔드에서 토큰 받기
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${API_URL}/api/oauth/kakao/callback?code=${code}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit',
        });

        if (!response.ok) {
          throw new Error('로그인 처리 중 오류가 발생했습니다.');
        }

        const data = await response.json();

        // localStorage에 토큰 저장
        setAuth(data.accessToken, data.refreshToken, data.userInfo);

        // /sme로 리다이렉트
        router.push('/sme');
      } catch (err) {
        console.error('Kakao callback error:', err);
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
        setTimeout(() => router.push('/'), 2000);
      }
    };

    processCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">{error}</div>
          <p className="text-gray-600">홈으로 돌아갑니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 중...</p>
      </div>
    </div>
  );
}
