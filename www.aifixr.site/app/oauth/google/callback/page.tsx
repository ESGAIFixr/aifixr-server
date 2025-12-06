"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/authservice";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("구글 로그인 처리 중...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        if (error) {
          setStatus("error");
          setMessage(`로그인 실패: ${error}`);
          setTimeout(() => router.push("/"), 3000);
          return;
        }

        if (!code || !state) {
          throw new Error("인가 코드 또는 state가 없습니다.");
        }

        // 백엔드로 code 전송
        const data = await AuthService.handleGoogleCallback(code, state);

        if (data.success && data.token) {
          // JWT 토큰 저장
          localStorage.setItem("access_token", data.token);
          if (data.refreshToken) {
            localStorage.setItem("refresh_token", data.refreshToken);
          }
          if (data.user) {
            localStorage.setItem("user_info", JSON.stringify(data.user));
          }

          // 로그인 상태 변경 이벤트 발생
          window.dispatchEvent(new Event('authStateChanged'));

          setStatus("success");
          setMessage("로그인 성공!");
          // 대시보드로 리다이렉트
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          throw new Error(data.message || "로그인 실패");
        }
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

