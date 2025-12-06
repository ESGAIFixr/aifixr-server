'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("구글 로그인 처리 중...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const error = searchParams.get('error');
        if (error) {
          setStatus("error");
          setMessage(`로그인 실패: ${decodeURIComponent(error)}`);
          setTimeout(() => router.push("/"), 3000);
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
            name: searchParams.get('name') || null,
            givenName: searchParams.get('givenName') || null,
            familyName: searchParams.get('familyName') || null,
            picture: searchParams.get('picture') || null,
            locale: searchParams.get('locale') || null,
            provider: searchParams.get('provider') || 'google',
          };

          // localStorage에 토큰 저장
          localStorage.setItem("access_token", decodeURIComponent(accessToken));
          if (refreshToken) {
            localStorage.setItem("refresh_token", decodeURIComponent(refreshToken));
          }
          if (userInfo) {
            localStorage.setItem("user_info", JSON.stringify(userInfo));
          }

          // 로그인 상태 변경 이벤트 발생
          window.dispatchEvent(new Event('authStateChanged'));

          setStatus("success");
          setMessage("로그인 성공!");
          // 대시보드로 리다이렉트
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
          return;
        }

        // 기존 방식: code를 받아서 백엔드 API 호출 (프론트엔드로 직접 콜백이 온 경우)
        const code = searchParams.get('code');
        if (!code) {
          throw new Error("인가 코드가 없습니다.");
        }

        // 백엔드에서 토큰 받기
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${API_URL}/api/oauth/google/callback?code=${code}`, {
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

        // 사용자 정보 변환
        const userInfo = {
          id: data.user?.id || '',
          email: data.user?.email || null,
          name: data.user?.name || null,
          givenName: data.user?.givenName || null,
          familyName: data.user?.familyName || null,
          picture: data.user?.picture || null,
          locale: data.user?.locale || null,
          provider: data.user?.provider || 'google',
        };

        // localStorage에 토큰 저장
        localStorage.setItem("access_token", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refresh_token", data.refreshToken);
        }
        if (userInfo) {
          localStorage.setItem("user_info", JSON.stringify(userInfo));
        }

        // 로그인 상태 변경 이벤트 발생
        window.dispatchEvent(new Event('authStateChanged'));

        setStatus("success");
        setMessage("로그인 성공!");
        // 대시보드로 리다이렉트
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (error: any) {
        console.error("로그인 실패:", error);
        setStatus("error");
        setMessage(error.message || "로그인 처리 중 오류가 발생했습니다.");
        setTimeout(() => router.push("/"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F6F8FB] to-[#E8F0FE]">
      <div className="text-center max-w-md mx-4">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-6 bg-white rounded-3xl p-12 shadow-2xl">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-[#0D4ABB]"></div>
              <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full bg-[#0D4ABB] opacity-20"></div>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-800">{message}</p>
              <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
            </div>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center gap-6 bg-white rounded-3xl p-12 shadow-2xl">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute inset-0 h-20 w-20 animate-ping rounded-full bg-green-400 opacity-30"></div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">로그인 성공!</h2>
              <p className="text-gray-600">환영합니다. 곧 메인 페이지로 이동합니다.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="h-1.5 w-1.5 rounded-full bg-[#0D4ABB] animate-bounce"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-[#0D4ABB] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-1.5 w-1.5 rounded-full bg-[#0D4ABB] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center gap-6 bg-white rounded-3xl p-12 shadow-2xl">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg">
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">로그인 실패</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">잠시 후 메인 페이지로 돌아갑니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

